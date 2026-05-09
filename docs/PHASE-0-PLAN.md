# VENTIX OS — Phase 0 Plan

> Phase 0's job is **not** to be impressive. Its job is to make Phase 1 cheap.

## Definition of Done

A single, testable acceptance criterion:

> A developer clones the repo, runs `pnpm i && pnpm dev`, opens `localhost:4200`, runs `pnpm ventix create plugin --id com.demo.hello`, runs `pnpm ventix dev`, and **the new plugin appears in the shell's navigation and renders a route — without rebuilding or restarting the shell**.

If we hit that, Phase 0 succeeded.

## Time Budget

**6 weeks. 3 sprints × 2 weeks.** Target is 4–5. Past 6 = the plan was wrong, replan.

## Milestones

| ID | Name | Window | Outcome |
|---|---|---|---|
| **M0** | Foundations Spike | Days 1–3 | Prove Nx + pnpm + Angular 20 + MF runtime works. Decision point. |
| **M1** | Contracts | Sprint 1 (Days 4–10) | ADRs 0001–0015 merged; RFC-0001 ratified; SDK types compile; manifest validator works. |
| **M2** | Runtime | Sprint 2 | Kernel implementations: registry, plugin-runtime, router-dynamic, nav. Shell renders. |
| **M3** | Hello Plugin & CLI | Sprint 3 | `ventix create/dev/validate/build`; Hello Plugin loads in unmodified shell; acceptance criterion passes. |

## Epics

| ID | Epic | Milestone |
|---|---|---|
| EPIC-1 | Workspace & Tooling Foundation | M0 |
| EPIC-2 | Manifest Contract (RFC-0001) | M1 |
| EPIC-3 | SDK Foundation | M1 |
| EPIC-4 | Plugin Runtime Kernel | M2 |
| EPIC-5 | Dynamic Routing & Navigation | M2 |
| EPIC-6 | CLI | M3 |
| EPIC-7 | Hello Plugin | M3 |
| EPIC-8 | Docs & Onboarding | M3 |

## Repository Structure (Phase 0 only)

```
ventix-platform/
├── apps/
│   └── shell/                     # Angular 20 host app
├── libs/
│   ├── kernel/
│   │   ├── manifest/              # Zod schema + validator (built first)
│   │   ├── registry/              # Plugin record store (signal-based, file-backed)
│   │   ├── plugin-runtime/        # MF loader + lifecycle FSM + DisposableBag
│   │   ├── router-dynamic/        # Route register/unregister
│   │   ├── nav/                   # Derived nav signal
│   │   ├── tenant-context/        # Stubbed for Phase 0
│   │   └── bootstrap/             # Wires the above into the shell
│   ├── sdk/
│   │   └── plugin-api/            # @ventix/plugin-api — public SDK
│   └── plugins/
│       └── hello/                 # The acceptance-criterion plugin
├── tools/
│   └── ventix-cli/                # oclif CLI: create, dev, validate, build
├── infrastructure/
│   └── dev/
│       └── plugin-host/           # Tiny static file server
├── docs/
│   ├── adr/
│   └── rfc/
├── .github/workflows/             # ci.yml only
├── nx.json
├── pnpm-workspace.yaml
└── package.json
```

**Deliberately NOT in Phase 0:** `services/`, `infrastructure/helm`, `infrastructure/argocd`, `apps/marketplace-web`, `libs/sdk/ui-kit`, `libs/sdk/design-tokens`, `libs/kernel/permissions`, `libs/kernel/event-bus`, `libs/kernel/theme`, `libs/kernel/i18n`, `libs/kernel/telemetry`, `libs-jvm/`.

## Technical Dependencies

| Tool | Version | Why |
|---|---|---|
| Node | 22 LTS | Stable, native fetch |
| pnpm | 9.x | Fast, strict, workspaces |
| Nx | 20.x | Latest, supports pnpm + Angular 20 |
| Angular | 20.x | Signals stable, standalone everything |
| TypeScript | 5.6+ strict | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| Zod | 4.x | Manifest schema (ADR-0015) |
| `@module-federation/enhanced` | 0.8+ | Runtime MF (ADR-0004) |
| Tailwind | 4.x | First-party CSS |
| oclif | 4.x | CLI (ADR-0009) |
| Vitest | 2.x | Test runner |

## Developer Workflows

### First-time setup
```bash
git clone <repo> && cd ventix-platform
pnpm install
pnpm dev                    # shell on :4200, plugin-host on :4300
```

### Working on the kernel
```bash
nx test kernel-plugin-runtime --watch
nx serve shell
```

### Building a plugin
```bash
pnpm ventix create plugin --id com.demo.hello
cd libs/plugins/hello
pnpm ventix dev             # rebuilds + hot-registers in shell
```

## CI/CD (Phase 0)

Single workflow `.github/workflows/ci.yml`:

```yaml
on: [pull_request, push]
jobs:
  ci:
    - checkout
    - setup pnpm + node 22
    - pnpm install --frozen-lockfile
    - nx affected -t lint test build --base=origin/main
```

**Not in Phase 0:** deploys, releases, package publishing, container builds, security scans.

## Coding Conventions (Phase 0 minimum)

- TypeScript strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`.
- Files: `kebab-case.ts`. Classes: `PascalCase`. Vars: `camelCase`. Plugin IDs: `reverse.dns`.
- Angular: standalone components only, signals over RxJS for state, no NgModules.
- No barrel files except the one curated `index.ts` per public lib.
- No circular deps (Nx enforces).
- No `any`. No `as` casts without `// SAFETY:` comment explaining why.
- Public API in `@ventix/plugin-api` requires TSDoc with `@example`.
- Conventional Commits.

## Plugin Lifecycle (Phase 0 subset)

```
DISCOVERED → VALIDATED → LOADED → ACTIVE → SUSPENDED → (gone)
                                       ↘ ERROR
```

Full FSM (`INSTALLED`, per-tenant lifecycle, retry policies) lands in Phase 1.

## Out of Scope for Phase 0

❌ Permissions / RBAC / CASL — Phase 1
❌ Event bus — Phase 1
❌ AI tool registration — Phase 1
❌ Themes / i18n — Phase 1
❌ Backend services — Phase 1+
❌ Marketplace, billing, signing — Phase 2
❌ Multi-tenant runtime enforcement — Phase 1 (shape locked now)
❌ Helm charts, ArgoCD, Kubernetes — Phase 2
❌ Plugin signing / cosign — Phase 2
❌ Test coverage gates — Phase 1
❌ Codemods — when we have something to migrate from
❌ Public docs site — Phase 1; README is enough now

## Sprint 1 Schedule

### Week 1
| Day | Task | Owner |
|---|---|---|
| Mon | M0 spike: Nx + pnpm + Angular 20 + MF runtime | Kernel Lead |
| Tue | M0 spike continues | Kernel Lead |
| Wed | M0 decision point. ADRs 0001, 0006, 0009 land. | Architect |
| Thu | RFC-0001 first draft published for review | SDK Lead |
| Fri | ADRs 0002–0015 merged | Architect |

### Week 2
| Day | Task | Owner |
|---|---|---|
| Mon | RFC-0001 ratified | SDK Lead |
| Tue | `libs/kernel/manifest` — Zod schema + validator + tests | Kernel Lead |
| Wed | `libs/sdk/plugin-api` — `definePlugin`, `PluginContext`, `Disposable`, `SDK_VERSION` | SDK Lead |
| Thu | Shell skeleton renders empty page; bootstrap stubbed | Kernel Lead |
| Fri | Sprint review. Plan Sprint 2. | All |

### Sprint 1 Definition of Done

- [ ] Repo runs locally in <5 minutes from fresh clone.
- [ ] RFC-0001 merged. Manifest schema implemented and tested.
- [ ] `@ventix/plugin-api` types compile and importable by a stub plugin file.
- [ ] Shell renders at `localhost:4200` (empty, but bootstraps cleanly).
- [ ] ADRs 0001–0015 merged.

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MF + Angular 20 + signals rough edges | Medium | High | M0 spike Days 1–3. Hard checkpoint. |
| Manifest schema designed against theory | Medium | Medium | RFC-0001 driven by Hello plugin needs. |
| SDK over-promises Phase 1 capabilities | Medium | Medium | Throw `NOT_IMPLEMENTED_IN_PHASE_0`; loud failures. |
| Scope creep | High | High | This document. PR reviewers cite it. |
| Onboarding takes >15 min | Medium | High | Acceptance criterion includes 5-minute install. |

## Standing Orders

1. No new ADR proposals during Sprint 1 except those in the ratified list.
2. Every PR has a one-line `Phase: 0 / 1 / 2` tag. Phase ≥1 work in a Phase 0 PR rejected.
3. Architect reviews any PR touching manifest schema, SDK public surface, or plugin lifecycle FSM.
4. Spike findings (M0) get written into ADR-0004 within 24h of completion.
5. Hello Plugin is "done" when a fresh contributor runs the acceptance command sequence with no help.
