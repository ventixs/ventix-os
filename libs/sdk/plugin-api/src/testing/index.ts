// @ventix/plugin-api/testing — canonical reference implementation of
// PluginContext for plugin unit tests. Per the SDK spec, this lib doubles
// as the kernel runtime's reference. If the harness drifts from the runtime,
// kernel CI fails.

export { createPluginTestBed, type PluginTestBed, type PluginTestOptions } from './test-bed';
