import "./dist.js";
import { t as __vitePreload } from "./preload-helper.js";
//#region \0virtual:mf-localSharedImportMap:__mfe_internal__com_demo_hello_mf
var importMap = {
	"@angular/common": async () => {
		return await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n.l), []);
	},
	"@angular/core": async () => {
		return await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n._t), []);
	},
	"@angular/router": async () => {
		return await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare__.mjs.js").then((n) => n.n), []);
	},
	"rxjs": async () => {
		return await __vitePreload(() => import("./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js").then((n) => n.Pt), []);
	}
};
var usedShared = {
	"@angular/common": {
		name: "@angular/common",
		version: "20.3.20",
		scope: ["default"],
		loaded: false,
		from: "__mfe_internal__com_demo_hello_mf",
		async get() {
			usedShared["@angular/common"].loaded = true;
			const { "@angular/common": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^20.3.20"
		}
	},
	"@angular/core": {
		name: "@angular/core",
		version: "20.3.20",
		scope: ["default"],
		loaded: false,
		from: "__mfe_internal__com_demo_hello_mf",
		async get() {
			usedShared["@angular/core"].loaded = true;
			const { "@angular/core": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^20.3.20"
		}
	},
	"@angular/router": {
		name: "@angular/router",
		version: "20.3.20",
		scope: ["default"],
		loaded: false,
		from: "__mfe_internal__com_demo_hello_mf",
		async get() {
			usedShared["@angular/router"].loaded = true;
			const { "@angular/router": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^20.3.20"
		}
	},
	"rxjs": {
		name: "rxjs",
		version: "7.8.2",
		scope: ["default"],
		loaded: false,
		from: "__mfe_internal__com_demo_hello_mf",
		async get() {
			usedShared["rxjs"].loaded = true;
			const { "rxjs": pkgDynamicImport } = importMap;
			const exportModule = { ...await pkgDynamicImport() };
			Object.defineProperty(exportModule, "__esModule", {
				value: true,
				enumerable: false
			});
			return function() {
				return exportModule;
			};
		},
		shareConfig: {
			singleton: true,
			requiredVersion: "^7.8.2"
		}
	}
};
var usedRemotes = [];
//#endregion
export { usedRemotes, usedShared };
