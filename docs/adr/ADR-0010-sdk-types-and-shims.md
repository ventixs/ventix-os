# ADR-0010: SDK Ships Types + Shims; Runtime Injected by Kernel

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

`@ventix/plugin-api` could ship as (a) a runtime library with full implementations, (b) types only, or (c) types plus minimal shims with the kernel providing real implementations at activation. Option (a) bloats plugin bundles, couples plugins to SDK internals, and makes versioning a compatibility minefield. Option (b) leaves no place for the canonical test harness. Option (c) is the elegant middle ground.

## Decision

`@ventix/plugin-api` ships:
- **Public interfaces** for `PluginContext` and every sub-API.
- **`definePlugin()`** — the single entry point.
- **Lifecycle primitives** (`Disposable`, `DisposableBag`).
- **Manifest types and Zod schema.**
- **Test harness** under a separate entry point (`@ventix/plugin-api/testing`).
- **`SDK_VERSION`** constant for kernel compatibility checks.

It ships **no** business logic, no HTTP client implementation, no event-bus implementation. The kernel injects real implementations of `PluginContext` at activation. The test harness is the *only* "real" implementation in the SDK package — and it doubles as the canonical reference implementation.

## Consequences

**Positive:** plugin bundles stay tiny (<5KB SDK contribution); kernel evolves freely behind stable interfaces; semver discipline applies to a small, explicit surface; tests don't require a running shell.

**Negative:** SDK authors must distinguish public (frozen per major) from internal (free to change). Mitigated by the `exports` map: only `.`, `./testing`, `./manifest` are reachable.

**Hard rule:** if the SDK package ever exceeds 5KB gzipped, we shipped runtime by accident. CI gates on size.
