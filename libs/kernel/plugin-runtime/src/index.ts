// @ventix/kernel-runtime — public surface.
// Conforms to ADR-0004 (Module Federation), ADR-0008 (FSM),
// ADR-0011 (disposables), ADR-0021 (fault isolation).

export { PluginOrchestrator, type OrchestratorEnv } from './lib/orchestrator';
export { ImportLoader, type PluginLoader } from './lib/loader';
export { MfLoader, initMfHost, SHARED_SINGLETONS } from './lib/mf-loader';
export {
  buildPluginContext,
  type ContextFactoryDeps,
  type NavRegistrar,
  type LogSink,
  type BuiltContext,
} from './lib/context-factory';
