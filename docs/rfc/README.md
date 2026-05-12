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
| [0003](./RFC-0003-permissions.md) | Permissions in Manifest (CASL) | Draft | Platform Lead |
| [0004](./RFC-0004-eventbus.md) | EventBus — Cross-plugin pub/sub | Draft | Platform Lead |
| [0011](./RFC-0011-tenant-control-plane.md) | Tenant Control Plane | Draft | Platform Lead |

## Reserved Numbers (Phase 1+)

| # | Title | Phase |
|---|---|---|
| 0002 | Plugin Distribution & Signing | Phase 2 |
| 0005 | Widgets in Manifest | Phase 1.5 |
| 0006 | Plugin Settings | Phase 1.5 |
| 0007 | AI Tool Registration | Phase 2 |
| 0008 | Backend Service Declaration | Phase 1.5 |
| 0009 | Tenancy Isolation Modes (schema-per-tenant) | Phase 1.5 |
| 0010 | Billing Models | Phase 2 |
