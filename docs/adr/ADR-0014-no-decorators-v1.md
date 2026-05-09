# ADR-0014: No Decorators in v1 SDK; `definePlugin()` is the Entry Point

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Decorators are a tempting plugin-authoring pattern (`@VentixPlugin({...}) class MyPlugin {}`). They look clean. They also: depend on stage-3 proposals that have shifted, require build-tool configuration (`emitDecoratorMetadata`, `experimentalDecorators`), couple authors to TypeScript-specific compile options, and hide what's actually happening at runtime via reflection.

## Decision

The v1 SDK exposes one entry point: `definePlugin(config)`. It is a plain function returning a typed default export. No decorators. No base classes. No `@Plugin`, `@Route`, `@OnActivate`. TypeScript's structural typing infers everything from the config object literal.

```ts
export default definePlugin({
  id: 'com.acme.hello',
  version: '1.0.0',
  async activate(ctx) { /* ... */ },
});
```

## Consequences

**Positive:** zero build-tool configuration; works under any bundler; types are inferred from the config object — no separate registration metadata; behavior at runtime matches what the source shows.

**Negative:** authors familiar with decorator-heavy frameworks (NestJS, Spring, Angular DI) may expect them. The 30-line Hello Plugin example demonstrates the pattern is not missed.

**Future:** decorators may be added in v2 *as an opt-in alternative* if and only if stage-4 proposals stabilize and authors demand it. They will never be required.
