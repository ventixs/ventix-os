/**
 * Plugin lifecycle finite-state machine. Conforms to ADR-0008.
 *
 * Phase 0 transition graph:
 *
 *   DISCOVERED → VALIDATED → LOADED → ACTIVE → SUSPENDED → (gone)
 *                                          ↘ ERROR (from any non-terminal state)
 *                                  SUSPENDED → ACTIVE  (re-activate)
 *                                  ERROR     → DISCOVERED  (retry from scratch)
 */
import type { PluginState } from './types';

const LEGAL: Readonly<Record<PluginState, ReadonlySet<PluginState>>> = Object.freeze({
  DISCOVERED: new Set<PluginState>(['VALIDATED', 'ERROR']),
  VALIDATED:  new Set<PluginState>(['LOADED', 'ERROR']),
  LOADED:     new Set<PluginState>(['ACTIVE', 'ERROR']),
  ACTIVE:     new Set<PluginState>(['SUSPENDED', 'ERROR']),
  SUSPENDED:  new Set<PluginState>(['ACTIVE', 'ERROR']),
  ERROR:      new Set<PluginState>(['DISCOVERED']),
});

export class IllegalTransitionError extends Error {
  constructor(
    readonly from: PluginState,
    readonly to: PluginState,
    readonly pluginId: string,
  ) {
    super(
      `[ILLEGAL_TRANSITION] plugin '${pluginId}' cannot move ${from} → ${to}. ` +
        `Legal transitions from ${from}: ${[...(LEGAL[from] ?? [])].join(', ') || '(terminal)'}.`,
    );
    this.name = 'IllegalTransitionError';
  }
}

export function isLegalTransition(from: PluginState, to: PluginState): boolean {
  if (from === to) return true; // idempotent re-assertion is allowed
  return LEGAL[from]?.has(to) ?? false;
}

export function assertLegalTransition(
  from: PluginState,
  to: PluginState,
  pluginId: string,
): void {
  if (!isLegalTransition(from, to)) {
    throw new IllegalTransitionError(from, to, pluginId);
  }
}
