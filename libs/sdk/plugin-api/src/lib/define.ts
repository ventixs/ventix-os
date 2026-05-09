/**
 * `definePlugin()` — the single entry point of the SDK. Per ADR-0014 the
 * v1 SDK has no decorators and no base class. Plugin authors describe a
 * plugin; the kernel constructs and drives it.
 *
 * @example
 * import { definePlugin } from '@ventix/plugin-api';
 *
 * export default definePlugin({
 *   id: 'com.acme.hello',
 *   version: '1.0.0',
 *   async activate(ctx) {
 *     ctx.router.register([
 *       { path: 'home', loadComponent: () => import('./home.component') },
 *     ]);
 *     ctx.logger.info('Hello plugin activated');
 *   },
 * });
 */
import type { PluginContext } from './context';
import type { PluginId } from './identity';

export interface PluginDefinition {
  /** Reverse-DNS plugin id. Must match the manifest's id exactly. */
  readonly id: PluginId;
  /** Strict semver. Must match the manifest's version exactly. */
  readonly version: string;

  /** Called once after the plugin loads. Register routes/nav/events here. */
  activate(ctx: PluginContext): void | Promise<void>;

  /**
   * Optional. The DisposableBag handles 95% of cleanup automatically
   * (ADR-0011). Only define this for teardown that doesn't fit the
   * Disposable pattern.
   */
  deactivate?(): void | Promise<void>;
}

/**
 * The kernel imports this default export from the loaded MF module and calls
 * its `activate` method during plugin lifecycle transition LOADED → ACTIVE.
 */
export interface VentixPluginModule {
  readonly id: PluginId;
  readonly version: string;
  activate(ctx: PluginContext): void | Promise<void>;
  deactivate(): void | Promise<void>;
}

/**
 * Wrap a PluginDefinition into the runtime shape the kernel expects.
 * Returned object is what your plugin's entry file should export as default.
 */
export function definePlugin(def: PluginDefinition): VentixPluginModule {
  return {
    id: def.id,
    version: def.version,
    async activate(ctx) {
      await def.activate(ctx);
    },
    async deactivate() {
      if (def.deactivate) await def.deactivate();
    },
  };
}
