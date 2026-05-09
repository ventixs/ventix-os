# ADR-0007: No Auth, Backend, Docker, or Kafka in Phase 0

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Phase 0's job is to prove the runtime plugin loop: a plugin loads into an unmodified shell and contributes routes/nav. Adding Keycloak, Quarkus services, Postgres, Docker Compose, and Kafka in Phase 0 multiplies setup cost — every contributor pays 30+ minutes in environment setup before writing a line of plugin code. This breaks the 15-minute-onboarding goal.

## Decision

In Phase 0:
- **Auth:** stubbed. `TenantContext.initialize({ id: 'dev-tenant', ... })` and `UserContext` hardcoded at the bootstrap edge.
- **Backend:** none. `ctx.http`, `ctx.events`, `ctx.permissions`, etc. throw `NOT_IMPLEMENTED_IN_PHASE_0` when accessed. Types remain full.
- **Docker:** not required. Pure Node + pnpm dev loop.
- **Kafka / event bus:** not present. Browser `EventBus` interface exists in types only.

The principle: **stubs are about source, not shape.** Every type signature is production-grade; only the bootstrap-edge initialization is stubbed. Phase 1 swap is a one-file change.

## Consequences

**Positive:** clone-to-running in <5 minutes; no JVM/Postgres/Docker on contributor machines; iteration speed maximized for the contracts we actually need to validate.

**Negative:** team must resist the temptation to start Phase 1 work early. Loud failures (`NOT_IMPLEMENTED_IN_PHASE_0`) over silent no-ops to make Phase 1 capability-leakage detectable.

**Phase 1 upgrade path:** OIDC adapter replaces tenant/user stubs; Quarkus services come online; Docker Compose for local dev lands; Kafka bridge exposes the existing `EventBus` interface to backend topics.
