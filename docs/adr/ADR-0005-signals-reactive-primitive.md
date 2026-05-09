# ADR-0005: Signals as the SDK Reactive Primitive

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Angular 20 ships signals as a stable, first-class reactive primitive. The SDK could expose state via `Observable`, `Signal`, both, or a custom abstraction. Each plugin author paying RxJS tax for a one-line "is this enabled" check is a DX failure; a custom abstraction is reinvention.

## Decision

The SDK's public reactive type is `Signal<T>` (Angular's `@angular/core` export). RxJS is used internally at I/O boundaries (HTTP, event-bus bridge, MF loader) and exposed via opt-in interop helpers (`toObservable`, `toSignal`). Components consume signals; pipelines consume Observables.

## Consequences

**Positive:** template ergonomics are excellent (`@if (perms.can$('crm.lead.write')()) { ... }`); zero subscription bookkeeping; aligns with Angular's direction.

**Negative:** couples the SDK type surface to Angular. Acceptable while the platform commits to Angular plugins; revisit only if framework-agnostic plugins become a strategic goal.

**Trap to avoid:** dual-API endpoints (`fooSignal` + `foo$`) — pick one per surface, RxJS users wrap with `toObservable`.
