/**
 * Plugin-scoped router contract. Per ADR-0012 routes are namespaced by the
 * plugin's reverse-DNS id automatically. Per ADR-0013 plugins cannot
 * navigate to other plugins via this API — use NavApi.open() with a
 * fully-qualified path for cross-plugin navigation.
 */
import type { Disposable } from './disposable';
import type { Signal } from './signal-shim';

/** Subset of Angular's Route shape that plugins are allowed to declare. */
export interface PluginRouteSpec {
  /** Path relative to the plugin namespace. e.g. 'home' becomes '/com.acme.hello/home'. */
  path: string;
  /** Lazy component import. Conforms to ADR-0017 (lazy within plugins). */
  loadComponent: () => Promise<unknown>;
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
  navigate(path: string, opts?: { replaceUrl?: boolean; queryParams?: Record<string, string> }): Promise<boolean>;

  /** Current route within this plugin, or null if a different plugin is active. */
  readonly current: Signal<PluginRouteState | null>;
}
