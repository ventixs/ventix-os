# ADR-0018: UI Kit as Federation Singleton, Exposed via `ctx.ui`

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Two constitution rules pull in opposite directions: plugins must use the **shared UI kit** for visual consistency; plugins must be **isolated** to prevent coupling. Direct imports of `@ventix/ui-kit` from plugin code create a hard dependency that breaks isolation; ad-hoc duplication breaks consistency.

## Decision

`@ventix/ui-kit` is a **Module Federation singleton** (`singleton: true`, `strictVersion: false`). The shell loads it once. Plugins consume primitives **through `ctx.ui`** — a re-export surface in `@ventix/plugin-api` that mirrors the public UI kit API. Direct `@ventix/ui-kit` imports from plugin code are forbidden by Nx tag constraints.

## Consequences

**Positive:** one mental model for plugin authors (everything reactive lives on `ctx`); UI kit can evolve internals freely as long as `ctx.ui` stays stable; visual consistency without coupling.

**Negative:** SDK Lead must keep `ctx.ui` in sync with UI kit's public surface. Mitigated by automated re-export generation as part of the SDK build.

**Why not strict version:** UI kit ergonomics evolve faster than the SDK contract; strict pinning would brick plugins on legitimate, additive UI kit upgrades. The SDK contract is the version-strict surface (ADR-0010), not the UI primitives.
