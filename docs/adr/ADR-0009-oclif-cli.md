# ADR-0009: oclif for the `ventix` CLI

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

The CLI is plugin authors' primary interface to the platform (`create`, `dev`, `validate`, `build`, `sign`, `publish`, `migrate`). Options: hand-rolled, Commander, yargs, oclif. CLI quality directly impacts developer onboarding speed.

## Decision

Build the CLI on **oclif 4** (TypeScript-first, plugin architecture, single-binary distribution via `pkg`, mature help/manifest generation). Live in `tools/ventix-cli`. Nx generators power command implementations under the hood (e.g., `ventix create plugin` invokes an Nx generator).

## Consequences

**Positive:** strong typing, structured help, testable commands, single-binary distribution, mature ecosystem, lazy command loading.

**Negative:** more dependencies than a hand-rolled approach. Acceptable — CLI complexity grows fast and reinventing the framework is wasted effort.

**Trap to avoid:** CLI commands wrapping kernel internals directly. CLI consumes the same public APIs as plugin authors (manifest schema, registry interface) — never private kernel modules.
