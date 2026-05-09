# ADR-0019: State vs Flow — Signals for State, RxJS for Flow

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

The constitution says "signals first" *and* "RxJS for streams, websockets, async pipelines, external subscriptions." Without a sharp boundary, contributors mix paradigms inconsistently — some services expose `Subject`, others `signal`, some both — and plugin authors face cognitive load.

## Decision

The boundary is **state vs. flow**:

- **State** (what the system *is* at this moment): `Signal<T>` and `computed`. Examples: active plugin list, current tenant, permission ability set, current route, derived nav tree.
- **Flow** (what's *happening* over time): RxJS. Examples: HTTP responses, websocket messages, debounced input streams, retry pipelines.

Conversions occur at boundaries: `toSignal(http$)` when an HTTP result feeds a state surface; `toObservable(routerState)` when state needs to feed an RxJS pipeline. Public reactive surfaces on `PluginContext.*` and kernel services expose `Signal<T>` only. RxJS lives inside kernel implementations.

## Consequences

**Positive:** plugin authors learn one reactive primitive (signals); template ergonomics excellent; subscription leak class of bugs eliminated from plugin code; RxJS power available when the kernel needs it.

**Negative:** kernel implementers must learn both. Acceptable — they already do.

**Trap to avoid:** dual APIs (`fooSignal` + `foo$` on the same surface). Pick one per surface; consumers wrap with `toObservable`/`toSignal` if needed.
