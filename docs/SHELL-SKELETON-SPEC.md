# Shell Skeleton Specification

> Target deliverable: end of Sprint 1, Week 2. The empty shell that loads zero plugins without crashing.

## Purpose

`apps/shell` is the runtime kernel host. It is **deliberately empty of business logic**. Its job is to:

1. Bootstrap Angular zonelessly with the kernel providers.
2. Initialize tenant + user context (stubbed in Phase 0).
3. Read the plugin registry.
4. Activate registered plugins in parallel, fault-isolated.
5. Render a `<router-outlet>` and a nav slot derived from `NavigationService.tree`.

Anything beyond that is a constitutional violation and must be rejected in review.

## File Layout

```
apps/shell/
├── src/
│   ├── main.ts                 # bootstrap entry
│   ├── app/
│   │   ├── shell.component.ts  # root component (template only)
│   │   ├── shell.component.html
│   │   ├── shell.config.ts     # ApplicationConfig
│   │   └── kernel-bootstrap.ts # APP_INITIALIZER orchestrator
│   ├── styles.css              # Tailwind 4 imports only
│   └── index.html
├── public/
│   └── config.json             # runtime config (registry URL, env)
├── project.json                # Nx target config
└── tsconfig.app.json
```

## `main.ts` (canonical shape)

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { ShellComponent } from './app/shell.component';
import { shellConfig } from './app/shell.config';

bootstrapApplication(ShellComponent, shellConfig)
  .catch((err) => console.error('VENTIX shell failed to bootstrap', err));
```

Five lines. No business logic. If this file grows, something is wrong.

## `shell.config.ts` (canonical shape)

```ts
import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideKernel } from '@ventix/kernel-bootstrap';
import { KernelBootstrap } from './kernel-bootstrap';

export const shellConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter([], withComponentInputBinding()),
    provideKernel(),
    provideAppInitializer(() => inject(KernelBootstrap).run()),
  ],
};
```

## `kernel-bootstrap.ts` (responsibilities)

A single service. Runs once on app init. Sequence:

1. Fetch `/config.json` (registry URL, env tag).
2. Initialize `TenantContext` (Phase 0: hardcoded `dev-tenant`).
3. Initialize `UserContext` (Phase 0: hardcoded `dev-user`).
4. Apply theme tokens for the tenant (Phase 0: default).
5. Fetch installed plugins from the registry (Phase 0: read `/registry.json`).
6. Call `PluginOrchestrator.activateAll(records)` — `Promise.allSettled` under the hood.
7. Mark shell ready.

Errors at any step are logged structured; the shell still renders. One broken step never blanks the UI.

## `shell.component.html` (canonical shape)

```html
<header class="vtx-shell-header">
  <a routerLink="/" class="vtx-brand">VENTIX</a>
  <nav>
    @for (item of nav.tree(); track item.id) {
      <a [routerLink]="item.route" class="vtx-nav-item">{{ item.label }}</a>
    }
  </nav>
  <span class="vtx-tenant">{{ tenant.current()?.name }}</span>
</header>

<main class="vtx-shell-main">
  <router-outlet />
</main>
```

That's the whole template. New control flow only. Signal calls in the template. No `*ngFor`, no `async` pipe (signals don't need it).

## Constraints (constitutional checks)

- ✅ **No business logic** — none of the words "lead", "deal", "invoice", "employee", or any domain term appears in `apps/shell`.
- ✅ **No hardcoded routes** — the router config is `[]` at boot; plugins register theirs.
- ✅ **No hardcoded menu items** — the template iterates `nav.tree()`.
- ✅ **No hardcoded permissions** — none referenced in shell code.
- ✅ **No NgModules** — standalone everything.
- ✅ **OnPush** — `ShellComponent` declares `changeDetection: ChangeDetectionStrategy.OnPush`.
- ✅ **Zoneless** — provided in `shell.config.ts`.
- ✅ **Bundle budget** — `size-limit` configured ≤ 250 KB gzip.

## Acceptance — Sprint 1 Week 2

- [ ] `nx serve shell` starts on `localhost:4200`.
- [ ] Empty shell renders the brand + an empty nav + the tenant name "Dev".
- [ ] No console errors on bootstrap.
- [ ] No console errors when `/registry.json` returns `[]`.
- [ ] `nx test shell` passes (3 tests: bootstraps, no errors with empty registry, fault-isolated on bad plugin).
- [ ] Bundle size measured and recorded (no enforcement until Phase 1).

## Out of Scope for the Skeleton

- ❌ Login / OIDC integration — Phase 1.
- ❌ Permissions UI — Phase 1.
- ❌ Theme switcher — Phase 1.
- ❌ Sidebar / breadcrumbs / search — Phase 1+.
- ❌ Error boundary UI beyond a logged warning — Phase 1.
- ❌ i18n — Phase 1.
- ❌ Telemetry — Phase 1.

The skeleton is the constitution applied to itself: small, generic, never knows plugin internals.
