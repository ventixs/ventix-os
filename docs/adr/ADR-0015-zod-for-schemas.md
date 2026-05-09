# ADR-0015: Zod 4 for Manifest + AI Tool Input Schemas

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

The platform has multiple schema-validation needs: manifest validation (kernel + CLI + IDE), AI tool input schemas (orchestrator passes JSON Schema to LLMs), plugin settings schemas. Options: Zod, Valibot, JSON Schema directly, ArkType, hand-rolled. Using two libraries fragments the developer experience; using JSON Schema directly loses TypeScript inference.

## Decision

**Zod 4** is the single schema library across the SDK and kernel. It powers:
- The manifest Zod schema (re-exported from `@ventix/plugin-api/manifest`).
- AI tool input definitions (`ai.tool({ input: z.object({...}) })`).
- Plugin settings schemas (Phase 1+).

Generated JSON Schema (via `zod-to-json-schema`) feeds: IDE autocomplete on `ventix.plugin.json`, LLM tool-calling APIs, and OpenAPI generation in backend services.

## Consequences

**Positive:** one mental model for plugin authors; full TypeScript inference everywhere; tree-shakeable; mature; first-class JSON Schema export; same schema validated client and server.

**Negative:** Zod adds ~12KB to the SDK package — but the SDK ships only types from Zod, not runtime, so plugin bundles only pay when they actually validate. Bundle budget respected.

**Trap to avoid:** introducing Valibot/ArkType "for the smaller bundle" in one corner. One library. New schema needs are RFC items, not library swaps.
