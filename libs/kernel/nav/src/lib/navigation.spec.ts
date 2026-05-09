import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry } from '@ventix/kernel-registry';
import { NavigationService } from './navigation.service';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';

const manifest = (id: string, navigation?: ManifestV1['navigation']): ManifestV1 => ({
  $schema: 'https://ventix.dev/schemas/plugin.v1.json',
  id,
  name: 'Test',
  version: '1.0.0',
  vendor: { name: 'Test' },
  license: 'MIT',
  engine: { ventix: '^1.0.0' },
  frontend: { remoteEntry: `http://x/${id}/r.js`, exposedModule: './Plugin' },
  ...(navigation ? { navigation } : {}),
});

function activate(registry: PluginRegistry, id: string): void {
  registry.transition(id, 'VALIDATED');
  registry.transition(id, 'LOADED');
  registry.transition(id, 'ACTIVE');
}

describe('NavigationService.tree', () => {
  let registry: PluginRegistry;
  let svc: NavigationService;

  beforeEach(() => {
    registry = new PluginRegistry();
    svc = new NavigationService(registry);
  });

  it('returns empty when no plugins are active', () => {
    expect(svc.tree()).toEqual([]);
  });

  it('returns nav items only from ACTIVE plugins, not DISCOVERED ones', () => {
    registry.discover(
      manifest('com.test.alpha', [{ id: 'a', label: 'A', route: '/com.test.alpha/a' }]),
    );
    expect(svc.tree()).toEqual([]); // DISCOVERED — not yet active

    activate(registry, 'com.test.alpha');
    expect(svc.tree()).toHaveLength(1);
    expect(svc.tree()[0]?.id).toBe('a');
  });

  it('updates reactively when plugins activate / deactivate', () => {
    registry.discover(
      manifest('com.test.alpha', [{ id: 'a', label: 'A', route: '/com.test.alpha/a' }]),
    );
    activate(registry, 'com.test.alpha');
    expect(svc.tree()).toHaveLength(1);

    registry.transition('com.test.alpha', 'SUSPENDED');
    expect(svc.tree()).toHaveLength(0);
  });

  it('merges nav from multiple active plugins, sorted by order', () => {
    registry.discover(
      manifest('com.test.late', [
        { id: 'late', label: 'Late', route: '/com.test.late/x', order: 200 },
      ]),
    );
    registry.discover(
      manifest('com.test.early', [
        { id: 'early', label: 'Early', route: '/com.test.early/x', order: 10 },
      ]),
    );
    activate(registry, 'com.test.late');
    activate(registry, 'com.test.early');

    expect(svc.tree().map((n) => n.id)).toEqual(['early', 'late']);
  });

  it('attributes each nav node to its owning plugin', () => {
    registry.discover(
      manifest('com.test.alpha', [{ id: 'a', label: 'A', route: '/com.test.alpha/a' }]),
    );
    activate(registry, 'com.test.alpha');
    expect(svc.tree()[0]?.pluginId).toBe('com.test.alpha');
  });
});
