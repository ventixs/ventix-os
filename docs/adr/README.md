# Architecture Decision Records

Each ADR captures one decision: context, decision, consequences. One paragraph each unless the decision warrants more. Numbered sequentially. Ratified ADRs do not change — they are superseded by a new ADR that references them.

## Index

| # | Title | Status |
|---|---|---|
| [0001](./ADR-0001-adopt-ventix-architecture.md) | Adopt VENTIX OS architecture | Ratified |
| [0002](./ADR-0002-manifest-as-contract.md) | Manifest is the inviolable kernel↔plugin contract | Ratified |
| [0003](./ADR-0003-multi-tenancy-axiom.md) | Multi-tenancy is an axiom | Ratified |
| [0004](./ADR-0004-module-federation-runtime.md) | Module Federation via `@module-federation/enhanced` | Ratified (pending M0 spike) |
| [0005](./ADR-0005-signals-reactive-primitive.md) | Signals as the SDK reactive primitive | Ratified |
| [0006](./ADR-0006-pnpm-nx-single-repo.md) | pnpm + Nx + single repo for Phase 0 | Ratified |
| [0007](./ADR-0007-no-auth-no-backend-phase-0.md) | No auth/backend/Docker/Kafka in Phase 0 | Ratified |
| [0008](./ADR-0008-plugin-lifecycle-fsm.md) | Plugin lifecycle FSM with single mutation surface | Ratified |
| [0009](./ADR-0009-oclif-cli.md) | oclif for the `ventix` CLI | Ratified |
| [0010](./ADR-0010-sdk-types-and-shims.md) | SDK ships types + shims; runtime injected by kernel | Ratified |
| [0011](./ADR-0011-disposables-auto-bound.md) | Disposables auto-bound to `ctx.disposables` | Ratified |
| [0012](./ADR-0012-route-namespacing.md) | Plugin route paths namespaced by reverse-DNS plugin ID | Ratified |
| [0013](./ADR-0013-cross-plugin-events-only.md) | Cross-plugin communication is events only | Ratified |
| [0014](./ADR-0014-no-decorators-v1.md) | No decorators in v1 SDK; `definePlugin()` is the entry point | Ratified |
| [0015](./ADR-0015-zod-for-schemas.md) | Zod 4 for manifest + AI tool input schemas | Ratified |
| [0016](./ADR-0016-angular-platform-conventions.md) | Angular Platform Conventions (standalone, zoneless, OnPush, new control flow) | Ratified |
| [0017](./ADR-0017-lazy-loading-boundary.md) | Lazy loading boundary — shell eager, plugins lazy | Ratified |
| [0018](./ADR-0018-ui-kit-federation-singleton.md) | UI kit as federation singleton, exposed via `ctx.ui` | Ratified |
| [0019](./ADR-0019-state-vs-flow.md) | State vs flow — signals for state, RxJS for flow | Ratified |
| [0020](./ADR-0020-registry-as-controlled-state.md) | Plugin registry as controlled state | Ratified |
| [0021](./ADR-0021-runtime-stance-vs-author-dx.md) | Adversarial runtime, collaborative SDK | Ratified |
| [0022](./ADR-0022-defer-oclif-to-phase-1.md) | Defer oclif to Phase 1; Phase 0 CLI uses `node:util.parseArgs` (partial supersede of 0009) | Ratified |
| [0023](./ADR-0023-mf-spike-blocker.md) | MF spike paused — documented blocker, deferred to Phase 1.5 (relates to 0004) | Ratified |
| [0024](./ADR-0024-auth-keycloak.md) | Auth strategy — Keycloak as identity provider (partial supersede of 0007) | Ratified |
| [0025](./ADR-0025-deployment-single-vps.md) | Deployment topology — single VPS for Phase 1 | Ratified |
