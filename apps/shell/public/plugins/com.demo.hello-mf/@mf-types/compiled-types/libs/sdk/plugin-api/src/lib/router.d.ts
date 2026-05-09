/**
 * Plugin-scoped router contract. Per ADR-0012 routes are namespaced by the
 * plugin's reverse-DNS id automatically. Per ADR-0013 plugins cannot
 * navigate to other plugins via this API — use NavApi.open() with a
 * fully-qualified path for cross-plugin navigation.
 *
 * A route declares EITHER `loadComponent` (Angular component, requires MF
 * for cross-plugin sharing — Phase 1) OR `panel` (declarative title/body
 * rendered by a kernel-provided component — works without MF). This lets
 * plain-JS plugins ship working routes today and upgrade to real components
 * in Phase 1 without changing the call site shape.
 */
import type { Disposable } from './disposable';
import type { Signal } from './signal-shim';
/**
 * Declarative panel content. The kernel renders a generic component using
 * these fields. Useful for landing pages, simple list views, plugin status,
 * or any UI that doesn't need a custom Angular component.
 */
export interface PluginPanel {
    readonly title: string;
    readonly body?: string;
    readonly footnote?: string;
}
/** Subset of Angular's Route shape that plugins are allowed to declare. */
export interface PluginRouteSpec {
    /** Path relative to the plugin namespace. e.g. 'home' becomes '/com.acme.hello/home'. */
    path: string;
    /** Lazy component import. Mutually exclusive with `panel`. */
    loadComponent?: () => Promise<unknown>;
    /** Declarative content rendered by a kernel-provided component. Mutually exclusive with `loadComponent`. */
    panel?: PluginPanel;
    /** Permission key required to enter this route. Enforced by the kernel guard. */
    permission?: string;
    /** Document title. Function form receives route params. */
    title?: string | ((params: Record<string, string>) => string);
    /** Free-form data merged into Angular route data. */
    data?: Record<string, unknown>;
}
export interface PluginRouteState {
    readonly path: string;
    readonly params: Readonly<Record<string, string>>;
    readonly query: Readonly<Record<string, string>>;
}
export interface RouterApi {
    /** Register routes scoped under this plugin's namespace. */
    register(routes: PluginRouteSpec[]): Disposable;
    /** Navigate within this plugin only. Cross-plugin → NavApi.open(). */
    navigate(path: string, opts?: {
        replaceUrl?: boolean;
        queryParams?: Record<string, string>;
    }): Promise<boolean>;
    /** Current route within this plugin, or null if a different plugin is active. */
    readonly current: Signal<PluginRouteState | null>;
}
