/**
 * DynamicRouterService — runtime route registration and revocation.
 *
 * Conforms to ADR-0012 (route paths namespaced by reverse-DNS plugin id) and
 * ADR-0011 (returned Disposable revokes registered routes on dispose).
 *
 * Phase 0: registers/unregisters routes via Router.resetConfig.
 * Phase 1: PermissionGuard added to canActivate per ADR-0021.
 */
import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { Router, type Route } from '@angular/router';
import type { Disposable, PluginId, PluginRouteSpec } from '@ventix/plugin-api';
import { PluginPanelComponent } from './plugin-panel.component';

/**
 * DI token plugin route components can inject to reach back into their
 * plugin's isolated EnvironmentInjector. The kernel sets this on the
 * route's `providers` when registering.
 */
import { InjectionToken } from '@angular/core';
export const PLUGIN_INJECTOR = new InjectionToken<EnvironmentInjector>('PLUGIN_INJECTOR');

@Injectable({ providedIn: 'root' })
export class DynamicRouterService {
  private readonly router = inject(Router);

  /** Tracks which paths each plugin owns, so unregister is precise. */
  private readonly owners = new Map<PluginId, Set<string>>();

  /**
   * Register routes scoped under the plugin's namespace.
   * Returns a Disposable that removes them.
   */
  register(
    pluginId: PluginId,
    specs: PluginRouteSpec[],
    pluginInjector?: EnvironmentInjector,
  ): Disposable {
    const namespacePrefix = pluginId; // becomes /<pluginId>/<spec.path>
    const routes: Route[] = specs.map((spec) =>
      this.toAngularRoute(namespacePrefix, spec, pluginInjector),
    );

    const owned = new Set(routes.map((r) => r.path ?? ''));
    this.owners.set(pluginId, owned);

    // Plugin routes must be inserted BEFORE wildcard fallback routes —
    // Angular's first-match semantics would otherwise let `**` swallow
    // every plugin path before it gets a chance.
    const wildcardIdx = this.router.config.findIndex((r) => r.path === '**');
    const next =
      wildcardIdx === -1
        ? [...this.router.config, ...routes]
        : [
            ...this.router.config.slice(0, wildcardIdx),
            ...routes,
            ...this.router.config.slice(wildcardIdx),
          ];
    this.router.resetConfig(next);

    return {
      dispose: () => this.unregister(pluginId),
    };
  }

  unregister(pluginId: PluginId): void {
    const owned = this.owners.get(pluginId);
    if (!owned || owned.size === 0) return;
    const remaining = this.router.config.filter(
      (r) => !owned.has(r.path ?? ''),
    );
    this.router.resetConfig(remaining);
    this.owners.delete(pluginId);
  }

  /** For tests/inspection. */
  ownsPath(pluginId: PluginId, path: string): boolean {
    return this.owners.get(pluginId)?.has(path) ?? false;
  }

  private toAngularRoute(
    pluginId: PluginId,
    spec: PluginRouteSpec,
    pluginInjector?: EnvironmentInjector,
  ): Route {
    const fullPath = `${pluginId}/${stripLeadingSlash(spec.path)}`;

    const data: Record<string, unknown> = {
      ...(spec.data ?? {}),
      pluginId,
      ...(spec.permission ? { permission: spec.permission } : {}),
      ...(spec.panel ? { panel: spec.panel } : {}),
    };

    // Either a real component (Phase 1 via MF) or the kernel's panel
    // component reading route.data.panel (Phase 0.5).
    const route: Route = spec.loadComponent
      // SAFETY: PluginRouteSpec.loadComponent returns Promise<unknown> by SDK
      // contract; Angular's Route.loadComponent expects a typed return.
      ? ({ path: fullPath, loadComponent: spec.loadComponent as unknown, data } as Route)
      : { path: fullPath, component: PluginPanelComponent, data };

    if (pluginInjector) {
      route.providers = [{ provide: PLUGIN_INJECTOR, useValue: pluginInjector }];
    }
    if (typeof spec.title === 'string') route.title = spec.title;
    return route;
  }
}

function stripLeadingSlash(p: string): string {
  return p.startsWith('/') ? p.slice(1) : p;
}
