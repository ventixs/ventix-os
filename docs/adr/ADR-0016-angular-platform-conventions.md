# ADR-0016: Angular Platform Conventions

- **Status:** Ratified
- **Date:** 2026-05-08
- **Deciders:** Senior Angular Platform Engineer, Chief Architect, Kernel Lead

## Context

VENTIX OS is a runtime plugin platform, not a CRUD app. Conventional Angular practices (NgModules, ad-hoc change detection, `*ngFor`, NgRx) accumulate coupling that breaks the plugin-first promise as the platform scales. Without a ratified set of Angular-specific conventions, every PR re-litigates style and architecture choices, and the shell drifts toward a monolith.

## Decision

The following conventions are binding across `apps/shell`, `libs/kernel/*`, `libs/sdk/*`, and `libs/plugins/*`:

1. **Standalone-only.** No `NgModule` declarations except in single-file shims wrapping third-party libraries that require them. Such shims carry a `// SAFETY:` comment explaining why and never proliferate.
2. **Zoneless change detection** is the default for the shell (`provideExperimentalZonelessChangeDetection()`). Zone.js is a Phase 1 fallback only if a plugin demonstrates an unbreakable dependency.
3. **`ChangeDetectionStrategy.OnPush`** is the default on every component. Default change detection requires a `// SAFETY:` comment in the component decorator.
4. **New control flow only.** `@if`, `@for`, `@switch`, `@defer`. No `*ngIf`, `*ngFor`, `ngClass`, `ngStyle`. Lint-enforced.
5. **No cross-plugin `Router.navigate` calls.** Cross-plugin navigation is `ctx.nav.open('/<plugin-id>/path')` only.
6. **No `inject()` calls in plugin code targeting kernel-internal tokens.** Plugins receive `PluginContext`. That is the only injection surface plugins are permitted.
7. **Plugin remotes declare `strictVersion: true`** on `@ventix/plugin-api` in their MF shared config. SDK contract skew is a correctness bug.
8. **Signals for state, RxJS for flow.** Conversions happen at boundaries via `toSignal`/`toObservable`. Public reactive surfaces on `ctx.*` and kernel services expose `Signal<T>`. RxJS is internal at I/O boundaries (HTTP, websockets, async pipelines).

## Consequences

**Positive:** Angular conventions stop being a per-PR debate; reviewers cite this ADR; plugin authors learn one set of patterns; lint rules become the enforcement mechanism, not human judgment.

**Negative:** contributors arriving from NgModule-heavy codebases pay a learning tax. Mitigated by the Hello plugin's component code as canonical example.

**Enforcement:** ESLint rules in the workspace root: `@angular-eslint/prefer-standalone`, `@angular-eslint/prefer-on-push-component-change-detection`, `@angular-eslint/template/prefer-control-flow`, plus a custom rule rejecting NgModule declarations outside the shim allowlist.
