# ADR-0011: Disposables Auto-Bound to `ctx.disposables`

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Plugin deactivation must fully reverse activation: routes removed, nav items gone, event subscriptions dropped, AI tools unregistered, timers cleared. Forcing every plugin author to track this manually produces leaky deactivation. Forcing them to define a complex `deactivate()` produces boilerplate.

## Decision

Every kernel-provided registration call (`ctx.events.on`, `ctx.router.register`, `ctx.nav.register`, `ctx.ai.tool`, etc.) returns a `Disposable` **and** auto-binds it to the ambient `ctx.disposables` bag. On deactivation, the kernel disposes the bag in reverse order, swallowing per-item errors so one broken cleanup doesn't strand others. Authors who want fine-grained control hold the returned `Disposable` themselves. `definePlugin()`'s `deactivate` hook is **optional** — most plugins never write one.

For async cancellation, `ctx.signal` is an `AbortSignal` that fires on deactivation and composes with `fetch`, timers, and async iterators.

## Consequences

**Positive:** zero-boilerplate cleanup for the common case; deactivation invariant is enforced by the runtime, not by author discipline; teardown ordering is deterministic.

**Negative:** authors who don't read docs may not realize cleanup is automatic and write redundant `deactivate` code. Acceptable noise; redundant code is harmless.
