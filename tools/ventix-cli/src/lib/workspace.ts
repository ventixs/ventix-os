/**
 * Workspace path discovery. The CLI assumes invocation from anywhere inside
 * the workspace and walks up to find `pnpm-workspace.yaml`. Phase 0: this is
 * the source of truth for "where do I write generated plugin files".
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface WorkspaceContext {
  readonly root: string;
  readonly pluginsDir: string;
  readonly registryJsonPath: string;
  readonly publicPluginsDir: string;
  readonly tsconfigBasePath: string;
}

export function discoverWorkspace(cwd = process.cwd()): WorkspaceContext {
  let dir = resolve(cwd);
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return {
        root: dir,
        pluginsDir: join(dir, 'libs', 'plugins'),
        registryJsonPath: join(dir, 'apps', 'shell', 'public', 'registry.json'),
        publicPluginsDir: join(dir, 'apps', 'shell', 'public', 'plugins'),
        tsconfigBasePath: join(dir, 'tsconfig.base.json'),
      };
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        '[VENTIX_CLI] could not find workspace root (no pnpm-workspace.yaml in any parent directory)',
      );
    }
    dir = parent;
  }
}

export function readJsonFile<T = unknown>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}
