/**
 * Typed SDK errors. Per ADR-0021 every error carries a machine-readable
 * `code` AND a human-readable `fix` hint. Errors teach.
 */
export type VentixErrorCode = 'NOT_IMPLEMENTED_IN_PHASE_0' | 'PERMISSION_DENIED' | 'TENANT_MISMATCH' | 'EVENT_NOT_DECLARED' | 'STORAGE_QUOTA_EXCEEDED' | 'HTTP_ERROR' | 'AI_TOOL_INVALID_INPUT' | 'PLUGIN_DEACTIVATED' | 'ROUTE_REGISTRATION_INVALID';
export declare class VentixError extends Error {
    readonly code: VentixErrorCode;
    readonly fix: string;
    readonly meta?: Readonly<Record<string, unknown>>;
    constructor(code: VentixErrorCode, message: string, fix: string, meta?: Readonly<Record<string, unknown>>);
}
