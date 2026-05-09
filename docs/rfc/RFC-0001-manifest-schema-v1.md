# RFC-0001: Manifest Schema v1

- **Status:** Draft (review window: 3 days)
- **Owner:** SDK Lead
- **Reviewers:** Chief Architect, Kernel Lead
- **Date:** 2026-05-08

## Summary

This RFC defines `ventix.plugin.json` v1 — the contract every plugin ships, and the single source of truth consumed by the kernel, CLI, marketplace, and IDE. Per ADR-0002, the manifest is inviolable: anything a plugin can do at runtime, it declares first.

## Motivation

The manifest is the highest-leverage decision in the platform. Every other system depends on it: kernel uses it to register routes/nav/permissions; marketplace uses it to render listings and run static review; CLI uses it for validation; IDE uses it for autocomplete. Getting it right early is cheap; changing it later requires migration codemods, plugin re-publishing, and registry rewrites.

Phase 0's manifest is the **minimum needed for the Hello Plugin loop**. Fields not required by the acceptance criterion are *out of scope* for this RFC and will be added by future RFCs (RFC-0003 permissions, RFC-0004 AI tools, RFC-0005 settings, etc.). Additive fields do not require a major bump.

## Schema (v1)

```jsonc
{
  "$schema": "https://ventix.dev/schemas/plugin.v1.json",

  "id": "com.acme.hello",
  "name": "Hello",
  "version": "1.0.0",
  "vendor": { "name": "Acme Inc.", "url": "https://acme.dev" },
  "license": "MIT",

  "engine": { "ventix": "^1.0.0" },

  "frontend": {
    "remoteEntry": "http://localhost:4300/com.acme.hello/remoteEntry.js",
    "exposedModule": "./Plugin",
    "integrity": "sha384-..."
  },

  "navigation": [
    { "id": "hello", "label": "Hello", "icon": "hand", "route": "/com.acme.hello/home", "order": 100 }
  ],

  "routes": [
    { "path": "home", "component": "HomePage" }
  ]
}
```

### Field Reference

#### `$schema` (required)
URL pointing to the JSON Schema for this manifest version. Used by IDEs for autocomplete. Kernel ignores at runtime; CLI validates.

#### `id` (required)
**Reverse-DNS string.** Globally unique. Pattern: `^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$`. This is the plugin's identity everywhere — registry key, route namespace prefix, storage namespace, log tag. **Cannot change after first publish.**

#### `name` (required)
Human-readable display name. Free-form, max 80 chars.

#### `version` (required)
**Strict semver** (`MAJOR.MINOR.PATCH`). Pre-release suffixes allowed (`1.0.0-beta.1`). Must match the version in the plugin's source code (`definePlugin({ version })`); the kernel validates and rejects on mismatch.

#### `vendor` (required)
- `name` (required): legal/display name of the publisher.
- `url` (optional): publisher homepage.

#### `license` (required)
SPDX identifier. The marketplace will surface this prominently.

#### `engine.ventix` (required)
Semver range against `SDK_VERSION` from `@ventix/plugin-api`. The kernel checks this at load time. Mismatch → plugin enters `ERROR` state with a clear message. This is the kernel/plugin compatibility contract.

#### `frontend` (required for UI plugins)
- `remoteEntry` (required): absolute URL to the Module Federation `remoteEntry.js`.
- `exposedModule` (required): the exposed module key (typically `./Plugin`); kernel imports `${id}/${exposedModule}`.
- `integrity` (optional in Phase 0, required Phase 2): subresource integrity hash. Kernel verifies before fetch in production builds.

#### `navigation` (optional)
Array of menu entries the kernel registers on activation. Each entry:
- `id` (required): unique within the plugin.
- `label` (required): display text.
- `icon` (optional): icon key from the kernel's icon set (Phase 1: extensible).
- `route` (required): full path (must start with `/${pluginId}/`); kernel validates the namespace.
- `order` (optional, default `100`): sort key within parent.
- `children` (optional): nested menu entries.

#### `routes` (optional)
Array of routes the plugin contributes. Each entry:
- `path` (required): relative to the plugin namespace (e.g., `home` resolves to `/com.acme.hello/home`).
- `component` (required): the component key the plugin's runtime registers via `ctx.router.register`.

> **Note:** `routes` in v1 is descriptive — the runtime authority is `ctx.router.register()` calls. The manifest entries exist for marketplace listing and static review. Future RFC may make manifest `routes` authoritative.

## Field Categories — Future RFCs

Fields explicitly **out of scope for v1** but reserved by name to avoid future conflict:

| Field | Future RFC | Phase |
|---|---|---|
| `permissions` | RFC-0003 | Phase 1 |
| `events.publishes`, `events.subscribes` | RFC-0004 | Phase 1 |
| `widgets` | RFC-0005 | Phase 1 |
| `settings` | RFC-0006 | Phase 1 |
| `ai.tools` | RFC-0007 | Phase 1 |
| `backend` | RFC-0008 | Phase 1 |
| `tenancy.isolation` | RFC-0009 | Phase 1 |
| `billing` | RFC-0010 | Phase 2 |

The Zod schema's `.passthrough()` on the root object **rejects** unknown fields in v1 (strict by default) — this prevents typos slipping through. Future RFCs explicitly add fields to the schema.

## Zod Schema (canonical)

Lives in `libs/sdk/plugin-api/src/manifest/schema.ts`:

```ts
import { z } from 'zod';

const PluginIdSchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/, 'must be reverse-DNS lowercase');

const SemverSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+(-[A-Za-z0-9.-]+)?$/, 'must be strict semver');

const NavigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    icon: z.string().optional(),
    route: z.string().startsWith('/'),
    order: z.number().int().optional(),
    children: z.array(NavigationItemSchema).optional(),
  }).strict(),
);

export const ManifestV1Schema = z.object({
  $schema: z.string().url(),
  id: PluginIdSchema,
  name: z.string().min(1).max(80),
  version: SemverSchema,
  vendor: z.object({
    name: z.string().min(1),
    url: z.string().url().optional(),
  }).strict(),
  license: z.string().min(1),
  engine: z.object({
    ventix: z.string().min(1),
  }).strict(),
  frontend: z.object({
    remoteEntry: z.string().url(),
    exposedModule: z.string().min(1),
    integrity: z.string().optional(),
  }).strict(),
  navigation: z.array(NavigationItemSchema).optional(),
  routes: z.array(z.object({
    path: z.string().min(1),
    component: z.string().min(1),
  }).strict()).optional(),
}).strict();

export type ManifestV1 = z.infer<typeof ManifestV1Schema>;
```

## Validation Rules (kernel-enforced)

Beyond schema validation:

1. **Version cross-check:** manifest `version` must equal the `version` passed to `definePlugin()` in the loaded module.
2. **ID cross-check:** manifest `id` must equal `definePlugin({ id })`.
3. **Route namespace:** every `navigation[].route` and every route registered via `ctx.router.register` must start with `/${id}/`.
4. **Engine compatibility:** `engine.ventix` must satisfy the running `SDK_VERSION` per node-semver rules.
5. **Integrity (production builds only):** `frontend.integrity` is required and verified before fetching `remoteEntry`.

## Versioning Policy

- **Schema version is part of `$schema` URL.** v1 → `https://ventix.dev/schemas/plugin.v1.json`.
- **Additive minor:** new optional fields. Existing plugins continue to validate.
- **Additive major:** new required fields or removed fields. Requires `$schema` URL bump and codemod (`ventix migrate manifest --from=1 --to=2`).
- **No silent compatibility.** Mismatched `$schema` versions are rejected; users see "your manifest is v1, this kernel expects v2 — run `ventix migrate`."

## Open Questions

1. **Should `frontend.integrity` be required in Phase 0 too?** Recommendation: optional in Phase 0 (local file server, no signing infra), required Phase 2 once cosign is in place.
2. **Should `routes` be authoritative or descriptive?** Recommendation: descriptive in v1 (runtime is authority) — defer to a future RFC after we have 3+ plugins to inform the call.
3. **Should we allow `id` aliases?** No. One plugin, one ID, forever.

## Acceptance Criteria

This RFC is ratified when:

- [ ] Architect approval recorded in PR.
- [ ] Kernel Lead confirms validator implementation matches schema.
- [ ] SDK Lead confirms `ManifestV1` type is consumed by `definePlugin()`.
- [ ] Hello Plugin's `ventix.plugin.json` validates against the schema.
- [ ] CLI `ventix validate` produces actionable error messages on each rule.
