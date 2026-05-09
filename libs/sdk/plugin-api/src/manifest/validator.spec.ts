import { describe, it, expect } from 'vitest';
import { validateManifest, crossCheckLoadedModule } from './validator';

const validManifest = {
  $schema: 'https://ventix.dev/schemas/plugin.v1.json',
  id: 'com.acme.hello',
  name: 'Hello',
  version: '1.0.0',
  vendor: { name: 'Acme Inc.' },
  license: 'MIT',
  engine: { ventix: '^1.0.0' },
  frontend: {
    remoteEntry: 'http://localhost:4300/com.acme.hello/remoteEntry.js',
    exposedModule: './Plugin',
  },
  navigation: [
    { id: 'home', label: 'Home', route: '/com.acme.hello/home', order: 100 },
  ],
  routes: [{ path: 'home', component: 'HomePage' }],
};

describe('validateManifest', () => {
  it('accepts a valid v1 manifest', () => {
    const result = validateManifest(validManifest);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.manifest.id).toBe('com.acme.hello');
  });

  it('rejects unknown root fields (strict mode catches typos)', () => {
    const result = validateManifest({ ...validManifest, foo: 'bar' });
    expect(result.ok).toBe(false);
  });

  it('rejects an invalid plugin id (non reverse-DNS)', () => {
    const result = validateManifest({ ...validManifest, id: 'NotReverseDns' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]?.code).toBe('SCHEMA_VIOLATION');
      expect(result.errors[0]?.fix).toContain('reverse-DNS');
    }
  });

  it('rejects non-semver version', () => {
    const result = validateManifest({ ...validManifest, version: 'v1' });
    expect(result.ok).toBe(false);
  });

  it('rejects route that escapes the plugin namespace', () => {
    const result = validateManifest({
      ...validManifest,
      navigation: [{ id: 'evil', label: 'Evil', route: '/com.other.plugin/leads' }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]?.code).toBe('ROUTE_NAMESPACE_VIOLATION');
    }
  });

  it('accepts a same-origin absolute path for remoteEntry', () => {
    const m = {
      ...validManifest,
      frontend: { remoteEntry: '/plugins/com.acme.hello/index.js', exposedModule: './Plugin' },
    };
    expect(validateManifest(m).ok).toBe(true);
  });

  it('rejects protocol-relative URL for remoteEntry', () => {
    const m = {
      ...validManifest,
      frontend: { remoteEntry: '//cdn.example.com/x.js', exposedModule: './Plugin' },
    };
    expect(validateManifest(m).ok).toBe(false);
  });

  it('rejects missing required fields', () => {
    const partial: Record<string, unknown> = { ...validManifest };
    delete partial['vendor'];
    const result = validateManifest(partial);
    expect(result.ok).toBe(false);
  });

  it('accepts manifest without optional navigation/routes', () => {
    const minimal = { ...validManifest };
    delete (minimal as Record<string, unknown>)['navigation'];
    delete (minimal as Record<string, unknown>)['routes'];
    const result = validateManifest(minimal);
    expect(result.ok).toBe(true);
  });
});

describe('crossCheckLoadedModule', () => {
  it('returns no errors when id and version match', () => {
    const errors = crossCheckLoadedModule(validManifest as never, {
      id: 'com.acme.hello',
      version: '1.0.0',
    });
    expect(errors).toEqual([]);
  });

  it('detects id mismatch', () => {
    const errors = crossCheckLoadedModule(validManifest as never, {
      id: 'com.acme.WRONG',
      version: '1.0.0',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe('ID_MISMATCH');
  });

  it('detects version mismatch', () => {
    const errors = crossCheckLoadedModule(validManifest as never, {
      id: 'com.acme.hello',
      version: '2.0.0',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe('VERSION_MISMATCH');
  });
});
