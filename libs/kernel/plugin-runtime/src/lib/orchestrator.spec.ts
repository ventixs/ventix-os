import '@angular/compiler';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { definePlugin, type VentixPluginModule } from '@ventix/plugin-api';
import { PluginRegistry } from '@ventix/kernel-registry';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';
import { PluginOrchestrator } from './orchestrator';
import type { PluginLoader } from './loader';
import type { ContextFactoryDeps, NavRegistrar } from './context-factory';

const manifest = (id: string, version = '1.0.0'): ManifestV1 => ({
  $schema: 'https://ventix.dev/schemas/plugin.v1.json',
  id,
  name: 'Test',
  version,
  vendor: { name: 'Test' },
  license: 'MIT',
  engine: { ventix: '^1.0.0' },
  frontend: { remoteEntry: `http://x/${id}/r.js`, exposedModule: './Plugin' },
});

function makeOrchestrator() {
  const registry = new PluginRegistry();
  const orch = Object.create(PluginOrchestrator.prototype) as PluginOrchestrator;
  Object.defineProperty(orch, 'registry', { value: registry, enumerable: false });
  Object.defineProperty(orch, 'slots', { value: new Map(), enumerable: false });

  const navRegistrar: NavRegistrar = {
    registerForPlugin: () => ({ dispose: () => {} }),
  };
  const dynamicRouter = {
    register: () => ({ dispose: () => {} }),
    unregister: () => {},
    ownsPath: () => false,
  } as unknown as ContextFactoryDeps['router'];

  const factoryDeps: ContextFactoryDeps = {
    tenant: { id: 't', name: 'Test' },
    user: { id: 'u', roles: [] },
    router: dynamicRouter,
    nav: navRegistrar,
  };

  return { orch, registry, factoryDeps };
}

const fakeLoader = (mod: VentixPluginModule | Error): PluginLoader => ({
  load: async () => {
    if (mod instanceof Error) throw mod;
    return mod;
  },
});

describe('PluginOrchestrator', () => {
  let orch: PluginOrchestrator;
  let registry: PluginRegistry;
  let factoryDeps: ContextFactoryDeps;

  beforeEach(() => {
    ({ orch, registry, factoryDeps } = makeOrchestrator());
  });

  it('runs the happy path: DISCOVERED → VALIDATED → LOADED → ACTIVE', async () => {
    const activate = vi.fn();
    const plugin = definePlugin({
      id: 'com.test.alpha',
      version: '1.0.0',
      activate,
    });
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(plugin) });

    await orch.activate(manifest('com.test.alpha'));
    expect(activate).toHaveBeenCalledOnce();
    expect(registry.byId('com.test.alpha')?.state).toBe('ACTIVE');
  });

  it('moves to ERROR with SCHEMA_VIOLATION when manifest is invalid', async () => {
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(new Error('unused')) });
    const broken = { ...manifest('NotReverseDns') } as unknown as ManifestV1;

    await orch.activate(broken);
    const rec = registry.byId('NotReverseDns');
    expect(rec?.state).toBe('ERROR');
    expect(rec?.lastError?.code).toBe('SCHEMA_VIOLATION');
  });

  it('moves to ERROR with LOAD_FAILED when loader throws', async () => {
    orch.configure({
      factoryDeps: () => factoryDeps,
      loader: fakeLoader(new Error('CDN down')),
    });

    await orch.activate(manifest('com.test.alpha'));
    const rec = registry.byId('com.test.alpha');
    expect(rec?.state).toBe('ERROR');
    expect(rec?.lastError?.code).toBe('LOAD_FAILED');
    expect(rec?.lastError?.message).toContain('CDN down');
  });

  it('moves to ERROR with ID_MISMATCH when loaded module disagrees with manifest', async () => {
    const plugin = definePlugin({
      id: 'com.test.WRONG',
      version: '1.0.0',
      activate: () => {},
    });
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(plugin) });

    await orch.activate(manifest('com.test.alpha'));
    const rec = registry.byId('com.test.alpha');
    expect(rec?.state).toBe('ERROR');
    expect(rec?.lastError?.code).toBe('ID_MISMATCH');
  });

  it('moves to ERROR with ACTIVATE_THREW when activate() throws', async () => {
    const plugin = definePlugin({
      id: 'com.test.alpha',
      version: '1.0.0',
      activate: () => {
        throw new Error('plugin sad');
      },
    });
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(plugin) });

    await orch.activate(manifest('com.test.alpha'));
    const rec = registry.byId('com.test.alpha');
    expect(rec?.state).toBe('ERROR');
    expect(rec?.lastError?.code).toBe('ACTIVATE_THREW');
  });

  it('activateAll is fault-isolated — one failure does not stop others', async () => {
    let goodActivated = false;
    const good = definePlugin({
      id: 'com.test.good',
      version: '1.0.0',
      activate: () => {
        goodActivated = true;
      },
    });
    // We only have one loader, so we route by manifest id at load time.
    const loader: PluginLoader = {
      load: async (m) => {
        if (m.id === 'com.test.good') return good;
        throw new Error('bad load');
      },
    };
    orch.configure({ factoryDeps: () => factoryDeps, loader });

    await orch.activateAll([
      manifest('com.test.bad'),
      manifest('com.test.good'),
    ]);

    expect(goodActivated).toBe(true);
    expect(registry.byId('com.test.bad')?.state).toBe('ERROR');
    expect(registry.byId('com.test.good')?.state).toBe('ACTIVE');
  });

  it('deactivate disposes resources and transitions to SUSPENDED', async () => {
    const deactivate = vi.fn();
    const plugin = definePlugin({
      id: 'com.test.alpha',
      version: '1.0.0',
      activate: () => {},
      deactivate,
    });
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(plugin) });

    await orch.activate(manifest('com.test.alpha'));
    await orch.deactivate('com.test.alpha');

    expect(deactivate).toHaveBeenCalledOnce();
    expect(registry.byId('com.test.alpha')?.state).toBe('SUSPENDED');
  });

  it('deactivate is safe even when the plugin\'s deactivate throws', async () => {
    const plugin = definePlugin({
      id: 'com.test.alpha',
      version: '1.0.0',
      activate: () => {},
      deactivate: () => {
        throw new Error('deactivate sad');
      },
    });
    orch.configure({ factoryDeps: () => factoryDeps, loader: fakeLoader(plugin) });

    await orch.activate(manifest('com.test.alpha'));
    await expect(orch.deactivate('com.test.alpha')).resolves.toBeUndefined();
    expect(registry.byId('com.test.alpha')?.state).toBe('SUSPENDED');
  });

  it('throws if used before configure()', async () => {
    await expect(orch.activate(manifest('com.test.alpha'))).rejects.toThrow(
      /ORCHESTRATOR_NOT_CONFIGURED/,
    );
  });
});
