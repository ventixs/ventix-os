/**
 * PluginContext factory. Conforms to ADR-0010 (kernel injects runtime impls
 * of SDK interfaces) and ADR-0011 (auto-bound disposables).
 *
 * Phase 0 surfaces wired:  router, nav, logger, signal, disposables, tenant, user
 * Phase 0 surfaces stubbed: events (throws NOT_IMPLEMENTED_IN_PHASE_0)
 *
 * Routes / nav items registered through ctx auto-bind to the plugin's
 * DisposableBag — kernel disposes the bag on deactivate (ADR-0011 invariant).
 */
import { DisposableBag, VentixError } from '@ventix/plugin-api';
import type {
  EventBus,
  Logger,
  NavApi,
  NavItemSpec,
  PluginContext,
  PluginId,
  PluginRouteSpec,
  RouterApi,
  TenantInfo,
  UserInfo,
} from '@ventix/plugin-api';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import { DynamicRouterService } from '@ventix/kernel-router';

export interface ContextFactoryDeps {
  readonly tenant: TenantInfo;
  readonly user: UserInfo;
  readonly router: DynamicRouterService;
  readonly nav: NavRegistrar;
  readonly logSink?: LogSink;
}

/** Minimal nav registrar interface so context-factory doesn't depend on the
 *  full NavigationService (which is read-only). The kernel orchestrator
 *  passes a writer adapter. Phase 1 may unify with a NavRegistry service. */
export interface NavRegistrar {
  registerForPlugin(pluginId: PluginId, items: NavItemSpec[]): { dispose: () => void };
}

export interface LogSink {
  emit(record: { level: string; pluginId: PluginId; msg: string; fields?: Readonly<Record<string, unknown>>; err?: unknown }): void;
}

export interface BuiltContext {
  readonly ctx: PluginContext;
  readonly abort: () => void;
}

/**
 * Build a PluginContext for the given manifest and dependencies.
 * The returned `abort()` aborts ctx.signal — call it on deactivate.
 */
export function buildPluginContext(
  manifest: ManifestV1,
  deps: ContextFactoryDeps,
): BuiltContext {
  const abortController = new AbortController();
  const disposables = new DisposableBag();

  const router: RouterApi = makeRouterApi(manifest.id, disposables, deps.router);
  const nav: NavApi = makeNavApi(manifest.id, disposables, deps.nav);
  const logger: Logger = makeLogger(manifest.id, deps.logSink);
  const events: EventBus = makeEventsStub();

  const ctx: PluginContext = {
    id: manifest.id,
    version: manifest.version,
    tenant: deps.tenant,
    user: deps.user,
    router,
    nav,
    logger,
    events,
    signal: abortController.signal,
    disposables,
  };

  return {
    ctx,
    abort: () => {
      abortController.abort();
      disposables.dispose();
    },
  };
}

function makeRouterApi(
  pluginId: PluginId,
  bag: DisposableBag,
  router: DynamicRouterService,
): RouterApi {
  return {
    register(specs: PluginRouteSpec[]) {
      const disp = router.register(pluginId, specs);
      bag.add(disp);
      return disp;
    },
    async navigate() {
      // Phase 0: cross-plugin nav not in scope for this stub. Returns false
      // silently rather than throwing — plugins simply don't navigate yet.
      return false;
    },
    current: (() => null) as RouterApi['current'],
  };
}

function makeNavApi(
  pluginId: PluginId,
  bag: DisposableBag,
  registrar: NavRegistrar,
): NavApi {
  return {
    register(items) {
      const disp = registrar.registerForPlugin(pluginId, items);
      bag.add(disp);
      return disp;
    },
    open(href, opts) {
      if (typeof window === 'undefined') return; // SSR / tests no-op
      if (opts?.target === 'blank') {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      window.location.assign(href);
    },
  };
}

function makeLogger(pluginId: PluginId, sink?: LogSink): Logger {
  const emit = (level: string, msg: string, fields?: Readonly<Record<string, unknown>>, err?: unknown): void => {
    if (sink) {
      sink.emit({ level, pluginId, msg, ...(fields ? { fields } : {}), ...(err !== undefined ? { err } : {}) });
      return;
    }
    // eslint-disable-next-line no-console
    const c = (console as unknown as Record<string, (..._: unknown[]) => void>)[level] ?? console.log;
    c(`[${pluginId}] ${msg}`, fields ?? '', err ?? '');
  };
  const make = (extraFields?: Readonly<Record<string, unknown>>): Logger => ({
    debug: (msg, fields) => emit('debug', msg, { ...extraFields, ...fields }),
    info: (msg, fields) => emit('info', msg, { ...extraFields, ...fields }),
    warn: (msg, fields) => emit('warn', msg, { ...extraFields, ...fields }),
    error: (msg, err, fields) => emit('error', msg, { ...extraFields, ...fields }, err),
    child: (more) => make({ ...extraFields, ...more }),
  });
  return make();
}

function makeEventsStub(): EventBus {
  const fail = (op: string): never => {
    throw new VentixError(
      'NOT_IMPLEMENTED_IN_PHASE_0',
      `EventBus.${op} is not implemented in Phase 0`,
      'EventBus arrives in Phase 1. Track it on the Phase 0 plan or stub events in your code.',
    );
  };
  return {
    publish: () => fail('publish'),
    on: () => fail('on'),
  };
}
