# RFC-0004: EventBus — Cross-plugin pub/sub

- **Status:** Draft
- **Date:** 2026-05-09
- **Owner:** Platform Lead
- **Phase:** 1 (M3)
- **Depends on:** RFC-0001 (Manifest), ADR-0013 (cross-plugin communication is events only), ADR-0015 (Zod for schemas)

## Summary

Defines the **only** legal channel for cross-plugin communication: a typed pub/sub bus where plugins **declare** the topics they publish and consume in their manifest, the kernel **validates** payloads against Zod schemas at the boundary, and **disposes** subscriptions automatically via the `DisposableBag`.

## Motivation

ADR-0013 forbids cross-plugin direct imports — but Phase 0 ships no replacement. Plugins built today have no way to coordinate. Without an EventBus:

1. POS cannot tell almacén "stock decreased" without importing it.
2. Facturación cannot react to a sale without polling.
3. The platform remains a collection of isolated apps, missing the "OS" promise.

## Goals

1. **Typed contract** — every event has a Zod schema, validated at publish and at subscribe-time delivery.
2. **Manifest-declared** — plugins list what they emit and what they consume, surfaced in the catalog and in tooling.
3. **Same-process today, distributed-ready tomorrow** — implementation is in-process for Phase 1; the API does not preclude a Kafka/NATS backend in Phase 2.
4. **Auto-disposal** — subscriptions live no longer than the plugin's lifecycle; `ctx.disposables` is the only sink.
5. **Tenant-scoped by default** — events from tenant A cannot reach plugins serving tenant B.

## Non-Goals

- Persistent event log / replay (Phase 2 with Kafka).
- Cross-tenant broadcast — explicitly forbidden.
- Request/response semantics. EventBus is fire-and-forget; for query/response use cases plugins expose REST surfaces via the gateway (separate RFC).
- Ordered guarantees beyond "subscribers in registration order".

## Design

### Topic naming

Reverse-DNS, scoped by emitting plugin:

```
com.ventix.pos.sale.completed
com.ventix.almacen.stock.adjusted
com.ventix.facturacion.invoice.issued
```

The emitting plugin **owns** its topic namespace. Consumers reference the fully-qualified name. Wildcard subscriptions (`com.ventix.pos.*`) are supported at consume-time.

### Manifest declaration

```jsonc
{
  "id": "com.ventix.pos",
  "events": {
    "publishes": [
      {
        "topic": "com.ventix.pos.sale.completed",
        "schema": "./events/sale-completed.schema.json",
        "description": "Fires after a sale is finalized and stored."
      }
    ],
    "consumes": [
      {
        "topic": "com.ventix.almacen.stock.adjusted",
        "description": "Re-renders stock badge in the POS UI when inventory changes."
      }
    ]
  }
}
```

- Schema files are JSON-Schema (Zod-derivable). The kernel resolves them at plugin load and caches.
- Consuming a topic that isn't declared **throws at subscribe-time** in dev; warns in prod. Forces the contract to be visible in the manifest, not buried in code.

### SDK surface

```ts
interface EventBusApi {
  /**
   * Publish to a topic owned by the calling plugin.
   * Throws if the topic isn't declared in the manifest's `publishes`.
   * Throws if the payload doesn't validate.
   */
  emit<T>(topic: string, payload: T): Promise<void>;

  /**
   * Subscribe to a topic. Subscription is auto-bound to ctx.disposables.
   * Throws if the topic isn't declared in `consumes`.
   */
  on<T>(topic: string, handler: (payload: T) => void | Promise<void>): Disposable;

  /**
   * Subscribe with a wildcard pattern.
   * Pattern syntax: `com.ventix.pos.*` (single segment), `com.ventix.pos.**` (any depth).
   */
  onPattern(pattern: string, handler: (topic: string, payload: unknown) => void): Disposable;
}
```

`emit` is async to leave room for the future distributed implementation; in-process delivery awaits the microtask queue and returns.

### Kernel side

```ts
// libs/kernel/eventbus/src/lib/eventbus.service.ts
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly subscribers = new Map<string, Set<Subscription>>();
  private readonly schemas     = new Map<string, ZodSchema>();

  registerPlugin(manifest: ManifestV1): void {
    for (const decl of manifest.events?.publishes ?? []) {
      this.schemas.set(decl.topic, this.loadSchema(decl.schema));
    }
  }

  async emit(pluginId: string, topic: string, payload: unknown): Promise<void> {
    this.assertOwnership(pluginId, topic);
    const schema = this.schemas.get(topic);
    if (!schema) throw new TopicNotDeclaredError(topic, pluginId);
    schema.parse(payload);    // throws ZodError
    queueMicrotask(() => this.deliver(topic, payload));
  }

  on(pluginId: string, topic: string, handler: Handler): Disposable {
    this.assertSubscriptionAllowed(pluginId, topic);
    // ... add to subscribers, return disposable wired to ctx.disposables
  }
}
```

The orchestrator wraps this service into `ctx.events` per plugin so the plugin id is captured automatically — plugins never pass their id explicitly.

### Tenant scoping

The EventBus is **per-tenant**. The kernel keeps a Map<tenantId, EventBusInstance>. Events emitted in tenant A's runtime never reach tenant B. In single-tab single-tenant Phase 1, this is trivial; the contract reserves the property for future multi-tenant tab scenarios.

### Validation modes

| Environment | On schema mismatch |
|---|---|
| Dev (`vite`, `pnpm dev`) | Throw, log full diff |
| Prod | Drop event, increment `eventbus.invalid_payload` metric, alert. Never throw upward. |

This protects against a misbehaving consumer/publisher taking down the shell while still surfacing the issue.

## Schemas (Zod 4)

Per ADR-0015, schemas are authored in Zod, exported as JSON-Schema for the manifest's `schema:` reference:

```ts
// libs/plugins/pos/src/events/sale-completed.schema.ts
import { z } from 'zod';

export const SaleCompletedSchema = z.object({
  saleId: z.string().uuid(),
  tenantId: z.string(),
  total: z.number().positive(),
  currency: z.string().length(3),
  items: z.array(z.object({
    sku: z.string(),
    qty: z.number().int().positive(),
    unitPrice: z.number().nonnegative(),
  })).nonempty(),
  occurredAt: z.string().datetime(),
});

export type SaleCompleted = z.infer<typeof SaleCompletedSchema>;
```

Build step (`pnpm ventix build`) extracts JSON-Schema from each Zod schema referenced in the manifest.

## Lifecycle

```
plugin.activate(ctx)
  └─ ctx.events.on('com.ventix.pos.sale.completed', h) → Disposable
                                                          │
                                                          ↓ (auto-bound)
                                                   ctx.disposables.add(d)
plugin.deactivate(ctx)
  └─ disposables.dispose()  → all subscriptions removed
```

No leak path. Re-activating a plugin gets fresh subscriptions; old ones are gone.

## Performance

- Phase 1 in-process: a `Map<topic, Set<handler>>` lookup + microtask. Negligible overhead.
- Schema validation runs on emit (publisher pays). Subscribers see validated, typed data.
- Wildcard subscriptions resolved by walking a sorted topic list once per emit; for Phase 1 plugin counts (<50 active topics) this is fine. If we hit hundreds of topics, switch to a trie.

## Migration to Distributed (Phase 2 sketch)

The SDK surface (`emit`, `on`, `onPattern`) does not change. The kernel implementation gets a `KafkaEventBus` that:

- Publishes to `tenants.{tenantId}.events.{topic}`.
- Subscribes via consumer group per `(plugin, topic)`.
- Same Zod validation on emit.

Plugins authored against Phase 1 work unchanged on Phase 2.

## Open Questions

1. **Should we expose a `replay` API for late subscribers?** Defer — requires persistence; lift in RFC for Kafka backend.
2. **Sync delivery option** for plugins that need ordered local effects? Current design uses microtask = ordered within a tick. Probably enough.
3. **Backpressure?** In-process: no. Distributed: yes — handled by Kafka. Out of scope here.

## Acceptance Criteria

- A plugin emitting an event with payload mismatching its manifest schema throws `EventPayloadError` in dev.
- A plugin subscribing to a topic not in its manifest's `consumes` throws `TopicNotDeclaredError`.
- Deactivating a plugin removes all its subscriptions before `deactivate()` resolves.
- Two demo plugins (POS + almacén) exchange a real event end-to-end with no direct imports.
