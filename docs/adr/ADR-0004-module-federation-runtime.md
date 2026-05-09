# ADR-0004: Module Federation via `@module-federation/enhanced`

- **Status:** Ratified (pending M0 spike confirmation)
- **Date:** 2026-05-08

## Context

The kernel must load plugins at runtime, from URLs unknown at shell-build time. Three viable approaches exist: Web Components (loses Angular DI sharing, costs DX), iframes (kills perf and singletons), and Module Federation. Within MF, two libraries dominate: `@angular-architects/module-federation` (Angular-coupled, builder-integrated) and `@module-federation/enhanced` (framework-neutral, runtime-API-first, actively maintained).

## Decision

Use `@module-federation/enhanced`'s runtime API. Remotes are registered at runtime from manifests, not at build time. Shared singletons (`@angular/core`, `@angular/common`, `@angular/router`, `rxjs`, `@ventix/plugin-api`, `@ventix/ui-kit`, `@ventix/design-tokens`) are declared with `strictVersion: true` for the SDK contract and pragmatic loose-version for ecosystem libs.

## Consequences

**Positive:** plugins declare URLs in manifests, kernel doesn't know them at build time, version skew on the SDK contract fails loudly.

**Negative:** less off-the-shelf Angular tooling than `@angular-architects/*`; we own a thin loader wrapper.

**Reversal cost:** ~1 sprint to switch to `@angular-architects/module-federation` if the M0 spike reveals blockers. Path documented; not preferred.
