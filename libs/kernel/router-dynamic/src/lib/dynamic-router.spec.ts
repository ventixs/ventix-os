import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { DynamicRouterService } from './dynamic-router.service';
import type { PluginRouteSpec } from '@ventix/plugin-api';

/**
 * Phase 0 unit test. We mock Angular's Router with a minimal stand-in
 * (no need for TestBed — service only uses .config and .resetConfig).
 */
function makeService() {
  const router = {
    config: [] as unknown[],
    resetConfig(next: unknown[]) {
      this.config = next;
    },
  };
  // Bypass DI: inject the mock router by hand.
  const svc = Object.create(DynamicRouterService.prototype) as DynamicRouterService;
  Object.assign(svc as object, { router, owners: new Map() });
  // Re-bind the private 'router' field so the prototype methods see the mock.
  // The actual class uses `inject(Router)` — for the test we shim it directly.
  Object.defineProperty(svc, 'router', { value: router, enumerable: false });
  Object.defineProperty(svc, 'owners', { value: new Map(), enumerable: false });
  return { svc, router };
}

const route = (path: string): PluginRouteSpec => ({
  path,
  loadComponent: () => Promise.resolve({}),
});

describe('DynamicRouterService', () => {
  it('registers routes namespaced by plugin id', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.hello', [route('home'), route('details/:id')]);
    expect(router.config).toHaveLength(2);
    expect((router.config[0] as { path: string }).path).toBe('com.acme.hello/home');
    expect((router.config[1] as { path: string }).path).toBe('com.acme.hello/details/:id');
  });

  it('strips leading slash from spec.path', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.hello', [route('/home')]);
    expect((router.config[0] as { path: string }).path).toBe('com.acme.hello/home');
  });

  it('attaches pluginId to route data for downstream consumers', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.hello', [route('home')]);
    expect((router.config[0] as { data: { pluginId: string } }).data.pluginId).toBe('com.acme.hello');
  });

  it('unregister removes only the plugin\'s routes', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.alpha', [route('a')]);
    svc.register('com.acme.beta', [route('b')]);
    expect(router.config).toHaveLength(2);

    svc.unregister('com.acme.alpha');
    expect(router.config).toHaveLength(1);
    expect((router.config[0] as { path: string }).path).toBe('com.acme.beta/b');
  });

  it('Disposable returned by register is equivalent to unregister', () => {
    const { svc, router } = makeService();
    const disp = svc.register('com.acme.alpha', [route('a'), route('b')]);
    expect(router.config).toHaveLength(2);

    disp.dispose();
    expect(router.config).toHaveLength(0);
  });

  it('ownsPath reports the registered paths', () => {
    const { svc } = makeService();
    svc.register('com.acme.alpha', [route('home')]);
    expect(svc.ownsPath('com.acme.alpha', 'com.acme.alpha/home')).toBe(true);
    expect(svc.ownsPath('com.acme.alpha', 'com.acme.alpha/missing')).toBe(false);
  });

  it('records permission in route data when spec declares one', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.alpha', [
      { path: 'home', loadComponent: () => Promise.resolve({}), permission: 'crm.lead.read' },
    ]);
    expect((router.config[0] as { data: { permission: string } }).data.permission).toBe(
      'crm.lead.read',
    );
  });

  it('passes plain spec.title through when string', () => {
    const { svc, router } = makeService();
    svc.register('com.acme.alpha', [
      { path: 'home', loadComponent: () => Promise.resolve({}), title: 'Home Page' },
    ]);
    expect((router.config[0] as { title: string }).title).toBe('Home Page');
  });
});

// Defensive: if the service ever changes shape, this test fails fast.
describe('DynamicRouterService API surface', () => {
  it('exposes register, unregister, ownsPath', () => {
    const { svc } = makeService();
    expect(typeof svc.register).toBe('function');
    expect(typeof svc.unregister).toBe('function');
    expect(typeof svc.ownsPath).toBe('function');
  });
});

// vi present so unused-imports lint stays clean
vi.fn();
