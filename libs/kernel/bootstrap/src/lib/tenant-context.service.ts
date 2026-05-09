/**
 * TenantContext / UserContext — single bootstrap-edge point per ADR-0007.
 * Phase 0 stub source; Phase 1 OIDC adapter replaces only `initialize()`.
 *
 * Per ADR-0003: shape is production-grade now. Source switches in one file.
 */
import { Injectable, signal } from '@angular/core';
import type { TenantInfo, UserInfo } from '@ventix/plugin-api';

@Injectable({ providedIn: 'root' })
export class TenantContext {
  private readonly _current = signal<TenantInfo | null>(null);
  readonly current = this._current.asReadonly();

  initialize(tenant: TenantInfo): void {
    if (this._current()) {
      throw new Error('[TENANT_ALREADY_INITIALIZED] tenant context can only be initialized once');
    }
    this._current.set(tenant);
  }

  require(): TenantInfo {
    const t = this._current();
    if (!t) throw new Error('[TENANT_NOT_INITIALIZED] call initialize() before reading');
    return t;
  }
}

@Injectable({ providedIn: 'root' })
export class UserContext {
  private readonly _current = signal<UserInfo | null>(null);
  readonly current = this._current.asReadonly();

  initialize(user: UserInfo): void {
    if (this._current()) {
      throw new Error('[USER_ALREADY_INITIALIZED] user context can only be initialized once');
    }
    this._current.set(user);
  }

  require(): UserInfo {
    const u = this._current();
    if (!u) throw new Error('[USER_NOT_INITIALIZED] call initialize() before reading');
    return u;
  }
}
