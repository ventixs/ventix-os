// @ventix/plugin-api/manifest — RFC-0001 Manifest Schema v1.
// Conforms to ADR-0002 (manifest as contract), ADR-0010 (SDK ships types),
// ADR-0015 (Zod 4 for schemas).

export {
  ManifestV1Schema,
  PluginIdSchema,
  SemverSchema,
  type ManifestV1,
  type NavigationItem,
  type PluginRoute,
} from './schema';

export {
  validateManifest,
  crossCheckLoadedModule,
  type ValidationOk,
  type ValidationErr,
  type ValidationResult,
} from './validator';

export { ManifestError, type ManifestErrorCode } from './errors';
