import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry } from './registry';
import { IllegalTransitionError } from './fsm';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';

const manifest = (id: string, version = '1.0.0'): ManifestV1 => ({
  $schema: 'https://ventix.dev/schemas/plugin.v1.json',
  id,
  name: 'Test',
  version,
  vendor: { name: 'Test Vendor' },
  license: 'MIT',
  engine: { ventix: '^1.0.0' },
  frontend: {
    remoteEntry: 'http://localhost:4300/' + id + '/remoteEntry.js',
    exposedModule: './Plugin',
  },
});

describe('PluginRegistry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  it('starts empty', () => {
    expect(registry.all()).toEqual([]);
    expect(registry.active()).toEqual([]);
  });

  it('discovers a plugin into DISCOVERED state', () => {
    registry.discover(manifest('com.test.alpha'));
    expect(registry.all()).toHaveLength(1);
    expect(registry.byId('com.test.alpha')?.state).toBe('DISCOVERED');
  });

  it('runs the happy path DISCOVERED → VALIDATED → LOADED → ACTIVE', () => {
    registry.discover(manifest('com.test.alpha'));
    registry.transition('com.test.alpha', 'VALIDATED');
    registry.transition('com.test.alpha', 'LOADED');
    registry.transition('com.test.alpha', 'ACTIVE');
    expect(registry.byId('com.test.alpha')?.state).toBe('ACTIVE');
    expect(registry.active()).toHaveLength(1);
  });

  it('rejects illegal transitions', () => {
    registry.discover(manifest('com.test.alpha'));
    expect(() => registry.transition('com.test.alpha', 'ACTIVE')).toThrow(
      IllegalTransitionError,
    );
  });

  it('records error with lastError payload', () => {
    registry.discover(manifest('com.test.alpha'));
    registry.recordError('com.test.alpha', { code: 'BOOM', message: 'broke' });
    const rec = registry.byId('com.test.alpha');
    expect(rec?.state).toBe('ERROR');
    expect(rec?.lastError).toEqual({ code: 'BOOM', message: 'broke' });
  });

  it('allows recovery: ERROR → DISCOVERED', () => {
    registry.discover(manifest('com.test.alpha'));
    registry.recordError('com.test.alpha', { code: 'X', message: 'x' });
    registry.transition('com.test.alpha', 'DISCOVERED');
    expect(registry.byId('com.test.alpha')?.state).toBe('DISCOVERED');
  });

  it('throws on transition for unknown plugin', () => {
    expect(() => registry.transition('com.unknown', 'VALIDATED')).toThrow(
      /UNKNOWN_PLUGIN/,
    );
  });

  it('refuses to remove an ACTIVE plugin', () => {
    registry.discover(manifest('com.test.alpha'));
    registry.transition('com.test.alpha', 'VALIDATED');
    registry.transition('com.test.alpha', 'LOADED');
    registry.transition('com.test.alpha', 'ACTIVE');
    expect(() => registry.remove('com.test.alpha')).toThrow(/CANNOT_REMOVE_ACTIVE/);
  });

  it('removes a SUSPENDED plugin', () => {
    registry.discover(manifest('com.test.alpha'));
    registry.transition('com.test.alpha', 'VALIDATED');
    registry.transition('com.test.alpha', 'LOADED');
    registry.transition('com.test.alpha', 'ACTIVE');
    registry.transition('com.test.alpha', 'SUSPENDED');
    registry.remove('com.test.alpha');
    expect(registry.byId('com.test.alpha')).toBeUndefined();
  });

  it('snapshots are immutable references — same Map identity until mutation', () => {
    registry.discover(manifest('com.test.alpha'));
    const before = registry.all();
    expect(before).toBe(registry.all()); // computed memoization

    registry.transition('com.test.alpha', 'VALIDATED');
    const after = registry.all();
    expect(after).not.toBe(before); // new map after mutation
  });

  it('discover is idempotent for same version', () => {
    registry.discover(manifest('com.test.alpha', '1.0.0'));
    const before = registry.byId('com.test.alpha')?.updatedAt;
    registry.discover(manifest('com.test.alpha', '1.0.0'));
    const after = registry.byId('com.test.alpha')?.updatedAt;
    expect(after).toBe(before);
  });

  it('discover replaces record for new version', () => {
    registry.discover(manifest('com.test.alpha', '1.0.0'));
    registry.discover(manifest('com.test.alpha', '1.1.0'));
    expect(registry.byId('com.test.alpha')?.manifest.version).toBe('1.1.0');
  });
});
