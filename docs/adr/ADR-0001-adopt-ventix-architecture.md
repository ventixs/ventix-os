# ADR-0001: Adopt VENTIX OS Architecture

- **Status:** Ratified
- **Date:** 2026-05-08
- **Deciders:** Chief Architect, Kernel Lead, SDK Lead

## Context

We are bootstrapping a multi-tenant business platform that must support an open ecosystem of third-party apps (CRM, Sales, Inventory, HR, AI agents, integrations) installed and updated independently of the host. Existing options — monolithic SaaS, framework-coupled plugin systems, iframe-based embeds — each fail on at least one of: runtime extensibility, developer experience, multi-tenant correctness, or open-source friendliness.

## Decision

Adopt the VENTIX OS architecture: a small, stable **kernel** (shell, plugin runtime, registry, router, nav, permissions, event bus, tenant context) that hosts independently-deployed **plugins** (Angular Module Federation remotes + optional backend services), all wired together through a versioned, manifest-driven contract (`@ventix/plugin-api`). Backend services are Quarkus-based, polyglot-tolerant, and communicate via Kafka with strict bounded-context ownership of data.

## Consequences

**Positive:** plugins ship without recompiling the shell; kernel surface stays small and reviewable; bounded contexts are enforced architecturally, not by convention; AI agents and humans share the same SDK; the platform is honestly open-source-able with a clean kernel/SDK boundary.

**Negative:** higher up-front complexity than a monolith; team must internalize the kernel/plugin/contract split; a real production deployment requires Kafka, OIDC, GitOps — none of which are free.

**Neutral:** locks us to Angular for frontend plugins (this is acceptable; revisit only if framework-agnostic plugins become a strategic goal).
