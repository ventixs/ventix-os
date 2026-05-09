/**
 * NavigationService — derived nav tree as a single computed signal.
 *
 * Per ADR-0019 (state vs flow): pure derived state.
 * Per ADR-0020 (controlled state): reads from PluginRegistry, never mutates.
 *
 * The constructor accepts an explicit registry so tests can instantiate
 * without TestBed; production code path uses `inject(PluginRegistry)`
 * via the default arg (Angular DI guarantees the context).
 *
 * Permissions filtering lands in Phase 1 (RFC-0003).
 */
import { Injectable, computed, inject, type Signal } from '@angular/core';
import { PluginRegistry } from '@ventix/kernel-registry';
import { buildTree, contributionsFromManifests } from './build-tree';
import type { NavNode } from './types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly tree: Signal<ReadonlyArray<NavNode>>;

  constructor(registry: PluginRegistry = inject(PluginRegistry)) {
    this.tree = computed(() =>
      buildTree(contributionsFromManifests(registry.active().map((r) => r.manifest))),
    );
  }
}
