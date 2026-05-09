/**
 * Resolves --plugin <id> or auto-detection from cwd / single-plugin workspaces.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { WorkspaceContext } from './workspace';

export function findPluginDirById(ws: WorkspaceContext, id: string): string | null {
  if (!existsSync(ws.pluginsDir)) return null;
  for (const entry of readdirSync(ws.pluginsDir)) {
    const dir = join(ws.pluginsDir, entry);
    if (!statSync(dir).isDirectory()) continue;
    const manifestPath = join(dir, 'ventix.plugin.json');
    if (!existsSync(manifestPath)) continue;
    try {
      const m = JSON.parse(readFileSync(manifestPath, 'utf8')) as { id?: string };
      if (m.id === id) return dir;
    } catch {
      /* skip unreadable */
    }
  }
  return null;
}

export function findPluginDirAtCwd(): string | null {
  const cwd = process.cwd();
  if (existsSync(join(cwd, 'ventix.plugin.json'))) return cwd;
  return null;
}

export function listAllPluginDirs(ws: WorkspaceContext): string[] {
  if (!existsSync(ws.pluginsDir)) return [];
  return readdirSync(ws.pluginsDir)
    .map((e) => join(ws.pluginsDir, e))
    .filter((d) => statSync(d).isDirectory() && existsSync(join(d, 'ventix.plugin.json')));
}

/**
 * Resolution order:
 *   1. --plugin <id> if provided → must match a manifest
 *   2. cwd contains ventix.plugin.json → that plugin
 *   3. workspace has exactly one plugin → that one
 *   4. otherwise: error with the list of options
 */
export function resolvePluginDir(
  ws: WorkspaceContext,
  pluginId?: string,
): string {
  if (pluginId) {
    const dir = findPluginDirById(ws, pluginId);
    if (!dir) {
      throw new Error(
        `[PLUGIN_NOT_FOUND] no plugin with id '${pluginId}' under ${ws.pluginsDir}\n` +
          `  fix: run 'ventix doctor' to list installed plugins.`,
      );
    }
    return dir;
  }
  const fromCwd = findPluginDirAtCwd();
  if (fromCwd) return fromCwd;
  const all = listAllPluginDirs(ws);
  if (all.length === 1) return all[0] as string;
  if (all.length === 0) {
    throw new Error(
      `[NO_PLUGINS] no plugins found under ${ws.pluginsDir}\n` +
        `  fix: ventix create plugin --id <reverse.dns>`,
    );
  }
  const ids = all.map((d) => {
    const m = JSON.parse(readFileSync(join(d, 'ventix.plugin.json'), 'utf8')) as { id?: string };
    return m.id;
  });
  throw new Error(
    `[AMBIGUOUS_PLUGIN] multiple plugins found; specify --plugin <id>:\n` +
      ids.map((id) => `  - ${id ?? '(unknown)'}`).join('\n'),
  );
}
