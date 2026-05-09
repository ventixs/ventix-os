/**
 * `ventix doctor` — environment + workspace health checks.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { discoverWorkspace } from '../lib/workspace';
import { validateManifest } from '@ventix/plugin-api/manifest';
import { SDK_VERSION } from '@ventix/plugin-api';
import { c } from '../lib/colors';

interface Check {
  name: string;
  status: 'ok' | 'warn' | 'fail';
  detail: string;
}

export async function doctor(): Promise<void> {
  const checks: Check[] = [];

  // Node version.
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  checks.push({
    name: 'Node ≥ 22',
    status: nodeMajor >= 22 ? 'ok' : 'fail',
    detail: `v${process.versions.node}`,
  });

  // Workspace root.
  let ws;
  try {
    ws = discoverWorkspace();
    checks.push({ name: 'Workspace root', status: 'ok', detail: ws.root });
  } catch (err) {
    checks.push({ name: 'Workspace root', status: 'fail', detail: (err as Error).message });
    print(checks);
    process.exit(2);
  }

  // SDK version.
  checks.push({ name: 'SDK_VERSION', status: 'ok', detail: SDK_VERSION });

  // Validate every plugin manifest under libs/plugins.
  if (existsSync(ws.pluginsDir)) {
    const { readdirSync } = await import('node:fs');
    for (const entry of readdirSync(ws.pluginsDir)) {
      const manifestPath = join(ws.pluginsDir, entry, 'ventix.plugin.json');
      if (!existsSync(manifestPath)) continue;
      const result = validateManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
      checks.push({
        name: `manifest libs/plugins/${entry}`,
        status: result.ok ? 'ok' : 'fail',
        detail: result.ok ? result.manifest.id : (result.errors[0]?.message ?? 'invalid'),
      });
    }
  }

  print(checks);
  if (checks.some((c) => c.status === 'fail')) process.exit(2);
}

function print(checks: Check[]): void {
  for (const c2 of checks) {
    const icon = c2.status === 'ok' ? c.green('✓') : c2.status === 'warn' ? c.yellow('!') : c.red('✗');
    process.stdout.write(`  ${icon} ${c2.name.padEnd(28)} ${c.gray(c2.detail)}\n`);
  }
}
