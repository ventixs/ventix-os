/**
 * Typed event bus. Plugin authors extend `VentixEvents` via declaration
 * merging from their plugin's types module. The runtime enforces what the
 * manifest declared via `events.publishes` / `events.subscribes` (ADR-0013).
 *
 * @example Extending the registry from a plugin:
 * declare module '@ventix/plugin-api' {
 *   interface VentixEvents {
 *     'crm.lead.created': { leadId: string; tenantId: string };
 *   }
 * }
 */
import type { Disposable } from './disposable';
import type { PluginId } from './identity';
/** Base event registry. Extended via declaration merging. */
export interface VentixEvents {
    'tenant.theme.changed': {
        themeId: string;
    };
}
export interface EventMeta {
    readonly traceId: string;
    readonly tenantId: string;
    readonly publishedAt: number;
    readonly source: PluginId | 'kernel';
}
export type EventHandler<E extends keyof VentixEvents> = (payload: VentixEvents[E], meta: EventMeta) => void | Promise<void>;
export interface EventBus {
    publish<E extends keyof VentixEvents>(name: E, payload: VentixEvents[E]): void;
    on<E extends keyof VentixEvents>(name: E, handler: EventHandler<E>): Disposable;
}
