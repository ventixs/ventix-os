/**
 * Pure builder: takes nav items contributed by active plugins (already
 * tagged with pluginId) and returns a sorted, flattened-then-grouped tree.
 *
 * Phase 0: simple stable sort by `order`. No grouping logic — manifest
 * authors emit roots; nested groups land via `children`. Phase 1 may add
 * top-level grouping by `category`.
 */
import type { ManifestV1, NavigationItem } from '@ventix/plugin-api/manifest';
import type { PluginId } from '@ventix/plugin-api';
import type { NavNode } from './types';

export interface PluginContribution {
  readonly pluginId: PluginId;
  readonly items: ReadonlyArray<NavigationItem>;
}

/** Extract nav contributions from a list of active plugin manifests. */
export function contributionsFromManifests(
  manifests: ReadonlyArray<ManifestV1>,
): ReadonlyArray<PluginContribution> {
  return manifests.map((m) => ({
    pluginId: m.id,
    items: m.navigation ?? [],
  }));
}

/**
 * Build the rendered tree. Stable-sorted by `order` (default 100).
 * Children are recursively converted; children inherit the parent's pluginId.
 */
export function buildTree(
  contributions: ReadonlyArray<PluginContribution>,
): ReadonlyArray<NavNode> {
  const flat: NavNode[] = [];
  for (const c of contributions) {
    for (const item of c.items) {
      flat.push(toNode(item, c.pluginId));
    }
  }
  return stableSortByOrder(flat);
}

function toNode(item: NavigationItem, pluginId: PluginId): NavNode {
  const node: NavNode = {
    id: item.id,
    label: item.label,
    route: item.route,
    order: item.order ?? 100,
    pluginId,
    ...(item.icon !== undefined ? { icon: item.icon } : {}),
    ...(item.children
      ? {
          children: stableSortByOrder(
            item.children.map((c) => toNode(c, pluginId)),
          ),
        }
      : {}),
  };
  return node;
}

function stableSortByOrder<T extends { order: number }>(items: ReadonlyArray<T>): T[] {
  return items
    .map((item, idx) => ({ item, idx }))
    .sort((a, b) => a.item.order - b.item.order || a.idx - b.idx)
    .map(({ item }) => item);
}
