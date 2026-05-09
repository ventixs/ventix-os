// VENTIX Hello plugin — Phase 0 reference implementation.
//
// Plain ESM (no TypeScript build) so the shell can `import()` it directly
// from /plugins/com.demo.hello/index.js. Phase 1 swaps to a Module
// Federation bundle without changing this file's exports.
//
// Conforms to ADR-0014 (no decorators) — but doesn't even use definePlugin
// since that would require an SDK runtime import. The default export
// matches VentixPluginModule's shape directly.

export default {
  id: 'com.demo.hello',
  version: '1.0.0',

  async activate(ctx) {
    ctx.logger.info('Hello plugin activated', {
      tenant: ctx.tenant.id,
      user: ctx.user.id,
    });

    ctx.nav.register([
      {
        id: 'hello-home',
        label: 'Hello',
        route: '/com.demo.hello/home',
      },
    ]);

    // Route registration is intentionally NOT included in Phase 0:
    // it requires Module Federation to share the host's Angular instance.
    // The nav item still appears; clicking it 404s in Phase 0.
    // Phase 1 (M0 spike → ADR-0004) wires real route loading.
  },

  async deactivate() {
    // DisposableBag handles cleanup automatically (ADR-0011).
  },
};
