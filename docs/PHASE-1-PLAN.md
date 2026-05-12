# VENTIX OS — Phase 1 Plan

> Phase 0 proved the platform works for one developer with one plugin. Phase 1's job is to make it work for **paying customers running multiple plugins**.

## Definition of Done

Two testable acceptance criteria:

> **AC-1 (Tenant gating):** A platform admin creates a tenant `taller-perez`, activates plugins `com.ventix.talleres` and `com.ventix.facturacion` for it. A user logs in scoped to that tenant. The shell loads **only** those two plugins, ignoring others published in the registry.

> **AC-2 (Remote plugin):** A plugin built in a **separate repository** is published to a CDN URL. The platform admin registers that URL in the control plane. A tenant with that plugin enabled logs in and sees the plugin's routes — **without redeploying the shell**.

If both pass, Phase 1 succeeded.

## Time Budget

**6 weeks. 3 sprints × 2 weeks.** Past 8 = the plan was wrong, replan.

The biggest risk is the MF spike (M1). If it slips, AC-2 is at risk; AC-1 is independent and ships regardless.

## Non-Goals

What Phase 1 explicitly does **not** ship:

- Marketplace UI for tenants to self-install plugins (Phase 2).
- Plugin signing / code-signing chain (Phase 2).
- Multi-region / HA deployment (Phase 2+).
- Stripe / billing automation — manual plan management is acceptable (Phase 1.5).
- AI agents as plugins / tool-call surface (Phase 2).
- Sandboxing beyond browser origin (Phase 2).

## Milestones

| ID | Name | Window | Outcome |
|---|---|---|---|
| **M0** | Control Plane | Sprint 1 | Tenant + tenant_plugins schema, `/api/registry/:tenantId` contract, kernel `TenantService`, registry filtered by tenant. AC-1 passes with stub data. |
| **M1** | MF Re-spike | Sprint 1 (parallel) | Resolve ADR-0023. ADR-0024 documents the working setup. `hello-mf` plugin loads from another origin. |
| **M2** | Auth | Sprint 2 | Keycloak deployed, frontend login flow, JWT with `tenant_id` claim, kernel `AuthService`, backend gateway validates tokens. |
| **M3** | EventBus | Sprint 2 | Cross-plugin pub/sub with Zod-validated topics, in-process implementation. POS demo emits, almacen demo consumes. |
| **M4** | Admin Plugin | Sprint 3 | First-class plugin (`com.ventix.admin`) only visible to platform admins. Manage tenants, activate/deactivate plugins, see version per tenant. AC-1 passes with real DB. |
| **M5** | First Real Plugin | Sprint 3 | Migrate the smallest production candidate (bot or one talleres module) to a remote plugin. AC-2 passes. |

## Epics

| ID | Epic | Milestone |
|---|---|---|
| EPIC-9 | Tenant Control Plane (RFC-0011) | M0 |
| EPIC-10 | Module Federation hardening | M1 |
| EPIC-11 | Auth — Keycloak (ADR-0024) | M2 |
| EPIC-12 | Permissions (RFC-0003) | M2 |
| EPIC-13 | EventBus (RFC-0004) | M3 |
| EPIC-14 | Platform Admin Plugin | M4 |
| EPIC-15 | Backend gateway (Quarkus, minimal) | M2–M4 |
| EPIC-16 | First production plugin migration | M5 |
| EPIC-17 | Deployment topology (ADR-0025) | M2–M4 |

## Repository Structure (Phase 1 additions)

```
ventix-os/
├── apps/
│   ├── shell/                         # existing
│   └── platform-gateway/              # NEW — Quarkus backend
├── libs/
│   ├── kernel/
│   │   ├── tenant/                    # NEW — TenantService
│   │   ├── auth/                      # NEW — AuthService, token decode
│   │   ├── permissions/               # NEW — CASL ability builder
│   │   └── eventbus/                  # NEW — typed pub/sub
│   ├── sdk/
│   │   └── plugin-api/                # extended: ctx.events, ctx.permissions
│   └── plugins/
│       ├── hello/                     # existing
│       ├── hello-mf/                  # reactivated (M1)
│       └── platform-admin/            # NEW (M4)
└── infra/
    ├── docker-compose.yml             # NEW — local dev stack
    ├── Caddyfile                      # NEW — reverse proxy
    └── keycloak/realm-export.json     # NEW
```

## Sprint Breakdown

### Sprint 1 (Weeks 1–2) — Control Plane + MF
- RFC-0011 ratified; schema + API contract frozen.
- `TenantService` shipped with stub data; orchestrator filters by tenant.
- MF re-spike: replace shell's build with `@module-federation/vite` (per ADR-0023 § Recommended approach).
- ADR-0024 if MF spike succeeds, ADR-0024-bis if it pivots to Native Federation.

### Sprint 2 (Weeks 3–4) — Auth + EventBus
- Keycloak in docker compose, realm `ventix`, client `shell`.
- Frontend login via `keycloak-js`; token in `AuthService`.
- Backend gateway (Quarkus) — minimal: `/api/registry/:tenantId`, JWT validation, `tenant_id` propagation.
- EventBus (in-process); two demo plugins exchanging events.
- Permissions layer (RFC-0003); plugins declare, kernel enforces on routes/menu.

### Sprint 3 (Weeks 5–6) — Admin + First Real Plugin
- `com.ventix.admin` plugin: CRUD tenants, activate/deactivate plugins, audit log of changes.
- Migrate one real production module to a remote plugin in its own repo.
- Deploy end-to-end on a single VPS per ADR-0025.
- Onboard one pilot tenant from existing customer base.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MF re-spike fails again | Medium | High (AC-2) | Fall back to Native Federation (Angular Architects); AC-1 still ships independently. |
| Keycloak ops complexity | Low | Medium | Start with default in-memory dev mode; production hardening is Phase 1.5. |
| EventBus scope creep into distributed | Medium | Medium | RFC-0004 explicitly scopes to in-process; Kafka is Phase 2. |
| Quarkus learning curve | Low | Medium | Backend stays minimal — registry endpoint + JWT validation. No business logic. |
| Real plugin migration uncovers SDK gaps | High | Medium | Treat the migration as a forcing function for SDK improvements; add ADRs as gaps surface. |

## Success Metrics

- **Onboarding time** for a new tenant: under 2 minutes (admin flow).
- **Time to add a new plugin** to a tenant: under 30 seconds (one DB row).
- **Shell bundle size** unchanged from Phase 0 (~180 KB gzip).
- **Plugin lazy-load** correctly per route (no eager bundle for unused plugins).
- **Zero shell redeploys** required to publish a new plugin version.

## What This Plan Does NOT Decide

Open questions deferred to RFCs / later ADRs:

- Inter-plugin **data** sharing model beyond events (RFC reserved).
- Plugin **versioning policy** for tenants (latest, pinned, opt-in updates) — open.
- **Backup / disaster recovery** posture for the single-VPS topology — ADR-0025 sketches it; production-grade comes Phase 1.5.
- **Telemetry** boundary (per-tenant logs, observability) — Phase 2.
