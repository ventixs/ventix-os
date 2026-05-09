// @ventix/kernel-nav — public surface.
// Conforms to ADR-0019 (state vs flow), ADR-0020 (controlled state).

export { NavigationService } from './lib/navigation.service';
export { buildTree, contributionsFromManifests, type PluginContribution } from './lib/build-tree';
export type { NavNode } from './lib/types';
