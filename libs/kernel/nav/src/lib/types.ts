/**
 * Internal nav types. Mirror @ventix/plugin-api NavItemSpec but enriched
 * with the owning pluginId so the shell can attribute clicks and audit.
 */
import type { PluginId } from '@ventix/plugin-api';

export interface NavNode {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly route: string;
  readonly order: number;
  readonly pluginId: PluginId;
  readonly children?: ReadonlyArray<NavNode>;
}
