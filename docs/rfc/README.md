# Requests for Comments

RFCs are non-trivial design proposals that change the public contract or require team alignment before implementation. ADRs record decisions; RFCs propose them.

## Process

1. **Draft** — open a PR adding `docs/rfc/RFC-NNNN-<slug>.md`.
2. **Review window** — 3 days for a small team, 14 days when the project is public.
3. **Ratification** — owner addresses comments, reviewers approve, PR merges with status flipped to **Ratified**.
4. **Implementation** — separate PRs reference the RFC.
5. **Supersession** — a new RFC explicitly references and supersedes; old RFCs are not edited.

## Index

| # | Title | Status | Owner |
|---|---|---|---|
| [0001](./RFC-0001-manifest-schema-v1.md) | Manifest Schema v1 | Draft | SDK Lead |

## Reserved Numbers (Phase 1+)

| # | Title | Phase |
|---|---|---|
| 0002 | Plugin Distribution & Signing | Phase 2 |
| 0003 | Permissions in Manifest | Phase 1 |
| 0004 | Event Declarations in Manifest | Phase 1 |
| 0005 | Widgets in Manifest | Phase 1 |
| 0006 | Plugin Settings | Phase 1 |
| 0007 | AI Tool Registration | Phase 1 |
| 0008 | Backend Service Declaration | Phase 1 |
| 0009 | Tenancy Isolation Modes | Phase 1 |
| 0010 | Billing Models | Phase 2 |
