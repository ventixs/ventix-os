# Security Policy

## Supported versions

VENTIX OS is in **Phase 0 → 1**. There are no released versions yet, so all security work targets the `main` branch. Once we ship a tagged release, this section will list the supported version window.

| Version | Supported |
|---|---|
| `main` | ✅ |
| Tagged releases | — (none yet) |

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email **security@ventixs.dev** with:

- A description of the issue and its impact.
- Steps to reproduce, ideally with a minimal proof of concept.
- The commit SHA or branch you tested against.
- Your name / handle if you want credit in the advisory.

If you do not receive an acknowledgement within **3 business days**, please follow up — it means the message did not reach us.

## What to expect

| Stage | Target |
|---|---|
| Acknowledgement | within 3 business days |
| Triage + severity assessment | within 7 days |
| Fix or mitigation plan | within 30 days for High/Critical |
| Public disclosure | coordinated with the reporter, typically after a fix lands on `main` |

We follow [coordinated disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure). Please give us a reasonable window to ship a fix before publishing details.

## Scope

In scope:

- The kernel libraries under `libs/kernel/*`.
- The public SDK (`@ventix/plugin-api`).
- The `ventix` CLI under `tools/ventix-cli`.
- The shell host (`apps/shell`) — particularly the plugin loading path and tenant boundary.
- The manifest schema and validator (RFC-0001).

Out of scope (until Phase 1+):

- Backend services (do not exist yet).
- Marketplace, billing, plugin signing (Phase 2).
- Vulnerabilities that require a malicious plugin to be already trusted and installed by the tenant administrator — this is the documented threat model for Phase 0. We will tighten the model when permissions and signing land.
- Issues in third-party plugins not maintained in this repository.

## Known design constraints

These are **documented limitations** of Phase 0, not vulnerabilities:

- No authentication / no backend (ADR-0007). Tenant identity is stubbed.
- No plugin sandboxing beyond what the browser provides. Plugins run in the same JS realm as the shell.
- No plugin signing or integrity verification (deferred to Phase 2).
- Module Federation is not yet wired end-to-end (ADR-0023). Plugins ship via declarative panels.

If you find an issue that exceeds these documented constraints, we want to hear about it.
