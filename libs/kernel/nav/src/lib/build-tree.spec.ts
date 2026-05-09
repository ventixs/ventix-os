import { describe, it, expect } from 'vitest';
import { buildTree, contributionsFromManifests } from './build-tree';
import type { ManifestV1 } from '@ventix/plugin-api/manifest';

const manifest = (
  id: string,
  navigation?: ManifestV1['navigation'],
): ManifestV1 => ({
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

describe('contributionsFromManifests', () => {
  it('returns empty items[] for plugins without navigation', () => {
    const c = contributionsFromManifests([manifest('com.test.alpha')]);
    expect(c).toEqual([{ pluginId: 'com.test.alpha', items: [] }]);
  });

  it('extracts navigation from each manifest', () => {
    const c = contributionsFromManifests([
      manifest('com.test.alpha', [{ id: 'a', label: 'A', route: '/com.test.alpha/a' }]),
      manifest('com.test.beta', [{ id: 'b', label: 'B', route: '/com.test.beta/b' }]),
    ]);
    expect(c).toHaveLength(2);
    expect(c[0]?.items).toHaveLength(1);
  });
});

describe('buildTree', () => {
  it('returns empty tree when there are no contributions', () => {
    expect(buildTree([])).toEqual([]);
  });

  it('flattens contributions across plugins', () => {
    const tree = buildTree([
      { pluginId: 'com.a', items: [{ id: 'x', label: 'X', route: '/com.a/x' }] },
      { pluginId: 'com.b', items: [{ id: 'y', label: 'Y', route: '/com.b/y' }] },
    ]);
    expect(tree).toHaveLength(2);
    expect(tree.map((n) => n.pluginId)).toEqual(['com.a', 'com.b']);
  });

  it('sorts by order ascending; defaults to 100', () => {
    const tree = buildTree([
      {
        pluginId: 'p',
        items: [
          { id: 'late', label: 'Late', route: '/p/l', order: 200 },
          { id: 'early', label: 'Early', route: '/p/e', order: 10 },
          { id: 'mid', label: 'Mid', route: '/p/m' /* default 100 */ },
        ],
      },
    ]);
    expect(tree.map((n) => n.id)).toEqual(['early', 'mid', 'late']);
  });

  it('preserves insertion order for items with equal `order` (stable sort)', () => {
    const tree = buildTree([
      {
        pluginId: 'p',
        items: [
          { id: 'a', label: 'A', route: '/p/a' },
          { id: 'b', label: 'B', route: '/p/b' },
          { id: 'c', label: 'C', route: '/p/c' },
        ],
      },
    ]);
    expect(tree.map((n) => n.id)).toEqual(['a', 'b', 'c']);
  });

  it('recurses into children, inheriting pluginId', () => {
    const tree = buildTree([
      {
        pluginId: 'com.a',
        items: [
          {
            id: 'parent',
            label: 'Parent',
            route: '/com.a/p',
            children: [
              { id: 'child1', label: 'C1', route: '/com.a/p/1', order: 2 },
              { id: 'child2', label: 'C2', route: '/com.a/p/2', order: 1 },
            ],
          },
        ],
      },
    ]);
    expect(tree[0]?.children?.map((c) => c.id)).toEqual(['child2', 'child1']);
    expect(tree[0]?.children?.[0]?.pluginId).toBe('com.a');
  });

  it('omits icon when not provided (exactOptionalPropertyTypes correctness)', () => {
    const tree = buildTree([
      { pluginId: 'p', items: [{ id: 'a', label: 'A', route: '/p/a' }] },
    ]);
    expect('icon' in (tree[0] ?? {})).toBe(false);
  });

  it('preserves icon when provided', () => {
    const tree = buildTree([
      { pluginId: 'p', items: [{ id: 'a', label: 'A', route: '/p/a', icon: 'home' }] },
    ]);
    expect(tree[0]?.icon).toBe('home');
  });
});
