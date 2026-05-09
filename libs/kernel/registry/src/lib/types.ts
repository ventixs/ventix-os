/**
 * Plugin lifecycle types. Conforms to ADR-0008 (lifecycle FSM with single
 * mutation surface) — Phase 0 subset.
 *
 * Full FSM (INSTALLED, per-tenant lifecycle, retry policies) lands in Phase 1.
 */
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import type { PluginId } from '@ventix/plugin-api';

/** Phase 0 lifecycle states. */
export type PluginState =
  | 'DISCOVERED'   // manifest fetched, not yet validated
  | 'VALIDATED'    // schema + integrity + engine semver OK
  | 'LOADED'       // remote module fetched, not yet activated
  | 'ACTIVE'       // running and visible
  | 'SUSPENDED'    // deactivated; still in registry
  | 'ERROR';       // any failure; carries `lastError`

export interface PluginRecord {
  readonly id: PluginId;
  readonly state: PluginState;
  readonly manifest: ManifestV1;
  readonly updatedAt: number;
  readonly lastError?: { code: string; message: string };
}

/** Used by the kernel orchestrator to populate ERROR state. */
export interface RecordedError {
  readonly code: string;
  readonly message: string;
}
