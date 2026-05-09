/**
 * PluginContext — the single object every plugin receives on activation.
 *
 * Per ADR-0010 the SDK ships interfaces only; the kernel injects
 * implementations. Per ADR-0007 sub-APIs not implemented in Phase 0
 * throw VentixError('NOT_IMPLEMENTED_IN_PHASE_0') when accessed —
 * loud failures over silent no-ops.
 *
 * Phase 0 implemented:  router, nav, logger, signal, disposables, tenant, user
 * Phase 1 stubs (throw): events, http, permissions, storage, ai, i18n, ui, notifications
 */
import type { TenantInfo, UserInfo, PluginId } from './identity';
import type { DisposableBag } from './disposable';
import type { EventBus } from './events';
import type { RouterApi } from './router';
import type { NavApi } from './nav';
import type { Logger } from './logger';
export interface PluginContext {
    readonly id: PluginId;
    readonly version: string;
    readonly tenant: TenantInfo;
    readonly user: UserInfo;
    readonly router: RouterApi;
    readonly nav: NavApi;
    readonly logger: Logger;
    /** Aborted on plugin deactivation. Compose with fetch / async iterators. */
    readonly signal: AbortSignal;
    /** Ambient cleanup bag. Sub-APIs auto-bind their disposables here. */
    readonly disposables: DisposableBag;
    readonly events: EventBus;
}
