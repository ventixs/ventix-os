import { definePlugin } from '@ventix/plugin-api';
import HomeComponent from './home.component';

/**
 * Hello-MF plugin entry. Phase 1 spike for ADR-0004.
 *
 * The component is statically imported so the MF bundler emits it inside
 * the plugin's main chunk graph. We expose it via Promise.resolve() to
 * match the loadComponent contract — a Phase 1.5 task is enabling true
 * lazy chunks with proper publicPath resolution under MF.
 */
export default definePlugin({
  id: 'com.demo.hello-mf',
  version: '1.0.0',

  async activate(ctx) {
    ctx.logger.info('Hello-MF plugin activated', {
      tenant: ctx.tenant.id,
      via: 'module-federation',
    });

    ctx.router.register([
      {
        path: 'home',
        title: 'Hello (MF) — VENTIX OS',
        loadComponent: () => Promise.resolve(HomeComponent),
      },
    ]);
  },
});
