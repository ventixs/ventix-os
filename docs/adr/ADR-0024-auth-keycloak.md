# ADR-0024: Auth strategy — Keycloak as identity provider

- **Status:** Ratified
- **Date:** 2026-05-09
- **Supersedes:** Partial — relaxes ADR-0007 (no auth in Phase 0) for Phase 1 onwards.
- **Relates to:** RFC-0011 (Tenant Control Plane), RFC-0003 (Permissions)

## Context

Phase 1 introduces real tenants with real users. The platform needs:

- Identity provider with users, roles, groups, password reset, MFA, audit.
- Multi-tenant support (tenants ↔ realms or tenants ↔ groups inside one realm).
- Standards-compliant tokens we can validate in the backend gateway.
- Self-hostable, no per-MAU pricing, OSS.

Build-vs-buy: building auth is one of the worst engineering investments. Documented identity products solve dozens of edge cases (token rotation, federated IdPs, recovery flows) we shouldn't reimplement.

## Options Considered

1. **Keycloak (OSS, Red Hat / CNCF).** Java-based, battle-tested, full OIDC/SAML, admin API, theming.
2. **Auth.js / NextAuth-equivalent for Angular.** Library, not a service. Forces us to host sessions ourselves.
3. **SaaS (Auth0, Clerk, Stytch, WorkOS).** Excellent DX, but per-MAU pricing scales badly with our SaaS model where MAU = tenant users (could be hundreds per tenant).
4. **Ory Kratos + Hydra.** Modern, modular, Go-based. Lower memory footprint than Keycloak. Steeper integration story for our admin needs (less complete admin UI, more self-assembly).

## Decision

**Keycloak.** Reasons:

- Single artifact covers identity, authorization, admin UI, and standard protocols — minimal moving parts in Phase 1.
- Mature `keycloak-js` adapter integrates cleanly with Angular's `APP_INITIALIZER`.
- Admin REST API lets the platform-admin plugin programmatically create tenants, users, roles.
- Self-hosted; fits the single-VPS topology of ADR-0025; no per-user costs.
- License: Apache-2.0 (matches our LICENSE).

## Tenancy Model in Keycloak

**One realm, tenants as groups.** Rationale:

- Realm-per-tenant scales poorly (Keycloak admin overhead per realm) and complicates SSO across plugins.
- Group-per-tenant is the documented pattern for "multi-tenant SaaS on Keycloak".
- Tenant ID is propagated as a JWT claim derived from the user's group membership.

```
Realm: ventix
├── Groups
│   ├── tenant:taller-perez
│   │   ├── Members: juan@taller, maria@taller
│   │   └── Subgroups (roles): owner, receptionist, accountant
│   ├── tenant:la-esquina
│   │   └── ...
│   └── platform-admins        (cross-tenant; only Carlos & ops)
├── Clients
│   ├── ventix-shell           (public, PKCE, browser login)
│   └── ventix-gateway         (confidential, service-to-service token validation)
└── Roles
    ├── platform:admin
    └── tenant:owner / tenant:receptionist / tenant:accountant / ...
```

A custom mapper (Keycloak `Script Mapper` or a small Java extension) inspects group membership and writes:

```jsonc
{
  "tenant_id":   "taller-perez",     // single tenant per session in Phase 1
  "tenant_role": "owner",
  "abilities":   [...]               // computed from tenant's active plugins (RFC-0003)
}
```

Multi-tenant-per-user (one human in many tenants) is supported by issuing a fresh token at tenant-switch time, not by encoding multiple tenants in one token.

## Frontend Integration

```ts
// libs/kernel/auth/src/lib/auth.bootstrap.ts
import Keycloak from 'keycloak-js';

export const KEYCLOAK = new InjectionToken<Keycloak>('KEYCLOAK');

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => async () => {
        const kc = new Keycloak({
          url: '/auth',                  // Caddy reverse-proxies /auth → keycloak
          realm: 'ventix',
          clientId: 'ventix-shell',
        });
        await kc.init({ onLoad: 'login-required', pkceMethod: 'S256' });
        // Make available via DI; AuthService reads token + claims from it.
      },
    },
    AuthService,
  ]);
}
```

`AuthService` exposes a signal of the current user, tenant id, and abilities:

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user        = signal<UserInfo | null>(null);
  readonly tenantId    = computed(() => this.tokenClaims()?.tenant_id ?? null);
  readonly tokenClaims = signal<JwtClaims | null>(null);

  // Auto-refresh tokens 30s before expiry; updates tokenClaims signal.
}
```

The `TenantService` (RFC-0011) consumes `auth.tenantId()` and loads the registry for that tenant.

## Backend (Gateway) Integration

Quarkus has first-class Keycloak support via `quarkus-oidc`:

```properties
quarkus.oidc.auth-server-url=http://keycloak:8080/realms/ventix
quarkus.oidc.client-id=ventix-gateway
quarkus.oidc.application-type=service
```

Every request to `/api/control-plane/v1/*` is gated:

```java
@RolesAllowed("platform:admin")
@PATCH @Path("/tenants/{id}/plugins/{pluginId}")
public Response updatePlugin(...) { ... }
```

Tenant-scoped endpoints validate that `jwt.tenant_id == path.tenantId` and reject otherwise.

## Local Dev

`infra/docker-compose.yml` includes Keycloak in dev mode with a pre-imported realm export (`infra/keycloak/realm-export.json`) containing:

- One default tenant (`tenant-default`).
- One admin user (`admin@ventix.local` / dev-only password).
- One regular user (`dev@taller-perez.local` / dev-only password).

CI uses the same compose file; the `realm-export.json` is the single source of truth.

## Consequences

**Positive:**
- Standards-based identity; no bespoke auth code in our gateway.
- Self-hosted, no MAU cost; fits single-VPS topology.
- Admin API enables the platform-admin plugin to provision tenants programmatically.
- `keycloak-js` is a known quantity in the Angular ecosystem.

**Negative:**
- Keycloak is a Java service — adds JVM overhead to the VPS (~400 MB RAM at idle). Acceptable on the recommended hardware (4 GB+).
- The custom mapper for `tenant_id`/`abilities` claims is platform-specific code. Documented as `infra/keycloak/mappers/`.
- Operator burden: realm export/import discipline becomes important for environment promotion. Mitigation: keep `realm-export.json` in source.

## Open

- **Tenant-switch UX** (one user, many tenants) — Phase 1.5. Phase 1 = one tenant per user.
- **Social login (Google, Microsoft)** — supported by Keycloak natively; enable per tenant on demand.
- **MFA** — supported; off by default; enable for `platform-admins` group from day one.
