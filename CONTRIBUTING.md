# Contributing to VENTIX OS

Thank you for considering contributing. VENTIX OS is early — every contribution shapes how the platform evolves.

## Before you start

Read these in order:

1. [`README.md`](README.md) — what VENTIX OS is and what works today.
2. [`docs/PHASE-0-PLAN.md`](docs/PHASE-0-PLAN.md) — what's in scope right now and what's deferred.
3. [`docs/adr/`](docs/adr/) — every architectural commitment is here. PRs that violate an ADR are rejected unless they include a new ADR superseding it.
4. [`docs/rfc/RFC-0001-manifest-schema-v1.md`](docs/rfc/RFC-0001-manifest-schema-v1.md) — the manifest contract.

## Development setup

```bash
git clone https://github.com/ventixs/ventix-os.git
cd ventix-os
pnpm install
pnpm dev                          # shell on http://localhost:4200
pnpm test                         # all libs
pnpm ventix doctor                # env + workspace health
```

Requirements: Node 22+, pnpm 9+, modern browser.

## What to work on

### Good first issues
Look for issues labeled `good-first-issue`. Typical wins:
- Test coverage gaps (manifest validator edge cases, FSM transitions)
- Documentation improvements (TSDoc on public SDK surfaces)
- CLI quality (better error messages, edge-case handling)

### Help-wanted areas (Phase 1)
- **EventBus** ([RFC-0004 reserved](docs/rfc/README.md))
- **Permissions** + CASL ([RFC-0003 reserved](docs/rfc/README.md))
- **Module Federation retry** ([ADR-0023 documents the blocker](docs/adr/ADR-0023-mf-spike-blocker.md))
- **First Quarkus backend service** (platform-gateway)

### Don't work on
- Plugin-to-plugin direct imports (forbidden by ADR-0013)
- Hardcoded routes/menus in the shell (violates ADR-0001)
- Anything that requires shell recompilation to add a plugin (violates the constitution)

If your idea seems to violate one of those, **open an RFC first** rather than a PR.

## Pull request workflow

1. **Fork** and create a branch: `feat/<short-name>` or `fix/<short-name>`.
2. **Make changes.** Keep PRs small — one logical change per PR.
3. **Run locally before pushing:**
   ```bash
   pnpm test                       # must pass
   pnpm nx affected -t lint        # zero warnings
   pnpm nx build shell             # shell still builds
   ```
4. **Conventional Commits** for the title: `feat(scope): summary`, `fix(scope): summary`, `docs(...)`, `refactor(...)`, etc.
5. **Open the PR.** The CI must pass before review.

### What gets merged fast

- Tests included for new behavior
- TSDoc on every new public type with `@example`
- ADR or RFC reference if the change touches public contract
- Phase tag in the PR description: `Phase: 0 | 0.5 | 1 | 1.5 | 2`

### What gets pushed back

- Anything in `apps/shell` containing domain words (lead, deal, invoice, etc.) — that's plugin territory
- New dependencies without rationale
- `any` types or `as` casts without a `// SAFETY:` comment
- NgModules outside the documented shim allowlist
- PRs that break Nx tag boundaries (e.g. `scope:plugin` importing from `scope:kernel`)

## Architecture changes

Public-contract changes (manifest schema, SDK surface, plugin lifecycle FSM) require an **RFC** before implementation. Open `docs/rfc/RFC-NNNN-<slug>.md` as a draft PR; comment window is 3 days for small team, 14 days when the project is more public.

Other architectural decisions get **ADRs** (one paragraph, no comment window). Add yours to `docs/adr/` and update `docs/adr/README.md`.

## Code style (the short version)

- TypeScript strict mode, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- Standalone Angular components only. No NgModules.
- `ChangeDetectionStrategy.OnPush` everywhere. Zoneless change detection in the shell.
- New control flow only: `@if`, `@for`, `@switch`. No `*ngIf`/`*ngFor`.
- Signals for state, RxJS for streams. Convert at boundaries (`toSignal`/`toObservable`).
- One curated `index.ts` per public lib. No barrel files inside.
- Conventional Commits.

Full conventions in [`docs/adr/ADR-0016-angular-platform-conventions.md`](docs/adr/ADR-0016-angular-platform-conventions.md).

## Reporting bugs / requesting features

- **Bugs:** open an issue with reproduction steps, expected vs actual, and `pnpm ventix doctor` output.
- **Features:** open an issue describing the use case before writing code. Big features need an RFC.
- **Security:** see [`SECURITY.md`](SECURITY.md). Do not file public issues for vulnerabilities.

## Code of Conduct

This project follows the [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). Be kind, be specific, and assume good intent.

## License

By submitting code you agree that your contributions will be licensed under [Apache-2.0](LICENSE).
