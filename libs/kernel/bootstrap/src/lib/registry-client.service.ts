/**
 * Phase 0 plugin discovery: fetches `/registry.json` (a static array of
 * manifests) from the shell's public assets. Phase 1 replaces with a real
 * @platform-registry HTTP client without changing this interface.
 */
import { Injectable } from '@angular/core';
import { validateManifest, type ManifestV1 } from '@ventix/plugin-api/manifest';

@Injectable({ providedIn: 'root' })
export class RegistryClient {
  async fetchInstalled(url = '/registry.json'): Promise<ReadonlyArray<ManifestV1>> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[VENTIX] registry fetch failed', err);
      return [];
    }
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[VENTIX] registry returned ${response.status}; treating as empty`);
      return [];
    }
    const raw: unknown = await response.json();
    if (!Array.isArray(raw)) {
      // eslint-disable-next-line no-console
      console.warn('[VENTIX] registry payload is not an array; ignoring');
      return [];
    }

    const valid: ManifestV1[] = [];
    for (const entry of raw) {
      const r = validateManifest(entry);
      if (r.ok) {
        valid.push(r.manifest);
      } else {
        // eslint-disable-next-line no-console
        console.warn('[VENTIX] dropping invalid manifest from registry', r.errors[0]?.message);
      }
    }
    return valid;
  }
}
