import { t as __vitePreload } from "./preload-helper.js";
//#region virtual:mf-exposes:__mfe_internal__com_demo_hello_mf__remoteEntry_js
var cssAssetMap = {};
var injectedCssHrefs = /* @__PURE__ */ new Set();
var exposeLoadQueue = Promise.resolve();
async function importExposedModule(loader) {
	const currentLoad = exposeLoadQueue.then(loader, loader);
	exposeLoadQueue = currentLoad.then(() => void 0, () => void 0);
	return currentLoad;
}
async function injectCssAssets(exposeKey) {
	if (typeof document === "undefined") return;
	const cssAssets = cssAssetMap[exposeKey] || [];
	await Promise.all(cssAssets.map((cssAsset) => {
		const href = new URL(cssAsset, import.meta.url).href;
		if (injectedCssHrefs.has(href)) return Promise.resolve();
		injectedCssHrefs.add(href);
		if (document.querySelector(`link[rel="stylesheet"][data-mf-href="${href}"]`)) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = href;
			link.setAttribute("data-mf-href", href);
			link.onload = () => resolve();
			link.onerror = () => reject(/* @__PURE__ */ new Error(`[Module Federation] Failed to load CSS asset: ${href}`));
			document.head.appendChild(link);
		});
	}));
}
var virtual_mf_exposes___mfe_internal__com_demo_hello_mf__remoteEntry_js_default = { "./Plugin": async () => {
	await injectCssAssets("./Plugin");
	const importModule = await importExposedModule(() => __vitePreload(() => import("./plugin.js"), []));
	const exportModule = {};
	Object.assign(exportModule, importModule);
	Object.defineProperty(exportModule, "__esModule", {
		value: true,
		enumerable: false
	});
	return exportModule;
} };
//#endregion
export { virtual_mf_exposes___mfe_internal__com_demo_hello_mf__remoteEntry_js_default as default };
