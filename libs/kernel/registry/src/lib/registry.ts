/**
 * PluginRegistry — controlled state container.
 *
 * Per ADR-0020: a single signal of an immutable Map, with a single mutation
 * surface (`transition`). Reads are derived computeds. One writer, many
 * readers. Not "global mutable state" — controlled state.
 *
 * Per ADR-0008: every transition is FSM-guarded.
 */
import { Injectable, computed, signal } from '@angular/core';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import type { PluginId } from '@ventix/plugin-api';
import { assertLegalTransition } from './fsm';
import type { PluginRecord, PluginState, RecordedError } from './types';

@Injectable({ providedIn: 'root' })
export class PluginRegistry {
  private readonly state = signal<ReadonlyMap<PluginId, PluginRecord>>(new Map());

  readonly all = computed<ReadonlyArray<PluginRecord>>(() => [...this.state().values()]);

  readonly active = computed<ReadonlyArray<PluginRecord>>(() =>
    this.all().filter((r) => r.state === 'ACTIVE'),
  );

  readonly errored = computed<ReadonlyArray<PluginRecord>>(() =>
    this.all().filter((r) => r.state === 'ERROR'),
  );

  byId(id: PluginId): PluginRecord | undefined {
    return this.state().get(id);
  }

  /**
   * Register a newly discovered plugin in the DISCOVERED state.
   * Idempotent: re-registering the same id replaces the record only if the
   * manifest changed (via ADR-0002 semantics, manifest is the contract).
   */
  discover(manifest: ManifestV1): void {
    const existing = this.state().get(manifest.id);
    if (existing && existing.manifest.version === manifest.version) return;

    this.replace(manifest.id, {
      id: manifest.id,
      state: 'DISCOVERED',
      manifest,
      updatedAt: Date.now(),
    });
  }

  /**
   * The single mutation surface. FSM-guarded. Patches merge over the existing
   * record; state is replaced. Snapshot is immutable — callers cannot mutate.
   *
   * @throws IllegalTransitionError if next is not reachable from current.
   */
  transition(id: PluginId, next: PluginState, patch?: Partial<PluginRecord>): void {
    const current = this.state().get(id);
    if (!current) {
      throw new Error(`[UNKNOWN_PLUGIN] cannot transition unknown plugin '${id}'`);
    }
    assertLegalTransition(current.state, next, id);

    const updated: PluginRecord = {
      ...current,
      ...patch,
      id: current.id,
      state: next,
      updatedAt: Date.now(),
    };
    this.replace(id, updated);
  }

  /** Convenience helper used by the lifecycle orchestrator. */
  recordError(id: PluginId, err: RecordedError): void {
    this.transition(id, 'ERROR', { lastError: err });
  }

  /** Remove a plugin from the registry entirely. Caller is responsible for
   *  ensuring the plugin is in a terminal state (SUSPENDED or ERROR). */
  remove(id: PluginId): void {
    const current = this.state().get(id);
    if (!current) return;
    if (current.state === 'ACTIVE') {
      throw new Error(
        `[CANNOT_REMOVE_ACTIVE] plugin '${id}' is ACTIVE; deactivate first.`,
      );
    }
    const next = new Map(this.state());
    next.delete(id);
    this.state.set(next);
  }

  private replace(id: PluginId, record: PluginRecord): void {
    const next = new Map(this.state());
    next.set(id, record);
    this.state.set(next);
  }
}
