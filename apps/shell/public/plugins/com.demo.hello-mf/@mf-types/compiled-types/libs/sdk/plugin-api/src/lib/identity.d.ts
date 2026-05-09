/**
 * Identity types — tenant and user info passed to every plugin.
 * Per ADR-0003 multi-tenancy is an axiom: plugins ALWAYS receive a
 * non-null tenant + user. Source is stubbed in Phase 0 (ADR-0007).
 */
export type PluginId = string;
export interface TenantInfo {
    readonly id: string;
    readonly name: string;
    readonly theme?: string;
}
export interface UserInfo {
    readonly id: string;
    readonly displayName?: string;
    readonly email?: string;
    readonly roles: ReadonlyArray<string>;
}
