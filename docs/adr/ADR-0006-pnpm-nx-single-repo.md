# ADR-0006: pnpm + Nx + Single Repo for Phase 0

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Two orthogonal choices: (a) workspace tool — npm/yarn/pnpm; (b) repo strategy — monorepo vs polyrepo. The architecture envisions multiple repos eventually (`ventix-platform`, `ventix-plugin-template`, `ventix-cli`, etc.), but premature splitting before there are external contributors imposes coordination overhead with zero benefit.

## Decision

Phase 0 ships as a single repo (`ventix-platform`) using **pnpm 9 workspaces** for installation/hoisting and **Nx 20** for task orchestration and dependency graph enforcement. First-party plugins live in `libs/plugins/*` until external developer onboarding warrants a dedicated `ventix-plugin-template` repo (Phase 1).

## Consequences

**Positive:** atomic refactors across kernel/SDK/plugins; one PR can update a contract and all consumers; Nx affected commands give fast feedback; no inter-repo version bumps.

**Negative:** first-party plugins risk developing internal-shortcut conventions. Mitigated by Nx tag boundaries (`scope:plugin` may only depend on `scope:sdk`) and reviewing Hello plugin "as if external."

**Future:** when Phase 1 introduces external contributors, `ventix-plugin-template` is extracted with the CLI's `create plugin` output as its starting commit.
