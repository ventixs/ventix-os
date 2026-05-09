# ADR-0008: Plugin Lifecycle FSM with Single Mutation Surface

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Plugin state ("is it loaded? activated? errored?") is touched by many subsystems: the loader, the registry, the router, the nav, the marketplace UI, the CLI dev workflow. Without a single source of truth and explicit transitions, debugging "how did this plugin end up ACTIVE without being LOADED" becomes archaeology three months in.

## Decision

A single finite-state machine governs every plugin's lifecycle, per-tenant:

```
DISCOVERED → VALIDATED → INSTALLED → LOADED → ACTIVE → SUSPENDED → INSTALLED → REMOVED
                                                  ↘ ERROR (from any state)
```

All transitions go through `PluginRegistry.transition(id, next, patch)`. Illegal transitions throw via `assertLegalTransition`. Activation is idempotent; deactivation fully reverses registration via `DisposableBag` (see ADR-0011). One broken plugin never affects the shell or other plugins (`Promise.allSettled` on activation).

Phase 0 implements the subset: `DISCOVERED → VALIDATED → LOADED → ACTIVE → SUSPENDED → (gone)`. `INSTALLED`, per-tenant lifecycle, and retry policies arrive in Phase 1.

## Consequences

**Positive:** every state question has one answer; transitions are auditable; UI can render any state safely; debugging is deterministic.

**Negative:** every contributor must learn the FSM. Mitigated by a single helper (`assertLegalTransition`) and unit tests that double as documentation.
