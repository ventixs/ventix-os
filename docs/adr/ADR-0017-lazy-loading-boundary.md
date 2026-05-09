# ADR-0017: Lazy Loading Boundary — Shell Eager, Plugins Lazy

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

The constitution mandates "lazy loading everywhere" *and* "fast startup." Taken literally, lazy-loading every kernel lib would slow startup (each lazy chunk is a network round-trip) without runtime benefit (the kernel is always needed). Without a clear boundary, every PR debates which libs are lazy.

## Decision

The lazy-loading boundary is the **shell ↔ plugin** seam:

- **Shell + kernel libs are eager.** Direct imports. One main bundle. Loaded once at startup. Includes `bootstrap`, `manifest`, `registry`, `plugin-runtime`, `router-dynamic`, `nav`, `tenant-context`, `permissions`, `event-bus`.
- **Plugins are always lazy.** Loaded via Module Federation runtime API on activation, never at shell build time.
- **Within a plugin, routes are lazy.** Each route component uses `loadComponent: () => import('./...')`. Plugin authors follow this convention; the CLI scaffold enforces it in `create plugin`.

## Consequences

**Positive:** shell startup is a single optimized bundle (target ≤250 KB gzip); plugins amortize cost across activations; per-plugin route navigation is fast because the chunk loads on demand within an already-active plugin.

**Negative:** the kernel main bundle is the long pole on TTI. Mitigated by the 250 KB budget enforced via `size-limit` in CI.

**Trap to avoid:** "let's lazy-load `kernel/permissions` because it's big." If permissions is big, fix permissions — don't paper over with a chunk split that only delays the cost.
