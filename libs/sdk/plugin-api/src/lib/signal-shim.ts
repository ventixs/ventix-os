/**
 * Signal type alias. The SDK ships types only (ADR-0010), so we re-export
 * Angular's Signal type without bundling Angular itself. The host shell
 * provides the runtime implementation; plugins consume.
 *
 * Per ADR-0005, Signal is the SDK's reactive primitive.
 */
export type { Signal } from '@angular/core';
