# RFC-0003: Permissions in Manifest

- **Status:** Draft
- **Date:** 2026-05-09
- **Owner:** Platform Lead
- **Phase:** 1 (M2)
- **Depends on:** RFC-0001 (Manifest), RFC-0011 (Tenant Control Plane), ADR-0024 (Auth)

## Summary

Defines how plugins **declare** the permissions they require, and how the kernel **enforces** them at the route, menu, and SDK-call level. Uses [CASL](https://casl.js.org/) as the runtime ability evaluator. Permissions are scoped to `(tenant, user)` and propagated from the JWT issued by Keycloak.

## Motivation

ADR-0013 forbids cross-plugin direct calls; communication is via events. But within a single tenant, **users have different roles** — the owner of a workshop sees everything, the receptionist only sees appointments, the accountant only sees invoices. Without a permission layer:

1. Plugins implement ad-hoc role checks, inconsistently.
2. Menu items can't be filtered safely (a plugin can hide a route in the menu but the route still resolves).
3. The SDK can't refuse a privileged call from inside a plugin acting on behalf of a low-privilege user.

## Goals

1. **Declarative permissions** in the manifest — what abilities the plugin defines, what abilities each route/menu requires.
2. **Kernel enforcement** — routes guarded automatically; menu items filtered automatically.
3. **`ctx.permissions`** in the SDK — plugins query `can('read', 'invoice')` without rolling their own.
4. **Backed by JWT** — the source of truth is the user's token, validated by the gateway, decoded by the kernel.
5. **Tenant-scoped** — abilities are always evaluated in the context of the current tenant; cross-tenant capability leakage is structurally impossible.

## Non-Goals

- Field-level encryption / row-level security at the DB layer (Phase 2; orthogonal).
- Time-bound permissions / approval workflows (out of scope).
- Cross-plugin permission delegation. Each plugin owns its abilities.

## Design

### Manifest declaration

```json
{
  "id": "com.ventix.facturacion",
  "version": "2.0.1",
  "permissions": {
    "defines": [
      { "action": "read",   "subject": "invoice",   "description": "View invoices" },
      { "action": "create", "subject": "invoice",   "description": "Issue invoices" },
      { "action": "void",   "subject": "invoice",   "description": "Cancel an issued invoice" }
    ]
  },
  "frontend": {
    "routes": [
      { "path": "list",     "requires": ["read:invoice"]   },
      { "path": "new",      "requires": ["create:invoice"] },
      { "path": "void/:id", "requires": ["void:invoice"]   }
    ],
    "menu": [
      { "id": "facturas", "label": "Facturas", "icon": "...", "requires": ["read:invoice"] }
    ]
  }
}
```

- `defines` lists the abilities this plugin **introduces**. The catalog endpoint exposes them so admins can assign roles per tenant.
- `requires` is a list of `action:subject` strings. Multiple requirements are AND-ed.
- Subject names are plugin-namespaced via the plugin id internally — the kernel rewrites `invoice` to `com.ventix.facturacion:invoice` so two plugins can both define an `invoice` subject without collision.

### Role assignment (out of scope of plugin manifest)

Roles are tenant-defined, not plugin-defined. The platform admin (or eventually the tenant owner) grants:

```
role: 'workshop-owner' → ['read:appointment', 'create:appointment', 'read:invoice', 'create:invoice', ...]
role: 'receptionist'   → ['read:appointment', 'create:appointment']
role: 'accountant'     → ['read:invoice', 'create:invoice']
```

Roles live in Keycloak. The user's effective abilities = union of role grants ∩ tenant's activated plugins' defined abilities.

### JWT shape

```jsonc
{
  "sub": "user-123",
  "tenant_id": "taller-perez",
  "tenant_role": "workshop-owner",
  "abilities": [
    "com.ventix.talleres:read:appointment",
    "com.ventix.talleres:create:appointment",
    "com.ventix.facturacion:read:invoice",
    "com.ventix.facturacion:create:invoice"
  ],
  "exp": 1746824400
}
```

The gateway computes `abilities` at token issuance — frontend never recomputes from raw role grants. This avoids drift between server and client.

### Kernel side

```ts
// libs/kernel/permissions/src/lib/ability.service.ts
@Injectable({ providedIn: 'root' })
export class AbilityService {
  readonly ability = computed<MongoAbility>(() => {
    const claims = this.auth.tokenClaims();
    return defineAbility((can) => {
      for (const a of claims?.abilities ?? []) {
        const [pluginId, action, subject] = a.split(':');
        can(action, `${pluginId}:${subject}`);
      }
    });
  });

  can(action: string, subject: string, pluginId: string): boolean {
    return this.ability().can(action, `${pluginId}:${subject}`);
  }
}
```

- Route guard `permissionGuard(requires: string[])` is auto-attached by `DynamicRouterService` when the manifest declares `requires`.
- Menu filter is a `computed()` derived from `(activePlugins, ability)` — items whose `requires` aren't satisfied are dropped from the tree.

### SDK side

`ctx.permissions` is added to `PluginContext`:

```ts
interface PermissionsApi {
  can(action: string, subject: string): boolean;     // tenant + user current
  cannot(action: string, subject: string): boolean;
  // Returns a signal so templates can react; resolves automatically as token
  // refreshes change abilities mid-session.
  signal(action: string, subject: string): Signal<boolean>;
}
```

Plugins call `ctx.permissions.can('void', 'invoice')` — the kernel rewrites the subject to the plugin's namespace. Cross-plugin checks (`ctx.permissions.can('read', 'com.other.plugin:invoice')`) are explicitly forbidden and throw at runtime; communication across plugin boundaries is events only (ADR-0013).

## Default Behaviors

- **No `requires` on a route** → public within the tenant (any authenticated user can access).
- **No abilities in token** → user has zero permissions; they can still log in but every guarded route blocks. Useful for "trial expired" surfaces.
- **Plugin not in tenant's active set** → its abilities are stripped from the user's effective set even if the JWT happens to mention them. Defense in depth.

## Surface for the Admin Plugin

The admin plugin (M4) needs:

```
GET    /api/control-plane/v1/tenants/:id/roles
POST   /api/control-plane/v1/tenants/:id/roles
PATCH  /api/control-plane/v1/tenants/:id/roles/:role
```

Mutations sync to Keycloak via its admin API.

## Open Questions

1. **Hierarchical abilities** (`manage` ⊃ `read|create|update|delete`)? CASL supports it natively. RFC v2.
2. **Conditions** (`can('read', 'invoice', { ownedBy: user.id })`)? Powerful but requires data shape coupling. Defer.
3. **Per-tenant ability customization** (a tenant defines a custom role) — out of scope for v1; default roles only.

## Acceptance Criteria

- A plugin with `routes[].requires = ['read:invoice']` is unreachable for a user whose JWT lacks that ability — kernel returns to fallback route.
- Menu items disappear without flicker when the user's abilities change (token refresh).
- `ctx.permissions.can()` is reactive; templates using `@if (ctx.permissions.signal(...)())` update when claims change.
- Cross-plugin permission queries throw `PermissionScopeError`.
