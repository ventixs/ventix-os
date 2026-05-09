import { B as __mf_366, I as __mf_325, J as __mf_379, Y as __mf_380, ct as __mf_480, q as __mf_378, st as __mf_479, x as __mf_150 } from "./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js";
//#region src/home.component.ts
var HomeComponent = class HomeComponent {
	constructor() {
		this.count = __mf_150(0, ...[]);
	}
	inc() {
		this.count.update((n) => n + 1);
	}
	static {
		this.ɵfac = function HomeComponent_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || HomeComponent)();
		};
	}
	static {
		this.ɵcmp = /* @__PURE__ */ __mf_366({
			type: HomeComponent,
			selectors: [["mf-hello-home"]],
			decls: 12,
			vars: 1,
			consts: [[1, "mf-home"], [3, "click"]],
			template: function HomeComponent_Template(rf, ctx) {
				if (rf & 1) {
					__mf_379(0, "section", 0)(1, "h1");
					__mf_479(2, "👋 Hello from a real plugin component");
					__mf_378();
					__mf_379(3, "p");
					__mf_479(4, " This component is shipped by ");
					__mf_379(5, "code");
					__mf_479(6, "com.demo.hello-mf");
					__mf_378();
					__mf_479(7, " as a Module Federation remote. It uses the shell's Angular instance via the MF singleton registry — no Angular bundled in the plugin. ");
					__mf_378();
					__mf_379(8, "p");
					__mf_479(9, " Click count from the plugin's own signal: ");
					__mf_379(10, "button", 1);
					__mf_380("click", function HomeComponent_Template_button_click_10_listener() {
						return ctx.inc();
					});
					__mf_479(11);
					__mf_378()()();
				}
				if (rf & 2) {
					__mf_325(11);
					__mf_480(ctx.count());
				}
			},
			styles: [".mf-home[_ngcontent-%COMP%] { max-width: 720px; padding: 1.5rem; color: #e6e8eb; }\n      .mf-home[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { font-size: 1.5rem; }\n      .mf-home[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] { background: #1c1f24; padding: 2px 6px; border-radius: 3px; }\n      .mf-home[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n        background: #4f8cff;\n        color: white;\n        border: none;\n        padding: 4px 12px;\n        border-radius: 4px;\n        cursor: pointer;\n      }"],
			changeDetection: 0
		});
	}
};
//#endregion
export { HomeComponent as default };
