/**
 * Phase 0 plugin test bed. Minimal but exercises every Phase 0 SDK surface.
 * Phase 1 will add: events publish/subscribe assertions, http mock, permission
 * grant/revoke, fake timers, flush().
 */
import { DisposableBag } from '../lib/disposable';
import { VentixError } from '../lib/errors';
import type { PluginContext } from '../lib/context';
import type { VentixPluginModule } from '../lib/define';
import type { TenantInfo, UserInfo } from '../lib/identity';
import type { PluginRouteSpec } from '../lib/router';
import type { NavItemSpec } from '../lib/nav';

export interface PluginTestOptions {
  plugin: VentixPluginModule;
  tenant?: Partial<TenantInfo>;
  user?: Partial<UserInfo>;
}

export interface PluginTestBed {
  readonly ctx: PluginContext;
  readonly registeredRoutes: ReadonlyArray<PluginRouteSpec>;
  readonly registeredNav: ReadonlyArray<NavItemSpec>;
  readonly logs: ReadonlyArray<{ level: string; msg: string; fields?: object }>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}

export function createPluginTestBed(opts: PluginTestOptions): PluginTestBed {
  const tenant: TenantInfo = {
    id: opts.tenant?.id ?? 'test-tenant',
    name: opts.tenant?.name ?? 'Test Tenant',
    ...(opts.tenant?.theme !== undefined ? { theme: opts.tenant.theme } : {}),
  };
  const user: UserInfo = {
    id: opts.user?.id ?? 'test-user',
    roles: opts.user?.roles ?? [],
    ...(opts.user?.displayName !== undefined ? { displayName: opts.user.displayName } : {}),
    ...(opts.user?.email !== undefined ? { email: opts.user.email } : {}),
  };

  const abortController = new AbortController();
  const disposables = new DisposableBag();
  const routes: PluginRouteSpec[] = [];
  const nav: NavItemSpec[] = [];
  const logs: { level: string; msg: string; fields?: object }[] = [];

  const log = (level: string) => (msg: string, fields?: object) => {
    logs.push({ level, msg, ...(fields ? { fields } : {}) });
  };

  const ctx: PluginContext = {
    id: opts.plugin.id,
    version: opts.plugin.version,
    tenant,
    user,
    signal: abortController.signal,
    disposables,
    router: {
      register(specs) {
        routes.push(...specs);
        const remove = { dispose: () => routes.splice(0, routes.length) };
        disposables.add(remove);
        return remove;
      },
      navigate: async () => true,
      current: (() => null) as unknown as PluginContext['router']['current'],
    },
    nav: {
      register(items) {
        nav.push(...items);
        const remove = { dispose: () => nav.splice(0, nav.length) };
        disposables.add(remove);
        return remove;
      },
      open: () => {
        /* no-op in tests */
      },
    },
    logger: {
      debug: log('debug'),
      info: log('info'),
      warn: log('warn'),
      error: (msg, _err, fields) => log('error')(msg, fields),
      child: () => ctx.logger,
    },
    events: {
      publish() {
        throw new VentixError(
          'NOT_IMPLEMENTED_IN_PHASE_0',
          'EventBus.publish is not implemented in Phase 0',
          'Wait for Phase 1 event-bus, or stub events in your test.',
        );
      },
      on() {
        throw new VentixError(
          'NOT_IMPLEMENTED_IN_PHASE_0',
          'EventBus.on is not implemented in Phase 0',
          'Wait for Phase 1 event-bus, or stub events in your test.',
        );
      },
    },
  };

  return {
    ctx,
    registeredRoutes: routes,
    registeredNav: nav,
    logs,
    async activate() {
      await opts.plugin.activate(ctx);
    },
    async deactivate() {
      abortController.abort();
      await opts.plugin.deactivate();
      disposables.dispose();
    },
  };
}
