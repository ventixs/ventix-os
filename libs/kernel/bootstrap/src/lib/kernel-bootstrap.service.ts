/**
 * KernelBootstrap — single APP_INITIALIZER orchestrator per the shell spec.
 *
 * Sequence (Phase 0):
 *  1. Initialize TenantContext + UserContext from stubs.
 *  2. Configure PluginOrchestrator with factory deps.
 *  3. Fetch installed manifests from RegistryClient.
 *  4. Activate them all (fault-isolated).
 *
 * Errors at any step are logged structured; the shell still renders.
 * One broken step never blanks the UI.
 */
import { Injectable, inject, signal } from '@angular/core';
// Eagerly import the host's Angular modules so we can hand the SAME live
// instances to MF's share registry — plugins must resolve to these, not
// to bundled copies, otherwise NG0200 (circular dep / dual Angular) fires.
import * as ngCore from '@angular/core';
import * as ngCommon from '@angular/common';
import * as ngRouter from '@angular/router';
import * as rxjs from 'rxjs';
import { PluginOrchestrator, initMfHost, type ContextFactoryDeps, type NavRegistrar } from '@ventix/kernel-runtime';
import { DynamicRouterService } from '@ventix/kernel-router';
import { TenantContext, UserContext } from './tenant-context.service';
import { RegistryClient } from './registry-client.service';

@Injectable({ providedIn: 'root' })
export class KernelBootstrap {
  private readonly tenantCtx = inject(TenantContext);
  private readonly userCtx = inject(UserContext);
  private readonly orchestrator = inject(PluginOrchestrator);
  private readonly registryClient = inject(RegistryClient);
  private readonly router = inject(DynamicRouterService);

  private readonly _ready = signal(false);
  readonly ready = this._ready.asReadonly();

  async run(): Promise<void> {
    try {
      // 1. Phase 0 stubs at the single bootstrap edge (ADR-0007).
      this.tenantCtx.initialize({ id: 'dev-tenant', name: 'Dev' });
      this.userCtx.initialize({ id: 'dev-user', roles: ['admin'] });

      // Initialize Module Federation host (ADR-0004). Idempotent. Plugins
      // built as MF remotes resolve their `@angular/*` imports to THESE
      // live instances via the share registry — no Angular duplication.
      initMfHost({
        '@angular/core':   () => ngCore,
        '@angular/common': () => ngCommon,
        '@angular/router': () => ngRouter,
        rxjs:              () => rxjs,
      });

      // 2. Wire orchestrator. NavRegistrar is a Phase 0 no-op since plugins
      //    declare nav in the manifest; runtime nav.register lands in Phase 1.
      const navRegistrar: NavRegistrar = {
        registerForPlugin: () => ({ dispose: () => {} }),
      };
      const factoryDeps: ContextFactoryDeps = {
        tenant: this.tenantCtx.require(),
        user: this.userCtx.require(),
        router: this.router,
        nav: navRegistrar,
      };
      this.orchestrator.configure({ factoryDeps: () => factoryDeps });

      // 3 + 4.
      const manifests = await this.registryClient.fetchInstalled();
      // eslint-disable-next-line no-console
      console.info('[VENTIX] kernel bootstrap', {
        tenant: factoryDeps.tenant,
        plugins: manifests.length,
      });
      await this.orchestrator.activateAll(manifests);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[VENTIX] kernel bootstrap failed', err);
    } finally {
      this._ready.set(true);
    }
  }
}
