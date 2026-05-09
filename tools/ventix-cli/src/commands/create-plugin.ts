/**
 * `ventix create plugin` — scaffolds a new plugin under libs/plugins/<short>/
 * using the template tree, then validates the generated manifest.
 *
 * Conforms to:
 *  - ADR-0002 (manifest-as-contract): generated manifest passes RFC-0001 schema
 *  - ADR-0006 (single repo for Phase 0): scaffolds inside the monorepo
 *  - ADR-0012 (route namespacing): generated nav uses /<plugin-id>/ prefix
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateManifest } from '@ventix/plugin-api/manifest';
import { discoverWorkspace } from '../lib/workspace';
import { parsePluginId } from '../lib/plugin-id';
import { renderTemplateTree, templatesRoot } from '../lib/template';
import { c } from '../lib/colors';

export interface CreatePluginArgs {
  readonly id: string;
  readonly name?: string;
  readonly vendor?: string;
  readonly license?: string;
}

export async function createPlugin(args: CreatePluginArgs): Promise<void> {
  const ws = discoverWorkspace();
  const parsed = parsePluginId(args.id);
  const target = join(ws.pluginsDir, parsed.short);

  if (existsSync(target)) {
    throw new Error(
      `[PLUGIN_EXISTS] ${target} already exists.\n` +
        `  fix: pick a different id, or remove the existing directory.`,
    );
  }

  const vars = {
    id: parsed.full,
    short: parsed.short,
    displayName: args.name ?? parsed.displayName,
    vendor: args.vendor ?? defaultVendor(),
    license: args.license ?? 'MIT',
  };

  const srcDir = join(templatesRoot(), 'plugin');
  const { written } = renderTemplateTree(srcDir, target, vars);

  // Validate generated manifest as a sanity check — caught here so authors
  // don't get a confusing failure later in `ventix dev`.
  const manifestPath = join(target, 'ventix.plugin.json');
  const result = validateManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
  if (!result.ok) {
    throw new Error(
      `[GENERATED_MANIFEST_INVALID] ${result.errors[0]?.message}\n` +
        `  fix: this is a CLI bug — please report.`,
    );
  }

  // Output.
  process.stdout.write(`${c.green('✓')} created ${c.bold(parsed.full)}\n`);
  process.stdout.write(`  ${c.gray('files:')}\n`);
  for (const f of written) {
    process.stdout.write(`    ${c.dim('+')} ${relativeTo(ws.root, f)}\n`);
  }
  process.stdout.write(`\n${c.bold('next:')}\n`);
  process.stdout.write(`  ${c.cyan('pnpm ventix dev --plugin')} ${parsed.full}\n`);
  process.stdout.write(`  ${c.cyan('pnpm ventix validate')} ${relativeTo(ws.root, manifestPath)}\n`);
}

function defaultVendor(): string {
  // Best-effort: read git user.name; fall back to "Anonymous".
  try {
    const { execSync } = require('node:child_process') as typeof import('node:child_process');
    return execSync('git config user.name', { encoding: 'utf8' }).trim() || 'Anonymous';
  } catch {
    return 'Anonymous';
  }
}

function relativeTo(root: string, abs: string): string {
  return abs.startsWith(root) ? abs.slice(root.length + 1) : abs;
}
