# ADR-0002: Manifest is the Inviolable Kernel↔Plugin Contract

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

A plugin system needs a single source of truth for what a plugin declares: identity, version, routes, permissions, events, AI tools, settings, billing model. Without it, the kernel must trust runtime registration calls — which means runtime code is required to know what a plugin does. That blocks marketplace review, static analysis, and offline UI generation.

## Decision

Every plugin ships a `ventix.plugin.json` manifest. The manifest is **the** contract: kernel, marketplace, CLI, validator, and IDE all consume the same Zod schema (see RFC-0001). Anything a plugin can do at runtime, the manifest declares first. Runtime registration that contradicts the manifest is rejected. Manifest fields are additive across minor versions; breaking changes require a major SDK bump and a codemod.

## Consequences

**Positive:** marketplace review can run statically; IDEs autocomplete; permissions and events are auditable before install; kernel can build navigation/permissions before any plugin code runs; plugins are legible to humans, not just runtimes.

**Negative:** authors must keep manifest and code in sync — the CLI's `validate` command and a kernel cross-check at load time mitigate this, but drift is still possible during development.

**Trap to avoid:** the kernel must never grow a "trust-me, just do this thing not in the manifest" escape hatch. There is no such thing.
