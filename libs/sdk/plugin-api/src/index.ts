// @ventix/plugin-api — public surface.
// Conforms to ADR-0010 (types + shims), ADR-0014 (no decorators),
// ADR-0011 (auto-bound disposables).

export { SDK_VERSION } from './lib/version';

export { definePlugin, type PluginDefinition, type VentixPluginModule } from './lib/define';

export { type PluginContext } from './lib/context';

export {
  type TenantInfo,
  type UserInfo,
  type PluginId,
} from './lib/identity';

export { DisposableBag } from './lib/disposable';
export type { Disposable, DisposableInput } from './lib/disposable';

export { VentixError, type VentixErrorCode } from './lib/errors';

export {
  type EventBus,
  type EventHandler,
  type EventMeta,
  type VentixEvents,
} from './lib/events';

export {
  type RouterApi,
  type PluginRouteSpec,
  type PluginRouteState,
  type PluginPanel,
} from './lib/router';

export { type NavApi, type NavItemSpec } from './lib/nav';

export { type Logger, type LogFields } from './lib/logger';

export { type Signal } from './lib/signal-shim';
