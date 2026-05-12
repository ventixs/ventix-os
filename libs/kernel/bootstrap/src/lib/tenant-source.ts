/**
 * TenantSource — abstraction over "what tenant am I, and what plugins do I have?".
 * Per ADR-0021 (stub source, production shape) and RFC-0011 (Tenant Control Plane).
 *
 * Phase 1 ships a stub backed by `/tenants.json`. M2 swaps to an HTTP source
 * hitting the gateway's `/api/control-plane/v1/tenants/:id/registry`. The SDK
 * surface and the kernel pipeline do not change.
 */
import { Injectable } from '@angular/core';
import type { TenantInfo } from '@ventix/plugin-api';

/** What the kernel needs to bootstrap a session: identity + active plugin set. */
export interface TenantActivation {
  readonly tenant: TenantInfo;
  /** Plugin IDs (reverse-DNS) that this tenant is allowed to load. */
  readonly activePluginIds: ReadonlyArray<string>;
}

export interface TenantSource {
  fetch(tenantId: string): Promise<TenantActivation>;
}

interface StubTenantsFile {
  readonly [tenantId: string]: {
    readonly displayName: string;
    readonly theme?: string;
    readonly plugins: ReadonlyArray<{ id: string }>;
  };
}

const FALLBACK: TenantActivation = {
  tenant: { id: 'tenant-default', name: 'Local Dev Tenant' },
  activePluginIds: [],
};

@Injectable({ providedIn: 'root' })
export class StubTenantSource implements TenantSource {
  /**
   * Fetches `/tenants.json` from the shell's public assets. If absent, returns
   * a fallback empty tenant — the shell still renders, with zero plugins.
   */
  async fetch(tenantId: string, url = '/tenants.json'): Promise<TenantActivation> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[VENTIX] tenants source unreachable, using fallback', err);
      return FALLBACK;
    }
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[VENTIX] tenants returned ${response.status}; using fallback`);
      return FALLBACK;
    }
    const raw = (await response.json()) as StubTenantsFile;
    const entry = raw[tenantId];
    if (!entry) {
      // eslint-disable-next-line no-console
      console.warn(`[VENTIX] tenant '${tenantId}' not found in stub; using fallback`);
      return FALLBACK;
    }
    return {
      tenant: {
        id: tenantId,
        name: entry.displayName,
        ...(entry.theme !== undefined ? { theme: entry.theme } : {}),
      },
      activePluginIds: entry.plugins.map((p) => p.id),
    };
  }
}

/**
 * Reads `?tenant=<id>` from the URL query, defaulting to `tenant-default`.
 * Phase 1 dev convenience; M2 replaces this with a JWT claim.
 */
export function resolveTenantIdFromUrl(): string {
  if (typeof window === 'undefined') return 'tenant-default';
  const params = new URLSearchParams(window.location.search);
  return params.get('tenant') ?? 'tenant-default';
}
