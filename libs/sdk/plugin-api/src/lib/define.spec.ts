import { describe, it, expect, vi } from 'vitest';
import { definePlugin } from './define';
import { createPluginTestBed } from '../testing/test-bed';

describe('definePlugin', () => {
  it('produces a module exposing id, version, activate, deactivate', () => {
    const mod = definePlugin({
      id: 'com.test.alpha',
      version: '1.0.0',
      activate: () => {},
    });
    expect(mod.id).toBe('com.test.alpha');
    expect(mod.version).toBe('1.0.0');
    expect(typeof mod.activate).toBe('function');
    expect(typeof mod.deactivate).toBe('function');
  });

  it('runs through the test bed end-to-end', async () => {
    const activate = vi.fn();
    const plugin = definePlugin({
      id: 'com.test.beta',
      version: '1.0.0',
      activate: (ctx) => {
        ctx.router.register([
          { path: 'home', loadComponent: async () => ({}) },
        ]);
        ctx.nav.register([
          { id: 'home', label: 'Home', route: '/com.test.beta/home' },
        ]);
        ctx.logger.info('activated', { phase: 0 });
        activate();
      },
    });

    const bed = createPluginTestBed({ plugin });
    await bed.activate();

    expect(activate).toHaveBeenCalledOnce();
    expect(bed.registeredRoutes).toHaveLength(1);
    expect(bed.registeredNav).toHaveLength(1);
    expect(bed.logs).toContainEqual({
      level: 'info',
      msg: 'activated',
      fields: { phase: 0 },
    });
  });

  it('disposes registrations on deactivate', async () => {
    const plugin = definePlugin({
      id: 'com.test.gamma',
      version: '1.0.0',
      activate: (ctx) => {
        ctx.router.register([{ path: 'a', loadComponent: async () => ({}) }]);
        ctx.nav.register([{ id: 'a', label: 'A', route: '/com.test.gamma/a' }]);
      },
    });

    const bed = createPluginTestBed({ plugin });
    await bed.activate();
    expect(bed.registeredRoutes).toHaveLength(1);
    expect(bed.registeredNav).toHaveLength(1);

    await bed.deactivate();
    expect(bed.registeredRoutes).toHaveLength(0);
    expect(bed.registeredNav).toHaveLength(0);
  });

  it('aborts ctx.signal on deactivate', async () => {
    let signalRef: AbortSignal | undefined;
    const plugin = definePlugin({
      id: 'com.test.delta',
      version: '1.0.0',
      activate: (ctx) => {
        signalRef = ctx.signal;
      },
    });

    const bed = createPluginTestBed({ plugin });
    await bed.activate();
    expect(signalRef?.aborted).toBe(false);

    await bed.deactivate();
    expect(signalRef?.aborted).toBe(true);
  });

  it('throws NOT_IMPLEMENTED_IN_PHASE_0 if a plugin reaches for events', async () => {
    const plugin = definePlugin({
      id: 'com.test.epsilon',
      version: '1.0.0',
      activate: (ctx) => {
        ctx.events.publish('tenant.theme.changed', { themeId: 'dark' });
      },
    });

    const bed = createPluginTestBed({ plugin });
    await expect(bed.activate()).rejects.toThrow(/NOT_IMPLEMENTED_IN_PHASE_0/);
  });
});
