# ADR-0022: Defer oclif to Phase 1; Phase 0 CLI uses `node:util.parseArgs`

- **Status:** Ratified
- **Date:** 2026-05-09
- **Supersedes (partial):** ADR-0009

## Context

ADR-0009 committed Phase 0 CLI to oclif 4. In implementation, oclif 4 with ESM + TypeScript + Nx workspace integration requires non-trivial setup: command manifest generation, build step, plugin loader configuration, and bin shim. For a CLI that ships 4–5 commands in Phase 0 (`create plugin`, `validate`, `build`, `dev`, `doctor`), this is yak-shaving cost without proportional benefit.

## Decision

Phase 0 CLI is built directly on `node:util.parseArgs` (Node 22 stable). No build step, no manifest generation, single `bin/ventix.mjs` entry. Migration to oclif is deferred to Phase 1 as part of EPIC-6 polish, when the command surface grows (`marketplace search`, `install`, `migrate`, `tenant`, etc.) and oclif's features (json output flags, plugins, generated docs, autocomplete) start paying for themselves.

## Consequences

**Positive:** unblocks Phase 0 CLI shipping in 1–2 days instead of 1+ week; zero build step keeps `pnpm ventix` invocation instant; CLI source remains plain TypeScript readable by every contributor.

**Negative:** when commands hit ~10+ we lose oclif's structured help, json mode, plugin system. Phase 1 migration is mechanical — commands are already organized as discrete files, oclif's command class shape is similar to what we write now.

**Migration path:** each Phase 0 command file is a pure function `(args, flags) => Promise<void>`. Phase 1 wraps each in an oclif `Command` class. No breaking change to user-facing CLI surface.

## Updates

- ADR-0009 stays in force as a *target* ("oclif is where the CLI ends up"); ADR-0022 governs *what we ship today*.
