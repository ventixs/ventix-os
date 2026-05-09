/**
 * Typed manifest errors. Every error carries a machine-readable code AND a
 * human-readable fix hint per the SDK error policy.
 *
 * @see docs/adr/ADR-0021-runtime-stance-vs-author-dx.md
 */
export type ManifestErrorCode =
  | 'SCHEMA_VIOLATION'
  | 'ID_MISMATCH'
  | 'VERSION_MISMATCH'
  | 'ROUTE_NAMESPACE_VIOLATION'
  | 'ENGINE_INCOMPATIBLE'
  | 'INTEGRITY_REQUIRED';

export class ManifestError extends Error {
  readonly code: ManifestErrorCode;
  readonly fix: string;
  readonly path?: ReadonlyArray<string | number>;

  constructor(
    code: ManifestErrorCode,
    message: string,
    fix: string,
    path?: ReadonlyArray<string | number>,
  ) {
    super(`[${code}] ${message}`);
    this.name = 'ManifestError';
    this.code = code;
    this.fix = fix;
    if (path) this.path = path;
  }
}
