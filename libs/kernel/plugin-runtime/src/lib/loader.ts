/**
 * PluginLoader contract — the seam where Module Federation will plug in.
 *
 * Phase 0 ships `ImportLoader` (dynamic ESM import). Phase 1 swaps for a
 * Module Federation runtime loader (ADR-0004) without changing this
 * interface or anything that depends on it.
 */
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import type { VentixPluginModule } from '@ventix/plugin-api';

export interface PluginLoader {
  /** Fetch the plugin module. The kernel uses `manifest.frontend.remoteEntry`. */
  load(manifest: ManifestV1): Promise<VentixPluginModule>;

  /** Optional: clear caches / detach listeners for a previously loaded plugin. */
  unload?(pluginId: string): Promise<void> | void;
}

/**
 * Phase 0 loader. Dynamically imports the plugin module from
 * `manifest.frontend.remoteEntry` and treats its default export as the
 * VentixPluginModule produced by `definePlugin()`.
 *
 * Constraints respected:
 *  - No shell recompilation: URLs come from the manifest at runtime.
 *  - No assumption of MF: a Phase 1 swap to MF is a one-class replacement.
 *  - SDK contract enforcement: the loaded module must have id+version.
 */
export class ImportLoader implements PluginLoader {
  async load(manifest: ManifestV1): Promise<VentixPluginModule> {
    const url = manifest.frontend.remoteEntry;
    const mod: unknown = await dynamicImport(url);
    const candidate = (mod as { default?: unknown })?.default ?? mod;
    if (!isPluginModule(candidate)) {
      throw new Error(
        `[INVALID_PLUGIN_MODULE] '${manifest.id}' loaded module from ${url} ` +
          `does not export a definePlugin() result. fix: ensure the bundle's ` +
          `default export is the value returned by definePlugin().`,
      );
    }
    return candidate;
  }
}

/** Indirected so tests can mock without touching `import()` directly. */
function dynamicImport(url: string): Promise<unknown> {
  // `/* @vite-ignore */` is needed because Vite tries to analyze the URL at
  // build time. At runtime we want the literal URL from the manifest.
  return import(/* @vite-ignore */ url);
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
