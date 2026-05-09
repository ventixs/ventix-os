/**
 * `ventix validate [path]` — runs RFC-0001 manifest validation. Defaults to
 * the manifest in the current directory.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validateManifest } from '@ventix/plugin-api/manifest';
import { c } from '../lib/colors';

export interface ValidateArgs {
  readonly path?: string;
}

export async function validate(args: ValidateArgs): Promise<void> {
  const target = resolve(args.path ?? join(process.cwd(), 'ventix.plugin.json'));
  if (!existsSync(target)) {
    throw new Error(
      `[MANIFEST_NOT_FOUND] no manifest at ${target}\n` +
        `  fix: pass --path <file>, or run from a directory containing ventix.plugin.json.`,
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(target, 'utf8'));
  } catch (err) {
    throw new Error(`[MANIFEST_NOT_JSON] ${target} is not valid JSON: ${(err as Error).message}`);
  }

  const result = validateManifest(raw);
  if (result.ok) {
    process.stdout.write(`${c.green('✓')} ${c.bold(result.manifest.id)} v${result.manifest.version} — manifest valid\n`);
    return;
  }

  process.stdout.write(`${c.red('✗')} ${c.bold(target)}\n`);
  for (const e of result.errors) {
    process.stdout.write(`  ${c.red('•')} ${e.message}\n`);
    process.stdout.write(`    ${c.gray('fix:')} ${c.gray(e.fix)}\n`);
  }
  process.exit(2);
}
