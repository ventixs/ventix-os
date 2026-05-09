# VENTIX OS

> **AI-native, plugin-first, event-driven business operating system.**
> Install business apps the way VSCode installs extensions.

[![CI](https://github.com/ventixs/ventix-os/actions/workflows/ci.yml/badge.svg)](https://github.com/ventixs/ventix-os/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/phase-0%20→%201-success)](docs/PHASE-0-PLAN.md)

VENTIX OS is a runtime platform where companies and developers dynamically install and run business apps — CRM, sales, inventory, HR, AI agents, integrations, custom plugins — without rebuilding the host. The kernel is small and stable; everything else is a plugin loaded from a manifest at runtime.

Inspired by VSCode extensions, Salesforce AppExchange, and Linux kernel architecture.

---

## Status

**Phase 0 — Foundations:** complete.
The plugin runtime loop is real. A plugin's manifest is fetched, validated, loaded from a URL, activated through a finite-state machine, and contributes navigation + routes to the shell — with zero shell rebuild.

| Area | Status |
|---|---|
| Plugin runtime + lifecycle FSM | ✅ |
| Manifest schema (RFC-0001) + validator | ✅ |
| Dynamic routing & navigation (signals) | ✅ |
| Multi-tenant by design | ✅ |
| Reference plugin (`com.demo.hello`) | ✅ |
| `ventix` CLI (create / validate / build / dev / doctor) | ✅ |
| 75 tests across 5 lib suites | ✅ |
| GitHub Actions CI | ✅ |
| Module Federation (real Angular components) | 🚧 [Phase 1.5](docs/adr/ADR-0023-mf-spike-blocker.md) |
| EventBus, permissions, AI tools | 🚧 Phase 1 RFCs reserved |
| Backend services (Quarkus + Postgres) | 🚧 Phase 1 |
| Marketplace, billing, signing | 🚧 Phase 2 |

---

## Quickstart

Requires Node 22+ and pnpm 9+.

```bash
git clone https://github.com/ventixs/ventix-os.git
cd ventix-os
pnpm install
pnpm dev                                # shell on http://localhost:4200
```

You'll see the shell with one plugin (`Hello`) already in the navigation. Click it to render a runtime-registered route.

### Create your own plugin in 30 seconds

```bash
pnpm ventix create plugin --id com.acme.demo
pnpm ventix build --plugin com.acme.demo
# reload http://localhost:4200 — your plugin appears in the header
```

No shell rebuild required.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  SHELL (Angular zoneless, OnPush, signals)           │
│  ┌────────────────────────────────────────────────┐  │
│  │  Dynamic nav    Dynamic router    Tenant ctx   │  │
│  │  (signal tree)  (Phase 0.5)       (stub→OIDC)  │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  KERNEL: registry · plugin-runtime · bootstrap │  │
│  └────────────────────────────────────────────────┘  │
│              ↑ plugins load via runtime              │
└──────────────────────────────────────────────────────┘
                       ↕
┌──────────────────────────────────────────────────────┐
│  PLUGINS (manifest-driven, sandboxed per tenant)     │
│  com.demo.hello   com.acme.crm   com.you.whatever    │
└──────────────────────────────────────────────────────┘
                       ↕
┌──────────────────────────────────────────────────────┐
│  BACKEND (Phase 1+): Quarkus services + Postgres     │
│  identity · tenancy · registry · plugin-services     │
└──────────────────────────────────────────────────────┘
```

**Five guarantees the kernel commits to:**

1. **Everything is a plugin.** No business logic lives in the shell.
2. **No shell recompilation.** Plugins arrive at runtime from a manifest.
3. **Manifest is the contract.** Anything a plugin can do, it declares first.
4. **Multi-tenant from line 1.** Every signature carries `tenantId`.
5. **Plugins fail in isolation.** One broken plugin never affects the shell or other plugins.

Read the [ADRs](docs/adr/) for the rationale behind each.

---

## Stack

**Frontend:** Angular 20 · Nx 22 · pnpm 11 · Module Federation (Phase 1.5) · TypeScript 5.8 · Signals · Tailwind 4
**Backend (Phase 1+):** Quarkus · PostgreSQL · Redis · Kafka
**Infrastructure (Phase 2+):** Docker · Kubernetes · GitHub Actions · ArgoCD

---

## Repository layout

```
ventix-os/
├── apps/shell/                      Angular host (zoneless, OnPush)
├── libs/
│   ├── sdk/plugin-api/              @ventix/plugin-api — public SDK
│   ├── kernel/registry/             FSM-guarded plugin store
│   ├── kernel/router-dynamic/       Runtime route registration
│   ├── kernel/nav/                  Derived nav signal
│   ├── kernel/plugin-runtime/       Loader + lifecycle orchestrator
│   ├── kernel/bootstrap/            provideKernel() wiring
│   └── plugins/hello/               Reference plugin
├── tools/ventix-cli/                The `ventix` CLI
└── docs/
    ├── adr/                         Architecture Decision Records
    ├── rfc/                         Requests for Comments
    ├── PHASE-0-PLAN.md
    ├── SHELL-SKELETON-SPEC.md
    └── CLI-DESIGN.md
```

---

## Documentation

- [Phase 0 Plan](docs/PHASE-0-PLAN.md) — milestones, conventions, and what's deferred
- [Architecture Decision Records](docs/adr/) — 23 ratified decisions
- [Requests for Comments](docs/rfc/) — RFC-0001 (Manifest Schema v1)
- [CLI Design](docs/CLI-DESIGN.md) — full `ventix` command surface
- [Shell Skeleton Spec](docs/SHELL-SKELETON-SPEC.md) — what the host commits to

---

## Contributing

We're early. The architecture is ratified and the runtime is real, but Phase 1 (events, permissions, backend, real Module Federation) is still ahead. If you want to contribute, start with [`CONTRIBUTING.md`](CONTRIBUTING.md) and read [ADR-0001](docs/adr/ADR-0001-adopt-ventix-architecture.md) and [RFC-0001](docs/rfc/RFC-0001-manifest-schema-v1.md) to understand the architectural commitments.

Code of conduct: [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). Security disclosures: [`SECURITY.md`](SECURITY.md).

---

## License

Apache-2.0 for the kernel + SDK. Future open-core components (marketplace, billing, AI orchestrator) will be BSL-1.1 with a 4-year Apache-2.0 conversion.

See [`LICENSE`](LICENSE).
