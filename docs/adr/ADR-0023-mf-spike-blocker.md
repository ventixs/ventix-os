# ADR-0023: Module Federation Spike — Documented Blocker, Deferred to Phase 1.5

- **Status:** Ratified
- **Date:** 2026-05-09
- **Relates to:** ADR-0004 (which stays in force as the target architecture)

## Context

Phase 1 spike attempted to wire `@module-federation/enhanced/runtime` in the host (`@angular/build` / esbuild) with `@module-federation/vite + @analogjs/vite-plugin-angular` in the plugin. Goal: ship a TypeScript plugin with a real Angular component that renders inside the shell using a shared Angular instance.

What worked:
- Vite + Angular plugin compiled the plugin component cleanly (329 modules transformed).
- `@module-federation/vite` emitted a valid `remoteEntry.js` + chunked share bundles.
- The host's `init()` accepted shared module factories (`lib: () => ngCore`, etc.) with `loaded: 1` and `singleton: true`.
- `MfLoader.load()` registered the remote with `type: 'module'` and `loadRemote()` returned the plugin's exposed module.

What did NOT work:
- The plugin's bundled `@angular/common` (and other shares) was used at runtime instead of the host's instance. NG0200 (circular dep on `StandaloneService`) and NG0203 (`inject()` outside injection context) fired from `__mfe_internal__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js` — the plugin's bundled fallback chunk.
- Setting `loaded: 1`, explicit version `'20.0.0'`, eager flag combinations, all yielded the same result.

## Root Cause Hypothesis

`@module-federation/vite` (used by the plugin) and `@module-federation/enhanced/runtime` (used by the host) maintain **separate share registries** in this configuration. The plugin's runtime initializer doesn't see the host's `lib:` factories because it expects a Manifest-protocol provider rather than a manually-registered share scope.

Making this work likely requires one of:

1. **Rebuild the shell with `@module-federation/vite`** instead of `@angular/build`. The two plugins then read from the same share scope. Cost: rewrite the shell build pipeline (1–3 days), accept Vite's Angular story over Angular's blessed builder.
2. **Use `@module-federation/runtime` directly on both sides** with a manifest endpoint — the plugin emits `mf-manifest.json` which the host fetches via `loadRemote('@manifest:url')`. May still hit the same scope-isolation issue.
3. **Move plugins to true webpack MF** — Angular Architects' MF preset (`@angular-architects/native-federation`). Designed exactly for Angular MFE; well-documented; the trade-off is leaving the modern Vite/esbuild stack.

## Decision

The MF spike is **paused**. The implementation lands in `libs/plugins/hello-mf/` and `libs/kernel/plugin-runtime/src/lib/mf-loader.ts` as a documented starting point for Phase 1.5.

The shell's runtime keeps the loader-selection logic but `com.demo.hello-mf` is removed from `apps/shell/public/registry.json` so the development shell stays in a clean working state.

ADR-0004 (Module Federation as the target architecture) **stays in force** — the decision is "pause, not abandon."

The Phase 0.5 `panel` API (ADR-0019 implementation) covers the immediate need: plugins ship working routes today via declarative content, with an upgrade path to `loadComponent` once MF is fully wired.

## Consequences

**Positive:**
- Stops a yak-shaving spiral. The next person picking this up has a documented starting point with two real evaluated approaches.
- The platform stays in a working, demonstrable state — Hello plugin shipped, panel-rendered routes, full lifecycle, registry, CLI, shell.
- ADR-0004 commitment is preserved; only the implementation timeline shifted.

**Negative:**
- Plugins ship simple panels in Phase 1, not arbitrary Angular components. For most business plugins (CRM, dashboards, lists, forms) this is sufficient — but advanced UI is bottlenecked.

## Recommended Phase 1.5 Approach

Schedule a dedicated 3-day spike that **starts** by replacing the shell build with `@module-federation/vite` (option 1 above). Specifically:
1. Keep `apps/shell` Angular code unchanged.
2. Replace `@angular/build:application` executor with a Vite-based equivalent that includes `@module-federation/vite` as the host plugin.
3. Re-test `hello-mf` end-to-end. If shares now resolve correctly, document the working setup in this ADR as a follow-up section.
4. If still broken, escalate to option 3 (Angular Architects' Native Federation).

Whatever path succeeds, write the working setup as ADR-0024 superseding this one.

## What This Does NOT Change

- ADR-0004 (target = Module Federation) — still binding.
- Plugin-first architecture, manifest-driven, kernel/SDK split — all unchanged.
- The `loadComponent` path in `PluginRouteSpec` — still the Phase 1.5 goal; `panel` is the working alternative today.
