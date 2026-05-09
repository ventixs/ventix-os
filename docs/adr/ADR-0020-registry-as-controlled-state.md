# ADR-0020: Plugin Registry as Controlled State, Not Global Mutable State

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

The constitution forbids "global mutable state" and "shared mutable stores." The plugin registry is, by necessity, globally readable — every kernel subsystem (router, nav, permissions, marketplace UI) needs to know what plugins exist and what state they're in. Without a clear distinction, well-intentioned engineers either replicate registry data into local state (causing drift) or invent unconstrained shared singletons (recreating the problem the rule forbids).

## Decision

The plugin registry is a **single signal of an immutable map**, with a **single mutation surface** (`PluginRegistry.transition(id, next, patch)`). Reads are derived `computed` signals. There is one writer (the kernel's lifecycle orchestrator) and many readers. This is *controlled state*, not *global mutable state*.

The distinction, made explicit:
- **Forbidden:** services exposing public mutators that anyone can call (`registry.set(...)`, `registry.update(...)`).
- **Forbidden:** plugins or feature code mutating registry data directly.
- **Allowed:** the registry's `transition` method, FSM-guarded, called only by the lifecycle orchestrator.
- **Allowed:** any subsystem reading via `registry.all()`, `registry.active()`, etc.

The same pattern (single signal of immutable data + single mutation surface) is the **only acceptable shape** for any future shell-wide state container. PRs introducing alternative patterns require an ADR that supersedes this one.

## Consequences

**Positive:** the architectural rule is operational, not aspirational; reviewers have a clear test ("does this have a single mutation surface?"); state debugging is deterministic; immutable snapshots feed `computed` cleanly.

**Negative:** contributors used to mutator-style state (NgRx actions, Redux dispatchers) need to internalize the pattern. The Hello plugin and kernel libs serve as examples.
