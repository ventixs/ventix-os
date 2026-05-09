/**
 * Hello-MF plugin entry. Phase 1 spike for ADR-0004.
 *
 * The component is statically imported so the MF bundler emits it inside
 * the plugin's main chunk graph. We expose it via Promise.resolve() to
 * match the loadComponent contract — a Phase 1.5 task is enabling true
 * lazy chunks with proper publicPath resolution under MF.
 */
declare const _default: import("@ventix/plugin-api").VentixPluginModule;
export default _default;
