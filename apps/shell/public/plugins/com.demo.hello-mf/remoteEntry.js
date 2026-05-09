import { t as __vitePreload } from "./preload-helper.js";
import { t as createInstance } from "./dist.js";
//#region virtual:mf-REMOTE_ENTRY_ID:__mfe_internal__com_demo_hello_mf__remoteEntry_js
if (typeof __VUE_HMR_RUNTIME__ === "undefined") globalThis.__VUE_HMR_RUNTIME__ = {
	createRecord() {},
	rerender() {},
	reload() {}
};
var __mfResolveGlobalKey = "__mf_init____mf__virtual/__mfe_internal__com_demo_hello_mf__mf_v__runtimeInit__mf_v__.js__";
var __mfResolveState = globalThis[__mfResolveGlobalKey];
if (!__mfResolveState) {
	let initResolve, initReject;
	const initPromise = new Promise((re, rj) => {
		initResolve = re;
		initReject = rj;
	});
	__mfResolveState = globalThis[__mfResolveGlobalKey] = {
		initPromise,
		initResolve,
		initReject
	};
	if (typeof window === "undefined") initResolve({
		loadRemote: function() {
			return Promise.resolve(void 0);
		},
		loadShare: function() {
			return Promise.resolve(void 0);
		}
	});
}
var initResolve = __mfResolveState.initResolve;
var __mfCacheGlobalKey = "__mf_module_cache__";
globalThis[__mfCacheGlobalKey] ||= {
	share: {},
	remote: {}
};
globalThis[__mfCacheGlobalKey].share ||= {};
globalThis[__mfCacheGlobalKey].remote ||= {};
var __mfModuleCache = globalThis[__mfCacheGlobalKey];
var initTokens = {};
var shareScopeName = "default";
var mfName = "__mfe_internal__com_demo_hello_mf";
var runtimeInstance;
var localSharedImportMapPromise;
var exposesMapPromise;
var shouldRetrySharedInitError = false;
var waitSharedInitRetry = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function retrySharedInit(fn) {
	for (let attempt = 0;; attempt++) try {
		return await fn();
	} catch (e) {
		if (!(typeof shouldRetrySharedInitError === "function" && shouldRetrySharedInitError(e)) || attempt >= 19) throw e;
		await waitSharedInitRetry(250);
	}
}
async function getLocalSharedImportMap() {
	if (!localSharedImportMapPromise) localSharedImportMapPromise = retrySharedInit(() => __vitePreload(() => import("./_virtual_mf-localSharedImportMap___mfe_internal__com_demo_hello_mf.js"), [])).catch((e) => {
		localSharedImportMapPromise = void 0;
		throw e;
	});
	return localSharedImportMapPromise;
}
async function getExposesMap() {
	if (!exposesMapPromise) exposesMapPromise = retrySharedInit(() => __vitePreload(() => import("./virtualExposes.js"), [])).then((mod) => mod.default ?? mod).catch((e) => {
		exposesMapPromise = void 0;
		throw e;
	});
	return exposesMapPromise;
}
async function init(shared = {}, initScope = []) {
	const { usedShared, usedRemotes } = await getLocalSharedImportMap();
	if (__mfModuleCache.share["@angular/common"] === void 0) {
		const exportModule = { ...await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n.c), []) };
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		__mfModuleCache.share["@angular/common"] = exportModule;
	}
	if (__mfModuleCache.share["@angular/core"] === void 0) {
		const exportModule = { ...await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n.gt), []) };
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		__mfModuleCache.share["@angular/core"] = exportModule;
	}
	if (__mfModuleCache.share["@angular/router"] === void 0) {
		const exportModule = { ...await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare__.mjs.js").then((n) => n.t), []) };
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		__mfModuleCache.share["@angular/router"] = exportModule;
	}
	if (__mfModuleCache.share["rxjs"] === void 0) {
		const exportModule = { ...await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n.Nt), []) };
		Object.defineProperty(exportModule, "__esModule", {
			value: true,
			enumerable: false
		});
		__mfModuleCache.share["rxjs"] = exportModule;
	}
	const runtimeOptions = {
		name: mfName,
		remotes: usedRemotes,
		shared: usedShared,
		plugins: [],
		shareStrategy: "version-first"
	};
	if (!runtimeInstance) runtimeInstance = createInstance(runtimeOptions);
	else runtimeInstance.initOptions(runtimeOptions);
	const initRes = runtimeInstance;
	var initToken = initTokens[shareScopeName];
	if (!initToken) initToken = initTokens[shareScopeName] = { from: mfName };
	if (initScope.indexOf(initToken) >= 0) return;
	initScope.push(initToken);
	initRes.initShareScopeMap("default", shared);
	initResolve(initRes);
	try {
		await retrySharedInit(async () => {
			await Promise.all(await initRes.initializeSharing("default", {
				strategy: "version-first",
				from: "build",
				initScope
			}));
		});
	} catch (e) {
		console.error("[Module Federation]", e);
	}
	return initRes;
}
async function getExposes(moduleName) {
	const exposesMap = await getExposesMap();
	if (!(moduleName in exposesMap)) throw new Error(`[Module Federation] Module ${moduleName} does not exist in container.`);
	return exposesMap[moduleName]().then((res) => () => res);
}
//#endregion
export { getExposes as get, init };
