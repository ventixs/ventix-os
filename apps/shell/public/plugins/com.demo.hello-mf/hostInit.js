import { t as __vitePreload } from "./preload-helper.js";
//#region node_modules/__mf__virtual/__mfe_internal__com_demo_hello_mf__H_A_I__hostAutoInit__H_A_I__.js
var __mfCacheGlobalKey = "__mf_module_cache__";
globalThis[__mfCacheGlobalKey] ||= {
	share: {},
	remote: {}
};
globalThis[__mfCacheGlobalKey].share ||= {};
globalThis[__mfCacheGlobalKey].remote ||= {};
var __mfModuleCache = globalThis[__mfCacheGlobalKey];
var hostInitPromise;
async function initHost() {
	if (!hostInitPromise) hostInitPromise = (async () => {
		const runtime = await (await __vitePreload(() => import("./remoteEntry.js"), [])).init();
		for (const [pkg, share] of Object.entries({
			"@angular/common": { shareConfig: {
				singleton: true,
				requiredVersion: "^20.3.20"
			} },
			"@angular/core": { shareConfig: {
				singleton: true,
				requiredVersion: "^20.3.20"
			} },
			"@angular/router": { shareConfig: {
				singleton: true,
				requiredVersion: "^20.3.20"
			} },
			"rxjs": { shareConfig: {
				singleton: true,
				requiredVersion: "^7.8.2"
			} }
		})) {
			if (__mfModuleCache.share[pkg] !== void 0) continue;
			await runtime.loadShare(pkg, { customShareInfo: { shareConfig: share.shareConfig } }).then((factory) => {
				const mod = typeof factory === "function" ? factory() : factory;
				return Promise.resolve(mod).then((resolved) => {
					__mfModuleCache.share[pkg] = resolved;
				});
			});
		}
		await Promise.all([]);
		return runtime;
	})();
	return hostInitPromise;
}
hostInitPromise = initHost();
//#endregion
export { hostInitPromise, initHost };
