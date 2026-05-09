# ADR-0003: Multi-Tenancy is an Axiom

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Bolting multi-tenancy onto a single-tenant codebase is one of the most expensive refactors in SaaS. Every cache key, every query, every event header, every storage prefix must be revisited. The historical pattern — "we'll add tenancy later" — produces years of follow-on bugs.

## Decision

Multi-tenancy is treated as a runtime axiom from line 1. Every kernel API, every SDK type, every event header, every cache namespace, every storage key carries `tenantId`. There is no tenant-less code path. Plugins receive a `TenantInfo` from the SDK and never construct it. Switching tenants triggers a full shell reload — surgical invalidation is a class of bugs we refuse to ship.

In Phase 0, the *source* of `TenantInfo` is stubbed (hardcoded `dev-tenant`) at the bootstrap edge. The *shape* — every signature, every header, every storage key — is production-grade. Phase 1 replaces the stub with an OIDC-driven tenant resolver in a single bootstrap-edge change.

## Consequences

**Positive:** zero-cost migration to real multi-tenancy in Phase 1; cross-tenant data leaks are impossible by construction (interceptors throw); plugin authors write zero tenancy code.

**Negative:** Phase 0 contributors must resist the temptation to "skip the tenantId since it's always the same." PR review enforces this; lint rules flag missing `tenantId` in event headers and storage operations.
