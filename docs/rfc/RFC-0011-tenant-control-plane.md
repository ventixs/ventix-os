# RFC-0011: Tenant Control Plane

- **Status:** Draft
- **Date:** 2026-05-09
- **Owner:** Platform Lead
- **Phase:** 1 (M0)
- **Depends on:** RFC-0001 (Manifest), ADR-0003 (Multi-tenancy axiom)
- **Related:** ADR-0024 (Auth), ADR-0025 (Deployment)

## Summary

Defines the data model, API contract, and lifecycle for **what plugins each tenant has activated**. This is the source of truth that the kernel consults at login to decide which plugins to load, and the control surface the platform admin uses to operate the SaaS business model (plans, upgrades, suspensions, version pinning).

## Motivation

ADR-0003 makes multi-tenancy an axiom but does not specify how the kernel knows _which_ plugins belong to a tenant. ADR-0020 makes the registry "controlled state" but treats the registry contents as static. The business reality of VENTIX OS — different tenants paying for different plugin bundles — requires a per-tenant view of the registry that is mutated outside the shell, on the platform's terms, by the platform's admin.

Without this RFC the kernel cannot answer the most fundamental question: _"who can use what?"_

## Goals

1. A single, normalized source of truth for `(tenant, plugin, version, enabled)` tuples.
2. A read API the shell calls at login: `GET /api/registry/:tenantId → ResolvedManifest[]`.
3. A write API the admin plugin uses to mutate that state.
4. A precise lifecycle (activate / suspend / upgrade / pin / expire) with audit logging.
5. A stub-source / production-shape kernel client per ADR-0021 — the kernel's TenantService talks to the same shape whether backed by JSON, SQLite, or Postgres.

## Non-Goals

- **Billing.** Stripe/Paddle integration is Phase 1.5; this RFC just gives them a target table to mutate.
- **Self-service install** by tenant owners. That is Phase 2 (marketplace).
- **Cross-tenant data sharing.** ADR-0003 forbids it; this RFC enforces it.
- **Plugin discovery / search.** Scope is "what's activated", not "what exists".

## Data Model

```sql
-- Identity of a tenant (a customer organization).
CREATE TABLE tenants (
  id           TEXT PRIMARY KEY,
  -- Reverse-DNS or slug. Stable, human-readable, used in subdomains and logs.
  -- Example: 'taller-perez', 'restaurante-la-esquina'.
  display_name TEXT NOT NULL,
  plan         TEXT NOT NULL,             -- 'trial' | 'basic' | 'commerce' | 'workshop' | 'full' | <custom>
  status       TEXT NOT NULL DEFAULT 'active',
                                          -- 'active' | 'suspended' | 'archived'
  created_at   TIMESTAMP NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP NOT NULL DEFAULT now(),
  metadata     JSONB NOT NULL DEFAULT '{}'
);

-- One row per (tenant, plugin) activation.
CREATE TABLE tenant_plugins (
  tenant_id    TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plugin_id    TEXT NOT NULL,             -- reverse-DNS, e.g. 'com.ventix.almacen'
  version      TEXT NOT NULL,             -- semver pinned for this tenant
  enabled      BOOLEAN NOT NULL DEFAULT true,
  enabled_at   TIMESTAMP NOT NULL DEFAULT now(),
  expires_at   TIMESTAMP,                 -- nullable; for trials / time-limited grants
  PRIMARY KEY (tenant_id, plugin_id)
);

-- Catalog of plugins known to the platform. Independent of activations.
CREATE TABLE plugin_catalog (
  id           TEXT PRIMARY KEY,          -- reverse-DNS plugin id
  name         TEXT NOT NULL,
  description  TEXT,
  homepage     TEXT,
  -- Available versions; latest first by emitted_at.
  -- Each row in plugin_versions points to a manifest URL on the CDN.
  current      TEXT NOT NULL              -- recommended version
);

CREATE TABLE plugin_versions (
  plugin_id    TEXT NOT NULL REFERENCES plugin_catalog(id) ON DELETE CASCADE,
  version      TEXT NOT NULL,
  manifest_url TEXT NOT NULL,             -- absolute URL to manifest.json on CDN
  emitted_at   TIMESTAMP NOT NULL DEFAULT now(),
  yanked       BOOLEAN NOT NULL DEFAULT false,
                                          -- emergency stop; resolver skips yanked rows
  notes        TEXT,
  PRIMARY KEY (plugin_id, version)
);

-- Audit log. Append-only. Never UPDATE or DELETE.
CREATE TABLE control_plane_events (
  id           BIGSERIAL PRIMARY KEY,
  occurred_at  TIMESTAMP NOT NULL DEFAULT now(),
  actor        TEXT NOT NULL,             -- 'admin:carlos' | 'system' | 'webhook:stripe'
  tenant_id    TEXT,                      -- nullable for catalog-level events
  plugin_id    TEXT,
  event        TEXT NOT NULL,             -- 'tenant.created' | 'plugin.activated' | ...
  payload      JSONB NOT NULL DEFAULT '{}'
);
```

### Notes
- `tenant_plugins.version` is **required**. There is no implicit "latest" — pinning is the default. The admin chooses when to bump.
- `plugin_versions.yanked` lets the platform halt a known-bad version without coordinating with each tenant.
- The catalog is decoupled from activations: a plugin can exist in the catalog with zero tenants using it.

## Resolution Algorithm

When the shell asks `GET /api/registry/:tenantId`, the gateway runs:

```
SELECT
  tp.plugin_id,
  tp.version,
  pv.manifest_url
FROM tenant_plugins tp
JOIN plugin_versions pv
  ON pv.plugin_id = tp.plugin_id AND pv.version = tp.version
JOIN tenants t
  ON t.id = tp.tenant_id
WHERE tp.tenant_id = :tenantId
  AND tp.enabled = true
  AND t.status   = 'active'
  AND pv.yanked  = false
  AND (tp.expires_at IS NULL OR tp.expires_at > now())
ORDER BY tp.plugin_id;
```

The shell receives `ResolvedManifest[]`, fetches each `manifest_url`, validates per RFC-0001, registers per ADR-0008.

If the resolver returns zero rows, the shell still renders — with an empty plugin set and a system-level "Your subscription has no active plugins" surface.

## API Contract

All endpoints are under `/api/control-plane/v1`. Versioned because the contract is part of the public surface for tenants and the admin plugin.

### Read (called by the kernel at login)

```
GET /api/control-plane/v1/tenants/:tenantId/registry
Authorization: Bearer <jwt>          // tenant_id claim must match :tenantId
                                     // OR caller has 'platform:admin' role

200 OK
{
  "tenant": { "id": "taller-perez", "displayName": "Taller Pérez", "plan": "workshop" },
  "plugins": [
    {
      "id": "com.ventix.talleres",
      "version": "1.2.0",
      "manifestUrl": "https://plugins.ventix.app/com.ventix.talleres/1.2.0/manifest.json",
      "expiresAt": null
    },
    ...
  ],
  "etag": "W/\"v42\""              // cache key; bumped on any tenant_plugins mutation
}
```

`ETag` lets the shell cache the resolution; the gateway invalidates by writing a new value to a small `tenant_etag` table on every relevant mutation.

### Write (called by the admin plugin only)

```
POST   /api/control-plane/v1/tenants                       create tenant
PATCH  /api/control-plane/v1/tenants/:id                   update plan/status/metadata
DELETE /api/control-plane/v1/tenants/:id                   archive (soft delete)

POST   /api/control-plane/v1/tenants/:id/plugins           activate plugin (with version)
PATCH  /api/control-plane/v1/tenants/:id/plugins/:pluginId update version / enabled / expires
DELETE /api/control-plane/v1/tenants/:id/plugins/:pluginId deactivate (sets enabled=false)

GET    /api/control-plane/v1/catalog                       list plugins
POST   /api/control-plane/v1/catalog                       register plugin in catalog
POST   /api/control-plane/v1/catalog/:pluginId/versions    publish a new version
PATCH  /api/control-plane/v1/catalog/:pluginId/versions/:version  yank/unyank
```

All write endpoints require the `platform:admin` role. All write endpoints append a row to `control_plane_events`.

## Kernel Side (TenantService)

Per ADR-0021 (stub source, production shape):

```ts
// libs/kernel/tenant/src/lib/tenant.service.ts
@Injectable({ providedIn: 'root' })
export class TenantService {
  readonly current = signal<TenantSnapshot | null>(null);
  readonly activePluginIds = computed(() =>
    new Set(this.current()?.plugins.map(p => p.id) ?? []),
  );

  async load(tenantId: string): Promise<void> {
    const snapshot = await this.source.fetch(tenantId);
    this.current.set(snapshot);
  }
}
```

`TenantSource` is an abstraction with two concrete implementations in Phase 1:

- `StubTenantSource` — reads from `apps/shell/public/tenants.json`. Phase 0/early dev.
- `HttpTenantSource` — calls `GET /api/control-plane/v1/tenants/:id/registry`. Production.

The orchestrator (libs/kernel/plugin-runtime) is updated to filter `manifest.id ∈ tenant.activePluginIds` before activation. Plugins not in the active set never reach `LOADED` state; they stay in `DISCOVERED`.

## Lifecycle

```
                  ┌─────────────┐
                  │  catalog    │  ← admin publishes plugin@version (manifest_url on CDN)
                  └──────┬──────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   (admin activates                  (admin yanks
    for tenant)                       version)
        │                                 │
        ↓                                 ↓
┌──────────────┐    suspend       ┌──────────────┐
│ tenant_plugin│ ───────────────→ │  enabled=    │
│  enabled=    │                  │   false      │
│  true        │ ←─────────────── │              │
└──────┬───────┘    re-enable     └──────────────┘
       │
       │ expires_at < now() (cron)
       ↓
   automatic deactivation
```

## Caching & Consistency

- Shell caches the registry response keyed by `(tenantId, etag)` for the session.
- Mutation endpoints write `tenant_etag[tenant_id] = uuid()` in the same transaction as the change.
- Shell may revalidate on focus / WebSocket signal; out of scope for this RFC, sketched in RFC-0014 (reserved).

## Stub Source (Phase 1 dev mode)

For local dev without a backend, `apps/shell/public/tenants.json` looks like:

```json
{
  "tenant-default": {
    "displayName": "Local Dev Tenant",
    "plan": "full",
    "plugins": [
      { "id": "com.demo.hello",   "version": "1.0.0", "manifestUrl": "/plugins/hello/manifest.json" }
    ]
  }
}
```

The shell reads `?tenant=tenant-default` from the URL (or defaults). This unblocks AC-1 without requiring Keycloak or Quarkus.

## Open Questions

1. **Should `version` support ranges (`^1.2.0`) instead of pins?** Default no — explicit pin is the SaaS-safe default. A `policy: 'pinned' | 'auto-minor' | 'auto-patch'` column may follow in a v2 of this RFC.
2. **Per-user plugin grants within a tenant?** Out of scope; permissions (RFC-0003) handle intra-tenant scoping.
3. **Soft-deleted tenants — retention period?** Default 30 days; this RFC doesn't decide.

## Migration Path

- Phase 1, M0: ship `StubTenantSource` + the kernel filtering. AC-1 passes.
- Phase 1, M2: backend gateway implements the read API. Switch shell to `HttpTenantSource`.
- Phase 1, M4: admin plugin implements the write API.

## Acceptance Criteria for This RFC

- Schema applies cleanly to Postgres 16+.
- Kernel `TenantService` compiles with both `StubTenantSource` and `HttpTenantSource` swappable via DI.
- Shell, given a tenant with two plugins activated, loads exactly those two — even if the catalog has more.
- Admin write endpoints are idempotent on retry (PATCH with same payload is a no-op).
