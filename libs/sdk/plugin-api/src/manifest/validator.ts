/**
 * Manifest validator. Combines Zod schema validation with cross-field rules
 * the schema cannot express alone (route namespacing, etc.).
 *
 * Returns a discriminated union so callers handle errors without try/catch.
 */
import { ManifestV1Schema, type ManifestV1 } from './schema';
import { ManifestError, type ManifestErrorCode } from './errors';

export interface ValidationOk {
  ok: true;
  manifest: ManifestV1;
}

export interface ValidationErr {
  ok: false;
  errors: ManifestError[];
}

export type ValidationResult = ValidationOk | ValidationErr;

/**
 * Validate a manifest object against RFC-0001 schema + cross-field rules.
 *
 * @example
 * const result = validateManifest(JSON.parse(json));
 * if (!result.ok) {
 *   for (const e of result.errors) console.error(e.message, '→', e.fix);
 *   return;
 * }
 * activate(result.manifest);
 */
export function validateManifest(input: unknown): ValidationResult {
  const parsed = ManifestV1Schema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => {
      const path = issue.path.filter(
        (p): p is string | number => typeof p === 'string' || typeof p === 'number',
      );
      return new ManifestError(
        'SCHEMA_VIOLATION',
        `${path.join('.') || '<root>'}: ${issue.message}`,
        fixHint(path, issue.message),
        path,
      );
    });
    return { ok: false, errors };
  }

  const crossFieldErrors = checkCrossFieldRules(parsed.data);
  if (crossFieldErrors.length > 0) {
    return { ok: false, errors: crossFieldErrors };
  }

  return { ok: true, manifest: parsed.data };
}

function checkCrossFieldRules(m: ManifestV1): ManifestError[] {
  const errors: ManifestError[] = [];
  const namespacePrefix = `/${m.id}/`;

  for (const [i, item] of (m.navigation ?? []).entries()) {
    if (!item.route.startsWith(namespacePrefix) && item.route !== `/${m.id}`) {
      errors.push(
        new ManifestError(
          'ROUTE_NAMESPACE_VIOLATION',
          `navigation[${i}].route '${item.route}' does not start with '${namespacePrefix}'`,
          `Prefix the route with '${namespacePrefix}'. Cross-plugin links use ctx.nav.open().`,
          ['navigation', i, 'route'],
        ),
      );
    }
  }

  return errors;
}

function fixHint(path: ReadonlyArray<string | number>, _message: string): string {
  const head = path[0];
  switch (head) {
    case 'id':
      return 'Use reverse-DNS lowercase, e.g. "com.acme.crm-plus".';
    case 'version':
      return 'Use strict semver, e.g. "1.0.0" or "1.0.0-beta.1".';
    case 'engine':
      return 'Specify a semver range, e.g. { "ventix": "^1.0.0" }.';
    case 'frontend':
      return 'remoteEntry must be a valid URL; exposedModule typically "./Plugin".';
    case '$schema':
      return 'Set to "https://ventix.dev/schemas/plugin.v1.json".';
    case undefined:
      return 'Manifest root must be an object with the v1 fields. See RFC-0001.';
    default:
      return 'See RFC-0001 for the complete v1 schema reference.';
  }
}

/**
 * Cross-check the manifest against the loaded plugin module's id and version.
 * Called by the kernel after loading a plugin via Module Federation.
 */
export function crossCheckLoadedModule(
  manifest: ManifestV1,
  loaded: { id: string; version: string },
): ManifestError[] {
  const errors: ManifestError[] = [];
  if (manifest.id !== loaded.id) {
    errors.push(
      new ManifestError(
        'ID_MISMATCH',
        `manifest id '${manifest.id}' does not match loaded module id '${loaded.id}'`,
        'Ensure definePlugin({ id }) matches ventix.plugin.json#id exactly.',
      ),
    );
  }
  if (manifest.version !== loaded.version) {
    errors.push(
      new ManifestError(
        'VERSION_MISMATCH',
        `manifest version '${manifest.version}' does not match loaded module version '${loaded.version}'`,
        'Bump both ventix.plugin.json#version and definePlugin({ version }) together.',
      ),
    );
  }
  return errors;
}

export type { ManifestErrorCode };
