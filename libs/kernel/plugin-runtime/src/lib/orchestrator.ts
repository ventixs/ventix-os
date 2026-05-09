/**
 * PluginOrchestrator — drives the lifecycle FSM end-to-end.
 *
 * Responsibilities:
 *  1. Validate manifest (RFC-0001).
 *  2. Load the plugin module (PluginLoader — Phase 0 ImportLoader).
 *  3. Cross-check manifest.id/version vs loaded module.
 *  4. Build a fresh PluginContext (with isolated DisposableBag, AbortSignal).
 *  5. Call plugin.activate(ctx).
 *  6. Transition states via PluginRegistry.transition (FSM-guarded).
 *
 * Per ADR-0021: fault-isolated. One broken plugin moves to ERROR state and
 * never throws into the shell. activateAll uses Promise.allSettled.
 */
import { Injectable, inject } from '@angular/core';
import { validateManifest, crossCheckLoadedModule } from '@ventix/plugin-api/manifest';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import type { PluginId, VentixPluginModule } from '@ventix/plugin-api';
import { PluginRegistry } from '@ventix/kernel-registry';
import type { PluginLoader } from './loader';
import { ImportLoader } from './loader';
import { buildPluginContext, type ContextFactoryDeps } from './context-factory';

/** Provided externally so the orchestrator stays unaware of tenant/user
 *  initialization (which lives in @ventix/kernel-bootstrap). */
export interface OrchestratorEnv {
  readonly factoryDeps: () => ContextFactoryDeps;
  readonly loader?: PluginLoader;
}

interface ActiveSlot {
  readonly module: VentixPluginModule;
  readonly abort: () => void;
}

@Injectable({ providedIn: 'root' })
export class PluginOrchestrator {
  private readonly registry = inject(PluginRegistry);

  private env?: OrchestratorEnv;
  private loader: PluginLoader = new ImportLoader();
  private readonly slots = new Map<PluginId, ActiveSlot>();

  /** Wire env once during shell bootstrap. */
  configure(env: OrchestratorEnv): void {
    this.env = env;
    if (env.loader) this.loader = env.loader;
  }

  /** Phase 0 entry point. Activate all manifests in parallel, fault-isolated. */
  async activateAll(manifests: ReadonlyArray<ManifestV1>): Promise<void> {
    if (!this.env) {
      throw new Error('[ORCHESTRATOR_NOT_CONFIGURED] call configure() before activateAll()');
    }
    await Promise.allSettled(manifests.map((m) => this.activate(m)));
  }

  async activate(manifest: ManifestV1): Promise<void> {
    if (!this.env) {
      throw new Error('[ORCHESTRATOR_NOT_CONFIGURED] call configure() before activate()');
    }

    // 1. Validate (or push to ERROR with the reason).
    const v = validateManifest(manifest);
    this.registry.discover(manifest);
    if (!v.ok) {
      const first = v.errors[0];
      this.registry.recordError(manifest.id, {
        code: first?.code ?? 'SCHEMA_VIOLATION',
        message: first?.message ?? 'manifest validation failed',
      });
      return;
    }
    this.registry.transition(manifest.id, 'VALIDATED');

    // 2. Load.
    let mod: VentixPluginModule;
    try {
      mod = await this.loader.load(manifest);
    } catch (err) {
      this.registry.recordError(manifest.id, {
        code: 'LOAD_FAILED',
        message: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    // 3. Cross-check.
    const xerrs = crossCheckLoadedModule(manifest, { id: mod.id, version: mod.version });
    if (xerrs.length > 0) {
      const first = xerrs[0];
      this.registry.recordError(manifest.id, {
        code: first?.code ?? 'CROSS_CHECK_FAILED',
        message: first?.message ?? 'manifest does not match loaded module',
      });
      return;
    }
    this.registry.transition(manifest.id, 'LOADED');

    // 4–5. Build context, activate.
    const built = buildPluginContext(manifest, this.env.factoryDeps());
    try {
      await mod.activate(built.ctx);
    } catch (err) {
      built.abort(); // tear down anything that registered before throwing
      this.registry.recordError(manifest.id, {
        code: 'ACTIVATE_THREW',
        message: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    // 6. Mark active and remember the slot for deactivation.
    this.slots.set(manifest.id, { module: mod, abort: built.abort });
    this.registry.transition(manifest.id, 'ACTIVE');
  }

  async deactivate(pluginId: PluginId): Promise<void> {
    const slot = this.slots.get(pluginId);
    if (!slot) return;
    try {
      await slot.module.deactivate();
    } catch (err) {
      // Per ADR-0021: never let a misbehaving plugin strand the kernel.
      // eslint-disable-next-line no-console
      console.error(`[VENTIX] plugin '${pluginId}' threw on deactivate`, err);
    } finally {
      slot.abort(); // dispose disposables, abort signal — always
      this.slots.delete(pluginId);
      this.registry.transition(pluginId, 'SUSPENDED');
    }
  }
}
