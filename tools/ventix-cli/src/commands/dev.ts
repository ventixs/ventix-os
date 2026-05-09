/**
 * `ventix dev [--plugin <id>]` — watch mode. On every save: re-validate,
 * cross-check, deploy to apps/shell/public/plugins/<id>/, upsert registry.
 * Reload the shell tab to see changes.
 *
 * Phase 1 will trigger Vite HMR via a websocket message instead of requiring
 * a manual reload — cheap once we have a real plugin host.
 */
import { watch } from 'node:fs';
import { join } from 'node:path';
import { discoverWorkspace } from '../lib/workspace';
import { resolvePluginDir } from '../lib/plugin-resolver';
import {
  loadPluginContext,
  crossCheckSource,
  deployPlugin,
  upsertRegistry,
} from '../lib/plugin-build';
import { c } from '../lib/colors';

export interface DevArgs {
  readonly plugin?: string;
}

const DEBOUNCE_MS = 80;

export async function dev(args: DevArgs): Promise<void> {
  const ws = discoverWorkspace();
  const pluginDir = resolvePluginDir(ws, args.plugin);

  const rebuild = (cause: string): void => {
    try {
      const ctx = loadPluginContext(ws, pluginDir);
      const xerrs = crossCheckSource(ctx);
      if (xerrs.length > 0) {
        process.stdout.write(
          `${c.yellow('!')} ${ctx.manifest.id} drift detected (${cause}):\n` +
            xerrs.map((e) => `    ${c.yellow('•')} ${e}\n`).join('') +
            `  ${c.gray('fix the drift; the previous deploy is still served.')}\n`,
        );
        return;
      }
      deployPlugin(ctx);
      upsertRegistry(ctx);
      const stamp = new Date().toLocaleTimeString();
      process.stdout.write(
        `${c.green('✓')} ${c.gray(stamp)} deployed ${c.bold(ctx.manifest.id)} v${ctx.manifest.version} ${c.gray(`(${cause})`)}\n`,
      );
    } catch (err) {
      process.stdout.write(`${c.red('✗')} ${(err as Error).message}\n`);
    }
  };

  // Initial build.
  rebuild('initial');

  // Watch the plugin directory recursively. Debounce because saves trigger
  // multiple events on macOS.
  let timer: NodeJS.Timeout | undefined;
  const handler = (filename: string | null): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => rebuild(filename ?? 'change'), DEBOUNCE_MS);
  };

  const watcher = watch(pluginDir, { recursive: true }, (_event, filename) => {
    if (filename && filename.startsWith('.')) return; // ignore hidden files
    handler(filename);
  });

  process.stdout.write(
    `${c.cyan('▶')} watching ${c.bold(pluginDir.replace(ws.root + '/', ''))} ${c.gray('(Ctrl+C to stop)')}\n` +
      `  ${c.gray('reload http://localhost:4200 after saves to see changes')}\n`,
  );

  // Keep alive.
  const cleanup = (): void => {
    watcher.close();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  // Block forever.
  await new Promise<void>(() => {
    /* never resolves */
  });
  void join; // silence unused-import lint if any
}
