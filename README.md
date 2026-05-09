# VENTIX OS

> AI-native, plugin-first, event-driven business operating system.

VENTIX OS is an open-source platform where companies and developers dynamically install business apps (CRM, Sales, Inventory, HR, AI Agents, Workflows, integrations) the way you install VSCode extensions or Salesforce AppExchange listings.

## Status

**Phase 0 — Foundations.** Pre-scaffold. The architectural contracts are ratified; code begins after the M0 spike (week 1).

## Core Principles

1. Everything is a plugin
2. Manifest-driven architecture
3. Runtime extensibility — no shell recompilation
4. Multi-tenant by default
5. Event-driven communication
6. Contracts over implementations
7. SDK-first development
8. AI agents are first-class plugins

## Repository Structure (Phase 0 target)

```
ventix-platform/
├── apps/shell/                    # Angular 20 host
├── libs/
│   ├── kernel/                    # plugin runtime, registry, router, nav, ...
│   ├── sdk/plugin-api/            # @ventix/plugin-api — public SDK
│   └── plugins/hello/             # reference plugin
├── tools/ventix-cli/              # `ventix` CLI (oclif)
├── infrastructure/dev/            # local plugin host
└── docs/
    ├── adr/                       # ratified decisions
    └── rfc/                       # in-flight proposals
```

## Tech Stack

**Frontend:** Angular 20 · Nx · Module Federation (`@module-federation/enhanced`) · Signals · Tailwind 4
**Backend (Phase 1+):** Quarkus · PostgreSQL · Redis · Kafka
**Infrastructure (Phase 2+):** Docker · Kubernetes · GitHub Actions · ArgoCD

## Quickstart (target — not yet implemented)

```bash
git clone <repo> && cd ventix-platform
pnpm install
pnpm dev                                          # shell on :4200
pnpm ventix create plugin --id com.demo.hello
pnpm ventix dev                                   # plugin appears in shell — no rebuild
```

## Documentation

- [Phase 0 Plan](./docs/PHASE-0-PLAN.md)
- [Architecture Decisions (ADR)](./docs/adr/)
- [Requests for Comments (RFC)](./docs/rfc/)

## License

Apache-2.0 (kernel + SDK). Open-core components (marketplace, billing, AI orchestrator) will be BSL-1.1 with a 4-year Apache-2.0 conversion.
