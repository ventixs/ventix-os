const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["home.component.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper.js";
//#region ../../sdk/plugin-api/src/lib/define.ts
/**
* Wrap a PluginDefinition into the runtime shape the kernel expects.
* Returned object is what your plugin's entry file should export as default.
*/
function definePlugin(def) {
	return {
		id: def.id,
		version: def.version,
		async activate(ctx) {
			await def.activate(ctx);
		},
		async deactivate() {
			if (def.deactivate) await def.deactivate();
		}
	};
}
//#endregion
//#region src/plugin.ts
var plugin_default = definePlugin({
	id: "com.demo.hello-mf",
	version: "1.0.0",
	async activate(ctx) {
		ctx.logger.info("Hello-MF plugin activated", {
			tenant: ctx.tenant.id,
			via: "module-federation"
		});
		ctx.router.register([{
			path: "home",
			title: "Hello (MF) — VENTIX OS",
			loadComponent: () => __vitePreload(() => import("./home.component.js"), __vite__mapDeps([0]))
		}]);
	}
});
//#endregion
export { plugin_default as default };
