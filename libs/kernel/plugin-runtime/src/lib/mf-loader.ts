/**
 * Module Federation runtime loader. Replaces ImportLoader as the default
 * Phase 1 path. Implements ADR-0004.
 *
 * Strategy:
 *  1. The shell calls `initMfHost(SHARED_SINGLETONS)` at bootstrap so the
 *     MF registry is alive before any plugin loads.
 *  2. For each plugin, we register the remote (manifest.id → remoteEntry URL)
 *     and call loadRemote('<id>/<exposedModule>').
 *  3. The remote's default export is the VentixPluginModule produced by
 *     definePlugin().
 *
 * Phase 0 ImportLoader stays available as a fallback for plain-JS plugins
 * that don't use shared singletons. The orchestrator picks the loader based
 * on whether the manifest's exposedModule looks like an MF entry point
 * (starts with './') vs a plain ESM file.
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
 * Shared singletons. Conforms to the kernel spec §3.4.
 *
 * - `strictVersion: true` on the SDK contract — version skew is a
 *   correctness bug, not a perf hint.
 * - Loose-version on Angular packages so legitimate plugins built against
 *   minor versions still load.
 */
export const SHARED_SINGLETONS = {
  '@angular/core':            { singleton: true, requiredVersion: '*', strictVersion: false },
  '@angular/common':          { singleton: true, requiredVersion: '*', strictVersion: false },
  '@angular/router':          { singleton: true, requiredVersion: '*', strictVersion: false },
  '@angular/forms':           { singleton: true, requiredVersion: '*', strictVersion: false },
  rxjs:                       { singleton: true, requiredVersion: '*', strictVersion: false },
  '@ventix/plugin-api':       { singleton: true, requiredVersion: '*', strictVersion: true  },
} as const;

let hostInitialized = false;
const registered = new Set<string>();

/**
 * Initialize the MF host. Idempotent — safe to call multiple times.
 * Called once during shell bootstrap.
 */
export function initMfHost(name = 'ventix-shell'): void {
  if (hostInitialized) return;
  // SAFETY: @module-federation's `init` typing is incompatible with
  // exactOptionalPropertyTypes:true (declares shared as optional but the
  // type extraction yields undefined-able). Our shared map is correct at
  // runtime; this cast is the cleanest way around the typing issue.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (init as any)({
    name,
    remotes: [],
    shared: SHARED_SINGLETONS,
  });
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
