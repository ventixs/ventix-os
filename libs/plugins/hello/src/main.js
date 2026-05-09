// VENTIX Hello plugin — Phase 0.5 reference implementation.
//
// Plain ESM (no TypeScript build) so the shell can `import()` it directly.
// Phase 1 swaps to a Module Federation bundle without changing this file's
// exports. Conforms to ADR-0014 — no decorators; default export matches
// VentixPluginModule's shape.

export default {
  id: 'com.demo.hello',
  version: '1.0.0',

  async activate(ctx) {
    ctx.logger.info('Hello plugin activated', {
      tenant: ctx.tenant.id,
      user: ctx.user.id,
    });

    // Register a real route. The `panel` API renders title/body via the
    // kernel's PluginPanelComponent — works without Module Federation.
    // Plugins that ship Angular components use `loadComponent` instead
    // (Phase 1 with MF, ADR-0004).
    ctx.router.register([
      {
        path: 'home',
        title: 'Hello — VENTIX OS',
        panel: {
          title: 'Hello, VENTIX!',
          body:
            "You are looking at a route registered at runtime by " +
            "the com.demo.hello plugin. The shell never knew about this " +
            "URL at build time — the manifest declared the navigation " +
            "item, the plugin's activate() hook called ctx.router.register(), " +
            "and the kernel rendered this panel.",
          footnote:
            "Phase 1 (ADR-0004 / Module Federation) replaces this panel " +
            "with a real Angular component shipped by the plugin.",
        },
      },
    ]);
  },

  async deactivate() {
    // DisposableBag handles cleanup automatically (ADR-0011).
  },
};
