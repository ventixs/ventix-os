/**
 * Plugin id parsing. Reverse-DNS validated by the manifest schema, but the
 * CLI also derives a short folder name from the id's last segment.
 */
import { PluginIdSchema } from '@ventix/plugin-api/manifest';

export interface ParsedPluginId {
  readonly full: string; // 'com.acme.crm-plus'
  readonly short: string; // 'crm-plus'
  readonly displayName: string; // 'Crm Plus'
}

export function parsePluginId(input: string): ParsedPluginId {
  const result = PluginIdSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `[INVALID_PLUGIN_ID] '${input}' is not a valid reverse-DNS plugin id.\n` +
        `  Expected: lowercase, dot-separated, e.g. 'com.acme.crm-plus'\n` +
        `  Pattern:  ^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*)+$`,
    );
  }
  const segments = result.data.split('.');
  const short = segments[segments.length - 1] ?? result.data;
  const displayName = short
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
  return { full: result.data, short, displayName };
}
