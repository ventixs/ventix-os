# ADR-0013: Cross-Plugin Communication is Events Only

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

If plugins can import each other's modules, the platform is no longer plugin-first — it is a distributed monolith with extra steps. Direct coupling defeats independent deployment, breaks marketplace install/uninstall semantics, and makes a single plugin's bug fail many others.

## Decision

Cross-plugin communication is **events only**. Plugins publish and subscribe through the typed `EventBus` (browser side) and Kafka (backend, Phase 1+). Topics published and subscribed are **declared in the manifest** (`events.publishes`, `events.subscribes`) and the runtime enforces declarations: undeclared publish/subscribe throws in dev, drops with structured warning in prod.

Type sharing is done through small `@vendor/plugin-id-types` packages (types only, no runtime) — this is the *only* legal cross-plugin import, and only types may flow through it.

Direct module imports between plugins are forbidden. Nx tag constraints enforce: `scope:plugin` may only depend on `scope:sdk` and `scope:plugin-types`.

## Consequences

**Positive:** plugins are independently deployable, installable, and uninstallable; bounded contexts stay sealed; marketplace can show "this plugin reacts to X events" before install; AI agents observing events compose naturally.

**Negative:** synchronous request/response patterns require RPC-over-events or going through a backend service. Deliberate friction — synchronous cross-plugin calls are usually a design smell anyway.
