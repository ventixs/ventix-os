import { definePlugin } from '@ventix/plugin-api';

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
        loadComponent: () => import('./home.component'),
      },
    ]);
  },
});
