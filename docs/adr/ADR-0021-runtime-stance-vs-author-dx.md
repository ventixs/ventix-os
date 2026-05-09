# ADR-0021: Adversarial Runtime, Collaborative SDK

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Two constitution rules appear to conflict: the runtime must "assume plugins may fail / disappear / be incompatible" (defensive stance), while plugin authoring must be "delightful" with "minimal boilerplate" (collaborative stance). Without naming who-faces-which-stance, contributors either over-harden the SDK (making authoring miserable) or under-harden the runtime (making the shell brittle).

## Decision

Different audiences, different stances:

- **Runtime stance — adversarial-but-trusted.** The kernel verifies manifest integrity, fault-isolates plugin activation (`Promise.allSettled`), enforces SDK-version compatibility, rejects undeclared events, gates routes behind permission guards before plugin code runs. One broken plugin never affects the shell or other plugins.
- **SDK stance — collaborative.** The author-facing surface (`@ventix/plugin-api`) is small, well-typed, autocomplete-friendly, with errors that teach (`code` + `fix` fields). No defensive ceremony; no try/catch boilerplate; no manual cleanup for the common case (ADR-0011).

The SDK does not protect the runtime. The **runtime** protects the runtime — at the boundary where plugin code returns control to the kernel. The SDK is free to be ergonomic because the kernel takes responsibility for safety on the other side.

## Consequences

**Positive:** plugin authors get a clean DX; the shell is robust against any plugin behavior the runtime detects; contributors reviewing PRs have a clear question to ask: "does this code face the author or the runtime?"

**Negative:** kernel code is denser and more defensive than typical Angular code. Acceptable — that's the kernel's job, and there is exactly one of it. Plugin code (which there will be many of) stays simple.
