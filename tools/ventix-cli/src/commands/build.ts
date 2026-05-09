/**
 * `ventix build [--plugin <id>]` — produces a deploy-ready artifact for one
 * plugin: manifest validated, source cross-checked, files copied to
 * apps/shell/public/plugins/<id>/, and registry.json updated.
 *
 * Phase 0: copy source as-is (plain JS). Phase 1: esbuild bundle for TS.
 */
import { discoverWorkspace } from '../lib/workspace';
import { resolvePluginDir } from '../lib/plugin-resolver';
import {
  loadPluginContext,
  crossCheckSource,
  deployPlugin,
  upsertRegistry,
} from '../lib/plugin-build';
import { c } from '../lib/colors';

export interface BuildArgs {
  readonly plugin?: string;
}

export async function build(args: BuildArgs): Promise<void> {
  const ws = discoverWorkspace();
  const pluginDir = resolvePluginDir(ws, args.plugin);
  const ctx = loadPluginContext(ws, pluginDir);

  const xerrs = crossCheckSource(ctx);
  if (xerrs.length > 0) {
    throw new Error(
      `[SOURCE_MANIFEST_DRIFT] ${ctx.manifest.id}\n` +
        xerrs.map((e) => `  • ${e}`).join('\n') +
        `\n  fix: keep id and version in source and ventix.plugin.json synchronized.`,
    );
  }

  const { written } = deployPlugin(ctx);
  upsertRegistry(ctx);

  const rel = (p: string): string =>
    p.startsWith(ws.root) ? p.slice(ws.root.length + 1) : p;

  process.stdout.write(`${c.green('✓')} built ${c.bold(ctx.manifest.id)} v${ctx.manifest.version}\n`);
  for (const f of written) process.stdout.write(`  ${c.dim('→')} ${rel(f)}\n`);
  process.stdout.write(`  ${c.dim('→')} ${rel(ws.registryJsonPath)} ${c.gray('(upserted)')}\n`);
}
