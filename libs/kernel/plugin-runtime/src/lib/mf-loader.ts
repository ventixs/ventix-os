/**
 * Module Federation runtime loader. Implements ADR-0004.
 *
 * The host MUST register its already-loaded Angular instance modules via
 * `lib:` functions so plugins resolve to the SAME instance — otherwise
 * each plugin bundles its own Angular copy and ChangeDetection / DI fail
 * with NG0200 "circular dependency" errors.
 *
 * Phase 0 ImportLoader stays available as the loader for plain-JS plugins
 * that don't use shared singletons. The orchestrator picks the loader based
 * on whether the manifest's remoteEntry ends with `/remoteEntry.js`.
 */
import {
  init,
  loadRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import type { VentixPluginModule } from '@ventix/plugin-api';
import type { PluginLoader } from './loader';

/**
 * Pre-loaded module factories. Each value is a function returning the
 * already-loaded module — this lets the host wire its bundled Angular,
 * router, etc. into MF's share registry so plugins consume the SAME
 * instance.
 */
export type SharedLibFactories = Readonly<Record<string, () => unknown>>;

let hostInitialized = false;
const registered = new Set<string>();

/**
 * Initialize the MF host. Idempotent. Pass `libs` to register pre-loaded
 * modules into the MF share scope so plugin bundles deduplicate against
 * the host's already-loaded Angular.
 *
 * @example
 * import * as ngCore from '@angular/core';
 * import * as ngCommon from '@angular/common';
 * initMfHost({
 *   '@angular/core': () => ngCore,
 *   '@angular/common': () => ngCommon,
 * });
 */
export function initMfHost(libs: SharedLibFactories = {}, name = 'ventix-shell'): void {
  if (hostInitialized) return;

  const shared: Record<string, unknown> = {};
  for (const [pkg, factory] of Object.entries(libs)) {
    shared[pkg] = {
      version: '20.0.0',
      scope: 'default',
      lib: factory,
      // `loaded: true` tells the runtime the module is already in memory
      // and the lib() factory should be called synchronously — without
      // this, the runtime treats the share as lazy and may fall back to
      // the plugin's bundled copy.
      loaded: 1,
      shareConfig: {
        singleton: true,
        requiredVersion: false,
      },
    };
  }

  // SAFETY: @module-federation's init typing is incompatible with
  // exactOptionalPropertyTypes:true. Our shape is correct at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (init as any)({ name, remotes: [], shared });
  hostInitialized = true;
}

export class MfLoader implements PluginLoader {
  async load(manifest: ManifestV1): Promise<VentixPluginModule> {
    if (!hostInitialized) {
      throw new Error(
        '[MF_HOST_NOT_INITIALIZED] call initMfHost() before loading plugins.\n' +
          '  fix: ensure provideKernel() ran during APP_INITIALIZER.',
      );
    }

    if (!registered.has(manifest.id)) {
      registerRemotes([
        {
          name: manifest.id,
          entry: manifest.frontend.remoteEntry,
          // Vite + @module-federation/vite emits ESM remotes.
          type: 'module',
        },
      ]);
      registered.add(manifest.id);
    }

    const moduleKey = `${manifest.id}/${stripLeadingDotSlash(manifest.frontend.exposedModule)}`;
    const mod = await loadRemote<{ default?: unknown } | unknown>(moduleKey);
    if (mod === null || mod === undefined) {
      throw new Error(`[MF_LOAD_RETURNED_EMPTY] '${manifest.id}' loadRemote('${moduleKey}') returned ${mod}`);
    }
    const candidate = (mod as { default?: unknown }).default ?? mod;
    if (!isPluginModule(candidate)) {
      throw new Error(
        `[INVALID_PLUGIN_MODULE] '${manifest.id}' module from MF does not match VentixPluginModule shape.\n` +
          '  fix: the plugin\'s exposed module must default-export the result of definePlugin().',
      );
    }
    return candidate;
  }
}

function stripLeadingDotSlash(s: string): string {
  return s.startsWith('./') ? s.slice(2) : s;
}

function isPluginModule(value: unknown): value is VentixPluginModule {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['version'] === 'string' &&
    typeof v['activate'] === 'function' &&
    typeof v['deactivate'] === 'function'
  );
}
