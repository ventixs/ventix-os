# ADR-0012: Plugin Route Paths Namespaced by Reverse-DNS Plugin ID

- **Status:** Ratified
- **Date:** 2026-05-08

## Context

Two plugins both registering `/leads` is a routing conflict. Resolving by load order, last-wins, or first-wins all produce surprising behavior and unstable URLs. Manual coordination ("don't use `/leads`, the CRM plugin owns it") doesn't scale and breaks at marketplace scale.

## Decision

The kernel automatically prefixes every plugin's registered route with its reverse-DNS plugin ID. A plugin manifesting `id: 'com.acme.crm-plus'` registering `path: 'leads'` resolves to `/com.acme.crm-plus/leads`. Plugin authors write relative paths; the kernel applies the namespace. Cross-plugin navigation uses fully-qualified paths via `ctx.nav.open('/com.other.plugin/path')`.

## Consequences

**Positive:** routing collisions impossible by construction; plugin IDs are globally unique (reverse-DNS); URL inspection immediately reveals the owning plugin; revoking a plugin removes a contiguous URL space.

**Negative:** URLs are longer than `/leads`. Acceptable trade for collision-free guarantee; first-party shells can offer aliases (`/crm` → `/com.ventix.crm`) at the host level without violating the contract.
