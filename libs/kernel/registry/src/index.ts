// @ventix/kernel-registry — public surface.
// Conforms to ADR-0008 (FSM), ADR-0020 (controlled state).

export { PluginRegistry } from './lib/registry';
export type { PluginRecord, PluginState, RecordedError } from './lib/types';
export {
  isLegalTransition,
  assertLegalTransition,
  IllegalTransitionError,
} from './lib/fsm';
