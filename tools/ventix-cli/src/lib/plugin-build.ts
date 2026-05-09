/**
 * Phase 0 plugin build pipeline. Plugins are single-file plain JS, so the
 * pipeline is: validate manifest → cross-check id/version with source →
 * copy to deploy directory → upsert registry.json.
 *
 * Phase 1 with TypeScript plugins replaces the copy step with esbuild.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  validateManifest,
  type ManifestV1,
} from '@ventix/plugin-api/manifest';
import type { WorkspaceContext } from './workspace';

export interface PluginBuildContext {
  readonly workspace: WorkspaceContext;
  readonly pluginDir: string;       // libs/plugins/<short>/
  readonly manifest: ManifestV1;
  readonly sourcePath: string;       // libs/plugins/<short>/src/main.js
  readonly deployDir: string;        // apps/shell/public/plugins/<id>/
}

export function loadPluginContext(
  ws: WorkspaceContext,
  pluginDir: string,
): PluginBuildContext {
  const manifestPath = join(pluginDir, 'ventix.plugin.json');
  if (!existsSync(manifestPath)) {
    throw new Error(`[MANIFEST_MISSING] no ventix.plugin.json in ${pluginDir}`);
  }
  const result = validateManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
  if (!result.ok) {
    const first = result.errors[0];
    throw new Error(`[MANIFEST_INVALID] ${manifestPath}: ${first?.message ?? 'unknown'}`);
  }
  const manifest = result.manifest;
  const sourcePath = join(pluginDir, 'src', 'main.js');
  if (!existsSync(sourcePath)) {
    throw new Error(`[SOURCE_MISSING] ${sourcePath} does not exist`);
  }
  return {
    workspace: ws,
    pluginDir,
    manifest,
    sourcePath,
    deployDir: join(ws.publicPluginsDir, manifest.id),
  };
}

/**
 * Cross-check that the plugin source's `id` and `version` literal values
 * match the manifest. Plain JS regex check (Phase 0). Phase 1 uses the TS
 * compiler.
 */
export function crossCheckSource(ctx: PluginBuildContext): string[] {
  const errors: string[] = [];
  const source = readFileSync(ctx.sourcePath, 'utf8');

  const idMatch = /\bid\s*:\s*['"]([^'"]+)['"]/.exec(source);
  if (idMatch && idMatch[1] !== ctx.manifest.id) {
    errors.push(
      `id mismatch: source declares '${idMatch[1]}' but manifest declares '${ctx.manifest.id}'`,
    );
  }

  const versionMatch = /\bversion\s*:\s*['"]([^'"]+)['"]/.exec(source);
  if (versionMatch && versionMatch[1] !== ctx.manifest.version) {
    errors.push(
      `version mismatch: source declares '${versionMatch[1]}' but manifest declares '${ctx.manifest.version}'`,
    );
  }

  return errors;
}

/** Copy source + manifest to the deploy directory. Idempotent. */
export function deployPlugin(ctx: PluginBuildContext): { written: string[] } {
  mkdirSync(ctx.deployDir, { recursive: true });
  const indexOut = join(ctx.deployDir, 'index.js');
  const manifestOut = join(ctx.deployDir, 'ventix.plugin.json');
  copyFileSync(ctx.sourcePath, indexOut);
  copyFileSync(join(ctx.pluginDir, 'ventix.plugin.json'), manifestOut);
  return { written: [indexOut, manifestOut] };
}

/**
 * Upsert the plugin's manifest into apps/shell/public/registry.json. If the
 * file doesn't exist, create it. If the plugin id already exists in the
 * array, replace it. Otherwise append. Other plugins' entries are preserved.
 */
export function upsertRegistry(ctx: PluginBuildContext): void {
  const path = ctx.workspace.registryJsonPath;
  mkdirSync(dirname(path), { recursive: true });

  let manifests: ManifestV1[] = [];
  if (existsSync(path)) {
    const raw: unknown = JSON.parse(readFileSync(path, 'utf8'));
    if (Array.isArray(raw)) manifests = raw as ManifestV1[];
  }

  const idx = manifests.findIndex((m) => m.id === ctx.manifest.id);
  if (idx >= 0) manifests[idx] = ctx.manifest;
  else manifests.push(ctx.manifest);

  writeFileSync(path, `${JSON.stringify(manifests, null, 2)}\n`);
}
