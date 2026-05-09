import { t as __exportAll } from "./rolldown-runtime.js";
import { $ as __mf_402, A as __mf_275, At as __mf_52$1, B as __mf_366, Bt as last$1, C as __mf_164, Ct as __mf_30$1, D as __mf_207, Dt as __mf_41$1, E as __mf_200, Et as __mf_4$1, F as __mf_323, Ft as tap, G as __mf_370, Gt as defaultIfEmpty, H as __mf_368, Ht as first, It as takeUntil, Jt as filter, K as __mf_372, Kt as concatMap, L as __mf_332, Lt as switchMap, M as __mf_283, Mt as __mf_63$1, N as __mf_30$2, O as __mf_248, Ot as __mf_44$1, P as __mf_32$1, Q as __mf_401, Qt as refCount, R as __mf_339, Rt as startWith, S as __mf_152, St as __mf_26$1, T as __mf_180, Tt as __mf_39$1, U as __mf_369, Ut as finalize, V as __mf_367, Vt as takeLast, W as __mf_37$1, Wt as take, X as __mf_383, Xt as mergeMap, Yt as mergeAll, Z as __mf_392, Zt as map, _ as __mf_13$1, a as __mf_43$2, at as __mf_450, b as __mf_148, bt as __mf_19$1, d as __mf_101, dt as __mf_6$1, et as __mf_413, f as __mf_106, ft as __mf_72$1, g as __mf_129, h as __mf_123, ht as __mf_95, i as __mf_21$1, it as __mf_44$2, j as __mf_277, jt as __mf_58$1, k as __mf_27$1, kt as __mf_5$1, lt as __mf_54$1, m as __mf_122, mt as __mf_91, n as __mf_19$2, nt as __mf_416, o as __mf_52$2, ot as __mf_469, p as __mf_12$1, pt as __mf_88, qt as catchError, r as __mf_20$1, rt as __mf_43$1, s as __mf_7$1, t as __mf_12$2, tt as __mf_415, u as __mf_1$2, ut as __mf_57$1, v as __mf_137, vt as __mf_0$1, w as __mf_179, wt as __mf_38$1, x as __mf_150, xt as __mf_23$1, y as __mf_145, yt as __mf_1$1, z as __mf_34$1, zt as scan } from "./__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_common__loadShare__.mjs.js";
//#region ../../../node_modules/.pnpm/@angular+platform-browser@20.3.20_@angular+animations@20.3.20_@angular+core@20.3.20_@an_13fa84a858b9c8822a826c20442aff9c/node_modules/@angular/platform-browser/fesm2022/platform-browser.mjs
/**
* A service that can be used to get and set the title of a current HTML document.
*
* Since an Angular application can't be bootstrapped on the entire HTML document (`<html>` tag)
* it is not possible to bind to the `text` property of the `HTMLTitleElement` elements
* (representing the `<title>` tag). Instead, this service can be used to set and get the current
* title value.
*
* @publicApi
*/
var Title = /* @__PURE__ */ (() => {
	class Title {
		_doc;
		constructor(_doc) {
			this._doc = _doc;
		}
		/**
		* Get the title of the current HTML document.
		*/
		getTitle() {
			return this._doc.title;
		}
		/**
		* Set the title of the current HTML document.
		* @param newTitle
		*/
		setTitle(newTitle) {
			this._doc.title = newTitle || "";
		}
		static ɵfac = function Title_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || Title)(__mf_401(__mf_7$1));
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: Title,
			factory: Title.ɵfac,
			providedIn: "root"
		});
	}
	return Title;
})();
//#endregion
//#region ../../../node_modules/.pnpm/@angular+router@20.3.20_@angular+common@20.3.20_@angular+core@20.3.20_@angular+compiler_f44a24d86c8db5f4d9f84c16fbc16cec/node_modules/@angular/router/fesm2022/router2.mjs
/**
* @license Angular v20.3.20
* (c) 2010-2025 Google LLC. https://angular.dev/
* License: MIT
*/
/**
* The primary routing outlet.
*
* @publicApi
*/
var PRIMARY_OUTLET = "primary";
/**
* A private symbol used to store the value of `Route.title` inside the `Route.data` if it is a
* static string or `Route.resolve` if anything else. This allows us to reuse the existing route
* data/resolvers to support the title feature without new instrumentation in the `Router` pipeline.
*/
var RouteTitleKey = /* @__PURE__ */ Symbol("RouteTitle");
var ParamsAsMap = class {
	params;
	constructor(params) {
		this.params = params || {};
	}
	has(name) {
		return Object.prototype.hasOwnProperty.call(this.params, name);
	}
	get(name) {
		if (this.has(name)) {
			const v = this.params[name];
			return Array.isArray(v) ? v[0] : v;
		}
		return null;
	}
	getAll(name) {
		if (this.has(name)) {
			const v = this.params[name];
			return Array.isArray(v) ? v : [v];
		}
		return [];
	}
	get keys() {
		return Object.keys(this.params);
	}
};
/**
* Converts a `Params` instance to a `ParamMap`.
* @param params The instance to convert.
* @returns The new map instance.
*
* @publicApi
*/
function convertToParamMap(params) {
	return new ParamsAsMap(params);
}
/**
* Matches the route configuration (`route`) against the actual URL (`segments`).
*
* When no matcher is defined on a `Route`, this is the matcher used by the Router by default.
*
* @param segments The remaining unmatched segments in the current navigation
* @param segmentGroup The current segment group being matched
* @param route The `Route` to match against.
*
* @see {@link UrlMatchResult}
* @see {@link Route}
*
* @returns The resulting match information or `null` if the `route` should not match.
* @publicApi
*/
function defaultUrlMatcher(segments, segmentGroup, route) {
	const parts = route.path.split("/");
	if (parts.length > segments.length) return null;
	if (route.pathMatch === "full" && (segmentGroup.hasChildren() || parts.length < segments.length)) return null;
	const posParams = {};
	for (let index = 0; index < parts.length; index++) {
		const part = parts[index];
		const segment = segments[index];
		if (part[0] === ":") posParams[part.substring(1)] = segment;
		else if (part !== segment.path) return null;
	}
	return {
		consumed: segments.slice(0, parts.length),
		posParams
	};
}
function shallowEqualArrays(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; ++i) if (!shallowEqual(a[i], b[i])) return false;
	return true;
}
function shallowEqual(a, b) {
	const k1 = a ? getDataKeys(a) : void 0;
	const k2 = b ? getDataKeys(b) : void 0;
	if (!k1 || !k2 || k1.length != k2.length) return false;
	let key;
	for (let i = 0; i < k1.length; i++) {
		key = k1[i];
		if (!equalArraysOrString(a[key], b[key])) return false;
	}
	return true;
}
/**
* Gets the keys of an object, including `symbol` keys.
*/
function getDataKeys(obj) {
	return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
}
/**
* Test equality for arrays of strings or a string.
*/
function equalArraysOrString(a, b) {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		const aSorted = [...a].sort();
		const bSorted = [...b].sort();
		return aSorted.every((val, index) => bSorted[index] === val);
	} else return a === b;
}
/**
* Return the last element of an array.
*/
function last(a) {
	return a.length > 0 ? a[a.length - 1] : null;
}
function wrapIntoObservable(value) {
	if (__mf_26$1(value)) return value;
	if (__mf_277(value)) return __mf_44$1(Promise.resolve(value));
	return __mf_52$1(value);
}
var pathCompareMap = {
	"exact": equalSegmentGroups,
	"subset": containsSegmentGroup
};
var paramCompareMap = {
	"exact": equalParams,
	"subset": containsParams,
	"ignored": () => true
};
function containsTree(container, containee, options) {
	return pathCompareMap[options.paths](container.root, containee.root, options.matrixParams) && paramCompareMap[options.queryParams](container.queryParams, containee.queryParams) && !(options.fragment === "exact" && container.fragment !== containee.fragment);
}
function equalParams(container, containee) {
	return shallowEqual(container, containee);
}
function equalSegmentGroups(container, containee, matrixParams) {
	if (!equalPath(container.segments, containee.segments)) return false;
	if (!matrixParamsMatch(container.segments, containee.segments, matrixParams)) return false;
	if (container.numberOfChildren !== containee.numberOfChildren) return false;
	for (const c in containee.children) {
		if (!container.children[c]) return false;
		if (!equalSegmentGroups(container.children[c], containee.children[c], matrixParams)) return false;
	}
	return true;
}
function containsParams(container, containee) {
	return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every((key) => equalArraysOrString(container[key], containee[key]));
}
function containsSegmentGroup(container, containee, matrixParams) {
	return containsSegmentGroupHelper(container, containee, containee.segments, matrixParams);
}
function containsSegmentGroupHelper(container, containee, containeePaths, matrixParams) {
	if (container.segments.length > containeePaths.length) {
		const current = container.segments.slice(0, containeePaths.length);
		if (!equalPath(current, containeePaths)) return false;
		if (containee.hasChildren()) return false;
		if (!matrixParamsMatch(current, containeePaths, matrixParams)) return false;
		return true;
	} else if (container.segments.length === containeePaths.length) {
		if (!equalPath(container.segments, containeePaths)) return false;
		if (!matrixParamsMatch(container.segments, containeePaths, matrixParams)) return false;
		for (const c in containee.children) {
			if (!container.children[c]) return false;
			if (!containsSegmentGroup(container.children[c], containee.children[c], matrixParams)) return false;
		}
		return true;
	} else {
		const current = containeePaths.slice(0, container.segments.length);
		const next = containeePaths.slice(container.segments.length);
		if (!equalPath(container.segments, current)) return false;
		if (!matrixParamsMatch(container.segments, current, matrixParams)) return false;
		if (!container.children["primary"]) return false;
		return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next, matrixParams);
	}
}
function matrixParamsMatch(containerPaths, containeePaths, options) {
	return containeePaths.every((containeeSegment, i) => {
		return paramCompareMap[options](containerPaths[i].parameters, containeeSegment.parameters);
	});
}
/**
* @description
*
* Represents the parsed URL.
*
* Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
* serialized tree.
* UrlTree is a data structure that provides a lot of affordances in dealing with URLs
*
* @usageNotes
* ### Example
*
* ```ts
* @Component({templateUrl:'template.html'})
* class MyComponent {
*   constructor(router: Router) {
*     const tree: UrlTree =
*       router.parseUrl('/team/33/(user/victor//support:help)?debug=true#fragment');
*     const f = tree.fragment; // return 'fragment'
*     const q = tree.queryParams; // returns {debug: 'true'}
*     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
*     const s: UrlSegment[] = g.segments; // returns 2 segments 'team' and '33'
*     g.children[PRIMARY_OUTLET].segments; // returns 2 segments 'user' and 'victor'
*     g.children['support'].segments; // return 1 segment 'help'
*   }
* }
* ```
*
* @publicApi
*/
var UrlTree = class {
	root;
	queryParams;
	fragment;
	/** @internal */
	_queryParamMap;
	constructor(root = new UrlSegmentGroup([], {}), queryParams = {}, fragment = null) {
		this.root = root;
		this.queryParams = queryParams;
		this.fragment = fragment;
	}
	get queryParamMap() {
		this._queryParamMap ??= convertToParamMap(this.queryParams);
		return this._queryParamMap;
	}
	/** @docsNotRequired */
	toString() {
		return DEFAULT_SERIALIZER.serialize(this);
	}
};
/**
* @description
*
* Represents the parsed URL segment group.
*
* See `UrlTree` for more information.
*
* @publicApi
*/
var UrlSegmentGroup = class {
	segments;
	children;
	/** The parent node in the url tree */
	parent = null;
	constructor(segments, children) {
		this.segments = segments;
		this.children = children;
		Object.values(children).forEach((v) => v.parent = this);
	}
	/** Whether the segment has child segments */
	hasChildren() {
		return this.numberOfChildren > 0;
	}
	/** Number of child segments */
	get numberOfChildren() {
		return Object.keys(this.children).length;
	}
	/** @docsNotRequired */
	toString() {
		return serializePaths(this);
	}
};
/**
* @description
*
* Represents a single URL segment.
*
* A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
* parameters associated with the segment.
*
* @usageNotes
* ### Example
*
* ```ts
* @Component({templateUrl:'template.html'})
* class MyComponent {
*   constructor(router: Router) {
*     const tree: UrlTree = router.parseUrl('/team;id=33');
*     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
*     const s: UrlSegment[] = g.segments;
*     s[0].path; // returns 'team'
*     s[0].parameters; // returns {id: 33}
*   }
* }
* ```
*
* @publicApi
*/
var UrlSegment = class {
	path;
	parameters;
	/** @internal */
	_parameterMap;
	constructor(path, parameters) {
		this.path = path;
		this.parameters = parameters;
	}
	get parameterMap() {
		this._parameterMap ??= convertToParamMap(this.parameters);
		return this._parameterMap;
	}
	/** @docsNotRequired */
	toString() {
		return serializePath(this);
	}
};
function equalSegments(as, bs) {
	return equalPath(as, bs) && as.every((a, i) => shallowEqual(a.parameters, bs[i].parameters));
}
function equalPath(as, bs) {
	if (as.length !== bs.length) return false;
	return as.every((a, i) => a.path === bs[i].path);
}
function mapChildrenIntoArray(segment, fn) {
	let res = [];
	Object.entries(segment.children).forEach(([childOutlet, child]) => {
		if (childOutlet === "primary") res = res.concat(fn(child, childOutlet));
	});
	Object.entries(segment.children).forEach(([childOutlet, child]) => {
		if (childOutlet !== "primary") res = res.concat(fn(child, childOutlet));
	});
	return res;
}
/**
* @description
*
* Serializes and deserializes a URL string into a URL tree.
*
* The url serialization strategy is customizable. You can
* make all URLs case insensitive by providing a custom UrlSerializer.
*
* See `DefaultUrlSerializer` for an example of a URL serializer.
*
* @publicApi
*/
var UrlSerializer = /* @__PURE__ */ (() => {
	class UrlSerializer {
		static ɵfac = function UrlSerializer_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || UrlSerializer)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: UrlSerializer,
			factory: () => new DefaultUrlSerializer(),
			providedIn: "root"
		});
	}
	return UrlSerializer;
})();
/**
* @description
*
* A default implementation of the `UrlSerializer`.
*
* Example URLs:
*
* ```
* /inbox/33(popup:compose)
* /inbox/33;open=true/messages/44
* ```
*
* DefaultUrlSerializer uses parentheses to serialize secondary segments (e.g., popup:compose), the
* colon syntax to specify the outlet, and the ';parameter=value' syntax (e.g., open=true) to
* specify route specific parameters.
*
* @publicApi
*/
var DefaultUrlSerializer = class {
	/** Parses a url into a `UrlTree` */
	parse(url) {
		const p = new UrlParser(url);
		return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
	}
	/** Converts a `UrlTree` into a url */
	serialize(tree) {
		return `${`/${serializeSegment(tree.root, true)}`}${serializeQueryParams(tree.queryParams)}${typeof tree.fragment === `string` ? `#${encodeUriFragment(tree.fragment)}` : ""}`;
	}
};
var DEFAULT_SERIALIZER = /* @__PURE__ */ new DefaultUrlSerializer();
function serializePaths(segment) {
	return segment.segments.map((p) => serializePath(p)).join("/");
}
function serializeSegment(segment, root) {
	if (!segment.hasChildren()) return serializePaths(segment);
	if (root) {
		const primary = segment.children["primary"] ? serializeSegment(segment.children[PRIMARY_OUTLET], false) : "";
		const children = [];
		Object.entries(segment.children).forEach(([k, v]) => {
			if (k !== "primary") children.push(`${k}:${serializeSegment(v, false)}`);
		});
		return children.length > 0 ? `${primary}(${children.join("//")})` : primary;
	} else {
		const children = mapChildrenIntoArray(segment, (v, k) => {
			if (k === "primary") return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
			return [`${k}:${serializeSegment(v, false)}`];
		});
		if (Object.keys(segment.children).length === 1 && segment.children["primary"] != null) return `${serializePaths(segment)}/${children[0]}`;
		return `${serializePaths(segment)}/(${children.join("//")})`;
	}
}
/**
* Encodes a URI string with the default encoding. This function will only ever be called from
* `encodeUriQuery` or `encodeUriSegment` as it's the base set of encodings to be used. We need
* a custom encoding because encodeURIComponent is too aggressive and encodes stuff that doesn't
* have to be encoded per https://url.spec.whatwg.org.
*/
function encodeUriString(s) {
	return encodeURIComponent(s).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",");
}
/**
* This function should be used to encode both keys and values in a query string key/value. In
* the following URL, you need to call encodeUriQuery on "k" and "v":
*
* http://www.site.org/html;mk=mv?k=v#f
*/
function encodeUriQuery(s) {
	return encodeUriString(s).replace(/%3B/gi, ";");
}
/**
* This function should be used to encode a URL fragment. In the following URL, you need to call
* encodeUriFragment on "f":
*
* http://www.site.org/html;mk=mv?k=v#f
*/
function encodeUriFragment(s) {
	return encodeURI(s);
}
/**
* This function should be run on any URI segment as well as the key and value in a key/value
* pair for matrix params. In the following URL, you need to call encodeUriSegment on "html",
* "mk", and "mv":
*
* http://www.site.org/html;mk=mv?k=v#f
*/
function encodeUriSegment(s) {
	return encodeUriString(s).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
}
function decode(s) {
	return decodeURIComponent(s);
}
function decodeQuery(s) {
	return decode(s.replace(/\+/g, "%20"));
}
function serializePath(path) {
	return `${encodeUriSegment(path.path)}${serializeMatrixParams(path.parameters)}`;
}
function serializeMatrixParams(params) {
	return Object.entries(params).map(([key, value]) => `;${encodeUriSegment(key)}=${encodeUriSegment(value)}`).join("");
}
function serializeQueryParams(params) {
	const strParams = Object.entries(params).map(([name, value]) => {
		return Array.isArray(value) ? value.map((v) => `${encodeUriQuery(name)}=${encodeUriQuery(v)}`).join("&") : `${encodeUriQuery(name)}=${encodeUriQuery(value)}`;
	}).filter((s) => s);
	return strParams.length ? `?${strParams.join("&")}` : "";
}
var SEGMENT_RE = /^[^\/()?;#]+/;
function matchSegments(str) {
	const match = str.match(SEGMENT_RE);
	return match ? match[0] : "";
}
var MATRIX_PARAM_SEGMENT_RE = /^[^\/()?;=#]+/;
function matchMatrixKeySegments(str) {
	const match = str.match(MATRIX_PARAM_SEGMENT_RE);
	return match ? match[0] : "";
}
var QUERY_PARAM_RE = /^[^=?&#]+/;
function matchQueryParams(str) {
	const match = str.match(QUERY_PARAM_RE);
	return match ? match[0] : "";
}
var QUERY_PARAM_VALUE_RE = /^[^&#]+/;
function matchUrlQueryParamValue(str) {
	const match = str.match(QUERY_PARAM_VALUE_RE);
	return match ? match[0] : "";
}
var UrlParser = class {
	url;
	remaining;
	constructor(url) {
		this.url = url;
		this.remaining = url;
	}
	parseRootSegment() {
		this.consumeOptional("/");
		if (this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#")) return new UrlSegmentGroup([], {});
		return new UrlSegmentGroup([], this.parseChildren());
	}
	parseQueryParams() {
		const params = {};
		if (this.consumeOptional("?")) do
			this.parseQueryParam(params);
		while (this.consumeOptional("&"));
		return params;
	}
	parseFragment() {
		return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
	}
	parseChildren() {
		if (this.remaining === "") return {};
		this.consumeOptional("/");
		const segments = [];
		if (!this.peekStartsWith("(")) segments.push(this.parseSegment());
		while (this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(")) {
			this.capture("/");
			segments.push(this.parseSegment());
		}
		let children = {};
		if (this.peekStartsWith("/(")) {
			this.capture("/");
			children = this.parseParens(true);
		}
		let res = {};
		if (this.peekStartsWith("(")) res = this.parseParens(false);
		if (segments.length > 0 || Object.keys(children).length > 0) res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
		return res;
	}
	parseSegment() {
		const path = matchSegments(this.remaining);
		if (path === "" && this.peekStartsWith(";")) throw new __mf_207(4009, false);
		this.capture(path);
		return new UrlSegment(decode(path), this.parseMatrixParams());
	}
	parseMatrixParams() {
		const params = {};
		while (this.consumeOptional(";")) this.parseParam(params);
		return params;
	}
	parseParam(params) {
		const key = matchMatrixKeySegments(this.remaining);
		if (!key) return;
		this.capture(key);
		let value = "";
		if (this.consumeOptional("=")) {
			const valueMatch = matchSegments(this.remaining);
			if (valueMatch) {
				value = valueMatch;
				this.capture(value);
			}
		}
		params[decode(key)] = decode(value);
	}
	parseQueryParam(params) {
		const key = matchQueryParams(this.remaining);
		if (!key) return;
		this.capture(key);
		let value = "";
		if (this.consumeOptional("=")) {
			const valueMatch = matchUrlQueryParamValue(this.remaining);
			if (valueMatch) {
				value = valueMatch;
				this.capture(value);
			}
		}
		const decodedKey = decodeQuery(key);
		const decodedVal = decodeQuery(value);
		if (params.hasOwnProperty(decodedKey)) {
			let currentVal = params[decodedKey];
			if (!Array.isArray(currentVal)) {
				currentVal = [currentVal];
				params[decodedKey] = currentVal;
			}
			currentVal.push(decodedVal);
		} else params[decodedKey] = decodedVal;
	}
	parseParens(allowPrimary) {
		const segments = {};
		this.capture("(");
		while (!this.consumeOptional(")") && this.remaining.length > 0) {
			const path = matchSegments(this.remaining);
			const next = this.remaining[path.length];
			if (next !== "/" && next !== ")" && next !== ";") throw new __mf_207(4010, false);
			let outletName;
			if (path.indexOf(":") > -1) {
				outletName = path.slice(0, path.indexOf(":"));
				this.capture(outletName);
				this.capture(":");
			} else if (allowPrimary) outletName = PRIMARY_OUTLET;
			const children = this.parseChildren();
			segments[outletName ?? "primary"] = Object.keys(children).length === 1 && children["primary"] ? children[PRIMARY_OUTLET] : new UrlSegmentGroup([], children);
			this.consumeOptional("//");
		}
		return segments;
	}
	peekStartsWith(str) {
		return this.remaining.startsWith(str);
	}
	consumeOptional(str) {
		if (this.peekStartsWith(str)) {
			this.remaining = this.remaining.substring(str.length);
			return true;
		}
		return false;
	}
	capture(str) {
		if (!this.consumeOptional(str)) throw new __mf_207(4011, false);
	}
};
function createRoot(rootCandidate) {
	return rootCandidate.segments.length > 0 ? new UrlSegmentGroup([], { [PRIMARY_OUTLET]: rootCandidate }) : rootCandidate;
}
/**
* Recursively
* - merges primary segment children into their parents
* - drops empty children (those which have no segments and no children themselves). This latter
* prevents serializing a group into something like `/a(aux:)`, where `aux` is an empty child
* segment.
* - merges named outlets without a primary segment sibling into the children. This prevents
* serializing a URL like `//(a:a)(b:b) instead of `/(a:a//b:b)` when the aux b route lives on the
* root but the `a` route lives under an empty path primary route.
*/
function squashSegmentGroup(segmentGroup) {
	const newChildren = {};
	for (const [childOutlet, child] of Object.entries(segmentGroup.children)) {
		const childCandidate = squashSegmentGroup(child);
		if (childOutlet === "primary" && childCandidate.segments.length === 0 && childCandidate.hasChildren()) for (const [grandChildOutlet, grandChild] of Object.entries(childCandidate.children)) newChildren[grandChildOutlet] = grandChild;
		else if (childCandidate.segments.length > 0 || childCandidate.hasChildren()) newChildren[childOutlet] = childCandidate;
	}
	return mergeTrivialChildren(new UrlSegmentGroup(segmentGroup.segments, newChildren));
}
/**
* When possible, merges the primary outlet child into the parent `UrlSegmentGroup`.
*
* When a segment group has only one child which is a primary outlet, merges that child into the
* parent. That is, the child segment group's segments are merged into the `s` and the child's
* children become the children of `s`. Think of this like a 'squash', merging the child segment
* group into the parent.
*/
function mergeTrivialChildren(s) {
	if (s.numberOfChildren === 1 && s.children["primary"]) {
		const c = s.children[PRIMARY_OUTLET];
		return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
	}
	return s;
}
function isUrlTree(v) {
	return v instanceof UrlTree;
}
/**
* Creates a `UrlTree` relative to an `ActivatedRouteSnapshot`.
*
* @publicApi
*
*
* @param relativeTo The `ActivatedRouteSnapshot` to apply the commands to
* @param commands An array of URL fragments with which to construct the new URL tree.
* If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
* segments, followed by the parameters for each segment.
* The fragments are applied to the one provided in the `relativeTo` parameter.
* @param queryParams The query parameters for the `UrlTree`. `null` if the `UrlTree` does not have
*     any query parameters.
* @param fragment The fragment for the `UrlTree`. `null` if the `UrlTree` does not have a fragment.
*
* @usageNotes
*
* ```ts
* // create /team/33/user/11
* createUrlTreeFromSnapshot(snapshot, ['/team', 33, 'user', 11]);
*
* // create /team/33;expand=true/user/11
* createUrlTreeFromSnapshot(snapshot, ['/team', 33, {expand: true}, 'user', 11]);
*
* // you can collapse static segments like this (this works only with the first passed-in value):
* createUrlTreeFromSnapshot(snapshot, ['/team/33/user', userId]);
*
* // If the first segment can contain slashes, and you do not want the router to split it,
* // you can do the following:
* createUrlTreeFromSnapshot(snapshot, [{segmentPath: '/one/two'}]);
*
* // create /team/33/(user/11//right:chat)
* createUrlTreeFromSnapshot(snapshot, ['/team', 33, {outlets: {primary: 'user/11', right:
* 'chat'}}], null, null);
*
* // remove the right secondary node
* createUrlTreeFromSnapshot(snapshot, ['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
*
* // For the examples below, assume the current URL is for the `/team/33/user/11` and the
* `ActivatedRouteSnapshot` points to `user/11`:
*
* // navigate to /team/33/user/11/details
* createUrlTreeFromSnapshot(snapshot, ['details']);
*
* // navigate to /team/33/user/22
* createUrlTreeFromSnapshot(snapshot, ['../22']);
*
* // navigate to /team/44/user/22
* createUrlTreeFromSnapshot(snapshot, ['../../team/44/user/22']);
* ```
*/
function createUrlTreeFromSnapshot(relativeTo, commands, queryParams = null, fragment = null) {
	return createUrlTreeFromSegmentGroup(createSegmentGroupFromRoute(relativeTo), commands, queryParams, fragment);
}
function createSegmentGroupFromRoute(route) {
	let targetGroup;
	function createSegmentGroupFromRouteRecursive(currentRoute) {
		const childOutlets = {};
		for (const childSnapshot of currentRoute.children) {
			const root = createSegmentGroupFromRouteRecursive(childSnapshot);
			childOutlets[childSnapshot.outlet] = root;
		}
		const segmentGroup = new UrlSegmentGroup(currentRoute.url, childOutlets);
		if (currentRoute === route) targetGroup = segmentGroup;
		return segmentGroup;
	}
	const rootSegmentGroup = createRoot(createSegmentGroupFromRouteRecursive(route.root));
	return targetGroup ?? rootSegmentGroup;
}
function createUrlTreeFromSegmentGroup(relativeTo, commands, queryParams, fragment) {
	let root = relativeTo;
	while (root.parent) root = root.parent;
	if (commands.length === 0) return tree(root, root, root, queryParams, fragment);
	const nav = computeNavigation(commands);
	if (nav.toRoot()) return tree(root, root, new UrlSegmentGroup([], {}), queryParams, fragment);
	const position = findStartingPositionForTargetGroup(nav, root, relativeTo);
	const newSegmentGroup = position.processChildren ? updateSegmentGroupChildren(position.segmentGroup, position.index, nav.commands) : updateSegmentGroup(position.segmentGroup, position.index, nav.commands);
	return tree(root, position.segmentGroup, newSegmentGroup, queryParams, fragment);
}
function isMatrixParams(command) {
	return typeof command === "object" && command != null && !command.outlets && !command.segmentPath;
}
/**
* Determines if a given command has an `outlets` map. When we encounter a command
* with an outlets k/v map, we need to apply each outlet individually to the existing segment.
*/
function isCommandWithOutlets(command) {
	return typeof command === "object" && command != null && command.outlets;
}
function tree(oldRoot, oldSegmentGroup, newSegmentGroup, queryParams, fragment) {
	let qp = {};
	if (queryParams) Object.entries(queryParams).forEach(([name, value]) => {
		qp[name] = Array.isArray(value) ? value.map((v) => `${v}`) : `${value}`;
	});
	let rootCandidate;
	if (oldRoot === oldSegmentGroup) rootCandidate = newSegmentGroup;
	else rootCandidate = replaceSegment(oldRoot, oldSegmentGroup, newSegmentGroup);
	return new UrlTree(createRoot(squashSegmentGroup(rootCandidate)), qp, fragment);
}
/**
* Replaces the `oldSegment` which is located in some child of the `current` with the `newSegment`.
* This also has the effect of creating new `UrlSegmentGroup` copies to update references. This
* shouldn't be necessary but the fallback logic for an invalid ActivatedRoute in the creation uses
* the Router's current url tree. If we don't create new segment groups, we end up modifying that
* value.
*/
function replaceSegment(current, oldSegment, newSegment) {
	const children = {};
	Object.entries(current.children).forEach(([outletName, c]) => {
		if (c === oldSegment) children[outletName] = newSegment;
		else children[outletName] = replaceSegment(c, oldSegment, newSegment);
	});
	return new UrlSegmentGroup(current.segments, children);
}
var Navigation = class {
	isAbsolute;
	numberOfDoubleDots;
	commands;
	constructor(isAbsolute, numberOfDoubleDots, commands) {
		this.isAbsolute = isAbsolute;
		this.numberOfDoubleDots = numberOfDoubleDots;
		this.commands = commands;
		if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) throw new __mf_207(4003, false);
		const cmdWithOutlet = commands.find(isCommandWithOutlets);
		if (cmdWithOutlet && cmdWithOutlet !== last(commands)) throw new __mf_207(4004, false);
	}
	toRoot() {
		return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/";
	}
};
/** Transforms commands to a normalized `Navigation` */
function computeNavigation(commands) {
	if (typeof commands[0] === "string" && commands.length === 1 && commands[0] === "/") return new Navigation(true, 0, commands);
	let numberOfDoubleDots = 0;
	let isAbsolute = false;
	const res = commands.reduce((res, cmd, cmdIdx) => {
		if (typeof cmd === "object" && cmd != null) {
			if (cmd.outlets) {
				const outlets = {};
				Object.entries(cmd.outlets).forEach(([name, commands]) => {
					outlets[name] = typeof commands === "string" ? commands.split("/") : commands;
				});
				return [...res, { outlets }];
			}
			if (cmd.segmentPath) return [...res, cmd.segmentPath];
		}
		if (!(typeof cmd === "string")) return [...res, cmd];
		if (cmdIdx === 0) {
			cmd.split("/").forEach((urlPart, partIndex) => {
				if (partIndex == 0 && urlPart === ".");
				else if (partIndex == 0 && urlPart === "") isAbsolute = true;
				else if (urlPart === "..") numberOfDoubleDots++;
				else if (urlPart != "") res.push(urlPart);
			});
			return res;
		}
		return [...res, cmd];
	}, []);
	return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
var Position = class {
	segmentGroup;
	processChildren;
	index;
	constructor(segmentGroup, processChildren, index) {
		this.segmentGroup = segmentGroup;
		this.processChildren = processChildren;
		this.index = index;
	}
};
function findStartingPositionForTargetGroup(nav, root, target) {
	if (nav.isAbsolute) return new Position(root, true, 0);
	if (!target) return new Position(root, false, NaN);
	if (target.parent === null) return new Position(target, true, 0);
	const modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
	return createPositionApplyingDoubleDots(target, target.segments.length - 1 + modifier, nav.numberOfDoubleDots);
}
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
	let g = group;
	let ci = index;
	let dd = numberOfDoubleDots;
	while (dd > ci) {
		dd -= ci;
		g = g.parent;
		if (!g) throw new __mf_207(4005, false);
		ci = g.segments.length;
	}
	return new Position(g, false, ci - dd);
}
function getOutlets(commands) {
	if (isCommandWithOutlets(commands[0])) return commands[0].outlets;
	return { [PRIMARY_OUTLET]: commands };
}
function updateSegmentGroup(segmentGroup, startIndex, commands) {
	segmentGroup ??= new UrlSegmentGroup([], {});
	if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
	const m = prefixedWith(segmentGroup, startIndex, commands);
	const slicedCommands = commands.slice(m.commandIndex);
	if (m.match && m.pathIndex < segmentGroup.segments.length) {
		const g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
		g.children[PRIMARY_OUTLET] = new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
		return updateSegmentGroupChildren(g, 0, slicedCommands);
	} else if (m.match && slicedCommands.length === 0) return new UrlSegmentGroup(segmentGroup.segments, {});
	else if (m.match && !segmentGroup.hasChildren()) return createNewSegmentGroup(segmentGroup, startIndex, commands);
	else if (m.match) return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
	else return createNewSegmentGroup(segmentGroup, startIndex, commands);
}
function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
	if (commands.length === 0) return new UrlSegmentGroup(segmentGroup.segments, {});
	else {
		const outlets = getOutlets(commands);
		const children = {};
		if (Object.keys(outlets).some((o) => o !== "primary") && segmentGroup.children["primary"] && segmentGroup.numberOfChildren === 1 && segmentGroup.children["primary"].segments.length === 0) {
			const childrenOfEmptyChild = updateSegmentGroupChildren(segmentGroup.children[PRIMARY_OUTLET], startIndex, commands);
			return new UrlSegmentGroup(segmentGroup.segments, childrenOfEmptyChild.children);
		}
		Object.entries(outlets).forEach(([outlet, commands]) => {
			if (typeof commands === "string") commands = [commands];
			if (commands !== null) children[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
		});
		Object.entries(segmentGroup.children).forEach(([childOutlet, child]) => {
			if (outlets[childOutlet] === void 0) children[childOutlet] = child;
		});
		return new UrlSegmentGroup(segmentGroup.segments, children);
	}
}
function prefixedWith(segmentGroup, startIndex, commands) {
	let currentCommandIndex = 0;
	let currentPathIndex = startIndex;
	const noMatch = {
		match: false,
		pathIndex: 0,
		commandIndex: 0
	};
	while (currentPathIndex < segmentGroup.segments.length) {
		if (currentCommandIndex >= commands.length) return noMatch;
		const path = segmentGroup.segments[currentPathIndex];
		const command = commands[currentCommandIndex];
		if (isCommandWithOutlets(command)) break;
		const curr = `${command}`;
		const next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
		if (currentPathIndex > 0 && curr === void 0) break;
		if (curr && next && typeof next === "object" && next.outlets === void 0) {
			if (!compare(curr, next, path)) return noMatch;
			currentCommandIndex += 2;
		} else {
			if (!compare(curr, {}, path)) return noMatch;
			currentCommandIndex++;
		}
		currentPathIndex++;
	}
	return {
		match: true,
		pathIndex: currentPathIndex,
		commandIndex: currentCommandIndex
	};
}
function createNewSegmentGroup(segmentGroup, startIndex, commands) {
	const paths = segmentGroup.segments.slice(0, startIndex);
	let i = 0;
	while (i < commands.length) {
		const command = commands[i];
		if (isCommandWithOutlets(command)) return new UrlSegmentGroup(paths, createNewSegmentChildren(command.outlets));
		if (i === 0 && isMatrixParams(commands[0])) {
			const p = segmentGroup.segments[startIndex];
			paths.push(new UrlSegment(p.path, stringify(commands[0])));
			i++;
			continue;
		}
		const curr = isCommandWithOutlets(command) ? command.outlets[PRIMARY_OUTLET] : `${command}`;
		const next = i < commands.length - 1 ? commands[i + 1] : null;
		if (curr && next && isMatrixParams(next)) {
			paths.push(new UrlSegment(curr, stringify(next)));
			i += 2;
		} else {
			paths.push(new UrlSegment(curr, {}));
			i++;
		}
	}
	return new UrlSegmentGroup(paths, {});
}
function createNewSegmentChildren(outlets) {
	const children = {};
	Object.entries(outlets).forEach(([outlet, commands]) => {
		if (typeof commands === "string") commands = [commands];
		if (commands !== null) children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
	});
	return children;
}
function stringify(params) {
	const res = {};
	Object.entries(params).forEach(([k, v]) => res[k] = `${v}`);
	return res;
}
function compare(path, params, segment) {
	return path == segment.path && shallowEqual(params, segment.parameters);
}
var IMPERATIVE_NAVIGATION = "imperative";
/**
* Identifies the type of a router event.
*
* @see [Router Lifecycle and Events](guide/routing/lifecycle-and-events)
*
* @publicApi
*/
var EventType = /* @__PURE__ */ function(EventType) {
	EventType[EventType["NavigationStart"] = 0] = "NavigationStart";
	EventType[EventType["NavigationEnd"] = 1] = "NavigationEnd";
	EventType[EventType["NavigationCancel"] = 2] = "NavigationCancel";
	EventType[EventType["NavigationError"] = 3] = "NavigationError";
	EventType[EventType["RoutesRecognized"] = 4] = "RoutesRecognized";
	EventType[EventType["ResolveStart"] = 5] = "ResolveStart";
	EventType[EventType["ResolveEnd"] = 6] = "ResolveEnd";
	EventType[EventType["GuardsCheckStart"] = 7] = "GuardsCheckStart";
	EventType[EventType["GuardsCheckEnd"] = 8] = "GuardsCheckEnd";
	EventType[EventType["RouteConfigLoadStart"] = 9] = "RouteConfigLoadStart";
	EventType[EventType["RouteConfigLoadEnd"] = 10] = "RouteConfigLoadEnd";
	EventType[EventType["ChildActivationStart"] = 11] = "ChildActivationStart";
	EventType[EventType["ChildActivationEnd"] = 12] = "ChildActivationEnd";
	EventType[EventType["ActivationStart"] = 13] = "ActivationStart";
	EventType[EventType["ActivationEnd"] = 14] = "ActivationEnd";
	EventType[EventType["Scroll"] = 15] = "Scroll";
	EventType[EventType["NavigationSkipped"] = 16] = "NavigationSkipped";
	return EventType;
}(EventType || {});
/**
* Base for events the router goes through, as opposed to events tied to a specific
* route. Fired one time for any given navigation.
*
* The following code shows how a class subscribes to router events.
*
* ```ts
* import {Event, RouterEvent, Router} from '@angular/router';
*
* class MyService {
*   constructor(public router: Router) {
*     router.events.pipe(
*        filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
*     ).subscribe((e: RouterEvent) => {
*       // Do something
*     });
*   }
* }
* ```
*
* @see {@link Event}
* @see [Router events summary](guide/routing/router-reference#router-events)
* @publicApi
*/
var RouterEvent = class {
	id;
	url;
	constructor(id, url) {
		this.id = id;
		this.url = url;
	}
};
/**
* An event triggered when a navigation starts.
*
* @publicApi
*/
var NavigationStart = class extends RouterEvent {
	type = EventType.NavigationStart;
	/**
	* Identifies the call or event that triggered the navigation.
	* An `imperative` trigger is a call to `router.navigateByUrl()` or `router.navigate()`.
	*
	* @see {@link NavigationEnd}
	* @see {@link NavigationCancel}
	* @see {@link NavigationError}
	*/
	navigationTrigger;
	/**
	* The navigation state that was previously supplied to the `pushState` call,
	* when the navigation is triggered by a `popstate` event. Otherwise null.
	*
	* The state object is defined by `NavigationExtras`, and contains any
	* developer-defined state value, as well as a unique ID that
	* the router assigns to every router transition/navigation.
	*
	* From the perspective of the router, the router never "goes back".
	* When the user clicks on the back button in the browser,
	* a new navigation ID is created.
	*
	* Use the ID in this previous-state object to differentiate between a newly created
	* state and one returned to by a `popstate` event, so that you can restore some
	* remembered state, such as scroll position.
	*
	*/
	restoredState;
	constructor(id, url, navigationTrigger = "imperative", restoredState = null) {
		super(id, url);
		this.navigationTrigger = navigationTrigger;
		this.restoredState = restoredState;
	}
	/** @docsNotRequired */
	toString() {
		return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
	}
};
/**
* An event triggered when a navigation ends successfully.
*
* @see {@link NavigationStart}
* @see {@link NavigationCancel}
* @see {@link NavigationError}
*
* @publicApi
*/
var NavigationEnd = class extends RouterEvent {
	urlAfterRedirects;
	type = EventType.NavigationEnd;
	constructor(id, url, urlAfterRedirects) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
	}
	/** @docsNotRequired */
	toString() {
		return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
	}
};
/**
* A code for the `NavigationCancel` event of the `Router` to indicate the
* reason a navigation failed.
*
* @publicApi
*/
var NavigationCancellationCode = /* @__PURE__ */ function(NavigationCancellationCode) {
	/**
	* A navigation failed because a guard returned a `UrlTree` to redirect.
	*/
	NavigationCancellationCode[NavigationCancellationCode["Redirect"] = 0] = "Redirect";
	/**
	* A navigation failed because a more recent navigation started.
	*/
	NavigationCancellationCode[NavigationCancellationCode["SupersededByNewNavigation"] = 1] = "SupersededByNewNavigation";
	/**
	* A navigation failed because one of the resolvers completed without emitting a value.
	*/
	NavigationCancellationCode[NavigationCancellationCode["NoDataFromResolver"] = 2] = "NoDataFromResolver";
	/**
	* A navigation failed because a guard returned `false`.
	*/
	NavigationCancellationCode[NavigationCancellationCode["GuardRejected"] = 3] = "GuardRejected";
	/**
	* A navigation was aborted by the `Navigation.abort` function.
	*
	* @see {@link Navigation}
	*/
	NavigationCancellationCode[NavigationCancellationCode["Aborted"] = 4] = "Aborted";
	return NavigationCancellationCode;
}(NavigationCancellationCode || {});
/**
* A code for the `NavigationSkipped` event of the `Router` to indicate the
* reason a navigation was skipped.
*
* @publicApi
*/
var NavigationSkippedCode = /* @__PURE__ */ function(NavigationSkippedCode) {
	/**
	* A navigation was skipped because the navigation URL was the same as the current Router URL.
	*/
	NavigationSkippedCode[NavigationSkippedCode["IgnoredSameUrlNavigation"] = 0] = "IgnoredSameUrlNavigation";
	/**
	* A navigation was skipped because the configured `UrlHandlingStrategy` return `false` for both
	* the current Router URL and the target of the navigation.
	*
	* @see {@link UrlHandlingStrategy}
	*/
	NavigationSkippedCode[NavigationSkippedCode["IgnoredByUrlHandlingStrategy"] = 1] = "IgnoredByUrlHandlingStrategy";
	return NavigationSkippedCode;
}(NavigationSkippedCode || {});
/**
* An event triggered when a navigation is canceled, directly or indirectly.
* This can happen for several reasons including when a route guard
* returns `false` or initiates a redirect by returning a `UrlTree`.
*
* @see {@link NavigationStart}
* @see {@link NavigationEnd}
* @see {@link NavigationError}
*
* @publicApi
*/
var NavigationCancel = class extends RouterEvent {
	reason;
	code;
	type = EventType.NavigationCancel;
	constructor(id, url, reason, code) {
		super(id, url);
		this.reason = reason;
		this.code = code;
	}
	/** @docsNotRequired */
	toString() {
		return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
	}
};
/**
* An event triggered when a navigation is skipped.
* This can happen for a couple reasons including onSameUrlHandling
* is set to `ignore` and the navigation URL is not different than the
* current state.
*
* @publicApi
*/
var NavigationSkipped = class extends RouterEvent {
	reason;
	code;
	type = EventType.NavigationSkipped;
	constructor(id, url, reason, code) {
		super(id, url);
		this.reason = reason;
		this.code = code;
	}
};
/**
* An event triggered when a navigation fails due to an unexpected error.
*
* @see {@link NavigationStart}
* @see {@link NavigationEnd}
* @see {@link NavigationCancel}
*
* @publicApi
*/
var NavigationError = class extends RouterEvent {
	error;
	target;
	type = EventType.NavigationError;
	constructor(id, url, error, target) {
		super(id, url);
		this.error = error;
		this.target = target;
	}
	/** @docsNotRequired */
	toString() {
		return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
	}
};
/**
* An event triggered when routes are recognized.
*
* @publicApi
*/
var RoutesRecognized = class extends RouterEvent {
	urlAfterRedirects;
	state;
	type = EventType.RoutesRecognized;
	constructor(id, url, urlAfterRedirects, state) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
		this.state = state;
	}
	/** @docsNotRequired */
	toString() {
		return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
	}
};
/**
* An event triggered at the start of the Guard phase of routing.
*
* @see {@link GuardsCheckEnd}
*
* @publicApi
*/
var GuardsCheckStart = class extends RouterEvent {
	urlAfterRedirects;
	state;
	type = EventType.GuardsCheckStart;
	constructor(id, url, urlAfterRedirects, state) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
		this.state = state;
	}
	toString() {
		return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
	}
};
/**
* An event triggered at the end of the Guard phase of routing.
*
* @see {@link GuardsCheckStart}
*
* @publicApi
*/
var GuardsCheckEnd = class extends RouterEvent {
	urlAfterRedirects;
	state;
	shouldActivate;
	type = EventType.GuardsCheckEnd;
	constructor(id, url, urlAfterRedirects, state, shouldActivate) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
		this.state = state;
		this.shouldActivate = shouldActivate;
	}
	toString() {
		return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
	}
};
/**
* An event triggered at the start of the Resolve phase of routing.
*
* Runs in the "resolve" phase whether or not there is anything to resolve.
* In future, may change to only run when there are things to be resolved.
*
* @see {@link ResolveEnd}
*
* @publicApi
*/
var ResolveStart = class extends RouterEvent {
	urlAfterRedirects;
	state;
	type = EventType.ResolveStart;
	constructor(id, url, urlAfterRedirects, state) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
		this.state = state;
	}
	toString() {
		return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
	}
};
/**
* An event triggered at the end of the Resolve phase of routing.
* @see {@link ResolveStart}
*
* @publicApi
*/
var ResolveEnd = class extends RouterEvent {
	urlAfterRedirects;
	state;
	type = EventType.ResolveEnd;
	constructor(id, url, urlAfterRedirects, state) {
		super(id, url);
		this.urlAfterRedirects = urlAfterRedirects;
		this.state = state;
	}
	toString() {
		return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
	}
};
/**
* An event triggered before lazy loading a route configuration.
*
* @see {@link RouteConfigLoadEnd}
*
* @publicApi
*/
var RouteConfigLoadStart = class {
	route;
	type = EventType.RouteConfigLoadStart;
	constructor(route) {
		this.route = route;
	}
	toString() {
		return `RouteConfigLoadStart(path: ${this.route.path})`;
	}
};
/**
* An event triggered when a route has been lazy loaded.
*
* @see {@link RouteConfigLoadStart}
*
* @publicApi
*/
var RouteConfigLoadEnd = class {
	route;
	type = EventType.RouteConfigLoadEnd;
	constructor(route) {
		this.route = route;
	}
	toString() {
		return `RouteConfigLoadEnd(path: ${this.route.path})`;
	}
};
/**
* An event triggered at the start of the child-activation
* part of the Resolve phase of routing.
* @see {@link ChildActivationEnd}
* @see {@link ResolveStart}
*
* @publicApi
*/
var ChildActivationStart = class {
	snapshot;
	type = EventType.ChildActivationStart;
	constructor(snapshot) {
		this.snapshot = snapshot;
	}
	toString() {
		return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`;
	}
};
/**
* An event triggered at the end of the child-activation part
* of the Resolve phase of routing.
* @see {@link ChildActivationStart}
* @see {@link ResolveStart}
* @publicApi
*/
var ChildActivationEnd = class {
	snapshot;
	type = EventType.ChildActivationEnd;
	constructor(snapshot) {
		this.snapshot = snapshot;
	}
	toString() {
		return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`;
	}
};
/**
* An event triggered at the start of the activation part
* of the Resolve phase of routing.
* @see {@link ActivationEnd}
* @see {@link ResolveStart}
*
* @publicApi
*/
var ActivationStart = class {
	snapshot;
	type = EventType.ActivationStart;
	constructor(snapshot) {
		this.snapshot = snapshot;
	}
	toString() {
		return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`;
	}
};
/**
* An event triggered at the end of the activation part
* of the Resolve phase of routing.
* @see {@link ActivationStart}
* @see {@link ResolveStart}
*
* @publicApi
*/
var ActivationEnd = class {
	snapshot;
	type = EventType.ActivationEnd;
	constructor(snapshot) {
		this.snapshot = snapshot;
	}
	toString() {
		return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`;
	}
};
/**
* An event triggered by scrolling.
*
* @publicApi
*/
var Scroll = class {
	routerEvent;
	position;
	anchor;
	type = EventType.Scroll;
	constructor(routerEvent, position, anchor) {
		this.routerEvent = routerEvent;
		this.position = position;
		this.anchor = anchor;
	}
	toString() {
		const pos = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
		return `Scroll(anchor: '${this.anchor}', position: '${pos}')`;
	}
};
var BeforeActivateRoutes = class {};
var RedirectRequest = class {
	url;
	navigationBehaviorOptions;
	constructor(url, navigationBehaviorOptions) {
		this.url = url;
		this.navigationBehaviorOptions = navigationBehaviorOptions;
	}
};
function isPublicRouterEvent(e) {
	return !(e instanceof BeforeActivateRoutes) && !(e instanceof RedirectRequest);
}
/**
* Creates an `EnvironmentInjector` if the `Route` has providers and one does not already exist
* and returns the injector. Otherwise, if the `Route` does not have `providers`, returns the
* `currentInjector`.
*
* @param route The route that might have providers
* @param currentInjector The parent injector of the `Route`
*/
function getOrCreateRouteInjectorIfNeeded(route, currentInjector) {
	if (route.providers && !route._injector) route._injector = __mf_106(route.providers, currentInjector, `Route: ${route.path}`);
	return route._injector ?? currentInjector;
}
/** Returns the `route.outlet` or PRIMARY_OUTLET if none exists. */
function getOutlet(route) {
	return route.outlet || "primary";
}
/**
* Sorts the `routes` such that the ones with an outlet matching `outletName` come first.
* The order of the configs is otherwise preserved.
*/
function sortByMatchingOutlets(routes, outletName) {
	const sortedConfig = routes.filter((r) => getOutlet(r) === outletName);
	sortedConfig.push(...routes.filter((r) => getOutlet(r) !== outletName));
	return sortedConfig;
}
/**
* Gets the first injector in the snapshot's parent tree.
*
* If the `Route` has a static list of providers, the returned injector will be the one created from
* those. If it does not exist, the returned injector may come from the parents, which may be from a
* loaded config or their static providers.
*
* Returns `null` if there is neither this nor any parents have a stored injector.
*
* Generally used for retrieving the injector to use for getting tokens for guards/resolvers and
* also used for getting the correct injector to use for creating components.
*/
function getClosestRouteInjector(snapshot) {
	if (!snapshot) return null;
	if (snapshot.routeConfig?._injector) return snapshot.routeConfig._injector;
	for (let s = snapshot.parent; s; s = s.parent) {
		const route = s.routeConfig;
		if (route?._loadedInjector) return route._loadedInjector;
		if (route?._injector) return route._injector;
	}
	return null;
}
/**
* Store contextual information about a `RouterOutlet`
*
* @publicApi
*/
var OutletContext = class {
	rootInjector;
	outlet = null;
	route = null;
	children;
	attachRef = null;
	get injector() {
		return getClosestRouteInjector(this.route?.snapshot) ?? this.rootInjector;
	}
	constructor(rootInjector) {
		this.rootInjector = rootInjector;
		this.children = new ChildrenOutletContexts(this.rootInjector);
	}
};
/**
* Store contextual information about the children (= nested) `RouterOutlet`
*
* @publicApi
*/
var ChildrenOutletContexts = /* @__PURE__ */ (() => {
	class ChildrenOutletContexts {
		rootInjector;
		contexts = /* @__PURE__ */ new Map();
		/** @docs-private */
		constructor(rootInjector) {
			this.rootInjector = rootInjector;
		}
		/** Called when a `RouterOutlet` directive is instantiated */
		onChildOutletCreated(childName, outlet) {
			const context = this.getOrCreateContext(childName);
			context.outlet = outlet;
			this.contexts.set(childName, context);
		}
		/**
		* Called when a `RouterOutlet` directive is destroyed.
		* We need to keep the context as the outlet could be destroyed inside a NgIf and might be
		* re-created later.
		*/
		onChildOutletDestroyed(childName) {
			const context = this.getContext(childName);
			if (context) {
				context.outlet = null;
				context.attachRef = null;
			}
		}
		/**
		* Called when the corresponding route is deactivated during navigation.
		* Because the component get destroyed, all children outlet are destroyed.
		*/
		onOutletDeactivated() {
			const contexts = this.contexts;
			this.contexts = /* @__PURE__ */ new Map();
			return contexts;
		}
		onOutletReAttached(contexts) {
			this.contexts = contexts;
		}
		getOrCreateContext(childName) {
			let context = this.getContext(childName);
			if (!context) {
				context = new OutletContext(this.rootInjector);
				this.contexts.set(childName, context);
			}
			return context;
		}
		getContext(childName) {
			return this.contexts.get(childName) || null;
		}
		static ɵfac = function ChildrenOutletContexts_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ChildrenOutletContexts)(__mf_401(__mf_32$1));
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: ChildrenOutletContexts,
			factory: ChildrenOutletContexts.ɵfac,
			providedIn: "root"
		});
	}
	return ChildrenOutletContexts;
})();
var Tree = class {
	/** @internal */
	_root;
	constructor(root) {
		this._root = root;
	}
	get root() {
		return this._root.value;
	}
	/**
	* @internal
	*/
	parent(t) {
		const p = this.pathFromRoot(t);
		return p.length > 1 ? p[p.length - 2] : null;
	}
	/**
	* @internal
	*/
	children(t) {
		const n = findNode(t, this._root);
		return n ? n.children.map((t) => t.value) : [];
	}
	/**
	* @internal
	*/
	firstChild(t) {
		const n = findNode(t, this._root);
		return n && n.children.length > 0 ? n.children[0].value : null;
	}
	/**
	* @internal
	*/
	siblings(t) {
		const p = findPath(t, this._root);
		if (p.length < 2) return [];
		return p[p.length - 2].children.map((c) => c.value).filter((cc) => cc !== t);
	}
	/**
	* @internal
	*/
	pathFromRoot(t) {
		return findPath(t, this._root).map((s) => s.value);
	}
};
function findNode(value, node) {
	if (value === node.value) return node;
	for (const child of node.children) {
		const node = findNode(value, child);
		if (node) return node;
	}
	return null;
}
function findPath(value, node) {
	if (value === node.value) return [node];
	for (const child of node.children) {
		const path = findPath(value, child);
		if (path.length) {
			path.unshift(node);
			return path;
		}
	}
	return [];
}
var TreeNode = class {
	value;
	children;
	constructor(value, children) {
		this.value = value;
		this.children = children;
	}
	toString() {
		return `TreeNode(${this.value})`;
	}
};
function nodeChildrenAsMap(node) {
	const map = {};
	if (node) node.children.forEach((child) => map[child.value.outlet] = child);
	return map;
}
/**
* Represents the state of the router as a tree of activated routes.
*
* @usageNotes
*
* Every node in the route tree is an `ActivatedRoute` instance
* that knows about the "consumed" URL segments, the extracted parameters,
* and the resolved data.
* Use the `ActivatedRoute` properties to traverse the tree from any node.
*
* The following fragment shows how a component gets the root node
* of the current state to establish its own route tree:
*
* ```ts
* @Component({templateUrl:'template.html'})
* class MyComponent {
*   constructor(router: Router) {
*     const state: RouterState = router.routerState;
*     const root: ActivatedRoute = state.root;
*     const child = root.firstChild;
*     const id: Observable<string> = child.params.map(p => p.id);
*     //...
*   }
* }
* ```
*
* @see {@link ActivatedRoute}
* @see [Getting route information](guide/routing/common-router-tasks#getting-route-information)
*
* @publicApi
*/
var RouterState = class extends Tree {
	snapshot;
	/** @internal */
	constructor(root, snapshot) {
		super(root);
		this.snapshot = snapshot;
		setRouterState(this, root);
	}
	toString() {
		return this.snapshot.toString();
	}
};
function createEmptyState(rootComponent) {
	const snapshot = createEmptyStateSnapshot(rootComponent);
	const emptyUrl = new __mf_5$1([new UrlSegment("", {})]);
	const emptyParams = new __mf_5$1({});
	const emptyData = new __mf_5$1({});
	const activated = new ActivatedRoute(emptyUrl, emptyParams, new __mf_5$1({}), new __mf_5$1(""), emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
	activated.snapshot = snapshot.root;
	return new RouterState(new TreeNode(activated, []), snapshot);
}
function createEmptyStateSnapshot(rootComponent) {
	return new RouterStateSnapshot("", new TreeNode(new ActivatedRouteSnapshot([], {}, {}, "", {}, PRIMARY_OUTLET, rootComponent, null, {}), []));
}
/**
* Provides access to information about a route associated with a component
* that is loaded in an outlet.
* Use to traverse the `RouterState` tree and extract information from nodes.
*
* The following example shows how to construct a component using information from a
* currently activated route.
*
* Note: the observables in this class only emit when the current and previous values differ based
* on shallow equality. For example, changing deeply nested properties in resolved `data` will not
* cause the `ActivatedRoute.data` `Observable` to emit a new value.
*
* {@example router/activated-route/module.ts region="activated-route"}
*
* @see [Getting route information](guide/routing/common-router-tasks#getting-route-information)
*
* @publicApi
*/
var ActivatedRoute = class {
	urlSubject;
	paramsSubject;
	queryParamsSubject;
	fragmentSubject;
	dataSubject;
	outlet;
	component;
	/** The current snapshot of this route */
	snapshot;
	/** @internal */
	_futureSnapshot;
	/** @internal */
	_routerState;
	/** @internal */
	_paramMap;
	/** @internal */
	_queryParamMap;
	/** An Observable of the resolved route title */
	title;
	/** An observable of the URL segments matched by this route. */
	url;
	/** An observable of the matrix parameters scoped to this route. */
	params;
	/** An observable of the query parameters shared by all the routes. */
	queryParams;
	/** An observable of the URL fragment shared by all the routes. */
	fragment;
	/** An observable of the static and resolved data of this route. */
	data;
	/** @internal */
	constructor(urlSubject, paramsSubject, queryParamsSubject, fragmentSubject, dataSubject, outlet, component, futureSnapshot) {
		this.urlSubject = urlSubject;
		this.paramsSubject = paramsSubject;
		this.queryParamsSubject = queryParamsSubject;
		this.fragmentSubject = fragmentSubject;
		this.dataSubject = dataSubject;
		this.outlet = outlet;
		this.component = component;
		this._futureSnapshot = futureSnapshot;
		this.title = this.dataSubject?.pipe(map((d) => d[RouteTitleKey])) ?? __mf_52$1(void 0);
		this.url = urlSubject;
		this.params = paramsSubject;
		this.queryParams = queryParamsSubject;
		this.fragment = fragmentSubject;
		this.data = dataSubject;
	}
	/** The configuration used to match this route. */
	get routeConfig() {
		return this._futureSnapshot.routeConfig;
	}
	/** The root of the router state. */
	get root() {
		return this._routerState.root;
	}
	/** The parent of this route in the router state tree. */
	get parent() {
		return this._routerState.parent(this);
	}
	/** The first child of this route in the router state tree. */
	get firstChild() {
		return this._routerState.firstChild(this);
	}
	/** The children of this route in the router state tree. */
	get children() {
		return this._routerState.children(this);
	}
	/** The path from the root of the router state tree to this route. */
	get pathFromRoot() {
		return this._routerState.pathFromRoot(this);
	}
	/**
	* An Observable that contains a map of the required and optional parameters
	* specific to the route.
	* The map supports retrieving single and multiple values from the same parameter.
	*/
	get paramMap() {
		this._paramMap ??= this.params.pipe(map((p) => convertToParamMap(p)));
		return this._paramMap;
	}
	/**
	* An Observable that contains a map of the query parameters available to all routes.
	* The map supports retrieving single and multiple values from the query parameter.
	*/
	get queryParamMap() {
		this._queryParamMap ??= this.queryParams.pipe(map((p) => convertToParamMap(p)));
		return this._queryParamMap;
	}
	toString() {
		return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
	}
};
/**
* Returns the inherited params, data, and resolve for a given route.
*
* By default, we do not inherit parent data unless the current route is path-less or the parent
* route is component-less.
*/
function getInherited(route, parent, paramsInheritanceStrategy = "emptyOnly") {
	let inherited;
	const { routeConfig } = route;
	if (parent !== null && (paramsInheritanceStrategy === "always" || routeConfig?.path === "" || !parent.component && !parent.routeConfig?.loadComponent)) inherited = {
		params: {
			...parent.params,
			...route.params
		},
		data: {
			...parent.data,
			...route.data
		},
		resolve: {
			...route.data,
			...parent.data,
			...routeConfig?.data,
			...route._resolvedData
		}
	};
	else inherited = {
		params: { ...route.params },
		data: { ...route.data },
		resolve: {
			...route.data,
			...route._resolvedData ?? {}
		}
	};
	if (routeConfig && hasStaticTitle(routeConfig)) inherited.resolve[RouteTitleKey] = routeConfig.title;
	return inherited;
}
/**
* @description
*
* Contains the information about a route associated with a component loaded in an
* outlet at a particular moment in time. ActivatedRouteSnapshot can also be used to
* traverse the router state tree.
*
* The following example initializes a component with route information extracted
* from the snapshot of the root node at the time of creation.
*
* ```ts
* @Component({templateUrl:'./my-component.html'})
* class MyComponent {
*   constructor(route: ActivatedRoute) {
*     const id: string = route.snapshot.params.id;
*     const url: string = route.snapshot.url.join('');
*     const user = route.snapshot.data.user;
*   }
* }
* ```
*
* @see [Understanding route snapshots](guide/routing/read-route-state#understanding-route-snapshots)
*
* @publicApi
*/
var ActivatedRouteSnapshot = class {
	url;
	params;
	queryParams;
	fragment;
	data;
	outlet;
	component;
	/** The configuration used to match this route **/
	routeConfig;
	/** @internal */
	_resolve;
	/** @internal */
	_resolvedData;
	/** @internal */
	_routerState;
	/** @internal */
	_paramMap;
	/** @internal */
	_queryParamMap;
	/** The resolved route title */
	get title() {
		return this.data?.[RouteTitleKey];
	}
	/** @internal */
	constructor(url, params, queryParams, fragment, data, outlet, component, routeConfig, resolve) {
		this.url = url;
		this.params = params;
		this.queryParams = queryParams;
		this.fragment = fragment;
		this.data = data;
		this.outlet = outlet;
		this.component = component;
		this.routeConfig = routeConfig;
		this._resolve = resolve;
	}
	/** The root of the router state */
	get root() {
		return this._routerState.root;
	}
	/** The parent of this route in the router state tree */
	get parent() {
		return this._routerState.parent(this);
	}
	/** The first child of this route in the router state tree */
	get firstChild() {
		return this._routerState.firstChild(this);
	}
	/** The children of this route in the router state tree */
	get children() {
		return this._routerState.children(this);
	}
	/** The path from the root of the router state tree to this route */
	get pathFromRoot() {
		return this._routerState.pathFromRoot(this);
	}
	get paramMap() {
		this._paramMap ??= convertToParamMap(this.params);
		return this._paramMap;
	}
	get queryParamMap() {
		this._queryParamMap ??= convertToParamMap(this.queryParams);
		return this._queryParamMap;
	}
	toString() {
		return `Route(url:'${this.url.map((segment) => segment.toString()).join("/")}', path:'${this.routeConfig ? this.routeConfig.path : ""}')`;
	}
};
/**
* @description
*
* Represents the state of the router at a moment in time.
*
* This is a tree of activated route snapshots. Every node in this tree knows about
* the "consumed" URL segments, the extracted parameters, and the resolved data.
*
* The following example shows how a component is initialized with information
* from the snapshot of the root node's state at the time of creation.
*
* ```ts
* @Component({templateUrl:'template.html'})
* class MyComponent {
*   constructor(router: Router) {
*     const state: RouterState = router.routerState;
*     const snapshot: RouterStateSnapshot = state.snapshot;
*     const root: ActivatedRouteSnapshot = snapshot.root;
*     const child = root.firstChild;
*     const id: Observable<string> = child.params.map(p => p.id);
*     //...
*   }
* }
* ```
*
* @publicApi
*/
var RouterStateSnapshot = class extends Tree {
	url;
	/** @internal */
	constructor(url, root) {
		super(root);
		this.url = url;
		setRouterState(this, root);
	}
	toString() {
		return serializeNode(this._root);
	}
};
function setRouterState(state, node) {
	node.value._routerState = state;
	node.children.forEach((c) => setRouterState(state, c));
}
function serializeNode(node) {
	const c = node.children.length > 0 ? ` { ${node.children.map(serializeNode).join(", ")} } ` : "";
	return `${node.value}${c}`;
}
/**
* The expectation is that the activate route is created with the right set of parameters.
* So we push new values into the observables only when they are not the initial values.
* And we detect that by checking if the snapshot field is set.
*/
function advanceActivatedRoute(route) {
	if (route.snapshot) {
		const currentSnapshot = route.snapshot;
		const nextSnapshot = route._futureSnapshot;
		route.snapshot = nextSnapshot;
		if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) route.queryParamsSubject.next(nextSnapshot.queryParams);
		if (currentSnapshot.fragment !== nextSnapshot.fragment) route.fragmentSubject.next(nextSnapshot.fragment);
		if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) route.paramsSubject.next(nextSnapshot.params);
		if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) route.urlSubject.next(nextSnapshot.url);
		if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) route.dataSubject.next(nextSnapshot.data);
	} else {
		route.snapshot = route._futureSnapshot;
		route.dataSubject.next(route._futureSnapshot.data);
	}
}
function equalParamsAndUrlSegments(a, b) {
	const equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
	const parentsMismatch = !a.parent !== !b.parent;
	return equalUrlParams && !parentsMismatch && (!a.parent || equalParamsAndUrlSegments(a.parent, b.parent));
}
function hasStaticTitle(config) {
	return typeof config.title === "string" || config.title === null;
}
/**
* An `InjectionToken` provided by the `RouterOutlet` and can be set using the `routerOutletData`
* input.
*
* When unset, this value is `null` by default.
*
* @usageNotes
*
* To set the data from the template of the component with `router-outlet`:
* ```html
* <router-outlet [routerOutletData]="{name: 'Angular'}" />
* ```
*
* To read the data in the routed component:
* ```ts
* data = inject(ROUTER_OUTLET_DATA) as Signal<{name: string}>;
* ```
*
* @publicApi
* @see [Page routerOutletData](guide/routing/show-routes-with-outlets#passing-contextual-data-to-routed-components)
*/
var ROUTER_OUTLET_DATA = /* @__PURE__ */ new __mf_43$1("");
/**
* @description
*
* Acts as a placeholder that Angular dynamically fills based on the current router state.
*
* Each outlet can have a unique name, determined by the optional `name` attribute.
* The name cannot be set or changed dynamically. If not set, default value is "primary".
*
* ```html
* <router-outlet></router-outlet>
* <router-outlet name='left'></router-outlet>
* <router-outlet name='right'></router-outlet>
* ```
*
* Named outlets can be the targets of secondary routes.
* The `Route` object for a secondary route has an `outlet` property to identify the target outlet:
*
* `{path: <base-path>, component: <component>, outlet: <target_outlet_name>}`
*
* Using named outlets and secondary routes, you can target multiple outlets in
* the same `RouterLink` directive.
*
* The router keeps track of separate branches in a navigation tree for each named outlet and
* generates a representation of that tree in the URL.
* The URL for a secondary route uses the following syntax to specify both the primary and secondary
* routes at the same time:
*
* `http://base-path/primary-route-path(outlet-name:route-path)`
*
* A router outlet emits an activate event when a new component is instantiated,
* deactivate event when a component is destroyed.
* An attached event emits when the `RouteReuseStrategy` instructs the outlet to reattach the
* subtree, and the detached event emits when the `RouteReuseStrategy` instructs the outlet to
* detach the subtree.
*
* ```html
* <router-outlet
*   (activate)='onActivate($event)'
*   (deactivate)='onDeactivate($event)'
*   (attach)='onAttach($event)'
*   (detach)='onDetach($event)'></router-outlet>
* ```
*
* @see {@link RouterLink}
* @see {@link Route}
* @ngModule RouterModule
*
* @publicApi
*/
var RouterOutlet = /* @__PURE__ */ (() => {
	class RouterOutlet {
		activated = null;
		/** @internal */
		get activatedComponentRef() {
			return this.activated;
		}
		_activatedRoute = null;
		/**
		* The name of the outlet
		*
		*/
		name = PRIMARY_OUTLET;
		activateEvents = new __mf_34$1();
		deactivateEvents = new __mf_34$1();
		/**
		* Emits an attached component instance when the `RouteReuseStrategy` instructs to re-attach a
		* previously detached subtree.
		**/
		attachEvents = new __mf_34$1();
		/**
		* Emits a detached component instance when the `RouteReuseStrategy` instructs to detach the
		* subtree.
		*/
		detachEvents = new __mf_34$1();
		/**
		* Data that will be provided to the child injector through the `ROUTER_OUTLET_DATA` token.
		*
		* When unset, the value of the token is `undefined` by default.
		*/
		routerOutletData = __mf_123(...[]);
		parentContexts = __mf_122(ChildrenOutletContexts);
		location = __mf_122(__mf_91);
		changeDetector = __mf_122(__mf_12$1);
		inputBinder = __mf_122(INPUT_BINDER, { optional: true });
		/** @docs-private */
		supportsBindingToComponentInputs = true;
		/** @docs-private */
		ngOnChanges(changes) {
			if (changes["name"]) {
				const { firstChange, previousValue } = changes["name"];
				if (firstChange) return;
				if (this.isTrackedInParentContexts(previousValue)) {
					this.deactivate();
					this.parentContexts.onChildOutletDestroyed(previousValue);
				}
				this.initializeOutletWithName();
			}
		}
		/** @docs-private */
		ngOnDestroy() {
			if (this.isTrackedInParentContexts(this.name)) this.parentContexts.onChildOutletDestroyed(this.name);
			this.inputBinder?.unsubscribeFromRouteData(this);
		}
		isTrackedInParentContexts(outletName) {
			return this.parentContexts.getContext(outletName)?.outlet === this;
		}
		/** @docs-private */
		ngOnInit() {
			this.initializeOutletWithName();
		}
		initializeOutletWithName() {
			this.parentContexts.onChildOutletCreated(this.name, this);
			if (this.activated) return;
			const context = this.parentContexts.getContext(this.name);
			if (context?.route) if (context.attachRef) this.attach(context.attachRef, context.route);
			else this.activateWith(context.route, context.injector);
		}
		get isActivated() {
			return !!this.activated;
		}
		/**
		* @returns The currently activated component instance.
		* @throws An error if the outlet is not activated.
		*/
		get component() {
			if (!this.activated) throw new __mf_207(4012, false);
			return this.activated.instance;
		}
		get activatedRoute() {
			if (!this.activated) throw new __mf_207(4012, false);
			return this._activatedRoute;
		}
		get activatedRouteData() {
			if (this._activatedRoute) return this._activatedRoute.snapshot.data;
			return {};
		}
		/**
		* Called when the `RouteReuseStrategy` instructs to detach the subtree
		*/
		detach() {
			if (!this.activated) throw new __mf_207(4012, false);
			this.location.detach();
			const cmp = this.activated;
			this.activated = null;
			this._activatedRoute = null;
			this.detachEvents.emit(cmp.instance);
			return cmp;
		}
		/**
		* Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
		*/
		attach(ref, activatedRoute) {
			this.activated = ref;
			this._activatedRoute = activatedRoute;
			this.location.insert(ref.hostView);
			this.inputBinder?.bindActivatedRouteToOutletComponent(this);
			this.attachEvents.emit(ref.instance);
		}
		deactivate() {
			if (this.activated) {
				const c = this.component;
				this.activated.destroy();
				this.activated = null;
				this._activatedRoute = null;
				this.deactivateEvents.emit(c);
			}
		}
		activateWith(activatedRoute, environmentInjector) {
			if (this.isActivated) throw new __mf_207(4013, false);
			this._activatedRoute = activatedRoute;
			const location = this.location;
			const component = activatedRoute.snapshot.component;
			const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
			const injector = new OutletInjector(activatedRoute, childContexts, location.injector, this.routerOutletData);
			this.activated = location.createComponent(component, {
				index: location.length,
				injector,
				environmentInjector
			});
			this.changeDetector.markForCheck();
			this.inputBinder?.bindActivatedRouteToOutletComponent(this);
			this.activateEvents.emit(this.activated.instance);
		}
		static ɵfac = function RouterOutlet_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterOutlet)();
		};
		static ɵdir = /* @__PURE__ */ __mf_367({
			type: RouterOutlet,
			selectors: [["router-outlet"]],
			inputs: {
				name: "name",
				routerOutletData: [1, "routerOutletData"]
			},
			outputs: {
				activateEvents: "activate",
				deactivateEvents: "deactivate",
				attachEvents: "attach",
				detachEvents: "detach"
			},
			exportAs: ["outlet"],
			features: [__mf_323]
		});
	}
	return RouterOutlet;
})();
var OutletInjector = class {
	route;
	childContexts;
	parent;
	outletData;
	constructor(route, childContexts, parent, outletData) {
		this.route = route;
		this.childContexts = childContexts;
		this.parent = parent;
		this.outletData = outletData;
	}
	get(token, notFoundValue) {
		if (token === ActivatedRoute) return this.route;
		if (token === ChildrenOutletContexts) return this.childContexts;
		if (token === ROUTER_OUTLET_DATA) return this.outletData;
		return this.parent.get(token, notFoundValue);
	}
};
var INPUT_BINDER = /* @__PURE__ */ new __mf_43$1("");
/**
* Injectable used as a tree-shakable provider for opting in to binding router data to component
* inputs.
*
* The RouterOutlet registers itself with this service when an `ActivatedRoute` is attached or
* activated. When this happens, the service subscribes to the `ActivatedRoute` observables (params,
* queryParams, data) and sets the inputs of the component using `ComponentRef.setInput`.
* Importantly, when an input does not have an item in the route data with a matching key, this
* input is set to `undefined`. If it were not done this way, the previous information would be
* retained if the data got removed from the route (i.e. if a query parameter is removed).
*
* The `RouterOutlet` should unregister itself when destroyed via `unsubscribeFromRouteData` so that
* the subscriptions are cleaned up.
*/
var RoutedComponentInputBinder = /* @__PURE__ */ (() => {
	class RoutedComponentInputBinder {
		outletDataSubscriptions = /* @__PURE__ */ new Map();
		bindActivatedRouteToOutletComponent(outlet) {
			this.unsubscribeFromRouteData(outlet);
			this.subscribeToRouteData(outlet);
		}
		unsubscribeFromRouteData(outlet) {
			this.outletDataSubscriptions.get(outlet)?.unsubscribe();
			this.outletDataSubscriptions.delete(outlet);
		}
		subscribeToRouteData(outlet) {
			const { activatedRoute } = outlet;
			const dataSubscription = __mf_38$1([
				activatedRoute.queryParams,
				activatedRoute.params,
				activatedRoute.data
			]).pipe(switchMap(([queryParams, params, data], index) => {
				data = {
					...queryParams,
					...params,
					...data
				};
				if (index === 0) return __mf_52$1(data);
				return Promise.resolve(data);
			})).subscribe((data) => {
				if (!outlet.isActivated || !outlet.activatedComponentRef || outlet.activatedRoute !== activatedRoute || activatedRoute.component === null) {
					this.unsubscribeFromRouteData(outlet);
					return;
				}
				const mirror = __mf_145(activatedRoute.component);
				if (!mirror) {
					this.unsubscribeFromRouteData(outlet);
					return;
				}
				for (const { templateName } of mirror.inputs) outlet.activatedComponentRef.setInput(templateName, data[templateName]);
			});
			this.outletDataSubscriptions.set(outlet, dataSubscription);
		}
		static ɵfac = function RoutedComponentInputBinder_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RoutedComponentInputBinder)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: RoutedComponentInputBinder,
			factory: RoutedComponentInputBinder.ɵfac
		});
	}
	return RoutedComponentInputBinder;
})();
/**
* This component is used internally within the router to be a placeholder when an empty
* router-outlet is needed. For example, with a config such as:
*
* `{path: 'parent', outlet: 'nav', children: [...]}`
*
* In order to render, there needs to be a component on this config, which will default
* to this `EmptyOutletComponent`.
*/
var ɵEmptyOutletComponent = /* @__PURE__ */ (() => {
	class ɵEmptyOutletComponent {
		static ɵfac = function ɵEmptyOutletComponent_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || ɵEmptyOutletComponent)();
		};
		static ɵcmp = /* @__PURE__ */ __mf_366({
			type: ɵEmptyOutletComponent,
			selectors: [["ng-component"]],
			exportAs: ["emptyRouterOutlet"],
			decls: 1,
			vars: 0,
			template: function _EmptyOutletComponent_Template(rf, ctx) {
				if (rf & 1) __mf_383(0, "router-outlet");
			},
			dependencies: [RouterOutlet],
			encapsulation: 2
		});
	}
	return ɵEmptyOutletComponent;
})();
/**
* Makes a copy of the config and adds any default required properties.
*/
function standardizeConfig(r) {
	const children = r.children && r.children.map(standardizeConfig);
	const c = children ? {
		...r,
		children
	} : { ...r };
	if (!c.component && !c.loadComponent && (children || c.loadChildren) && c.outlet && c.outlet !== "primary") c.component = ɵEmptyOutletComponent;
	return c;
}
function createRouterState(routeReuseStrategy, curr, prevState) {
	return new RouterState(createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : void 0), curr);
}
function createNode(routeReuseStrategy, curr, prevState) {
	if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
		const value = prevState.value;
		value._futureSnapshot = curr.value;
		return new TreeNode(value, createOrReuseChildren(routeReuseStrategy, curr, prevState));
	} else {
		if (routeReuseStrategy.shouldAttach(curr.value)) {
			const detachedRouteHandle = routeReuseStrategy.retrieve(curr.value);
			if (detachedRouteHandle !== null) {
				const tree = detachedRouteHandle.route;
				tree.value._futureSnapshot = curr.value;
				tree.children = curr.children.map((c) => createNode(routeReuseStrategy, c));
				return tree;
			}
		}
		return new TreeNode(createActivatedRoute(curr.value), curr.children.map((c) => createNode(routeReuseStrategy, c)));
	}
}
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
	return curr.children.map((child) => {
		for (const p of prevState.children) if (routeReuseStrategy.shouldReuseRoute(child.value, p.value.snapshot)) return createNode(routeReuseStrategy, child, p);
		return createNode(routeReuseStrategy, child);
	});
}
function createActivatedRoute(c) {
	return new ActivatedRoute(new __mf_5$1(c.url), new __mf_5$1(c.params), new __mf_5$1(c.queryParams), new __mf_5$1(c.fragment), new __mf_5$1(c.data), c.outlet, c.component, c);
}
/**
* Can be returned by a `Router` guard to instruct the `Router` to redirect rather than continue
* processing the path of the in-flight navigation. The `redirectTo` indicates _where_ the new
* navigation should go to and the optional `navigationBehaviorOptions` can provide more information
* about _how_ to perform the navigation.
*
* ```ts
* const route: Route = {
*   path: "user/:userId",
*   component: User,
*   canActivate: [
*     () => {
*       const router = inject(Router);
*       const authService = inject(AuthenticationService);
*
*       if (!authService.isLoggedIn()) {
*         const loginPath = router.parseUrl("/login");
*         return new RedirectCommand(loginPath, {
*           skipLocationChange: true,
*         });
*       }
*
*       return true;
*     },
*   ],
* };
* ```
* @see [Routing guide](guide/routing/common-router-tasks#preventing-unauthorized-access)
*
* @publicApi
*/
var RedirectCommand = class {
	redirectTo;
	navigationBehaviorOptions;
	constructor(redirectTo, navigationBehaviorOptions) {
		this.redirectTo = redirectTo;
		this.navigationBehaviorOptions = navigationBehaviorOptions;
	}
};
var NAVIGATION_CANCELING_ERROR = "ngNavigationCancelingError";
function redirectingNavigationError(urlSerializer, redirect) {
	const { redirectTo, navigationBehaviorOptions } = isUrlTree(redirect) ? {
		redirectTo: redirect,
		navigationBehaviorOptions: void 0
	} : redirect;
	const error = navigationCancelingError(false, NavigationCancellationCode.Redirect);
	error.url = redirectTo;
	error.navigationBehaviorOptions = navigationBehaviorOptions;
	return error;
}
function navigationCancelingError(message, code) {
	const error = /* @__PURE__ */ new Error(`NavigationCancelingError: ${message || ""}`);
	error[NAVIGATION_CANCELING_ERROR] = true;
	error.cancellationCode = code;
	return error;
}
function isRedirectingNavigationCancelingError(error) {
	return isNavigationCancelingError(error) && isUrlTree(error.url);
}
function isNavigationCancelingError(error) {
	return !!error && error[NAVIGATION_CANCELING_ERROR];
}
var activateRoutes = (rootContexts, routeReuseStrategy, forwardEvent, inputBindingEnabled) => map((t) => {
	new ActivateRoutes(routeReuseStrategy, t.targetRouterState, t.currentRouterState, forwardEvent, inputBindingEnabled).activate(rootContexts);
	return t;
});
var ActivateRoutes = class {
	routeReuseStrategy;
	futureState;
	currState;
	forwardEvent;
	inputBindingEnabled;
	constructor(routeReuseStrategy, futureState, currState, forwardEvent, inputBindingEnabled) {
		this.routeReuseStrategy = routeReuseStrategy;
		this.futureState = futureState;
		this.currState = currState;
		this.forwardEvent = forwardEvent;
		this.inputBindingEnabled = inputBindingEnabled;
	}
	activate(parentContexts) {
		const futureRoot = this.futureState._root;
		const currRoot = this.currState ? this.currState._root : null;
		this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
		advanceActivatedRoute(this.futureState.root);
		this.activateChildRoutes(futureRoot, currRoot, parentContexts);
	}
	deactivateChildRoutes(futureNode, currNode, contexts) {
		const children = nodeChildrenAsMap(currNode);
		futureNode.children.forEach((futureChild) => {
			const childOutletName = futureChild.value.outlet;
			this.deactivateRoutes(futureChild, children[childOutletName], contexts);
			delete children[childOutletName];
		});
		Object.values(children).forEach((v) => {
			this.deactivateRouteAndItsChildren(v, contexts);
		});
	}
	deactivateRoutes(futureNode, currNode, parentContext) {
		const future = futureNode.value;
		const curr = currNode ? currNode.value : null;
		if (future === curr) if (future.component) {
			const context = parentContext.getContext(future.outlet);
			if (context) this.deactivateChildRoutes(futureNode, currNode, context.children);
		} else this.deactivateChildRoutes(futureNode, currNode, parentContext);
		else if (curr) this.deactivateRouteAndItsChildren(currNode, parentContext);
	}
	deactivateRouteAndItsChildren(route, parentContexts) {
		if (route.value.component && this.routeReuseStrategy.shouldDetach(route.value.snapshot)) this.detachAndStoreRouteSubtree(route, parentContexts);
		else this.deactivateRouteAndOutlet(route, parentContexts);
	}
	detachAndStoreRouteSubtree(route, parentContexts) {
		const context = parentContexts.getContext(route.value.outlet);
		const contexts = context && route.value.component ? context.children : parentContexts;
		const children = nodeChildrenAsMap(route);
		for (const treeNode of Object.values(children)) this.deactivateRouteAndItsChildren(treeNode, contexts);
		if (context && context.outlet) {
			const componentRef = context.outlet.detach();
			const contexts = context.children.onOutletDeactivated();
			this.routeReuseStrategy.store(route.value.snapshot, {
				componentRef,
				route,
				contexts
			});
		}
	}
	deactivateRouteAndOutlet(route, parentContexts) {
		const context = parentContexts.getContext(route.value.outlet);
		const contexts = context && route.value.component ? context.children : parentContexts;
		const children = nodeChildrenAsMap(route);
		for (const treeNode of Object.values(children)) this.deactivateRouteAndItsChildren(treeNode, contexts);
		if (context) {
			if (context.outlet) {
				context.outlet.deactivate();
				context.children.onOutletDeactivated();
			}
			context.attachRef = null;
			context.route = null;
		}
	}
	activateChildRoutes(futureNode, currNode, contexts) {
		const children = nodeChildrenAsMap(currNode);
		futureNode.children.forEach((c) => {
			this.activateRoutes(c, children[c.value.outlet], contexts);
			this.forwardEvent(new ActivationEnd(c.value.snapshot));
		});
		if (futureNode.children.length) this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
	}
	activateRoutes(futureNode, currNode, parentContexts) {
		const future = futureNode.value;
		const curr = currNode ? currNode.value : null;
		advanceActivatedRoute(future);
		if (future === curr) if (future.component) {
			const context = parentContexts.getOrCreateContext(future.outlet);
			this.activateChildRoutes(futureNode, currNode, context.children);
		} else this.activateChildRoutes(futureNode, currNode, parentContexts);
		else if (future.component) {
			const context = parentContexts.getOrCreateContext(future.outlet);
			if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
				const stored = this.routeReuseStrategy.retrieve(future.snapshot);
				this.routeReuseStrategy.store(future.snapshot, null);
				context.children.onOutletReAttached(stored.contexts);
				context.attachRef = stored.componentRef;
				context.route = stored.route.value;
				if (context.outlet) context.outlet.attach(stored.componentRef, stored.route.value);
				advanceActivatedRoute(stored.route.value);
				this.activateChildRoutes(futureNode, null, context.children);
			} else {
				context.attachRef = null;
				context.route = future;
				if (context.outlet) context.outlet.activateWith(future, context.injector);
				this.activateChildRoutes(futureNode, null, context.children);
			}
		} else this.activateChildRoutes(futureNode, null, parentContexts);
	}
};
var CanActivate = class {
	path;
	route;
	constructor(path) {
		this.path = path;
		this.route = this.path[this.path.length - 1];
	}
};
var CanDeactivate = class {
	component;
	route;
	constructor(component, route) {
		this.component = component;
		this.route = route;
	}
};
function getAllRouteGuards(future, curr, parentContexts) {
	const futureRoot = future._root;
	return getChildRouteGuards(futureRoot, curr ? curr._root : null, parentContexts, [futureRoot.value]);
}
function getCanActivateChild(p) {
	const canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
	if (!canActivateChild || canActivateChild.length === 0) return null;
	return {
		node: p,
		guards: canActivateChild
	};
}
function getTokenOrFunctionIdentity(tokenOrFunction, injector) {
	const NOT_FOUND = Symbol();
	const result = injector.get(tokenOrFunction, NOT_FOUND);
	if (result === NOT_FOUND) if (typeof tokenOrFunction === "function" && !__mf_275(tokenOrFunction)) return tokenOrFunction;
	else return injector.get(tokenOrFunction);
	return result;
}
function getChildRouteGuards(futureNode, currNode, contexts, futurePath, checks = {
	canDeactivateChecks: [],
	canActivateChecks: []
}) {
	const prevChildren = nodeChildrenAsMap(currNode);
	futureNode.children.forEach((c) => {
		getRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]), checks);
		delete prevChildren[c.value.outlet];
	});
	Object.entries(prevChildren).forEach(([k, v]) => deactivateRouteAndItsChildren(v, contexts.getContext(k), checks));
	return checks;
}
function getRouteGuards(futureNode, currNode, parentContexts, futurePath, checks = {
	canDeactivateChecks: [],
	canActivateChecks: []
}) {
	const future = futureNode.value;
	const curr = currNode ? currNode.value : null;
	const context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
	if (curr && future.routeConfig === curr.routeConfig) {
		const shouldRun = shouldRunGuardsAndResolvers(curr, future, future.routeConfig.runGuardsAndResolvers);
		if (shouldRun) checks.canActivateChecks.push(new CanActivate(futurePath));
		else {
			future.data = curr.data;
			future._resolvedData = curr._resolvedData;
		}
		if (future.component) getChildRouteGuards(futureNode, currNode, context ? context.children : null, futurePath, checks);
		else getChildRouteGuards(futureNode, currNode, parentContexts, futurePath, checks);
		if (shouldRun && context && context.outlet && context.outlet.isActivated) checks.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, curr));
	} else {
		if (curr) deactivateRouteAndItsChildren(currNode, context, checks);
		checks.canActivateChecks.push(new CanActivate(futurePath));
		if (future.component) getChildRouteGuards(futureNode, null, context ? context.children : null, futurePath, checks);
		else getChildRouteGuards(futureNode, null, parentContexts, futurePath, checks);
	}
	return checks;
}
function shouldRunGuardsAndResolvers(curr, future, mode) {
	if (typeof mode === "function") return mode(curr, future);
	switch (mode) {
		case "pathParamsChange": return !equalPath(curr.url, future.url);
		case "pathParamsOrQueryParamsChange": return !equalPath(curr.url, future.url) || !shallowEqual(curr.queryParams, future.queryParams);
		case "always": return true;
		case "paramsOrQueryParamsChange": return !equalParamsAndUrlSegments(curr, future) || !shallowEqual(curr.queryParams, future.queryParams);
		default: return !equalParamsAndUrlSegments(curr, future);
	}
}
function deactivateRouteAndItsChildren(route, context, checks) {
	const children = nodeChildrenAsMap(route);
	const r = route.value;
	Object.entries(children).forEach(([childName, node]) => {
		if (!r.component) deactivateRouteAndItsChildren(node, context, checks);
		else if (context) deactivateRouteAndItsChildren(node, context.children.getContext(childName), checks);
		else deactivateRouteAndItsChildren(node, null, checks);
	});
	if (!r.component) checks.canDeactivateChecks.push(new CanDeactivate(null, r));
	else if (context && context.outlet && context.outlet.isActivated) checks.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
	else checks.canDeactivateChecks.push(new CanDeactivate(null, r));
}
/**
* Simple function check, but generic so type inference will flow. Example:
*
* function product(a: number, b: number) {
*   return a * b;
* }
*
* if (isFunction<product>(fn)) {
*   return fn(1, 2);
* } else {
*   throw "Must provide the `product` function";
* }
*/
function isFunction(v) {
	return typeof v === "function";
}
function isBoolean(v) {
	return typeof v === "boolean";
}
function isCanLoad(guard) {
	return guard && isFunction(guard.canLoad);
}
function isCanActivate(guard) {
	return guard && isFunction(guard.canActivate);
}
function isCanActivateChild(guard) {
	return guard && isFunction(guard.canActivateChild);
}
function isCanDeactivate(guard) {
	return guard && isFunction(guard.canDeactivate);
}
function isCanMatch(guard) {
	return guard && isFunction(guard.canMatch);
}
function isEmptyError(e) {
	return e instanceof __mf_30$1 || e?.name === "EmptyError";
}
var INITIAL_VALUE = /* @__PURE__ */ Symbol("INITIAL_VALUE");
function prioritizedGuardValue() {
	return switchMap((obs) => {
		return __mf_38$1(obs.map((o) => o.pipe(take(1), startWith(INITIAL_VALUE)))).pipe(map((results) => {
			for (const result of results) if (result === true) continue;
			else if (result === INITIAL_VALUE) return INITIAL_VALUE;
			else if (result === false || isRedirect(result)) return result;
			return true;
		}), filter((item) => item !== INITIAL_VALUE), take(1));
	});
}
function isRedirect(val) {
	return isUrlTree(val) || val instanceof RedirectCommand;
}
function checkGuards(injector, forwardEvent) {
	return mergeMap((t) => {
		const { targetSnapshot, currentSnapshot, guards: { canActivateChecks, canDeactivateChecks } } = t;
		if (canDeactivateChecks.length === 0 && canActivateChecks.length === 0) return __mf_52$1({
			...t,
			guardsResult: true
		});
		return runCanDeactivateChecks(canDeactivateChecks, targetSnapshot, currentSnapshot, injector).pipe(mergeMap((canDeactivate) => {
			return canDeactivate && isBoolean(canDeactivate) ? runCanActivateChecks(targetSnapshot, canActivateChecks, injector, forwardEvent) : __mf_52$1(canDeactivate);
		}), map((guardsResult) => ({
			...t,
			guardsResult
		})));
	});
}
function runCanDeactivateChecks(checks, futureRSS, currRSS, injector) {
	return __mf_44$1(checks).pipe(mergeMap((check) => runCanDeactivate(check.component, check.route, currRSS, futureRSS, injector)), first((result) => {
		return result !== true;
	}, true));
}
function runCanActivateChecks(futureSnapshot, checks, injector, forwardEvent) {
	return __mf_44$1(checks).pipe(concatMap((check) => {
		return __mf_39$1(fireChildActivationStart(check.route.parent, forwardEvent), fireActivationStart(check.route, forwardEvent), runCanActivateChild(futureSnapshot, check.path, injector), runCanActivate(futureSnapshot, check.route, injector));
	}), first((result) => {
		return result !== true;
	}, true));
}
/**
* This should fire off `ActivationStart` events for each route being activated at this
* level.
* In other words, if you're activating `a` and `b` below, `path` will contain the
* `ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
* return
* `true` so checks continue to run.
*/
function fireActivationStart(snapshot, forwardEvent) {
	if (snapshot !== null && forwardEvent) forwardEvent(new ActivationStart(snapshot));
	return __mf_52$1(true);
}
/**
* This should fire off `ChildActivationStart` events for each route being activated at this
* level.
* In other words, if you're activating `a` and `b` below, `path` will contain the
* `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
* return
* `true` so checks continue to run.
*/
function fireChildActivationStart(snapshot, forwardEvent) {
	if (snapshot !== null && forwardEvent) forwardEvent(new ChildActivationStart(snapshot));
	return __mf_52$1(true);
}
function runCanActivate(futureRSS, futureARS, injector) {
	const canActivate = futureARS.routeConfig ? futureARS.routeConfig.canActivate : null;
	if (!canActivate || canActivate.length === 0) return __mf_52$1(true);
	return __mf_52$1(canActivate.map((canActivate) => {
		return __mf_41$1(() => {
			const closestInjector = getClosestRouteInjector(futureARS) ?? injector;
			const guard = getTokenOrFunctionIdentity(canActivate, closestInjector);
			return wrapIntoObservable(isCanActivate(guard) ? guard.canActivate(futureARS, futureRSS) : __mf_148(closestInjector, () => guard(futureARS, futureRSS))).pipe(first());
		});
	})).pipe(prioritizedGuardValue());
}
function runCanActivateChild(futureRSS, path, injector) {
	const futureARS = path[path.length - 1];
	return __mf_52$1(path.slice(0, path.length - 1).reverse().map((p) => getCanActivateChild(p)).filter((_) => _ !== null).map((d) => {
		return __mf_41$1(() => {
			return __mf_52$1(d.guards.map((canActivateChild) => {
				const closestInjector = getClosestRouteInjector(d.node) ?? injector;
				const guard = getTokenOrFunctionIdentity(canActivateChild, closestInjector);
				return wrapIntoObservable(isCanActivateChild(guard) ? guard.canActivateChild(futureARS, futureRSS) : __mf_148(closestInjector, () => guard(futureARS, futureRSS))).pipe(first());
			})).pipe(prioritizedGuardValue());
		});
	})).pipe(prioritizedGuardValue());
}
function runCanDeactivate(component, currARS, currRSS, futureRSS, injector) {
	const canDeactivate = currARS && currARS.routeConfig ? currARS.routeConfig.canDeactivate : null;
	if (!canDeactivate || canDeactivate.length === 0) return __mf_52$1(true);
	return __mf_52$1(canDeactivate.map((c) => {
		const closestInjector = getClosestRouteInjector(currARS) ?? injector;
		const guard = getTokenOrFunctionIdentity(c, closestInjector);
		return wrapIntoObservable(isCanDeactivate(guard) ? guard.canDeactivate(component, currARS, currRSS, futureRSS) : __mf_148(closestInjector, () => guard(component, currARS, currRSS, futureRSS))).pipe(first());
	})).pipe(prioritizedGuardValue());
}
function runCanLoadGuards(injector, route, segments, urlSerializer) {
	const canLoad = route.canLoad;
	if (canLoad === void 0 || canLoad.length === 0) return __mf_52$1(true);
	return __mf_52$1(canLoad.map((injectionToken) => {
		const guard = getTokenOrFunctionIdentity(injectionToken, injector);
		return wrapIntoObservable(isCanLoad(guard) ? guard.canLoad(route, segments) : __mf_148(injector, () => guard(route, segments)));
	})).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
function redirectIfUrlTree(urlSerializer) {
	return __mf_23$1(tap((result) => {
		if (typeof result === "boolean") return;
		throw redirectingNavigationError(urlSerializer, result);
	}), map((result) => result === true));
}
function runCanMatchGuards(injector, route, segments, urlSerializer) {
	const canMatch = route.canMatch;
	if (!canMatch || canMatch.length === 0) return __mf_52$1(true);
	return __mf_52$1(canMatch.map((injectionToken) => {
		const guard = getTokenOrFunctionIdentity(injectionToken, injector);
		return wrapIntoObservable(isCanMatch(guard) ? guard.canMatch(route, segments) : __mf_148(injector, () => guard(route, segments)));
	})).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
var NoMatch = class {
	segmentGroup;
	constructor(segmentGroup) {
		this.segmentGroup = segmentGroup || null;
	}
};
var AbsoluteRedirect = class extends Error {
	urlTree;
	constructor(urlTree) {
		super();
		this.urlTree = urlTree;
	}
};
function noMatch$1(segmentGroup) {
	return __mf_58$1(new NoMatch(segmentGroup));
}
function namedOutletsRedirect(redirectTo) {
	return __mf_58$1(new __mf_207(4e3, false));
}
function canLoadFails(route) {
	return __mf_58$1(navigationCancelingError(false, NavigationCancellationCode.GuardRejected));
}
var ApplyRedirects = class {
	urlSerializer;
	urlTree;
	constructor(urlSerializer, urlTree) {
		this.urlSerializer = urlSerializer;
		this.urlTree = urlTree;
	}
	lineralizeSegments(route, urlTree) {
		let res = [];
		let c = urlTree.root;
		while (true) {
			res = res.concat(c.segments);
			if (c.numberOfChildren === 0) return __mf_52$1(res);
			if (c.numberOfChildren > 1 || !c.children["primary"]) return namedOutletsRedirect(`${route.redirectTo}`);
			c = c.children[PRIMARY_OUTLET];
		}
	}
	applyRedirectCommands(segments, redirectTo, posParams, currentSnapshot, injector) {
		return getRedirectResult(redirectTo, currentSnapshot, injector).pipe(map((redirect) => {
			if (redirect instanceof UrlTree) throw new AbsoluteRedirect(redirect);
			const newTree = this.applyRedirectCreateUrlTree(redirect, this.urlSerializer.parse(redirect), segments, posParams);
			if (redirect[0] === "/") throw new AbsoluteRedirect(newTree);
			return newTree;
		}));
	}
	applyRedirectCreateUrlTree(redirectTo, urlTree, segments, posParams) {
		return new UrlTree(this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams), this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
	}
	createQueryParams(redirectToParams, actualParams) {
		const res = {};
		Object.entries(redirectToParams).forEach(([k, v]) => {
			if (typeof v === "string" && v[0] === ":") res[k] = actualParams[v.substring(1)];
			else res[k] = v;
		});
		return res;
	}
	createSegmentGroup(redirectTo, group, segments, posParams) {
		const updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
		let children = {};
		Object.entries(group.children).forEach(([name, child]) => {
			children[name] = this.createSegmentGroup(redirectTo, child, segments, posParams);
		});
		return new UrlSegmentGroup(updatedSegments, children);
	}
	createSegments(redirectTo, redirectToSegments, actualSegments, posParams) {
		return redirectToSegments.map((s) => s.path[0] === ":" ? this.findPosParam(redirectTo, s, posParams) : this.findOrReturn(s, actualSegments));
	}
	findPosParam(redirectTo, redirectToUrlSegment, posParams) {
		const pos = posParams[redirectToUrlSegment.path.substring(1)];
		if (!pos) throw new __mf_207(4001, false);
		return pos;
	}
	findOrReturn(redirectToUrlSegment, actualSegments) {
		let idx = 0;
		for (const s of actualSegments) {
			if (s.path === redirectToUrlSegment.path) {
				actualSegments.splice(idx);
				return s;
			}
			idx++;
		}
		return redirectToUrlSegment;
	}
};
function getRedirectResult(redirectTo, currentSnapshot, injector) {
	if (typeof redirectTo === "string") return __mf_52$1(redirectTo);
	const redirectToFn = redirectTo;
	const { queryParams, fragment, routeConfig, url, outlet, params, data, title } = currentSnapshot;
	return wrapIntoObservable(__mf_148(injector, () => redirectToFn({
		params,
		data,
		queryParams,
		fragment,
		routeConfig,
		url,
		outlet,
		title
	})));
}
var noMatch = {
	matched: false,
	consumedSegments: [],
	remainingSegments: [],
	parameters: {},
	positionalParamSegments: {}
};
function matchWithChecks(segmentGroup, route, segments, injector, urlSerializer) {
	const result = match(segmentGroup, route, segments);
	if (!result.matched) return __mf_52$1(result);
	injector = getOrCreateRouteInjectorIfNeeded(route, injector);
	return runCanMatchGuards(injector, route, segments, urlSerializer).pipe(map((v) => v === true ? result : { ...noMatch }));
}
function match(segmentGroup, route, segments) {
	if (route.path === "**") return createWildcardMatchResult(segments);
	if (route.path === "") {
		if (route.pathMatch === "full" && (segmentGroup.hasChildren() || segments.length > 0)) return { ...noMatch };
		return {
			matched: true,
			consumedSegments: [],
			remainingSegments: segments,
			parameters: {},
			positionalParamSegments: {}
		};
	}
	const res = (route.matcher || defaultUrlMatcher)(segments, segmentGroup, route);
	if (!res) return { ...noMatch };
	const posParams = {};
	Object.entries(res.posParams ?? {}).forEach(([k, v]) => {
		posParams[k] = v.path;
	});
	const parameters = res.consumed.length > 0 ? {
		...posParams,
		...res.consumed[res.consumed.length - 1].parameters
	} : posParams;
	return {
		matched: true,
		consumedSegments: res.consumed,
		remainingSegments: segments.slice(res.consumed.length),
		parameters,
		positionalParamSegments: res.posParams ?? {}
	};
}
function createWildcardMatchResult(segments) {
	return {
		matched: true,
		parameters: segments.length > 0 ? last(segments).parameters : {},
		consumedSegments: segments,
		remainingSegments: [],
		positionalParamSegments: {}
	};
}
function split(segmentGroup, consumedSegments, slicedSegments, config) {
	if (slicedSegments.length > 0 && containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) return {
		segmentGroup: new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children))),
		slicedSegments: []
	};
	if (slicedSegments.length === 0 && containsEmptyPathMatches(segmentGroup, slicedSegments, config)) return {
		segmentGroup: new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children)),
		slicedSegments
	};
	return {
		segmentGroup: new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children),
		slicedSegments
	};
}
function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
	const res = {};
	for (const r of routes) if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
		const s = new UrlSegmentGroup([], {});
		res[getOutlet(r)] = s;
	}
	return {
		...children,
		...res
	};
}
function createChildrenForEmptyPaths(routes, primarySegment) {
	const res = {};
	res[PRIMARY_OUTLET] = primarySegment;
	for (const r of routes) if (r.path === "" && getOutlet(r) !== "primary") {
		const s = new UrlSegmentGroup([], {});
		res[getOutlet(r)] = s;
	}
	return res;
}
function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes) {
	return routes.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet(r) !== "primary");
}
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
	return routes.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r));
}
function emptyPathMatch(segmentGroup, slicedSegments, r) {
	if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === "full") return false;
	return r.path === "";
}
function noLeftoversInUrl(segmentGroup, segments, outlet) {
	return segments.length === 0 && !segmentGroup.children[outlet];
}
/**
* Class used to indicate there were no additional route config matches but that all segments of
* the URL were consumed during matching so the route was URL matched. When this happens, we still
* try to match child configs in case there are empty path children.
*/
var NoLeftoversInUrl = class {};
function recognize$1(injector, configLoader, rootComponentType, config, urlTree, urlSerializer, paramsInheritanceStrategy = "emptyOnly") {
	return new Recognizer(injector, configLoader, rootComponentType, config, urlTree, paramsInheritanceStrategy, urlSerializer).recognize();
}
var MAX_ALLOWED_REDIRECTS = 31;
var Recognizer = class {
	injector;
	configLoader;
	rootComponentType;
	config;
	urlTree;
	paramsInheritanceStrategy;
	urlSerializer;
	applyRedirects;
	absoluteRedirectCount = 0;
	allowRedirects = true;
	constructor(injector, configLoader, rootComponentType, config, urlTree, paramsInheritanceStrategy, urlSerializer) {
		this.injector = injector;
		this.configLoader = configLoader;
		this.rootComponentType = rootComponentType;
		this.config = config;
		this.urlTree = urlTree;
		this.paramsInheritanceStrategy = paramsInheritanceStrategy;
		this.urlSerializer = urlSerializer;
		this.applyRedirects = new ApplyRedirects(this.urlSerializer, this.urlTree);
	}
	noMatchError(e) {
		return new __mf_207(4002, `'${e.segmentGroup}'`);
	}
	recognize() {
		const rootSegmentGroup = split(this.urlTree.root, [], [], this.config).segmentGroup;
		return this.match(rootSegmentGroup).pipe(map(({ children, rootSnapshot }) => {
			const routeState = new RouterStateSnapshot("", new TreeNode(rootSnapshot, children));
			const tree = createUrlTreeFromSnapshot(rootSnapshot, [], this.urlTree.queryParams, this.urlTree.fragment);
			tree.queryParams = this.urlTree.queryParams;
			routeState.url = this.urlSerializer.serialize(tree);
			return {
				state: routeState,
				tree
			};
		}));
	}
	match(rootSegmentGroup) {
		const rootSnapshot = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, Object.freeze({}), PRIMARY_OUTLET, this.rootComponentType, null, {});
		return this.processSegmentGroup(this.injector, this.config, rootSegmentGroup, PRIMARY_OUTLET, rootSnapshot).pipe(map((children) => {
			return {
				children,
				rootSnapshot
			};
		}), catchError((e) => {
			if (e instanceof AbsoluteRedirect) {
				this.urlTree = e.urlTree;
				return this.match(e.urlTree.root);
			}
			if (e instanceof NoMatch) throw this.noMatchError(e);
			throw e;
		}));
	}
	processSegmentGroup(injector, config, segmentGroup, outlet, parentRoute) {
		if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) return this.processChildren(injector, config, segmentGroup, parentRoute);
		return this.processSegment(injector, config, segmentGroup, segmentGroup.segments, outlet, true, parentRoute).pipe(map((child) => child instanceof TreeNode ? [child] : []));
	}
	/**
	* Matches every child outlet in the `segmentGroup` to a `Route` in the config. Returns `null` if
	* we cannot find a match for _any_ of the children.
	*
	* @param config - The `Routes` to match against
	* @param segmentGroup - The `UrlSegmentGroup` whose children need to be matched against the
	*     config.
	*/
	processChildren(injector, config, segmentGroup, parentRoute) {
		const childOutlets = [];
		for (const child of Object.keys(segmentGroup.children)) if (child === "primary") childOutlets.unshift(child);
		else childOutlets.push(child);
		return __mf_44$1(childOutlets).pipe(concatMap((childOutlet) => {
			const child = segmentGroup.children[childOutlet];
			const sortedConfig = sortByMatchingOutlets(config, childOutlet);
			return this.processSegmentGroup(injector, sortedConfig, child, childOutlet, parentRoute);
		}), scan((children, outletChildren) => {
			children.push(...outletChildren);
			return children;
		}), defaultIfEmpty(null), last$1(), mergeMap((children) => {
			if (children === null) return noMatch$1(segmentGroup);
			const mergedChildren = mergeEmptyPathMatches(children);
			sortActivatedRouteSnapshots(mergedChildren);
			return __mf_52$1(mergedChildren);
		}));
	}
	processSegment(injector, routes, segmentGroup, segments, outlet, allowRedirects, parentRoute) {
		return __mf_44$1(routes).pipe(concatMap((r) => {
			return this.processSegmentAgainstRoute(r._injector ?? injector, routes, r, segmentGroup, segments, outlet, allowRedirects, parentRoute).pipe(catchError((e) => {
				if (e instanceof NoMatch) return __mf_52$1(null);
				throw e;
			}));
		}), first((x) => !!x), catchError((e) => {
			if (isEmptyError(e)) {
				if (noLeftoversInUrl(segmentGroup, segments, outlet)) return __mf_52$1(new NoLeftoversInUrl());
				return noMatch$1(segmentGroup);
			}
			throw e;
		}));
	}
	processSegmentAgainstRoute(injector, routes, route, rawSegment, segments, outlet, allowRedirects, parentRoute) {
		if (getOutlet(route) !== outlet && (outlet === "primary" || !emptyPathMatch(rawSegment, segments, route))) return noMatch$1(rawSegment);
		if (route.redirectTo === void 0) return this.matchSegmentAgainstRoute(injector, rawSegment, route, segments, outlet, parentRoute);
		if (this.allowRedirects && allowRedirects) return this.expandSegmentAgainstRouteUsingRedirect(injector, rawSegment, routes, route, segments, outlet, parentRoute);
		return noMatch$1(rawSegment);
	}
	expandSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes, route, segments, outlet, parentRoute) {
		const { matched, parameters, consumedSegments, positionalParamSegments, remainingSegments } = match(segmentGroup, route, segments);
		if (!matched) return noMatch$1(segmentGroup);
		if (typeof route.redirectTo === "string" && route.redirectTo[0] === "/") {
			this.absoluteRedirectCount++;
			if (this.absoluteRedirectCount > MAX_ALLOWED_REDIRECTS) this.allowRedirects = false;
		}
		const currentSnapshot = new ActivatedRouteSnapshot(segments, parameters, Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, getData(route), getOutlet(route), route.component ?? route._loadedComponent ?? null, route, getResolve(route));
		const inherited = getInherited(currentSnapshot, parentRoute, this.paramsInheritanceStrategy);
		currentSnapshot.params = Object.freeze(inherited.params);
		currentSnapshot.data = Object.freeze(inherited.data);
		return this.applyRedirects.applyRedirectCommands(consumedSegments, route.redirectTo, positionalParamSegments, currentSnapshot, injector).pipe(switchMap((newTree) => this.applyRedirects.lineralizeSegments(route, newTree)), mergeMap((newSegments) => {
			return this.processSegment(injector, routes, segmentGroup, newSegments.concat(remainingSegments), outlet, false, parentRoute);
		}));
	}
	matchSegmentAgainstRoute(injector, rawSegment, route, segments, outlet, parentRoute) {
		const matchResult = matchWithChecks(rawSegment, route, segments, injector, this.urlSerializer);
		if (route.path === "**") rawSegment.children = {};
		return matchResult.pipe(switchMap((result) => {
			if (!result.matched) return noMatch$1(rawSegment);
			injector = route._injector ?? injector;
			return this.getChildConfig(injector, route, segments).pipe(switchMap(({ routes: childConfig }) => {
				const childInjector = route._loadedInjector ?? injector;
				const { parameters, consumedSegments, remainingSegments } = result;
				const snapshot = new ActivatedRouteSnapshot(consumedSegments, parameters, Object.freeze({ ...this.urlTree.queryParams }), this.urlTree.fragment, getData(route), getOutlet(route), route.component ?? route._loadedComponent ?? null, route, getResolve(route));
				const inherited = getInherited(snapshot, parentRoute, this.paramsInheritanceStrategy);
				snapshot.params = Object.freeze(inherited.params);
				snapshot.data = Object.freeze(inherited.data);
				const { segmentGroup, slicedSegments } = split(rawSegment, consumedSegments, remainingSegments, childConfig);
				if (slicedSegments.length === 0 && segmentGroup.hasChildren()) return this.processChildren(childInjector, childConfig, segmentGroup, snapshot).pipe(map((children) => {
					return new TreeNode(snapshot, children);
				}));
				if (childConfig.length === 0 && slicedSegments.length === 0) return __mf_52$1(new TreeNode(snapshot, []));
				const matchedOnOutlet = getOutlet(route) === outlet;
				return this.processSegment(childInjector, childConfig, segmentGroup, slicedSegments, matchedOnOutlet ? PRIMARY_OUTLET : outlet, true, snapshot).pipe(map((child) => {
					return new TreeNode(snapshot, child instanceof TreeNode ? [child] : []);
				}));
			}));
		}));
	}
	getChildConfig(injector, route, segments) {
		if (route.children) return __mf_52$1({
			routes: route.children,
			injector
		});
		if (route.loadChildren) {
			if (route._loadedRoutes !== void 0) return __mf_52$1({
				routes: route._loadedRoutes,
				injector: route._loadedInjector
			});
			return runCanLoadGuards(injector, route, segments, this.urlSerializer).pipe(mergeMap((shouldLoadResult) => {
				if (shouldLoadResult) return this.configLoader.loadChildren(injector, route).pipe(tap((cfg) => {
					route._loadedRoutes = cfg.routes;
					route._loadedInjector = cfg.injector;
				}));
				return canLoadFails(route);
			}));
		}
		return __mf_52$1({
			routes: [],
			injector
		});
	}
};
function sortActivatedRouteSnapshots(nodes) {
	nodes.sort((a, b) => {
		if (a.value.outlet === "primary") return -1;
		if (b.value.outlet === "primary") return 1;
		return a.value.outlet.localeCompare(b.value.outlet);
	});
}
function hasEmptyPathConfig(node) {
	const config = node.value.routeConfig;
	return config && config.path === "";
}
/**
* Finds `TreeNode`s with matching empty path route configs and merges them into `TreeNode` with
* the children from each duplicate. This is necessary because different outlets can match a
* single empty path route config and the results need to then be merged.
*/
function mergeEmptyPathMatches(nodes) {
	const result = [];
	const mergedNodes = /* @__PURE__ */ new Set();
	for (const node of nodes) {
		if (!hasEmptyPathConfig(node)) {
			result.push(node);
			continue;
		}
		const duplicateEmptyPathNode = result.find((resultNode) => node.value.routeConfig === resultNode.value.routeConfig);
		if (duplicateEmptyPathNode !== void 0) {
			duplicateEmptyPathNode.children.push(...node.children);
			mergedNodes.add(duplicateEmptyPathNode);
		} else result.push(node);
	}
	for (const mergedNode of mergedNodes) {
		const mergedChildren = mergeEmptyPathMatches(mergedNode.children);
		result.push(new TreeNode(mergedNode.value, mergedChildren));
	}
	return result.filter((n) => !mergedNodes.has(n));
}
function getData(route) {
	return route.data || {};
}
function getResolve(route) {
	return route.resolve || {};
}
function recognize(injector, configLoader, rootComponentType, config, serializer, paramsInheritanceStrategy) {
	return mergeMap((t) => recognize$1(injector, configLoader, rootComponentType, config, t.extractedUrl, serializer, paramsInheritanceStrategy).pipe(map(({ state: targetSnapshot, tree: urlAfterRedirects }) => {
		return {
			...t,
			targetSnapshot,
			urlAfterRedirects
		};
	})));
}
function resolveData(paramsInheritanceStrategy, injector) {
	return mergeMap((t) => {
		const { targetSnapshot, guards: { canActivateChecks } } = t;
		if (!canActivateChecks.length) return __mf_52$1(t);
		const routesWithResolversToRun = new Set(canActivateChecks.map((check) => check.route));
		const routesNeedingDataUpdates = /* @__PURE__ */ new Set();
		for (const route of routesWithResolversToRun) {
			if (routesNeedingDataUpdates.has(route)) continue;
			for (const newRoute of flattenRouteTree(route)) routesNeedingDataUpdates.add(newRoute);
		}
		let routesProcessed = 0;
		return __mf_44$1(routesNeedingDataUpdates).pipe(concatMap((route) => {
			if (routesWithResolversToRun.has(route)) return runResolve(route, targetSnapshot, paramsInheritanceStrategy, injector);
			else {
				route.data = getInherited(route, route.parent, paramsInheritanceStrategy).resolve;
				return __mf_52$1(void 0);
			}
		}), tap(() => routesProcessed++), takeLast(1), mergeMap((_) => routesProcessed === routesNeedingDataUpdates.size ? __mf_52$1(t) : __mf_63$1));
	});
}
/**
*  Returns the `ActivatedRouteSnapshot` tree as an array, using DFS to traverse the route tree.
*/
function flattenRouteTree(route) {
	return [route, ...route.children.map((child) => flattenRouteTree(child)).flat()];
}
function runResolve(futureARS, futureRSS, paramsInheritanceStrategy, injector) {
	const config = futureARS.routeConfig;
	const resolve = futureARS._resolve;
	if (config?.title !== void 0 && !hasStaticTitle(config)) resolve[RouteTitleKey] = config.title;
	return __mf_41$1(() => {
		futureARS.data = getInherited(futureARS, futureARS.parent, paramsInheritanceStrategy).resolve;
		return resolveNode(resolve, futureARS, futureRSS, injector).pipe(map((resolvedData) => {
			futureARS._resolvedData = resolvedData;
			futureARS.data = {
				...futureARS.data,
				...resolvedData
			};
			return null;
		}));
	});
}
function resolveNode(resolve, futureARS, futureRSS, injector) {
	const keys = getDataKeys(resolve);
	if (keys.length === 0) return __mf_52$1({});
	const data = {};
	return __mf_44$1(keys).pipe(mergeMap((key) => getResolver(resolve[key], futureARS, futureRSS, injector).pipe(first(), tap((value) => {
		if (value instanceof RedirectCommand) throw redirectingNavigationError(new DefaultUrlSerializer(), value);
		data[key] = value;
	}))), takeLast(1), map(() => data), catchError((e) => isEmptyError(e) ? __mf_63$1 : __mf_58$1(e)));
}
function getResolver(injectionToken, futureARS, futureRSS, injector) {
	const closestInjector = getClosestRouteInjector(futureARS) ?? injector;
	const resolver = getTokenOrFunctionIdentity(injectionToken, closestInjector);
	return wrapIntoObservable(resolver.resolve ? resolver.resolve(futureARS, futureRSS) : __mf_148(closestInjector, () => resolver(futureARS, futureRSS)));
}
/**
* Perform a side effect through a switchMap for every emission on the source Observable,
* but return an Observable that is identical to the source. It's essentially the same as
* the `tap` operator, but if the side effectful `next` function returns an ObservableInput,
* it will wait before continuing with the original value.
*/
function switchTap(next) {
	return switchMap((v) => {
		const nextResult = next(v);
		if (nextResult) return __mf_44$1(nextResult).pipe(map(() => v));
		return __mf_52$1(v);
	});
}
/**
* Provides a strategy for setting the page title after a router navigation.
*
* The built-in implementation traverses the router state snapshot and finds the deepest primary
* outlet with `title` property. Given the `Routes` below, navigating to
* `/base/child(popup:aux)` would result in the document title being set to "child".
* ```ts
* [
*   {path: 'base', title: 'base', children: [
*     {path: 'child', title: 'child'},
*   ],
*   {path: 'aux', outlet: 'popup', title: 'popupTitle'}
* ]
* ```
*
* This class can be used as a base class for custom title strategies. That is, you can create your
* own class that extends the `TitleStrategy`. Note that in the above example, the `title`
* from the named outlet is never used. However, a custom strategy might be implemented to
* incorporate titles in named outlets.
*
* @publicApi
* @see [Page title guide](guide/routing/define-routes#using-titlestrategy-for-page-titles)
*/
var TitleStrategy = /* @__PURE__ */ (() => {
	class TitleStrategy {
		/**
		* @returns The `title` of the deepest primary route.
		*/
		buildTitle(snapshot) {
			let pageTitle;
			let route = snapshot.root;
			while (route !== void 0) {
				pageTitle = this.getResolvedTitleForRoute(route) ?? pageTitle;
				route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
			}
			return pageTitle;
		}
		/**
		* Given an `ActivatedRouteSnapshot`, returns the final value of the
		* `Route.title` property, which can either be a static string or a resolved value.
		*/
		getResolvedTitleForRoute(snapshot) {
			return snapshot.data[RouteTitleKey];
		}
		static ɵfac = function TitleStrategy_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || TitleStrategy)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: TitleStrategy,
			factory: () => __mf_122(DefaultTitleStrategy),
			providedIn: "root"
		});
	}
	return TitleStrategy;
})();
/**
* The default `TitleStrategy` used by the router that updates the title using the `Title` service.
*/
var DefaultTitleStrategy = /* @__PURE__ */ (() => {
	class DefaultTitleStrategy extends TitleStrategy {
		title;
		constructor(title) {
			super();
			this.title = title;
		}
		/**
		* Sets the title of the browser to the given value.
		*
		* @param title The `pageTitle` from the deepest primary route.
		*/
		updateTitle(snapshot) {
			const title = this.buildTitle(snapshot);
			if (title !== void 0) this.title.setTitle(title);
		}
		static ɵfac = function DefaultTitleStrategy_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || DefaultTitleStrategy)(__mf_401(Title));
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: DefaultTitleStrategy,
			factory: DefaultTitleStrategy.ɵfac,
			providedIn: "root"
		});
	}
	return DefaultTitleStrategy;
})();
/**
* A DI token for the router service.
*
* @publicApi
*/
var ROUTER_CONFIGURATION = /* @__PURE__ */ new __mf_43$1("", {
	providedIn: "root",
	factory: () => ({})
});
/**
* The DI token for a router configuration.
*
* `ROUTES` is a low level API for router configuration via dependency injection.
*
* We recommend that in almost all cases to use higher level APIs such as `RouterModule.forRoot()`,
* `provideRouter`, or `Router.resetConfig()`.
*
* @publicApi
*/
var ROUTES = /* @__PURE__ */ new __mf_43$1("");
var RouterConfigLoader = /* @__PURE__ */ (() => {
	class RouterConfigLoader {
		componentLoaders = /* @__PURE__ */ new WeakMap();
		childrenLoaders = /* @__PURE__ */ new WeakMap();
		onLoadStartListener;
		onLoadEndListener;
		compiler = __mf_122(__mf_13$1);
		loadComponent(injector, route) {
			if (this.componentLoaders.get(route)) return this.componentLoaders.get(route);
			else if (route._loadedComponent) return __mf_52$1(route._loadedComponent);
			if (this.onLoadStartListener) this.onLoadStartListener(route);
			const loader = new __mf_1$1(wrapIntoObservable(__mf_148(injector, () => route.loadComponent())).pipe(map(maybeUnwrapDefaultExport), switchMap(maybeResolveResources), tap((component) => {
				if (this.onLoadEndListener) this.onLoadEndListener(route);
				route._loadedComponent = component;
			}), finalize(() => {
				this.componentLoaders.delete(route);
			})), () => new __mf_4$1()).pipe(refCount());
			this.componentLoaders.set(route, loader);
			return loader;
		}
		loadChildren(parentInjector, route) {
			if (this.childrenLoaders.get(route)) return this.childrenLoaders.get(route);
			else if (route._loadedRoutes) return __mf_52$1({
				routes: route._loadedRoutes,
				injector: route._loadedInjector
			});
			if (this.onLoadStartListener) this.onLoadStartListener(route);
			const loader = new __mf_1$1(loadChildren(route, this.compiler, parentInjector, this.onLoadEndListener).pipe(finalize(() => {
				this.childrenLoaders.delete(route);
			})), () => new __mf_4$1()).pipe(refCount());
			this.childrenLoaders.set(route, loader);
			return loader;
		}
		static ɵfac = function RouterConfigLoader_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterConfigLoader)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: RouterConfigLoader,
			factory: RouterConfigLoader.ɵfac,
			providedIn: "root"
		});
	}
	return RouterConfigLoader;
})();
/**
* Executes a `route.loadChildren` callback and converts the result to an array of child routes and
* an injector if that callback returned a module.
*
* This function is used for the route discovery during prerendering
* in @angular-devkit/build-angular. If there are any updates to the contract here, it will require
* an update to the extractor.
*/
function loadChildren(route, compiler, parentInjector, onLoadEndListener) {
	return wrapIntoObservable(__mf_148(parentInjector, () => route.loadChildren())).pipe(map(maybeUnwrapDefaultExport), switchMap(maybeResolveResources), mergeMap((t) => {
		if (t instanceof __mf_54$1 || Array.isArray(t)) return __mf_52$1(t);
		else return __mf_44$1(compiler.compileModuleAsync(t));
	}), map((factoryOrRoutes) => {
		if (onLoadEndListener) onLoadEndListener(route);
		let injector;
		let rawRoutes;
		if (Array.isArray(factoryOrRoutes)) rawRoutes = factoryOrRoutes;
		else {
			injector = factoryOrRoutes.create(parentInjector).injector;
			rawRoutes = injector.get(ROUTES, [], {
				optional: true,
				self: true
			}).flat();
		}
		return {
			routes: rawRoutes.map(standardizeConfig),
			injector
		};
	}));
}
function isWrappedDefaultExport(value) {
	return value && typeof value === "object" && "default" in value;
}
function maybeUnwrapDefaultExport(input) {
	return isWrappedDefaultExport(input) ? input["default"] : input;
}
function maybeResolveResources(value) {
	return __mf_52$1(value);
}
/**
* @description
*
* Provides a way to migrate AngularJS applications to Angular.
*
* @publicApi
*/
var UrlHandlingStrategy = /* @__PURE__ */ (() => {
	class UrlHandlingStrategy {
		static ɵfac = function UrlHandlingStrategy_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || UrlHandlingStrategy)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: UrlHandlingStrategy,
			factory: () => __mf_122(DefaultUrlHandlingStrategy),
			providedIn: "root"
		});
	}
	return UrlHandlingStrategy;
})();
/**
* @publicApi
*/
var DefaultUrlHandlingStrategy = /* @__PURE__ */ (() => {
	class DefaultUrlHandlingStrategy {
		shouldProcessUrl(url) {
			return true;
		}
		extract(url) {
			return url;
		}
		merge(newUrlPart, wholeUrl) {
			return newUrlPart;
		}
		static ɵfac = function DefaultUrlHandlingStrategy_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || DefaultUrlHandlingStrategy)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: DefaultUrlHandlingStrategy,
			factory: DefaultUrlHandlingStrategy.ɵfac,
			providedIn: "root"
		});
	}
	return DefaultUrlHandlingStrategy;
})();
var CREATE_VIEW_TRANSITION = /* @__PURE__ */ new __mf_43$1("");
var VIEW_TRANSITION_OPTIONS = /* @__PURE__ */ new __mf_43$1("");
/**
* A helper function for using browser view transitions. This function skips the call to
* `startViewTransition` if the browser does not support it.
*
* @returns A Promise that resolves when the view transition callback begins.
*/
function createViewTransition(injector, from, to) {
	const transitionOptions = injector.get(VIEW_TRANSITION_OPTIONS);
	const document = injector.get(__mf_7$1);
	if (!document.startViewTransition || transitionOptions.skipNextTransition) {
		transitionOptions.skipNextTransition = false;
		return new Promise((resolve) => setTimeout(resolve));
	}
	let resolveViewTransitionStarted;
	const viewTransitionStarted = new Promise((resolve) => {
		resolveViewTransitionStarted = resolve;
	});
	const transition = document.startViewTransition(() => {
		resolveViewTransitionStarted();
		return createRenderPromise(injector);
	});
	transition.ready.catch((error) => {});
	const { onViewTransitionCreated } = transitionOptions;
	if (onViewTransitionCreated) __mf_148(injector, () => onViewTransitionCreated({
		transition,
		from,
		to
	}));
	return viewTransitionStarted;
}
/**
* Creates a promise that resolves after next render.
*/
function createRenderPromise(injector) {
	return new Promise((resolve) => {
		__mf_95({ read: () => setTimeout(resolve) }, { injector });
	});
}
var NAVIGATION_ERROR_HANDLER = /* @__PURE__ */ new __mf_43$1("");
var NavigationTransitions = /* @__PURE__ */ (() => {
	class NavigationTransitions {
		currentNavigation = __mf_150(null, ...[{ equal: () => false }]);
		currentTransition = null;
		lastSuccessfulNavigation = null;
		/**
		* These events are used to communicate back to the Router about the state of the transition. The
		* Router wants to respond to these events in various ways. Because the `NavigationTransition`
		* class is not public, this event subject is not publicly exposed.
		*/
		events = new __mf_4$1();
		/**
		* Used to abort the current transition with an error.
		*/
		transitionAbortWithErrorSubject = new __mf_4$1();
		configLoader = __mf_122(RouterConfigLoader);
		environmentInjector = __mf_122(__mf_32$1);
		destroyRef = __mf_122(__mf_27$1);
		urlSerializer = __mf_122(UrlSerializer);
		rootContexts = __mf_122(ChildrenOutletContexts);
		location = __mf_122(__mf_20$1);
		inputBindingEnabled = __mf_122(INPUT_BINDER, { optional: true }) !== null;
		titleStrategy = __mf_122(TitleStrategy);
		options = __mf_122(ROUTER_CONFIGURATION, { optional: true }) || {};
		paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
		urlHandlingStrategy = __mf_122(UrlHandlingStrategy);
		createViewTransition = __mf_122(CREATE_VIEW_TRANSITION, { optional: true });
		navigationErrorHandler = __mf_122(NAVIGATION_ERROR_HANDLER, { optional: true });
		navigationId = 0;
		get hasRequestedNavigation() {
			return this.navigationId !== 0;
		}
		transitions;
		/**
		* Hook that enables you to pause navigation after the preactivation phase.
		* Used by `RouterModule`.
		*
		* @internal
		*/
		afterPreactivation = () => __mf_52$1(void 0);
		/** @internal */
		rootComponentType = null;
		destroyed = false;
		constructor() {
			const onLoadStart = (r) => this.events.next(new RouteConfigLoadStart(r));
			const onLoadEnd = (r) => this.events.next(new RouteConfigLoadEnd(r));
			this.configLoader.onLoadEndListener = onLoadEnd;
			this.configLoader.onLoadStartListener = onLoadStart;
			this.destroyRef.onDestroy(() => {
				this.destroyed = true;
			});
		}
		complete() {
			this.transitions?.complete();
		}
		handleNavigationRequest(request) {
			const id = ++this.navigationId;
			__mf_152(() => {
				this.transitions?.next({
					...request,
					extractedUrl: this.urlHandlingStrategy.extract(request.rawUrl),
					targetSnapshot: null,
					targetRouterState: null,
					guards: {
						canActivateChecks: [],
						canDeactivateChecks: []
					},
					guardsResult: null,
					abortController: new AbortController(),
					id
				});
			});
		}
		setupNavigations(router) {
			this.transitions = new __mf_5$1(null);
			return this.transitions.pipe(filter((t) => t !== null), switchMap((overallTransitionState) => {
				let completedOrAborted = false;
				return __mf_52$1(overallTransitionState).pipe(switchMap((t) => {
					if (this.navigationId > overallTransitionState.id) {
						this.cancelNavigationTransition(overallTransitionState, "", NavigationCancellationCode.SupersededByNewNavigation);
						return __mf_63$1;
					}
					this.currentTransition = overallTransitionState;
					this.currentNavigation.set({
						id: t.id,
						initialUrl: t.rawUrl,
						extractedUrl: t.extractedUrl,
						targetBrowserUrl: typeof t.extras.browserUrl === "string" ? this.urlSerializer.parse(t.extras.browserUrl) : t.extras.browserUrl,
						trigger: t.source,
						extras: t.extras,
						previousNavigation: !this.lastSuccessfulNavigation ? null : {
							...this.lastSuccessfulNavigation,
							previousNavigation: null
						},
						abort: () => t.abortController.abort()
					});
					const urlTransition = !router.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl();
					const onSameUrlNavigation = t.extras.onSameUrlNavigation ?? router.onSameUrlNavigation;
					if (!urlTransition && onSameUrlNavigation !== "reload") {
						this.events.next(new NavigationSkipped(t.id, this.urlSerializer.serialize(t.rawUrl), "", NavigationSkippedCode.IgnoredSameUrlNavigation));
						t.resolve(false);
						return __mf_63$1;
					}
					if (this.urlHandlingStrategy.shouldProcessUrl(t.rawUrl)) return __mf_52$1(t).pipe(switchMap((t) => {
						this.events.next(new NavigationStart(t.id, this.urlSerializer.serialize(t.extractedUrl), t.source, t.restoredState));
						if (t.id !== this.navigationId) return __mf_63$1;
						return Promise.resolve(t);
					}), recognize(this.environmentInjector, this.configLoader, this.rootComponentType, router.config, this.urlSerializer, this.paramsInheritanceStrategy), tap((t) => {
						overallTransitionState.targetSnapshot = t.targetSnapshot;
						overallTransitionState.urlAfterRedirects = t.urlAfterRedirects;
						this.currentNavigation.update((nav) => {
							nav.finalUrl = t.urlAfterRedirects;
							return nav;
						});
						const routesRecognized = new RoutesRecognized(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
						this.events.next(routesRecognized);
					}));
					else if (urlTransition && this.urlHandlingStrategy.shouldProcessUrl(t.currentRawUrl)) {
						const { id, extractedUrl, source, restoredState, extras } = t;
						const navStart = new NavigationStart(id, this.urlSerializer.serialize(extractedUrl), source, restoredState);
						this.events.next(navStart);
						const targetSnapshot = createEmptyState(this.rootComponentType).snapshot;
						this.currentTransition = overallTransitionState = {
							...t,
							targetSnapshot,
							urlAfterRedirects: extractedUrl,
							extras: {
								...extras,
								skipLocationChange: false,
								replaceUrl: false
							}
						};
						this.currentNavigation.update((nav) => {
							nav.finalUrl = extractedUrl;
							return nav;
						});
						return __mf_52$1(overallTransitionState);
					} else {
						this.events.next(new NavigationSkipped(t.id, this.urlSerializer.serialize(t.extractedUrl), "", NavigationSkippedCode.IgnoredByUrlHandlingStrategy));
						t.resolve(false);
						return __mf_63$1;
					}
				}), tap((t) => {
					const guardsStart = new GuardsCheckStart(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
					this.events.next(guardsStart);
				}), map((t) => {
					this.currentTransition = overallTransitionState = {
						...t,
						guards: getAllRouteGuards(t.targetSnapshot, t.currentSnapshot, this.rootContexts)
					};
					return overallTransitionState;
				}), checkGuards(this.environmentInjector, (evt) => this.events.next(evt)), tap((t) => {
					overallTransitionState.guardsResult = t.guardsResult;
					if (t.guardsResult && typeof t.guardsResult !== "boolean") throw redirectingNavigationError(this.urlSerializer, t.guardsResult);
					const guardsEnd = new GuardsCheckEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot, !!t.guardsResult);
					this.events.next(guardsEnd);
				}), filter((t) => {
					if (!t.guardsResult) {
						this.cancelNavigationTransition(t, "", NavigationCancellationCode.GuardRejected);
						return false;
					}
					return true;
				}), switchTap((t) => {
					if (t.guards.canActivateChecks.length === 0) return;
					return __mf_52$1(t).pipe(tap((t) => {
						const resolveStart = new ResolveStart(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
						this.events.next(resolveStart);
					}), switchMap((t) => {
						let dataResolved = false;
						return __mf_52$1(t).pipe(resolveData(this.paramsInheritanceStrategy, this.environmentInjector), tap({
							next: () => dataResolved = true,
							complete: () => {
								if (!dataResolved) this.cancelNavigationTransition(t, "", NavigationCancellationCode.NoDataFromResolver);
							}
						}));
					}), tap((t) => {
						const resolveEnd = new ResolveEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
						this.events.next(resolveEnd);
					}));
				}), switchTap((t) => {
					const loadComponents = (route) => {
						const loaders = [];
						if (route.routeConfig?.loadComponent) {
							const injector = getClosestRouteInjector(route) ?? this.environmentInjector;
							loaders.push(this.configLoader.loadComponent(injector, route.routeConfig).pipe(tap((loadedComponent) => {
								route.component = loadedComponent;
							}), map(() => void 0)));
						}
						for (const child of route.children) loaders.push(...loadComponents(child));
						return loaders;
					};
					return __mf_38$1(loadComponents(t.targetSnapshot.root)).pipe(defaultIfEmpty(null), take(1));
				}), switchTap(() => this.afterPreactivation()), switchMap(() => {
					const { currentSnapshot, targetSnapshot } = overallTransitionState;
					const viewTransitionStarted = this.createViewTransition?.(this.environmentInjector, currentSnapshot.root, targetSnapshot.root);
					return viewTransitionStarted ? __mf_44$1(viewTransitionStarted).pipe(map(() => overallTransitionState)) : __mf_52$1(overallTransitionState);
				}), map((t) => {
					const targetRouterState = createRouterState(router.routeReuseStrategy, t.targetSnapshot, t.currentRouterState);
					this.currentTransition = overallTransitionState = {
						...t,
						targetRouterState
					};
					this.currentNavigation.update((nav) => {
						nav.targetRouterState = targetRouterState;
						return nav;
					});
					return overallTransitionState;
				}), tap(() => {
					this.events.next(new BeforeActivateRoutes());
				}), activateRoutes(this.rootContexts, router.routeReuseStrategy, (evt) => this.events.next(evt), this.inputBindingEnabled), take(1), takeUntil(new __mf_0$1((subscriber) => {
					const abortSignal = overallTransitionState.abortController.signal;
					const handler = () => subscriber.next();
					abortSignal.addEventListener("abort", handler);
					return () => abortSignal.removeEventListener("abort", handler);
				}).pipe(filter(() => !completedOrAborted && !overallTransitionState.targetRouterState), tap(() => {
					this.cancelNavigationTransition(overallTransitionState, overallTransitionState.abortController.signal.reason + "", NavigationCancellationCode.Aborted);
				}))), tap({
					next: (t) => {
						completedOrAborted = true;
						this.lastSuccessfulNavigation = __mf_152(this.currentNavigation);
						this.events.next(new NavigationEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects)));
						this.titleStrategy?.updateTitle(t.targetRouterState.snapshot);
						t.resolve(true);
					},
					complete: () => {
						completedOrAborted = true;
					}
				}), takeUntil(this.transitionAbortWithErrorSubject.pipe(tap((err) => {
					throw err;
				}))), finalize(() => {
					if (!completedOrAborted) this.cancelNavigationTransition(overallTransitionState, "", NavigationCancellationCode.SupersededByNewNavigation);
					if (this.currentTransition?.id === overallTransitionState.id) {
						this.currentNavigation.set(null);
						this.currentTransition = null;
					}
				}), catchError((e) => {
					if (this.destroyed) {
						overallTransitionState.resolve(false);
						return __mf_63$1;
					}
					completedOrAborted = true;
					if (isNavigationCancelingError(e)) {
						this.events.next(new NavigationCancel(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e.message, e.cancellationCode));
						if (!isRedirectingNavigationCancelingError(e)) overallTransitionState.resolve(false);
						else this.events.next(new RedirectRequest(e.url, e.navigationBehaviorOptions));
					} else {
						const navigationError = new NavigationError(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e, overallTransitionState.targetSnapshot ?? void 0);
						try {
							const navigationErrorHandlerResult = __mf_148(this.environmentInjector, () => this.navigationErrorHandler?.(navigationError));
							if (navigationErrorHandlerResult instanceof RedirectCommand) {
								const { message, cancellationCode } = redirectingNavigationError(this.urlSerializer, navigationErrorHandlerResult);
								this.events.next(new NavigationCancel(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), message, cancellationCode));
								this.events.next(new RedirectRequest(navigationErrorHandlerResult.redirectTo, navigationErrorHandlerResult.navigationBehaviorOptions));
							} else {
								this.events.next(navigationError);
								throw e;
							}
						} catch (ee) {
							if (this.options.resolveNavigationPromiseOnError) overallTransitionState.resolve(false);
							else overallTransitionState.reject(ee);
						}
					}
					return __mf_63$1;
				}));
			}));
		}
		cancelNavigationTransition(t, reason, code) {
			const navCancel = new NavigationCancel(t.id, this.urlSerializer.serialize(t.extractedUrl), reason, code);
			this.events.next(navCancel);
			t.resolve(false);
		}
		/**
		* @returns Whether we're navigating to somewhere that is not what the Router is
		* currently set to.
		*/
		isUpdatingInternalState() {
			return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString();
		}
		/**
		* @returns Whether we're updating the browser URL to something new (navigation is going
		* to somewhere not displayed in the URL bar and we will update the URL
		* bar if navigation succeeds).
		*/
		isUpdatedBrowserUrl() {
			const currentBrowserUrl = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(true)));
			const currentNavigation = __mf_152(this.currentNavigation);
			const targetBrowserUrl = currentNavigation?.targetBrowserUrl ?? currentNavigation?.extractedUrl;
			return currentBrowserUrl.toString() !== targetBrowserUrl?.toString() && !currentNavigation?.extras.skipLocationChange;
		}
		static ɵfac = function NavigationTransitions_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || NavigationTransitions)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: NavigationTransitions,
			factory: NavigationTransitions.ɵfac,
			providedIn: "root"
		});
	}
	return NavigationTransitions;
})();
function isBrowserTriggeredNavigation(source) {
	return source !== IMPERATIVE_NAVIGATION;
}
/**
* @description
*
* Provides a way to customize when activated routes get reused.
*
* @publicApi
*/
var RouteReuseStrategy = /* @__PURE__ */ (() => {
	class RouteReuseStrategy {
		static ɵfac = function RouteReuseStrategy_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouteReuseStrategy)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: RouteReuseStrategy,
			factory: () => __mf_122(DefaultRouteReuseStrategy),
			providedIn: "root"
		});
	}
	return RouteReuseStrategy;
})();
/**
* @description
*
* This base route reuse strategy only reuses routes when the matched router configs are
* identical. This prevents components from being destroyed and recreated
* when just the route parameters, query parameters or fragment change
* (that is, the existing component is _reused_).
*
* This strategy does not store any routes for later reuse.
*
* Angular uses this strategy by default.
*
*
* It can be used as a base class for custom route reuse strategies, i.e. you can create your own
* class that extends the `BaseRouteReuseStrategy` one.
* @publicApi
*/
var BaseRouteReuseStrategy = class {
	/**
	* Whether the given route should detach for later reuse.
	* Always returns false for `BaseRouteReuseStrategy`.
	* */
	shouldDetach(route) {
		return false;
	}
	/**
	* A no-op; the route is never stored since this strategy never detaches routes for later re-use.
	*/
	store(route, detachedTree) {}
	/** Returns `false`, meaning the route (and its subtree) is never reattached */
	shouldAttach(route) {
		return false;
	}
	/** Returns `null` because this strategy does not store routes for later re-use. */
	retrieve(route) {
		return null;
	}
	/**
	* Determines if a route should be reused.
	* This strategy returns `true` when the future route config and current route config are
	* identical.
	*/
	shouldReuseRoute(future, curr) {
		return future.routeConfig === curr.routeConfig;
	}
};
var DefaultRouteReuseStrategy = /* @__PURE__ */ (() => {
	class DefaultRouteReuseStrategy extends BaseRouteReuseStrategy {
		static ɵfac = /* @__PURE__ */ (() => {
			let ɵDefaultRouteReuseStrategy_BaseFactory;
			return function DefaultRouteReuseStrategy_Factory(__ngFactoryType__) {
				return (ɵDefaultRouteReuseStrategy_BaseFactory || (ɵDefaultRouteReuseStrategy_BaseFactory = __mf_392(DefaultRouteReuseStrategy)))(__ngFactoryType__ || DefaultRouteReuseStrategy);
			};
		})();
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: DefaultRouteReuseStrategy,
			factory: DefaultRouteReuseStrategy.ɵfac,
			providedIn: "root"
		});
	}
	return DefaultRouteReuseStrategy;
})();
var StateManager = /* @__PURE__ */ (() => {
	class StateManager {
		urlSerializer = __mf_122(UrlSerializer);
		options = __mf_122(ROUTER_CONFIGURATION, { optional: true }) || {};
		canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
		location = __mf_122(__mf_20$1);
		urlHandlingStrategy = __mf_122(UrlHandlingStrategy);
		urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
		currentUrlTree = new UrlTree();
		/**
		* Returns the currently activated `UrlTree`.
		*
		* This `UrlTree` shows only URLs that the `Router` is configured to handle (through
		* `UrlHandlingStrategy`).
		*
		* The value is set after finding the route config tree to activate but before activating the
		* route.
		*/
		getCurrentUrlTree() {
			return this.currentUrlTree;
		}
		rawUrlTree = this.currentUrlTree;
		/**
		* Returns a `UrlTree` that is represents what the browser is actually showing.
		*
		* In the life of a navigation transition:
		* 1. When a navigation begins, the raw `UrlTree` is updated to the full URL that's being
		* navigated to.
		* 2. During a navigation, redirects are applied, which might only apply to _part_ of the URL (due
		* to `UrlHandlingStrategy`).
		* 3. Just before activation, the raw `UrlTree` is updated to include the redirects on top of the
		* original raw URL.
		*
		* Note that this is _only_ here to support `UrlHandlingStrategy.extract` and
		* `UrlHandlingStrategy.shouldProcessUrl`. Without those APIs, the current `UrlTree` would not
		* deviated from the raw `UrlTree`.
		*
		* For `extract`, a raw `UrlTree` is needed because `extract` may only return part
		* of the navigation URL. Thus, the current `UrlTree` may only represent _part_ of the browser
		* URL. When a navigation gets cancelled and the router needs to reset the URL or a new navigation
		* occurs, it needs to know the _whole_ browser URL, not just the part handled by
		* `UrlHandlingStrategy`.
		* For `shouldProcessUrl`, when the return is `false`, the router ignores the navigation but
		* still updates the raw `UrlTree` with the assumption that the navigation was caused by the
		* location change listener due to a URL update by the AngularJS router. In this case, the router
		* still need to know what the browser's URL is for future navigations.
		*/
		getRawUrlTree() {
			return this.rawUrlTree;
		}
		createBrowserPath({ finalUrl, initialUrl, targetBrowserUrl }) {
			const rawUrl = finalUrl !== void 0 ? this.urlHandlingStrategy.merge(finalUrl, initialUrl) : initialUrl;
			const url = targetBrowserUrl ?? rawUrl;
			return url instanceof UrlTree ? this.urlSerializer.serialize(url) : url;
		}
		commitTransition({ targetRouterState, finalUrl, initialUrl }) {
			if (finalUrl && targetRouterState) {
				this.currentUrlTree = finalUrl;
				this.rawUrlTree = this.urlHandlingStrategy.merge(finalUrl, initialUrl);
				this.routerState = targetRouterState;
			} else this.rawUrlTree = initialUrl;
		}
		routerState = createEmptyState(null);
		/** Returns the current RouterState. */
		getRouterState() {
			return this.routerState;
		}
		stateMemento = this.createStateMemento();
		updateStateMemento() {
			this.stateMemento = this.createStateMemento();
		}
		createStateMemento() {
			return {
				rawUrlTree: this.rawUrlTree,
				currentUrlTree: this.currentUrlTree,
				routerState: this.routerState
			};
		}
		resetInternalState({ finalUrl }) {
			this.routerState = this.stateMemento.routerState;
			this.currentUrlTree = this.stateMemento.currentUrlTree;
			this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, finalUrl ?? this.rawUrlTree);
		}
		static ɵfac = function StateManager_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || StateManager)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: StateManager,
			factory: () => __mf_122(HistoryStateManager),
			providedIn: "root"
		});
	}
	return StateManager;
})();
var HistoryStateManager = /* @__PURE__ */ (() => {
	class HistoryStateManager extends StateManager {
		/**
		* The id of the currently active page in the router.
		* Updated to the transition's target id on a successful navigation.
		*
		* This is used to track what page the router last activated. When an attempted navigation fails,
		* the router can then use this to compute how to restore the state back to the previously active
		* page.
		*/
		currentPageId = 0;
		lastSuccessfulId = -1;
		restoredState() {
			return this.location.getState();
		}
		/**
		* The ɵrouterPageId of whatever page is currently active in the browser history. This is
		* important for computing the target page id for new navigations because we need to ensure each
		* page id in the browser history is 1 more than the previous entry.
		*/
		get browserPageId() {
			if (this.canceledNavigationResolution !== "computed") return this.currentPageId;
			return this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
		}
		registerNonRouterCurrentEntryChangeListener(listener) {
			return this.location.subscribe((event) => {
				if (event["type"] === "popstate") setTimeout(() => {
					listener(event["url"], event.state, "popstate");
				});
			});
		}
		handleRouterEvent(e, currentTransition) {
			if (e instanceof NavigationStart) this.updateStateMemento();
			else if (e instanceof NavigationSkipped) this.commitTransition(currentTransition);
			else if (e instanceof RoutesRecognized) {
				if (this.urlUpdateStrategy === "eager") {
					if (!currentTransition.extras.skipLocationChange) this.setBrowserUrl(this.createBrowserPath(currentTransition), currentTransition);
				}
			} else if (e instanceof BeforeActivateRoutes) {
				this.commitTransition(currentTransition);
				if (this.urlUpdateStrategy === "deferred" && !currentTransition.extras.skipLocationChange) this.setBrowserUrl(this.createBrowserPath(currentTransition), currentTransition);
			} else if (e instanceof NavigationCancel && e.code !== NavigationCancellationCode.SupersededByNewNavigation && e.code !== NavigationCancellationCode.Redirect) this.restoreHistory(currentTransition);
			else if (e instanceof NavigationError) this.restoreHistory(currentTransition, true);
			else if (e instanceof NavigationEnd) {
				this.lastSuccessfulId = e.id;
				this.currentPageId = this.browserPageId;
			}
		}
		setBrowserUrl(path, { extras, id }) {
			const { replaceUrl, state } = extras;
			if (this.location.isCurrentPathEqualTo(path) || !!replaceUrl) {
				const currentBrowserPageId = this.browserPageId;
				const newState = {
					...state,
					...this.generateNgRouterState(id, currentBrowserPageId)
				};
				this.location.replaceState(path, "", newState);
			} else {
				const newState = {
					...state,
					...this.generateNgRouterState(id, this.browserPageId + 1)
				};
				this.location.go(path, "", newState);
			}
		}
		/**
		* Performs the necessary rollback action to restore the browser URL to the
		* state before the transition.
		*/
		restoreHistory(navigation, restoringFromCaughtError = false) {
			if (this.canceledNavigationResolution === "computed") {
				const currentBrowserPageId = this.browserPageId;
				const targetPagePosition = this.currentPageId - currentBrowserPageId;
				if (targetPagePosition !== 0) this.location.historyGo(targetPagePosition);
				else if (this.getCurrentUrlTree() === navigation.finalUrl && targetPagePosition === 0) {
					this.resetInternalState(navigation);
					this.resetUrlToCurrentUrlTree();
				}
			} else if (this.canceledNavigationResolution === "replace") {
				if (restoringFromCaughtError) this.resetInternalState(navigation);
				this.resetUrlToCurrentUrlTree();
			}
		}
		resetUrlToCurrentUrlTree() {
			this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId));
		}
		generateNgRouterState(navigationId, routerPageId) {
			if (this.canceledNavigationResolution === "computed") return {
				navigationId,
				ɵrouterPageId: routerPageId
			};
			return { navigationId };
		}
		static ɵfac = /* @__PURE__ */ (() => {
			let ɵHistoryStateManager_BaseFactory;
			return function HistoryStateManager_Factory(__ngFactoryType__) {
				return (ɵHistoryStateManager_BaseFactory || (ɵHistoryStateManager_BaseFactory = __mf_392(HistoryStateManager)))(__ngFactoryType__ || HistoryStateManager);
			};
		})();
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: HistoryStateManager,
			factory: HistoryStateManager.ɵfac,
			providedIn: "root"
		});
	}
	return HistoryStateManager;
})();
/**
* Performs the given action once the router finishes its next/current navigation.
*
* The navigation is considered complete under the following conditions:
* - `NavigationCancel` event emits and the code is not `NavigationCancellationCode.Redirect` or
* `NavigationCancellationCode.SupersededByNewNavigation`. In these cases, the
* redirecting/superseding navigation must finish.
* - `NavigationError`, `NavigationEnd`, or `NavigationSkipped` event emits
*/
function afterNextNavigation(router, action) {
	router.events.pipe(filter((e) => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError || e instanceof NavigationSkipped), map((e) => {
		if (e instanceof NavigationEnd || e instanceof NavigationSkipped) return 0;
		return (e instanceof NavigationCancel ? e.code === NavigationCancellationCode.Redirect || e.code === NavigationCancellationCode.SupersededByNewNavigation : false) ? 2 : 1;
	}), filter((result) => result !== 2), take(1)).subscribe(() => {
		action();
	});
}
/**
* The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `true`
* (exact = true).
*/
var exactMatchOptions = {
	paths: "exact",
	fragment: "ignored",
	matrixParams: "ignored",
	queryParams: "exact"
};
/**
* The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `false`
* (exact = false).
*/
var subsetMatchOptions = {
	paths: "subset",
	fragment: "ignored",
	matrixParams: "ignored",
	queryParams: "subset"
};
/**
* @description
*
* A service that facilitates navigation among views and URL manipulation capabilities.
* This service is provided in the root scope and configured with [provideRouter](api/router/provideRouter).
*
* @see {@link Route}
* @see {@link provideRouter}
* @see [Routing and Navigation Guide](guide/routing/common-router-tasks).
*
* @ngModule RouterModule
*
* @publicApi
*/
var Router = /* @__PURE__ */ (() => {
	class Router {
		get currentUrlTree() {
			return this.stateManager.getCurrentUrlTree();
		}
		get rawUrlTree() {
			return this.stateManager.getRawUrlTree();
		}
		disposed = false;
		nonRouterCurrentEntryChangeSubscription;
		console = __mf_122(__mf_164);
		stateManager = __mf_122(StateManager);
		options = __mf_122(ROUTER_CONFIGURATION, { optional: true }) || {};
		pendingTasks = __mf_122(__mf_200);
		urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
		navigationTransitions = __mf_122(NavigationTransitions);
		urlSerializer = __mf_122(UrlSerializer);
		location = __mf_122(__mf_20$1);
		urlHandlingStrategy = __mf_122(UrlHandlingStrategy);
		injector = __mf_122(__mf_32$1);
		/**
		* The private `Subject` type for the public events exposed in the getter. This is used internally
		* to push events to. The separate field allows us to expose separate types in the public API
		* (i.e., an Observable rather than the Subject).
		*/
		_events = new __mf_4$1();
		/**
		* An event stream for routing events.
		*/
		get events() {
			return this._events;
		}
		/**
		* The current state of routing in this NgModule.
		*/
		get routerState() {
			return this.stateManager.getRouterState();
		}
		/**
		* True if at least one navigation event has occurred,
		* false otherwise.
		*/
		navigated = false;
		/**
		* A strategy for re-using routes.
		*
		* @deprecated Configure using `providers` instead:
		*   `{provide: RouteReuseStrategy, useClass: MyStrategy}`.
		*/
		routeReuseStrategy = __mf_122(RouteReuseStrategy);
		/**
		* How to handle a navigation request to the current URL.
		*
		*
		* @deprecated Configure this through `provideRouter` or `RouterModule.forRoot` instead.
		* @see {@link withRouterConfig}
		* @see {@link provideRouter}
		* @see {@link RouterModule}
		*/
		onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
		config = __mf_122(ROUTES, { optional: true })?.flat() ?? [];
		/**
		* Indicates whether the application has opted in to binding Router data to component inputs.
		*
		* This option is enabled by the `withComponentInputBinding` feature of `provideRouter` or
		* `bindToComponentInputs` in the `ExtraOptions` of `RouterModule.forRoot`.
		*/
		componentInputBindingEnabled = !!__mf_122(INPUT_BINDER, { optional: true });
		/**
		* Signal of the current `Navigation` object when the router is navigating, and `null` when idle.
		*
		* Note: The current navigation becomes to null after the NavigationEnd event is emitted.
		*/
		currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
		constructor() {
			this.resetConfig(this.config);
			this.navigationTransitions.setupNavigations(this).subscribe({ error: (e) => {
				this.console.warn(e);
			} });
			this.subscribeToNavigationEvents();
		}
		eventsSubscription = new __mf_19$1();
		subscribeToNavigationEvents() {
			const subscription = this.navigationTransitions.events.subscribe((e) => {
				try {
					const currentTransition = this.navigationTransitions.currentTransition;
					const currentNavigation = __mf_152(this.navigationTransitions.currentNavigation);
					if (currentTransition !== null && currentNavigation !== null) {
						this.stateManager.handleRouterEvent(e, currentNavigation);
						if (e instanceof NavigationCancel && e.code !== NavigationCancellationCode.Redirect && e.code !== NavigationCancellationCode.SupersededByNewNavigation) this.navigated = true;
						else if (e instanceof NavigationEnd) this.navigated = true;
						else if (e instanceof RedirectRequest) {
							const opts = e.navigationBehaviorOptions;
							const mergedTree = this.urlHandlingStrategy.merge(e.url, currentTransition.currentRawUrl);
							const extras = {
								browserUrl: currentTransition.extras.browserUrl,
								info: currentTransition.extras.info,
								skipLocationChange: currentTransition.extras.skipLocationChange,
								replaceUrl: currentTransition.extras.replaceUrl || this.urlUpdateStrategy === "eager" || isBrowserTriggeredNavigation(currentTransition.source),
								...opts
							};
							this.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras, {
								resolve: currentTransition.resolve,
								reject: currentTransition.reject,
								promise: currentTransition.promise
							});
						}
					}
					if (isPublicRouterEvent(e)) this._events.next(e);
				} catch (e) {
					this.navigationTransitions.transitionAbortWithErrorSubject.next(e);
				}
			});
			this.eventsSubscription.add(subscription);
		}
		/** @internal */
		resetRootComponentType(rootComponentType) {
			this.routerState.root.component = rootComponentType;
			this.navigationTransitions.rootComponentType = rootComponentType;
		}
		/**
		* Sets up the location change listener and performs the initial navigation.
		*/
		initialNavigation() {
			this.setUpLocationChangeListener();
			if (!this.navigationTransitions.hasRequestedNavigation) this.navigateToSyncWithBrowser(this.location.path(true), IMPERATIVE_NAVIGATION, this.stateManager.restoredState());
		}
		/**
		* Sets up the location change listener. This listener detects navigations triggered from outside
		* the Router (the browser back/forward buttons, for example) and schedules a corresponding Router
		* navigation so that the correct events, guards, etc. are triggered.
		*/
		setUpLocationChangeListener() {
			this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener((url, state, source) => {
				this.navigateToSyncWithBrowser(url, source, state);
			});
		}
		/**
		* Schedules a router navigation to synchronize Router state with the browser state.
		*
		* This is done as a response to a popstate event and the initial navigation. These
		* two scenarios represent times when the browser URL/state has been updated and
		* the Router needs to respond to ensure its internal state matches.
		*/
		navigateToSyncWithBrowser(url, source, state) {
			const extras = { replaceUrl: true };
			const restoredState = state?.navigationId ? state : null;
			if (state) {
				const stateCopy = { ...state };
				delete stateCopy.navigationId;
				delete stateCopy.ɵrouterPageId;
				if (Object.keys(stateCopy).length !== 0) extras.state = stateCopy;
			}
			const urlTree = this.parseUrl(url);
			this.scheduleNavigation(urlTree, source, restoredState, extras).catch((e) => {
				if (this.disposed) return;
				this.injector.get(__mf_179)(e);
			});
		}
		/** The current URL. */
		get url() {
			return this.serializeUrl(this.currentUrlTree);
		}
		/**
		* Returns the current `Navigation` object when the router is navigating,
		* and `null` when idle.
		*
		* @deprecated 20.2 Use the `currentNavigation` signal instead.
		*/
		getCurrentNavigation() {
			return __mf_152(this.navigationTransitions.currentNavigation);
		}
		/**
		* The `Navigation` object of the most recent navigation to succeed and `null` if there
		*     has not been a successful navigation yet.
		*/
		get lastSuccessfulNavigation() {
			return this.navigationTransitions.lastSuccessfulNavigation;
		}
		/**
		* Resets the route configuration used for navigation and generating links.
		*
		* @param config The route array for the new configuration.
		*
		* @usageNotes
		*
		* ```ts
		* router.resetConfig([
		*  { path: 'team/:id', component: TeamCmp, children: [
		*    { path: 'simple', component: SimpleCmp },
		*    { path: 'user/:name', component: UserCmp }
		*  ]}
		* ]);
		* ```
		*/
		resetConfig(config) {
			this.config = config.map(standardizeConfig);
			this.navigated = false;
		}
		/** @docs-private */
		ngOnDestroy() {
			this.dispose();
		}
		/** Disposes of the router. */
		dispose() {
			this._events.unsubscribe();
			this.navigationTransitions.complete();
			if (this.nonRouterCurrentEntryChangeSubscription) {
				this.nonRouterCurrentEntryChangeSubscription.unsubscribe();
				this.nonRouterCurrentEntryChangeSubscription = void 0;
			}
			this.disposed = true;
			this.eventsSubscription.unsubscribe();
		}
		/**
		* Appends URL segments to the current URL tree to create a new URL tree.
		*
		* @param commands An array of URL fragments with which to construct the new URL tree.
		* If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
		* segments, followed by the parameters for each segment.
		* The fragments are applied to the current URL tree or the one provided  in the `relativeTo`
		* property of the options object, if supplied.
		* @param navigationExtras Options that control the navigation strategy.
		* @returns The new URL tree.
		*
		* @usageNotes
		*
		* ```
		* // create /team/33/user/11
		* router.createUrlTree(['/team', 33, 'user', 11]);
		*
		* // create /team/33;expand=true/user/11
		* router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
		*
		* // you can collapse static segments like this (this works only with the first passed-in value):
		* router.createUrlTree(['/team/33/user', userId]);
		*
		* // If the first segment can contain slashes, and you do not want the router to split it,
		* // you can do the following:
		* router.createUrlTree([{segmentPath: '/one/two'}]);
		*
		* // create /team/33/(user/11//right:chat)
		* router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
		*
		* // remove the right secondary node
		* router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
		*
		* // assuming the current url is `/team/33/user/11` and the route points to `user/11`
		*
		* // navigate to /team/33/user/11/details
		* router.createUrlTree(['details'], {relativeTo: route});
		*
		* // navigate to /team/33/user/22
		* router.createUrlTree(['../22'], {relativeTo: route});
		*
		* // navigate to /team/44/user/22
		* router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
		*
		* Note that a value of `null` or `undefined` for `relativeTo` indicates that the
		* tree should be created relative to the root.
		* ```
		*/
		createUrlTree(commands, navigationExtras = {}) {
			const { relativeTo, queryParams, fragment, queryParamsHandling, preserveFragment } = navigationExtras;
			const f = preserveFragment ? this.currentUrlTree.fragment : fragment;
			let q = null;
			switch (queryParamsHandling ?? this.options.defaultQueryParamsHandling) {
				case "merge":
					q = {
						...this.currentUrlTree.queryParams,
						...queryParams
					};
					break;
				case "preserve":
					q = this.currentUrlTree.queryParams;
					break;
				default: q = queryParams || null;
			}
			if (q !== null) q = this.removeEmptyProps(q);
			let relativeToUrlSegmentGroup;
			try {
				relativeToUrlSegmentGroup = createSegmentGroupFromRoute(relativeTo ? relativeTo.snapshot : this.routerState.snapshot.root);
			} catch (e) {
				if (typeof commands[0] !== "string" || commands[0][0] !== "/") commands = [];
				relativeToUrlSegmentGroup = this.currentUrlTree.root;
			}
			return createUrlTreeFromSegmentGroup(relativeToUrlSegmentGroup, commands, q, f ?? null);
		}
		/**
		* Navigates to a view using an absolute route path.
		*
		* @param url An absolute path for a defined route. The function does not apply any delta to the
		*     current URL.
		* @param extras An object containing properties that modify the navigation strategy.
		*
		* @returns A Promise that resolves to 'true' when navigation succeeds,
		* to 'false' when navigation fails, or is rejected on error.
		*
		* @usageNotes
		*
		* The following calls request navigation to an absolute path.
		*
		* ```ts
		* router.navigateByUrl("/team/33/user/11");
		*
		* // Navigate without updating the URL
		* router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
		* ```
		*
		* @see [Routing and Navigation guide](guide/routing/common-router-tasks)
		*
		*/
		navigateByUrl(url, extras = { skipLocationChange: false }) {
			const urlTree = isUrlTree(url) ? url : this.parseUrl(url);
			const mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
			return this.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras);
		}
		/**
		* Navigate based on the provided array of commands and a starting point.
		* If no starting route is provided, the navigation is absolute.
		*
		* @param commands An array of URL fragments with which to construct the target URL.
		* If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
		* segments, followed by the parameters for each segment.
		* The fragments are applied to the current URL or the one provided  in the `relativeTo` property
		* of the options object, if supplied.
		* @param extras An options object that determines how the URL should be constructed or
		*     interpreted.
		*
		* @returns A Promise that resolves to `true` when navigation succeeds, or `false` when navigation
		*     fails. The Promise is rejected when an error occurs if `resolveNavigationPromiseOnError` is
		* not `true`.
		*
		* @usageNotes
		*
		* The following calls request navigation to a dynamic route path relative to the current URL.
		*
		* ```ts
		* router.navigate(['team', 33, 'user', 11], {relativeTo: route});
		*
		* // Navigate without updating the URL, overriding the default behavior
		* router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
		* ```
		*
		* @see [Routing and Navigation guide](guide/routing/common-router-tasks)
		*
		*/
		navigate(commands, extras = { skipLocationChange: false }) {
			validateCommands(commands);
			return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
		}
		/** Serializes a `UrlTree` into a string */
		serializeUrl(url) {
			return this.urlSerializer.serialize(url);
		}
		/** Parses a string into a `UrlTree` */
		parseUrl(url) {
			try {
				return this.urlSerializer.parse(url);
			} catch (e) {
				this.console.warn(__mf_248(4018, false));
				return this.urlSerializer.parse("/");
			}
		}
		isActive(url, matchOptions) {
			let options;
			if (matchOptions === true) options = { ...exactMatchOptions };
			else if (matchOptions === false) options = { ...subsetMatchOptions };
			else options = matchOptions;
			if (isUrlTree(url)) return containsTree(this.currentUrlTree, url, options);
			const urlTree = this.parseUrl(url);
			return containsTree(this.currentUrlTree, urlTree, options);
		}
		removeEmptyProps(params) {
			return Object.entries(params).reduce((result, [key, value]) => {
				if (value !== null && value !== void 0) result[key] = value;
				return result;
			}, {});
		}
		scheduleNavigation(rawUrl, source, restoredState, extras, priorPromise) {
			if (this.disposed) return Promise.resolve(false);
			let resolve;
			let reject;
			let promise;
			if (priorPromise) {
				resolve = priorPromise.resolve;
				reject = priorPromise.reject;
				promise = priorPromise.promise;
			} else promise = new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			});
			const taskId = this.pendingTasks.add();
			afterNextNavigation(this, () => {
				queueMicrotask(() => this.pendingTasks.remove(taskId));
			});
			this.navigationTransitions.handleNavigationRequest({
				source,
				restoredState,
				currentUrlTree: this.currentUrlTree,
				currentRawUrl: this.currentUrlTree,
				rawUrl,
				extras,
				resolve,
				reject,
				promise,
				currentSnapshot: this.routerState.snapshot,
				currentRouterState: this.routerState
			});
			return promise.catch((e) => {
				return Promise.reject(e);
			});
		}
		static ɵfac = function Router_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || Router)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: Router,
			factory: Router.ɵfac,
			providedIn: "root"
		});
	}
	return Router;
})();
function validateCommands(commands) {
	for (let i = 0; i < commands.length; i++) if (commands[i] == null) throw new __mf_207(4008, false);
}
//#endregion
//#region ../../../node_modules/.pnpm/@angular+router@20.3.20_@angular+common@20.3.20_@angular+core@20.3.20_@angular+compiler_f44a24d86c8db5f4d9f84c16fbc16cec/node_modules/@angular/router/fesm2022/router_module.mjs
/**
* @license Angular v20.3.20
* (c) 2010-2025 Google LLC. https://angular.dev/
* License: MIT
*/
/**
* @description
*
* When applied to an element in a template, makes that element a link
* that initiates navigation to a route. Navigation opens one or more routed components
* in one or more `<router-outlet>` locations on the page.
*
* Given a route configuration `[{ path: 'user/:name', component: UserCmp }]`,
* the following creates a static link to the route:
* `<a routerLink="/user/bob">link to user component</a>`
*
* You can use dynamic values to generate the link.
* For a dynamic link, pass an array of path segments,
* followed by the params for each segment.
* For example, `['/team', teamId, 'user', userName, {details: true}]`
* generates a link to `/team/11/user/bob;details=true`.
*
* Multiple static segments can be merged into one term and combined with dynamic segments.
* For example, `['/team/11/user', userName, {details: true}]`
*
* The input that you provide to the link is treated as a delta to the current URL.
* For instance, suppose the current URL is `/user/(box//aux:team)`.
* The link `<a [routerLink]="['/user/jim']">Jim</a>` creates the URL
* `/user/(jim//aux:team)`.
* See {@link Router#createUrlTree} for more information.
*
* @usageNotes
*
* You can use absolute or relative paths in a link, set query parameters,
* control how parameters are handled, and keep a history of navigation states.
*
* ### Relative link paths
*
* The first segment name can be prepended with `/`, `./`, or `../`.
* * If the first segment begins with `/`, the router looks up the route from the root of the
*   app.
* * If the first segment begins with `./`, or doesn't begin with a slash, the router
*   looks in the children of the current activated route.
* * If the first segment begins with `../`, the router goes up one level in the route tree.
*
* ### Setting and handling query params and fragments
*
* The following link adds a query parameter and a fragment to the generated URL:
*
* ```html
* <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
*   link to user component
* </a>
* ```
* By default, the directive constructs the new URL using the given query parameters.
* The example generates the link: `/user/bob?debug=true#education`.
*
* You can instruct the directive to handle query parameters differently
* by specifying the `queryParamsHandling` option in the link.
* Allowed values are:
*
*  - `'merge'`: Merge the given `queryParams` into the current query params.
*  - `'preserve'`: Preserve the current query params.
*
* For example:
*
* ```html
* <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
*   link to user component
* </a>
* ```
*
* `queryParams`, `fragment`, `queryParamsHandling`, `preserveFragment`, and `relativeTo`
* cannot be used when the `routerLink` input is a `UrlTree`.
*
* See {@link UrlCreationOptions#queryParamsHandling}.
*
* ### Preserving navigation history
*
* You can provide a `state` value to be persisted to the browser's
* [`History.state` property](https://developer.mozilla.org/en-US/docs/Web/API/History#Properties).
* For example:
*
* ```html
* <a [routerLink]="['/user/bob']" [state]="{tracingId: 123}">
*   link to user component
* </a>
* ```
*
* Use {@link Router#getCurrentNavigation} to retrieve a saved
* navigation-state value. For example, to capture the `tracingId` during the `NavigationStart`
* event:
*
* ```ts
* // Get NavigationStart events
* router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
*   const navigation = router.getCurrentNavigation();
*   tracingService.trace({id: navigation.extras.state.tracingId});
* });
* ```
*
* ### RouterLink compatible custom elements
*
* In order to make a custom element work with routerLink, the corresponding custom
* element must implement the `href` attribute and must list `href` in the array of
* the static property/getter `observedAttributes`.
*
* @ngModule RouterModule
*
* @publicApi
*/
var RouterLink = /* @__PURE__ */ (() => {
	class RouterLink {
		router;
		route;
		tabIndexAttribute;
		renderer;
		el;
		locationStrategy;
		/** @nodoc */
		reactiveHref = __mf_150(null, ...[]);
		/**
		* Represents an `href` attribute value applied to a host element,
		* when a host element is an `<a>`/`<area>` tag or a compatible custom element.
		* For other tags, the value is `null`.
		*/
		get href() {
			return __mf_152(this.reactiveHref);
		}
		/** @deprecated */
		set href(value) {
			this.reactiveHref.set(value);
		}
		/**
		* Represents the `target` attribute on a host element.
		* This is only used when the host element is
		* an `<a>`/`<area>` tag or a compatible custom element.
		*/
		target;
		/**
		* Passed to {@link Router#createUrlTree} as part of the
		* `UrlCreationOptions`.
		* @see {@link UrlCreationOptions#queryParams}
		* @see {@link Router#createUrlTree}
		*/
		queryParams;
		/**
		* Passed to {@link Router#createUrlTree} as part of the
		* `UrlCreationOptions`.
		* @see {@link UrlCreationOptions#fragment}
		* @see {@link Router#createUrlTree}
		*/
		fragment;
		/**
		* Passed to {@link Router#createUrlTree} as part of the
		* `UrlCreationOptions`.
		* @see {@link UrlCreationOptions#queryParamsHandling}
		* @see {@link Router#createUrlTree}
		*/
		queryParamsHandling;
		/**
		* Passed to {@link Router#navigateByUrl} as part of the
		* `NavigationBehaviorOptions`.
		* @see {@link NavigationBehaviorOptions#state}
		* @see {@link Router#navigateByUrl}
		*/
		state;
		/**
		* Passed to {@link Router#navigateByUrl} as part of the
		* `NavigationBehaviorOptions`.
		* @see {@link NavigationBehaviorOptions#info}
		* @see {@link Router#navigateByUrl}
		*/
		info;
		/**
		* Passed to {@link Router#createUrlTree} as part of the
		* `UrlCreationOptions`.
		* Specify a value here when you do not want to use the default value
		* for `routerLink`, which is the current activated route.
		* Note that a value of `undefined` here will use the `routerLink` default.
		* @see {@link UrlCreationOptions#relativeTo}
		* @see {@link Router#createUrlTree}
		*/
		relativeTo;
		/** Whether a host element is an `<a>`/`<area>` tag or a compatible custom element. */
		isAnchorElement;
		subscription;
		/** @internal */
		onChanges = new __mf_4$1();
		applicationErrorHandler = __mf_122(__mf_179);
		options = __mf_122(ROUTER_CONFIGURATION, { optional: true });
		constructor(router, route, tabIndexAttribute, renderer, el, locationStrategy) {
			this.router = router;
			this.route = route;
			this.tabIndexAttribute = tabIndexAttribute;
			this.renderer = renderer;
			this.el = el;
			this.locationStrategy = locationStrategy;
			this.reactiveHref.set(__mf_122(new __mf_37$1("href"), { optional: true }));
			const tagName = el.nativeElement.tagName?.toLowerCase();
			this.isAnchorElement = tagName === "a" || tagName === "area" || !!(typeof customElements === "object" && customElements.get(tagName)?.observedAttributes?.includes?.("href"));
			if (!this.isAnchorElement) this.subscribeToNavigationEventsIfNecessary();
			else this.setTabIndexIfNotOnNativeEl("0");
		}
		subscribeToNavigationEventsIfNecessary() {
			if (this.subscription !== void 0 || !this.isAnchorElement) return;
			let createSubcription = this.preserveFragment;
			const dependsOnRouterState = (handling) => handling === "merge" || handling === "preserve";
			createSubcription ||= dependsOnRouterState(this.queryParamsHandling);
			createSubcription ||= !this.queryParamsHandling && !dependsOnRouterState(this.options?.defaultQueryParamsHandling);
			if (!createSubcription) return;
			this.subscription = this.router.events.subscribe((s) => {
				if (s instanceof NavigationEnd) this.updateHref();
			});
		}
		/**
		* Passed to {@link Router#createUrlTree} as part of the
		* `UrlCreationOptions`.
		* @see {@link UrlCreationOptions#preserveFragment}
		* @see {@link Router#createUrlTree}
		*/
		preserveFragment = false;
		/**
		* Passed to {@link Router#navigateByUrl} as part of the
		* `NavigationBehaviorOptions`.
		* @see {@link NavigationBehaviorOptions#skipLocationChange}
		* @see {@link Router#navigateByUrl}
		*/
		skipLocationChange = false;
		/**
		* Passed to {@link Router#navigateByUrl} as part of the
		* `NavigationBehaviorOptions`.
		* @see {@link NavigationBehaviorOptions#replaceUrl}
		* @see {@link Router#navigateByUrl}
		*/
		replaceUrl = false;
		/**
		* Modifies the tab index if there was not a tabindex attribute on the element during
		* instantiation.
		*/
		setTabIndexIfNotOnNativeEl(newTabIndex) {
			if (this.tabIndexAttribute != null || this.isAnchorElement) return;
			this.applyAttributeValue("tabindex", newTabIndex);
		}
		/** @docs-private */
		ngOnChanges(changes) {
			if (this.isAnchorElement) {
				this.updateHref();
				this.subscribeToNavigationEventsIfNecessary();
			}
			this.onChanges.next(this);
		}
		routerLinkInput = null;
		/**
		* Commands to pass to {@link Router#createUrlTree} or a `UrlTree`.
		*   - **array**: commands to pass to {@link Router#createUrlTree}.
		*   - **string**: shorthand for array of commands with just the string, i.e. `['/route']`
		*   - **UrlTree**: a `UrlTree` for this link rather than creating one from the commands
		*     and other inputs that correspond to properties of `UrlCreationOptions`.
		*   - **null|undefined**: effectively disables the `routerLink`
		* @see {@link Router#createUrlTree}
		*/
		set routerLink(commandsOrUrlTree) {
			if (commandsOrUrlTree == null) {
				this.routerLinkInput = null;
				this.setTabIndexIfNotOnNativeEl(null);
			} else {
				if (isUrlTree(commandsOrUrlTree)) this.routerLinkInput = commandsOrUrlTree;
				else this.routerLinkInput = Array.isArray(commandsOrUrlTree) ? commandsOrUrlTree : [commandsOrUrlTree];
				this.setTabIndexIfNotOnNativeEl("0");
			}
		}
		/** @docs-private */
		onClick(button, ctrlKey, shiftKey, altKey, metaKey) {
			const urlTree = this.urlTree;
			if (urlTree === null) return true;
			if (this.isAnchorElement) {
				if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) return true;
				if (typeof this.target === "string" && this.target != "_self") return true;
			}
			const extras = {
				skipLocationChange: this.skipLocationChange,
				replaceUrl: this.replaceUrl,
				state: this.state,
				info: this.info
			};
			this.router.navigateByUrl(urlTree, extras)?.catch((e) => {
				this.applicationErrorHandler(e);
			});
			return !this.isAnchorElement;
		}
		/** @docs-private */
		ngOnDestroy() {
			this.subscription?.unsubscribe();
		}
		updateHref() {
			const urlTree = this.urlTree;
			this.reactiveHref.set(urlTree !== null && this.locationStrategy ? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(urlTree)) ?? "" : null);
		}
		applyAttributeValue(attrName, attrValue) {
			const renderer = this.renderer;
			const nativeElement = this.el.nativeElement;
			if (attrValue !== null) renderer.setAttribute(nativeElement, attrName, attrValue);
			else renderer.removeAttribute(nativeElement, attrName);
		}
		get urlTree() {
			if (this.routerLinkInput === null) return null;
			else if (isUrlTree(this.routerLinkInput)) return this.routerLinkInput;
			return this.router.createUrlTree(this.routerLinkInput, {
				relativeTo: this.relativeTo !== void 0 ? this.relativeTo : this.route,
				queryParams: this.queryParams,
				fragment: this.fragment,
				queryParamsHandling: this.queryParamsHandling,
				preserveFragment: this.preserveFragment
			});
		}
		static ɵfac = function RouterLink_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterLink)(__mf_372(Router), __mf_372(ActivatedRoute), __mf_402("tabindex"), __mf_372(__mf_72$1), __mf_372(__mf_30$2), __mf_372(__mf_21$1));
		};
		static ɵdir = /* @__PURE__ */ __mf_367({
			type: RouterLink,
			selectors: [[
				"",
				"routerLink",
				""
			]],
			hostVars: 2,
			hostBindings: function RouterLink_HostBindings(rf, ctx) {
				if (rf & 1) __mf_415("click", function RouterLink_click_HostBindingHandler($event) {
					return ctx.onClick($event.button, $event.ctrlKey, $event.shiftKey, $event.altKey, $event.metaKey);
				});
				if (rf & 2) __mf_332("href", ctx.reactiveHref(), __mf_469)("target", ctx.target);
			},
			inputs: {
				target: "target",
				queryParams: "queryParams",
				fragment: "fragment",
				queryParamsHandling: "queryParamsHandling",
				state: "state",
				info: "info",
				relativeTo: "relativeTo",
				preserveFragment: [
					2,
					"preserveFragment",
					"preserveFragment",
					__mf_101
				],
				skipLocationChange: [
					2,
					"skipLocationChange",
					"skipLocationChange",
					__mf_101
				],
				replaceUrl: [
					2,
					"replaceUrl",
					"replaceUrl",
					__mf_101
				],
				routerLink: "routerLink"
			},
			features: [__mf_323]
		});
	}
	return RouterLink;
})();
/**
*
* @description
*
* Tracks whether the linked route of an element is currently active, and allows you
* to specify one or more CSS classes to add to the element when the linked route
* is active.
*
* Use this directive to create a visual distinction for elements associated with an active route.
* For example, the following code highlights the word "Bob" when the router
* activates the associated route:
*
* ```html
* <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
* ```
*
* Whenever the URL is either '/user' or '/user/bob', the "active-link" class is
* added to the anchor tag. If the URL changes, the class is removed.
*
* You can set more than one class using a space-separated string or an array.
* For example:
*
* ```html
* <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
* <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
* ```
*
* To add the classes only when the URL matches the link exactly, add the option `exact: true`:
*
* ```html
* <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
* true}">Bob</a>
* ```
*
* To directly check the `isActive` status of the link, assign the `RouterLinkActive`
* instance to a template variable.
* For example, the following checks the status without assigning any CSS classes:
*
* ```html
* <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
*   Bob {{ rla.isActive ? '(already open)' : ''}}
* </a>
* ```
*
* You can apply the `RouterLinkActive` directive to an ancestor of linked elements.
* For example, the following sets the active-link class on the `<div>`  parent tag
* when the URL is either '/user/jim' or '/user/bob'.
*
* ```html
* <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
*   <a routerLink="/user/jim">Jim</a>
*   <a routerLink="/user/bob">Bob</a>
* </div>
* ```
*
* The `RouterLinkActive` directive can also be used to set the aria-current attribute
* to provide an alternative distinction for active elements to visually impaired users.
*
* For example, the following code adds the 'active' class to the Home Page link when it is
* indeed active and in such case also sets its aria-current attribute to 'page':
*
* ```html
* <a routerLink="/" routerLinkActive="active" ariaCurrentWhenActive="page">Home Page</a>
* ```
*
* NOTE: RouterLinkActive is a `ContentChildren` query.
* Content children queries do not retrieve elements or directives that are in other components' templates, since a component's template is always a black box to its ancestors.
*
* @ngModule RouterModule
*
* @see [Detect active current route with RouterLinkActive](guide/routing/read-route-state#detect-active-current-route-with-routerlinkactive)
*
* @publicApi
*/
var RouterLinkActive = /* @__PURE__ */ (() => {
	class RouterLinkActive {
		router;
		element;
		renderer;
		cdr;
		link;
		links;
		classes = [];
		routerEventsSubscription;
		linkInputChangesSubscription;
		_isActive = false;
		get isActive() {
			return this._isActive;
		}
		/**
		* Options to configure how to determine if the router link is active.
		*
		* These options are passed to the `Router.isActive()` function.
		*
		* @see {@link Router#isActive}
		*/
		routerLinkActiveOptions = { exact: false };
		/**
		* Aria-current attribute to apply when the router link is active.
		*
		* Possible values: `'page'` | `'step'` | `'location'` | `'date'` | `'time'` | `true` | `false`.
		*
		* @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current}
		*/
		ariaCurrentWhenActive;
		/**
		*
		* You can use the output `isActiveChange` to get notified each time the link becomes
		* active or inactive.
		*
		* Emits:
		* true  -> Route is active
		* false -> Route is inactive
		*
		* ```html
		* <a
		*  routerLink="/user/bob"
		*  routerLinkActive="active-link"
		*  (isActiveChange)="this.onRouterLinkActive($event)">Bob</a>
		* ```
		*/
		isActiveChange = new __mf_34$1();
		constructor(router, element, renderer, cdr, link) {
			this.router = router;
			this.element = element;
			this.renderer = renderer;
			this.cdr = cdr;
			this.link = link;
			this.routerEventsSubscription = router.events.subscribe((s) => {
				if (s instanceof NavigationEnd) this.update();
			});
		}
		/** @docs-private */
		ngAfterContentInit() {
			__mf_52$1(this.links.changes, __mf_52$1(null)).pipe(mergeAll()).subscribe((_) => {
				this.update();
				this.subscribeToEachLinkOnChanges();
			});
		}
		subscribeToEachLinkOnChanges() {
			this.linkInputChangesSubscription?.unsubscribe();
			const allLinkChanges = [...this.links.toArray(), this.link].filter((link) => !!link).map((link) => link.onChanges);
			this.linkInputChangesSubscription = __mf_44$1(allLinkChanges).pipe(mergeAll()).subscribe((link) => {
				if (this._isActive !== this.isLinkActive(this.router)(link)) this.update();
			});
		}
		set routerLinkActive(data) {
			const classes = Array.isArray(data) ? data : data.split(" ");
			this.classes = classes.filter((c) => !!c);
		}
		/** @docs-private */
		ngOnChanges(changes) {
			this.update();
		}
		/** @docs-private */
		ngOnDestroy() {
			this.routerEventsSubscription.unsubscribe();
			this.linkInputChangesSubscription?.unsubscribe();
		}
		update() {
			if (!this.links || !this.router.navigated) return;
			queueMicrotask(() => {
				const hasActiveLinks = this.hasActiveLinks();
				this.classes.forEach((c) => {
					if (hasActiveLinks) this.renderer.addClass(this.element.nativeElement, c);
					else this.renderer.removeClass(this.element.nativeElement, c);
				});
				if (hasActiveLinks && this.ariaCurrentWhenActive !== void 0) this.renderer.setAttribute(this.element.nativeElement, "aria-current", this.ariaCurrentWhenActive.toString());
				else this.renderer.removeAttribute(this.element.nativeElement, "aria-current");
				if (this._isActive !== hasActiveLinks) {
					this._isActive = hasActiveLinks;
					this.cdr.markForCheck();
					this.isActiveChange.emit(hasActiveLinks);
				}
			});
		}
		isLinkActive(router) {
			const options = isActiveMatchOptions(this.routerLinkActiveOptions) ? this.routerLinkActiveOptions : this.routerLinkActiveOptions.exact || false;
			return (link) => {
				const urlTree = link.urlTree;
				return urlTree ? router.isActive(urlTree, options) : false;
			};
		}
		hasActiveLinks() {
			const isActiveCheckFn = this.isLinkActive(this.router);
			return this.link && isActiveCheckFn(this.link) || this.links.some(isActiveCheckFn);
		}
		static ɵfac = function RouterLinkActive_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterLinkActive)(__mf_372(Router), __mf_372(__mf_30$2), __mf_372(__mf_72$1), __mf_372(__mf_12$1), __mf_372(RouterLink, 8));
		};
		static ɵdir = /* @__PURE__ */ __mf_367({
			type: RouterLinkActive,
			selectors: [[
				"",
				"routerLinkActive",
				""
			]],
			contentQueries: function RouterLinkActive_ContentQueries(rf, ctx, dirIndex) {
				if (rf & 1) __mf_339(dirIndex, RouterLink, 5);
				if (rf & 2) {
					let _t;
					__mf_450(_t = __mf_416()) && (ctx.links = _t);
				}
			},
			inputs: {
				routerLinkActiveOptions: "routerLinkActiveOptions",
				ariaCurrentWhenActive: "ariaCurrentWhenActive",
				routerLinkActive: "routerLinkActive"
			},
			outputs: { isActiveChange: "isActiveChange" },
			exportAs: ["routerLinkActive"],
			features: [__mf_323]
		});
	}
	return RouterLinkActive;
})();
/**
* Use instead of `'paths' in options` to be compatible with property renaming
*/
function isActiveMatchOptions(options) {
	return !!options.paths;
}
/**
* @description
*
* Provides a preloading strategy.
*
* @publicApi
*/
var PreloadingStrategy = class {};
/**
* @description
*
* Provides a preloading strategy that preloads all modules as quickly as possible.
*
* ```ts
* RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
* ```
*
* @publicApi
*/
var PreloadAllModules = /* @__PURE__ */ (() => {
	class PreloadAllModules {
		preload(route, fn) {
			return fn().pipe(catchError(() => __mf_52$1(null)));
		}
		static ɵfac = function PreloadAllModules_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || PreloadAllModules)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: PreloadAllModules,
			factory: PreloadAllModules.ɵfac,
			providedIn: "root"
		});
	}
	return PreloadAllModules;
})();
/**
* @description
*
* Provides a preloading strategy that does not preload any modules.
*
* This strategy is enabled by default.
*
* @publicApi
*/
var NoPreloading = /* @__PURE__ */ (() => {
	class NoPreloading {
		preload(route, fn) {
			return __mf_52$1(null);
		}
		static ɵfac = function NoPreloading_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || NoPreloading)();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: NoPreloading,
			factory: NoPreloading.ɵfac,
			providedIn: "root"
		});
	}
	return NoPreloading;
})();
/**
* The preloader optimistically loads all router configurations to
* make navigations into lazily-loaded sections of the application faster.
*
* The preloader runs in the background. When the router bootstraps, the preloader
* starts listening to all navigation events. After every such event, the preloader
* will check if any configurations can be loaded lazily.
*
* If a route is protected by `canLoad` guards, the preloaded will not load it.
*
* @publicApi
*/
var RouterPreloader = /* @__PURE__ */ (() => {
	class RouterPreloader {
		router;
		injector;
		preloadingStrategy;
		loader;
		subscription;
		constructor(router, injector, preloadingStrategy, loader) {
			this.router = router;
			this.injector = injector;
			this.preloadingStrategy = preloadingStrategy;
			this.loader = loader;
		}
		setUpPreloading() {
			this.subscription = this.router.events.pipe(filter((e) => e instanceof NavigationEnd), concatMap(() => this.preload())).subscribe(() => {});
		}
		preload() {
			return this.processRoutes(this.injector, this.router.config);
		}
		/** @docs-private */
		ngOnDestroy() {
			if (this.subscription) this.subscription.unsubscribe();
		}
		processRoutes(injector, routes) {
			const res = [];
			for (const route of routes) {
				if (route.providers && !route._injector) route._injector = __mf_106(route.providers, injector, `Route: ${route.path}`);
				const injectorForCurrentRoute = route._injector ?? injector;
				const injectorForChildren = route._loadedInjector ?? injectorForCurrentRoute;
				if (route.loadChildren && !route._loadedRoutes && route.canLoad === void 0 || route.loadComponent && !route._loadedComponent) res.push(this.preloadConfig(injectorForCurrentRoute, route));
				if (route.children || route._loadedRoutes) res.push(this.processRoutes(injectorForChildren, route.children ?? route._loadedRoutes));
			}
			return __mf_44$1(res).pipe(mergeAll());
		}
		preloadConfig(injector, route) {
			return this.preloadingStrategy.preload(route, () => {
				let loadedChildren$;
				if (route.loadChildren && route.canLoad === void 0) loadedChildren$ = this.loader.loadChildren(injector, route);
				else loadedChildren$ = __mf_52$1(null);
				const recursiveLoadChildren$ = loadedChildren$.pipe(mergeMap((config) => {
					if (config === null) return __mf_52$1(void 0);
					route._loadedRoutes = config.routes;
					route._loadedInjector = config.injector;
					return this.processRoutes(config.injector ?? injector, config.routes);
				}));
				if (route.loadComponent && !route._loadedComponent) return __mf_44$1([recursiveLoadChildren$, this.loader.loadComponent(injector, route)]).pipe(mergeAll());
				else return recursiveLoadChildren$;
			});
		}
		static ɵfac = function RouterPreloader_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterPreloader)(__mf_401(Router), __mf_401(__mf_32$1), __mf_401(PreloadingStrategy), __mf_401(RouterConfigLoader));
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: RouterPreloader,
			factory: RouterPreloader.ɵfac,
			providedIn: "root"
		});
	}
	return RouterPreloader;
})();
var ROUTER_SCROLLER = /* @__PURE__ */ new __mf_43$1("");
var RouterScroller = /* @__PURE__ */ (() => {
	class RouterScroller {
		urlSerializer;
		transitions;
		viewportScroller;
		zone;
		options;
		routerEventsSubscription;
		scrollEventsSubscription;
		lastId = 0;
		lastSource = IMPERATIVE_NAVIGATION;
		restoredId = 0;
		store = {};
		/** @docs-private */
		constructor(urlSerializer, transitions, viewportScroller, zone, options = {}) {
			this.urlSerializer = urlSerializer;
			this.transitions = transitions;
			this.viewportScroller = viewportScroller;
			this.zone = zone;
			this.options = options;
			options.scrollPositionRestoration ||= "disabled";
			options.anchorScrolling ||= "disabled";
		}
		init() {
			if (this.options.scrollPositionRestoration !== "disabled") this.viewportScroller.setHistoryScrollRestoration("manual");
			this.routerEventsSubscription = this.createScrollEvents();
			this.scrollEventsSubscription = this.consumeScrollEvents();
		}
		createScrollEvents() {
			return this.transitions.events.subscribe((e) => {
				if (e instanceof NavigationStart) {
					this.store[this.lastId] = this.viewportScroller.getScrollPosition();
					this.lastSource = e.navigationTrigger;
					this.restoredId = e.restoredState ? e.restoredState.navigationId : 0;
				} else if (e instanceof NavigationEnd) {
					this.lastId = e.id;
					this.scheduleScrollEvent(e, this.urlSerializer.parse(e.urlAfterRedirects).fragment);
				} else if (e instanceof NavigationSkipped && e.code === NavigationSkippedCode.IgnoredSameUrlNavigation) {
					this.lastSource = void 0;
					this.restoredId = 0;
					this.scheduleScrollEvent(e, this.urlSerializer.parse(e.url).fragment);
				}
			});
		}
		consumeScrollEvents() {
			return this.transitions.events.subscribe((e) => {
				if (!(e instanceof Scroll)) return;
				const instantScroll = { behavior: "instant" };
				if (e.position) {
					if (this.options.scrollPositionRestoration === "top") this.viewportScroller.scrollToPosition([0, 0], instantScroll);
					else if (this.options.scrollPositionRestoration === "enabled") this.viewportScroller.scrollToPosition(e.position, instantScroll);
				} else if (e.anchor && this.options.anchorScrolling === "enabled") this.viewportScroller.scrollToAnchor(e.anchor);
				else if (this.options.scrollPositionRestoration !== "disabled") this.viewportScroller.scrollToPosition([0, 0]);
			});
		}
		scheduleScrollEvent(routerEvent, anchor) {
			this.zone.runOutsideAngular(async () => {
				await new Promise((resolve) => {
					setTimeout(resolve);
					if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(resolve);
				});
				this.zone.run(() => {
					this.transitions.events.next(new Scroll(routerEvent, this.lastSource === "popstate" ? this.store[this.restoredId] : null, anchor));
				});
			});
		}
		/** @docs-private */
		ngOnDestroy() {
			this.routerEventsSubscription?.unsubscribe();
			this.scrollEventsSubscription?.unsubscribe();
		}
		static ɵfac = function RouterScroller_Factory(__ngFactoryType__) {
			__mf_413();
		};
		static ɵprov = /* @__PURE__ */ __mf_368({
			token: RouterScroller,
			factory: RouterScroller.ɵfac
		});
	}
	return RouterScroller;
})();
/**
* Sets up providers necessary to enable `Router` functionality for the application.
* Allows to configure a set of routes as well as extra features that should be enabled.
*
* @usageNotes
*
* Basic example of how you can add a Router to your application:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent, {
*   providers: [provideRouter(appRoutes)]
* });
* ```
*
* You can also enable optional features in the Router by adding functions from the `RouterFeatures`
* type:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes,
*         withDebugTracing(),
*         withRouterConfig({paramsInheritanceStrategy: 'always'}))
*     ]
*   }
* );
* ```
* @see [Router](guide/routing)
*
* @see {@link RouterFeatures}
*
* @publicApi
* @param routes A set of `Route`s to use for the application routing table.
* @param features Optional features to configure additional router behaviors.
* @returns A set of providers to setup a Router.
*/
function provideRouter(routes, ...features) {
	return __mf_129([
		{
			provide: ROUTES,
			multi: true,
			useValue: routes
		},
		[],
		{
			provide: ActivatedRoute,
			useFactory: rootRoute,
			deps: [Router]
		},
		{
			provide: __mf_1$2,
			multi: true,
			useFactory: getBootstrapListener
		},
		features.map((feature) => feature.ɵproviders)
	]);
}
function rootRoute(router) {
	return router.routerState.root;
}
/**
* Helper function to create an object that represents a Router feature.
*/
function routerFeature(kind, providers) {
	return {
		ɵkind: kind,
		ɵproviders: providers
	};
}
/**
* Registers a DI provider for a set of routes.
* @param routes The route configuration to provide.
*
* @usageNotes
*
* ```ts
* @NgModule({
*   providers: [provideRoutes(ROUTES)]
* })
* class LazyLoadedChildModule {}
* ```
*
* @deprecated If necessary, provide routes using the `ROUTES` `InjectionToken`.
* @see {@link ROUTES}
* @publicApi
*/
function provideRoutes(routes) {
	return [{
		provide: ROUTES,
		multi: true,
		useValue: routes
	}, []];
}
/**
* Enables customizable scrolling behavior for router navigations.
*
* @usageNotes
*
* Basic example of how you can enable scrolling feature:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withInMemoryScrolling())
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
* @see {@link ViewportScroller}
*
* @publicApi
* @param options Set of configuration parameters to customize scrolling behavior, see
*     `InMemoryScrollingOptions` for additional information.
* @returns A set of providers for use with `provideRouter`.
*/
function withInMemoryScrolling(options = {}) {
	return routerFeature(4, [{
		provide: ROUTER_SCROLLER,
		useFactory: () => {
			const viewportScroller = __mf_122(__mf_52$2);
			const zone = __mf_122(__mf_57$1);
			const transitions = __mf_122(NavigationTransitions);
			return new RouterScroller(__mf_122(UrlSerializer), transitions, viewportScroller, zone, options);
		}
	}]);
}
function getBootstrapListener() {
	const injector = __mf_122(__mf_44$2);
	return (bootstrappedComponentRef) => {
		const ref = injector.get(__mf_6$1);
		if (bootstrappedComponentRef !== ref.components[0]) return;
		const router = injector.get(Router);
		const bootstrapDone = injector.get(BOOTSTRAP_DONE);
		if (injector.get(INITIAL_NAVIGATION) === 1) router.initialNavigation();
		injector.get(ROUTER_PRELOADER, null, { optional: true })?.setUpPreloading();
		injector.get(ROUTER_SCROLLER, null, { optional: true })?.init();
		router.resetRootComponentType(ref.componentTypes[0]);
		if (!bootstrapDone.closed) {
			bootstrapDone.next();
			bootstrapDone.complete();
			bootstrapDone.unsubscribe();
		}
	};
}
/**
* A subject used to indicate that the bootstrapping phase is done. When initial navigation is
* `enabledBlocking`, the first navigation waits until bootstrapping is finished before continuing
* to the activation phase.
*/
var BOOTSTRAP_DONE = /* @__PURE__ */ new __mf_43$1("", { factory: () => {
	return new __mf_4$1();
} });
var INITIAL_NAVIGATION = /* @__PURE__ */ new __mf_43$1("", {
	providedIn: "root",
	factory: () => 1
});
/**
* Configures initial navigation to start before the root component is created.
*
* The bootstrap is blocked until the initial navigation is complete. This should be set in case
* you use [server-side rendering](guide/ssr), but do not enable [hydration](guide/hydration) for
* your application.
*
* @usageNotes
*
* Basic example of how you can enable this navigation behavior:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
*
* @publicApi
* @returns A set of providers for use with `provideRouter`.
*/
function withEnabledBlockingInitialNavigation() {
	return routerFeature(2, [
		{
			provide: __mf_180,
			useValue: true
		},
		{
			provide: INITIAL_NAVIGATION,
			useValue: 0
		},
		__mf_137(() => {
			const injector = __mf_122(__mf_44$2);
			return injector.get(__mf_19$2, Promise.resolve()).then(() => {
				return new Promise((resolve) => {
					const router = injector.get(Router);
					const bootstrapDone = injector.get(BOOTSTRAP_DONE);
					afterNextNavigation(router, () => {
						resolve(true);
					});
					injector.get(NavigationTransitions).afterPreactivation = () => {
						resolve(true);
						return bootstrapDone.closed ? __mf_52$1(void 0) : bootstrapDone;
					};
					router.initialNavigation();
				});
			});
		})
	]);
}
/**
* Disables initial navigation.
*
* Use if there is a reason to have more control over when the router starts its initial navigation
* due to some complex initialization logic.
*
* @usageNotes
*
* Basic example of how you can disable initial navigation:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withDisabledInitialNavigation())
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
*
* @returns A set of providers for use with `provideRouter`.
*
* @publicApi
*/
function withDisabledInitialNavigation() {
	return routerFeature(3, [__mf_137(() => {
		__mf_122(Router).setUpLocationChangeListener();
	}), {
		provide: INITIAL_NAVIGATION,
		useValue: 2
	}]);
}
/**
* Enables logging of all internal navigation events to the console.
* Extra logging might be useful for debugging purposes to inspect Router event sequence.
*
* @usageNotes
*
* Basic example of how you can enable debug tracing:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withDebugTracing())
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
*
* @returns A set of providers for use with `provideRouter`.
*
* @publicApi
*/
function withDebugTracing() {
	let providers = [];
	providers = [];
	return routerFeature(1, providers);
}
var ROUTER_PRELOADER = /* @__PURE__ */ new __mf_43$1("");
/**
* Allows to configure a preloading strategy to use. The strategy is configured by providing a
* reference to a class that implements a `PreloadingStrategy`.
*
* @usageNotes
*
* Basic example of how you can configure preloading:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withPreloading(PreloadAllModules))
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
*
* @param preloadingStrategy A reference to a class that implements a `PreloadingStrategy` that
*     should be used.
* @returns A set of providers for use with `provideRouter`.
*
* @see [Preloading strategy](guide/routing/customizing-route-behavior#preloading-strategy)
*
* @publicApi
*/
function withPreloading(preloadingStrategy) {
	return routerFeature(0, [{
		provide: ROUTER_PRELOADER,
		useExisting: RouterPreloader
	}, {
		provide: PreloadingStrategy,
		useExisting: preloadingStrategy
	}]);
}
/**
* Allows to provide extra parameters to configure Router.
*
* @usageNotes
*
* Basic example of how you can provide extra configuration options:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withRouterConfig({
*          onSameUrlNavigation: 'reload'
*       }))
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
*
* @param options A set of parameters to configure Router, see `RouterConfigOptions` for
*     additional information.
* @returns A set of providers for use with `provideRouter`.
*
* @see [Router configuration options](guide/routing/customizing-route-behavior#router-configuration-options)
*
* @publicApi
*/
function withRouterConfig(options) {
	return routerFeature(5, [{
		provide: ROUTER_CONFIGURATION,
		useValue: options
	}]);
}
/**
* Provides the location strategy that uses the URL fragment instead of the history API.
*
* @usageNotes
*
* Basic example of how you can use the hash location option:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withHashLocation())
*     ]
*   }
* );
* ```
*
* @see {@link provideRouter}
* @see {@link /api/common/HashLocationStrategy HashLocationStrategy}
*
* @returns A set of providers for use with `provideRouter`.
*
* @publicApi
*/
function withHashLocation() {
	return routerFeature(6, [{
		provide: __mf_21$1,
		useClass: __mf_12$2
	}]);
}
/**
* Provides a function which is called when a navigation error occurs.
*
* This function is run inside application's [injection context](guide/di/dependency-injection-context)
* so you can use the [`inject`](api/core/inject) function.
*
* This function can return a `RedirectCommand` to convert the error to a redirect, similar to returning
* a `UrlTree` or `RedirectCommand` from a guard. This will also prevent the `Router` from emitting
* `NavigationError`; it will instead emit `NavigationCancel` with code NavigationCancellationCode.Redirect.
* Return values other than `RedirectCommand` are ignored and do not change any behavior with respect to
* how the `Router` handles the error.
*
* @usageNotes
*
* Basic example of how you can use the error handler option:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withNavigationErrorHandler((e: NavigationError) =>
* inject(MyErrorTracker).trackError(e)))
*     ]
*   }
* );
* ```
*
* @see {@link NavigationError}
* @see {@link /api/core/inject inject}
* @see {@link runInInjectionContext}
* @see [Centralize error handling in withNavigationErrorHandler](guide/routing/data-resolvers#centralize-error-handling-in-withnavigationerrorhandler)
*
* @returns A set of providers for use with `provideRouter`.
*
* @publicApi
*/
function withNavigationErrorHandler(handler) {
	return routerFeature(7, [{
		provide: NAVIGATION_ERROR_HANDLER,
		useValue: handler
	}]);
}
/**
* Enables binding information from the `Router` state directly to the inputs of the component in
* `Route` configurations.
*
* @usageNotes
*
* Basic example of how you can enable the feature:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withComponentInputBinding())
*     ]
*   }
* );
* ```
*
* The router bindings information from any of the following sources:
*
*  - query parameters
*  - path and matrix parameters
*  - static route data
*  - data from resolvers
*
* Duplicate keys are resolved in the same order from above, from least to greatest,
* meaning that resolvers have the highest precedence and override any of the other information
* from the route.
*
* Importantly, when an input does not have an item in the route data with a matching key, this
* input is set to `undefined`. This prevents previous information from being
* retained if the data got removed from the route (i.e. if a query parameter is removed).
* Default values can be provided with a resolver on the route to ensure the value is always present
* or an input and use an input transform in the component.
*
* @see {@link /guide/components/inputs#input-transforms Input Transforms}
* @returns A set of providers for use with `provideRouter`.
*/
function withComponentInputBinding() {
	return routerFeature(8, [RoutedComponentInputBinder, {
		provide: INPUT_BINDER,
		useExisting: RoutedComponentInputBinder
	}]);
}
/**
* Enables view transitions in the Router by running the route activation and deactivation inside of
* `document.startViewTransition`.
*
* Note: The View Transitions API is not available in all browsers. If the browser does not support
* view transitions, the Router will not attempt to start a view transition and continue processing
* the navigation as usual.
*
* @usageNotes
*
* Basic example of how you can enable the feature:
* ```ts
* const appRoutes: Routes = [];
* bootstrapApplication(AppComponent,
*   {
*     providers: [
*       provideRouter(appRoutes, withViewTransitions())
*     ]
*   }
* );
* ```
*
* @returns A set of providers for use with `provideRouter`.
* @see https://developer.chrome.com/docs/web-platform/view-transitions/
* @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
* @see [Route transition animations](guide/routing/route-transition-animations)
* @developerPreview 19.0
*/
function withViewTransitions(options) {
	__mf_283("NgRouterViewTransitions");
	return routerFeature(9, [{
		provide: CREATE_VIEW_TRANSITION,
		useValue: createViewTransition
	}, {
		provide: VIEW_TRANSITION_OPTIONS,
		useValue: {
			skipNextTransition: !!options?.skipInitialTransition,
			...options
		}
	}]);
}
var ROUTER_PROVIDERS = [
	__mf_20$1,
	{
		provide: UrlSerializer,
		useClass: DefaultUrlSerializer
	},
	Router,
	ChildrenOutletContexts,
	{
		provide: ActivatedRoute,
		useFactory: rootRoute,
		deps: [Router]
	},
	RouterConfigLoader,
	[]
];
/**
* @description
*
* Adds directives and providers for in-app navigation among views defined in an application.
* Use the Angular `Router` service to declaratively specify application states and manage state
* transitions.
*
* You can import this NgModule multiple times, once for each lazy-loaded bundle.
* However, only one `Router` service can be active.
* To ensure this, there are two ways to register routes when importing this module:
*
* * The `forRoot()` method creates an `NgModule` that contains all the directives, the given
* routes, and the `Router` service itself.
* * The `forChild()` method creates an `NgModule` that contains all the directives and the given
* routes, but does not include the `Router` service.
*
* @see [Routing and Navigation guide](guide/routing/common-router-tasks) for an
* overview of how the `Router` service should be used.
*
* @publicApi
*/
var RouterModule = /* @__PURE__ */ (() => {
	class RouterModule {
		constructor() {}
		/**
		* Creates and configures a module with all the router providers and directives.
		* Optionally sets up an application listener to perform an initial navigation.
		*
		* When registering the NgModule at the root, import as follows:
		*
		* ```ts
		* @NgModule({
		*   imports: [RouterModule.forRoot(ROUTES)]
		* })
		* class MyNgModule {}
		* ```
		*
		* @param routes An array of `Route` objects that define the navigation paths for the application.
		* @param config An `ExtraOptions` configuration object that controls how navigation is performed.
		* @return The new `NgModule`.
		*
		*/
		static forRoot(routes, config) {
			return {
				ngModule: RouterModule,
				providers: [
					ROUTER_PROVIDERS,
					[],
					{
						provide: ROUTES,
						multi: true,
						useValue: routes
					},
					[],
					config?.errorHandler ? {
						provide: NAVIGATION_ERROR_HANDLER,
						useValue: config.errorHandler
					} : [],
					{
						provide: ROUTER_CONFIGURATION,
						useValue: config ? config : {}
					},
					config?.useHash ? provideHashLocationStrategy() : providePathLocationStrategy(),
					provideRouterScroller(),
					config?.preloadingStrategy ? withPreloading(config.preloadingStrategy).ɵproviders : [],
					config?.initialNavigation ? provideInitialNavigation(config) : [],
					config?.bindToComponentInputs ? withComponentInputBinding().ɵproviders : [],
					config?.enableViewTransitions ? withViewTransitions().ɵproviders : [],
					provideRouterInitializer()
				]
			};
		}
		/**
		* Creates a module with all the router directives and a provider registering routes,
		* without creating a new Router service.
		* When registering for submodules and lazy-loaded submodules, create the NgModule as follows:
		*
		* ```ts
		* @NgModule({
		*   imports: [RouterModule.forChild(ROUTES)]
		* })
		* class MyNgModule {}
		* ```
		*
		* @param routes An array of `Route` objects that define the navigation paths for the submodule.
		* @return The new NgModule.
		*
		*/
		static forChild(routes) {
			return {
				ngModule: RouterModule,
				providers: [{
					provide: ROUTES,
					multi: true,
					useValue: routes
				}]
			};
		}
		static ɵfac = function RouterModule_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || RouterModule)();
		};
		static ɵmod = /* @__PURE__ */ __mf_370({
			type: RouterModule,
			imports: [
				RouterOutlet,
				RouterLink,
				RouterLinkActive,
				ɵEmptyOutletComponent
			],
			exports: [
				RouterOutlet,
				RouterLink,
				RouterLinkActive,
				ɵEmptyOutletComponent
			]
		});
		static ɵinj = /* @__PURE__ */ __mf_369({});
	}
	return RouterModule;
})();
/**
* For internal use by `RouterModule` only. Note that this differs from `withInMemoryRouterScroller`
* because it reads from the `ExtraOptions` which should not be used in the standalone world.
*/
function provideRouterScroller() {
	return {
		provide: ROUTER_SCROLLER,
		useFactory: () => {
			const viewportScroller = __mf_122(__mf_52$2);
			const zone = __mf_122(__mf_57$1);
			const config = __mf_122(ROUTER_CONFIGURATION);
			const transitions = __mf_122(NavigationTransitions);
			const urlSerializer = __mf_122(UrlSerializer);
			if (config.scrollOffset) viewportScroller.setOffset(config.scrollOffset);
			return new RouterScroller(urlSerializer, transitions, viewportScroller, zone, config);
		}
	};
}
function provideHashLocationStrategy() {
	return {
		provide: __mf_21$1,
		useClass: __mf_12$2
	};
}
function providePathLocationStrategy() {
	return {
		provide: __mf_21$1,
		useClass: __mf_43$2
	};
}
function provideInitialNavigation(config) {
	return [config.initialNavigation === "disabled" ? withDisabledInitialNavigation().ɵproviders : [], config.initialNavigation === "enabledBlocking" ? withEnabledBlockingInitialNavigation().ɵproviders : []];
}
/**
* A DI token for the router initializer that
* is called after the app is bootstrapped.
*
* @publicApi
*/
var ROUTER_INITIALIZER = /* @__PURE__ */ new __mf_43$1("");
function provideRouterInitializer() {
	return [{
		provide: ROUTER_INITIALIZER,
		useFactory: getBootstrapListener
	}, {
		provide: __mf_1$2,
		multi: true,
		useExisting: ROUTER_INITIALIZER
	}];
}
//#endregion
//#region ../../../node_modules/.pnpm/@angular+router@20.3.20_@angular+common@20.3.20_@angular+core@20.3.20_@angular+compiler_f44a24d86c8db5f4d9f84c16fbc16cec/node_modules/@angular/router/fesm2022/router.mjs
var router_exports = /* @__PURE__ */ __exportAll({
	ActivatedRoute: () => ActivatedRoute,
	ActivatedRouteSnapshot: () => ActivatedRouteSnapshot,
	ActivationEnd: () => ActivationEnd,
	ActivationStart: () => ActivationStart,
	BaseRouteReuseStrategy: () => BaseRouteReuseStrategy,
	ChildActivationEnd: () => ChildActivationEnd,
	ChildActivationStart: () => ChildActivationStart,
	ChildrenOutletContexts: () => ChildrenOutletContexts,
	DefaultTitleStrategy: () => DefaultTitleStrategy,
	DefaultUrlSerializer: () => DefaultUrlSerializer,
	EventType: () => EventType,
	GuardsCheckEnd: () => GuardsCheckEnd,
	GuardsCheckStart: () => GuardsCheckStart,
	NavigationCancel: () => NavigationCancel,
	NavigationCancellationCode: () => NavigationCancellationCode,
	NavigationEnd: () => NavigationEnd,
	NavigationError: () => NavigationError,
	NavigationSkipped: () => NavigationSkipped,
	NavigationSkippedCode: () => NavigationSkippedCode,
	NavigationStart: () => NavigationStart,
	NoPreloading: () => NoPreloading,
	OutletContext: () => OutletContext,
	PRIMARY_OUTLET: () => PRIMARY_OUTLET,
	PreloadAllModules: () => PreloadAllModules,
	PreloadingStrategy: () => PreloadingStrategy,
	ROUTER_CONFIGURATION: () => ROUTER_CONFIGURATION,
	ROUTER_INITIALIZER: () => ROUTER_INITIALIZER,
	ROUTER_OUTLET_DATA: () => ROUTER_OUTLET_DATA,
	ROUTES: () => ROUTES,
	RedirectCommand: () => RedirectCommand,
	ResolveEnd: () => ResolveEnd,
	ResolveStart: () => ResolveStart,
	RouteConfigLoadEnd: () => RouteConfigLoadEnd,
	RouteConfigLoadStart: () => RouteConfigLoadStart,
	RouteReuseStrategy: () => RouteReuseStrategy,
	Router: () => Router,
	RouterEvent: () => RouterEvent,
	RouterLink: () => RouterLink,
	RouterLinkActive: () => RouterLinkActive,
	RouterLinkWithHref: () => RouterLink,
	RouterModule: () => RouterModule,
	RouterOutlet: () => RouterOutlet,
	RouterPreloader: () => RouterPreloader,
	RouterState: () => RouterState,
	RouterStateSnapshot: () => RouterStateSnapshot,
	RoutesRecognized: () => RoutesRecognized,
	Scroll: () => Scroll,
	TitleStrategy: () => TitleStrategy,
	UrlHandlingStrategy: () => UrlHandlingStrategy,
	UrlSegment: () => UrlSegment,
	UrlSegmentGroup: () => UrlSegmentGroup,
	UrlSerializer: () => UrlSerializer,
	UrlTree: () => UrlTree,
	VERSION: () => VERSION,
	convertToParamMap: () => convertToParamMap,
	createUrlTreeFromSnapshot: () => createUrlTreeFromSnapshot,
	defaultUrlMatcher: () => defaultUrlMatcher,
	mapToCanActivate: () => mapToCanActivate,
	mapToCanActivateChild: () => mapToCanActivateChild,
	mapToCanDeactivate: () => mapToCanDeactivate,
	mapToCanMatch: () => mapToCanMatch,
	mapToResolve: () => mapToResolve,
	provideRouter: () => provideRouter,
	provideRoutes: () => provideRoutes,
	withComponentInputBinding: () => withComponentInputBinding,
	withDebugTracing: () => withDebugTracing,
	withDisabledInitialNavigation: () => withDisabledInitialNavigation,
	withEnabledBlockingInitialNavigation: () => withEnabledBlockingInitialNavigation,
	withHashLocation: () => withHashLocation,
	withInMemoryScrolling: () => withInMemoryScrolling,
	withNavigationErrorHandler: () => withNavigationErrorHandler,
	withPreloading: () => withPreloading,
	withRouterConfig: () => withRouterConfig,
	withViewTransitions: () => withViewTransitions,
	ɵEmptyOutletComponent: () => ɵEmptyOutletComponent,
	ɵROUTER_PROVIDERS: () => ROUTER_PROVIDERS,
	ɵafterNextNavigation: () => afterNextNavigation,
	ɵloadChildren: () => loadChildren
});
/**
* Maps an array of injectable classes with canMatch functions to an array of equivalent
* `CanMatchFn` for use in a `Route` definition.
*
* Usage {@example router/utils/functional_guards.ts region='CanActivate'}
*
* @publicApi
* @see {@link Route}
*/
function mapToCanMatch(providers) {
	return providers.map((provider) => (...params) => __mf_122(provider).canMatch(...params));
}
/**
* Maps an array of injectable classes with canActivate functions to an array of equivalent
* `CanActivateFn` for use in a `Route` definition.
*
* Usage {@example router/utils/functional_guards.ts region='CanActivate'}
*
* @publicApi
* @see {@link Route}
*/
function mapToCanActivate(providers) {
	return providers.map((provider) => (...params) => __mf_122(provider).canActivate(...params));
}
/**
* Maps an array of injectable classes with canActivateChild functions to an array of equivalent
* `CanActivateChildFn` for use in a `Route` definition.
*
* Usage {@example router/utils/functional_guards.ts region='CanActivate'}
*
* @publicApi
* @see {@link Route}
*/
function mapToCanActivateChild(providers) {
	return providers.map((provider) => (...params) => __mf_122(provider).canActivateChild(...params));
}
/**
* Maps an array of injectable classes with canDeactivate functions to an array of equivalent
* `CanDeactivateFn` for use in a `Route` definition.
*
* Usage {@example router/utils/functional_guards.ts region='CanActivate'}
*
* @publicApi
* @see {@link Route}
*/
function mapToCanDeactivate(providers) {
	return providers.map((provider) => (...params) => __mf_122(provider).canDeactivate(...params));
}
/**
* Maps an injectable class with a resolve function to an equivalent `ResolveFn`
* for use in a `Route` definition.
*
* Usage {@example router/utils/functional_guards.ts region='Resolve'}
*
* @publicApi
* @see {@link Route}
*/
function mapToResolve(provider) {
	return (...params) => __mf_122(provider).resolve(...params);
}
/**
* @module
* @description
* Entry point for all public APIs of the router package.
*/
/**
* @publicApi
*/
var VERSION = /* @__PURE__ */ new __mf_88("20.3.20");
//#endregion
//#region node_modules/__mf__virtual/__mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare__.mjs
var __mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare___exports = /* @__PURE__ */ __exportAll({
	ActivatedRoute: () => __mf_0,
	ActivatedRouteSnapshot: () => __mf_1,
	ActivationEnd: () => __mf_2,
	ActivationStart: () => __mf_3,
	BaseRouteReuseStrategy: () => __mf_4,
	ChildActivationEnd: () => __mf_5,
	ChildActivationStart: () => __mf_6,
	ChildrenOutletContexts: () => __mf_7,
	DefaultTitleStrategy: () => __mf_8,
	DefaultUrlSerializer: () => __mf_9,
	EventType: () => __mf_10,
	GuardsCheckEnd: () => __mf_11,
	GuardsCheckStart: () => __mf_12,
	NavigationCancel: () => __mf_13,
	NavigationCancellationCode: () => __mf_14,
	NavigationEnd: () => __mf_15,
	NavigationError: () => __mf_16,
	NavigationSkipped: () => __mf_17,
	NavigationSkippedCode: () => __mf_18,
	NavigationStart: () => __mf_19,
	NoPreloading: () => __mf_20,
	OutletContext: () => __mf_21,
	PRIMARY_OUTLET: () => __mf_22,
	PreloadAllModules: () => __mf_23,
	PreloadingStrategy: () => __mf_24,
	ROUTER_CONFIGURATION: () => __mf_25,
	ROUTER_INITIALIZER: () => __mf_26,
	ROUTER_OUTLET_DATA: () => __mf_27,
	ROUTES: () => __mf_28,
	RedirectCommand: () => __mf_29,
	ResolveEnd: () => __mf_30,
	ResolveStart: () => __mf_31,
	RouteConfigLoadEnd: () => __mf_32,
	RouteConfigLoadStart: () => __mf_33,
	RouteReuseStrategy: () => __mf_34,
	Router: () => __mf_35,
	RouterEvent: () => __mf_36,
	RouterLink: () => __mf_37,
	RouterLinkActive: () => __mf_38,
	RouterLinkWithHref: () => __mf_39,
	RouterModule: () => __mf_40,
	RouterOutlet: () => __mf_41,
	RouterPreloader: () => __mf_42,
	RouterState: () => __mf_43,
	RouterStateSnapshot: () => __mf_44,
	RoutesRecognized: () => __mf_45,
	Scroll: () => __mf_46,
	TitleStrategy: () => __mf_47,
	UrlHandlingStrategy: () => __mf_48,
	UrlSegment: () => __mf_49,
	UrlSegmentGroup: () => __mf_50,
	UrlSerializer: () => __mf_51,
	UrlTree: () => __mf_52,
	VERSION: () => __mf_53,
	__moduleExports: () => __moduleExports,
	convertToParamMap: () => __mf_54,
	createUrlTreeFromSnapshot: () => __mf_55,
	default: () => __mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare___default,
	defaultUrlMatcher: () => __mf_56,
	mapToCanActivate: () => __mf_57,
	mapToCanActivateChild: () => __mf_58,
	mapToCanDeactivate: () => __mf_59,
	mapToCanMatch: () => __mf_60,
	mapToResolve: () => __mf_61,
	provideRouter: () => __mf_62,
	provideRoutes: () => __mf_63,
	withComponentInputBinding: () => __mf_64,
	withDebugTracing: () => __mf_65,
	withDisabledInitialNavigation: () => __mf_66,
	withEnabledBlockingInitialNavigation: () => __mf_67,
	withHashLocation: () => __mf_68,
	withInMemoryScrolling: () => __mf_69,
	withNavigationErrorHandler: () => __mf_70,
	withPreloading: () => __mf_71,
	withRouterConfig: () => __mf_72,
	withViewTransitions: () => __mf_73,
	ɵEmptyOutletComponent: () => __mf_74,
	ɵROUTER_PROVIDERS: () => __mf_75,
	ɵafterNextNavigation: () => __mf_76,
	ɵloadChildren: () => __mf_77
});
var __mfCacheGlobalKey = "__mf_module_cache__";
globalThis[__mfCacheGlobalKey] ||= {
	share: {},
	remote: {}
};
globalThis[__mfCacheGlobalKey].share ||= {};
globalThis[__mfCacheGlobalKey].remote ||= {};
var __mfModuleCache = globalThis[__mfCacheGlobalKey];
var exportModule = __mfModuleCache.share["@angular/router"];
if (exportModule === void 0) {
	exportModule = router_exports;
	__mfModuleCache.share["@angular/router"] = exportModule;
}
var __moduleExports = exportModule;
var __mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare___default = exportModule.__esModule ? exportModule.default : exportModule.default ?? exportModule;
var { ActivatedRoute: __mf_0, ActivatedRouteSnapshot: __mf_1, ActivationEnd: __mf_2, ActivationStart: __mf_3, BaseRouteReuseStrategy: __mf_4, ChildActivationEnd: __mf_5, ChildActivationStart: __mf_6, ChildrenOutletContexts: __mf_7, DefaultTitleStrategy: __mf_8, DefaultUrlSerializer: __mf_9, EventType: __mf_10, GuardsCheckEnd: __mf_11, GuardsCheckStart: __mf_12, NavigationCancel: __mf_13, NavigationCancellationCode: __mf_14, NavigationEnd: __mf_15, NavigationError: __mf_16, NavigationSkipped: __mf_17, NavigationSkippedCode: __mf_18, NavigationStart: __mf_19, NoPreloading: __mf_20, OutletContext: __mf_21, PRIMARY_OUTLET: __mf_22, PreloadAllModules: __mf_23, PreloadingStrategy: __mf_24, ROUTER_CONFIGURATION: __mf_25, ROUTER_INITIALIZER: __mf_26, ROUTER_OUTLET_DATA: __mf_27, ROUTES: __mf_28, RedirectCommand: __mf_29, ResolveEnd: __mf_30, ResolveStart: __mf_31, RouteConfigLoadEnd: __mf_32, RouteConfigLoadStart: __mf_33, RouteReuseStrategy: __mf_34, Router: __mf_35, RouterEvent: __mf_36, RouterLink: __mf_37, RouterLinkActive: __mf_38, RouterLinkWithHref: __mf_39, RouterModule: __mf_40, RouterOutlet: __mf_41, RouterPreloader: __mf_42, RouterState: __mf_43, RouterStateSnapshot: __mf_44, RoutesRecognized: __mf_45, Scroll: __mf_46, TitleStrategy: __mf_47, UrlHandlingStrategy: __mf_48, UrlSegment: __mf_49, UrlSegmentGroup: __mf_50, UrlSerializer: __mf_51, UrlTree: __mf_52, VERSION: __mf_53, convertToParamMap: __mf_54, createUrlTreeFromSnapshot: __mf_55, defaultUrlMatcher: __mf_56, mapToCanActivate: __mf_57, mapToCanActivateChild: __mf_58, mapToCanDeactivate: __mf_59, mapToCanMatch: __mf_60, mapToResolve: __mf_61, provideRouter: __mf_62, provideRoutes: __mf_63, withComponentInputBinding: __mf_64, withDebugTracing: __mf_65, withDisabledInitialNavigation: __mf_66, withEnabledBlockingInitialNavigation: __mf_67, withHashLocation: __mf_68, withInMemoryScrolling: __mf_69, withNavigationErrorHandler: __mf_70, withPreloading: __mf_71, withRouterConfig: __mf_72, withViewTransitions: __mf_73, ɵEmptyOutletComponent: __mf_74, ɵROUTER_PROVIDERS: __mf_75, ɵafterNextNavigation: __mf_76, ɵloadChildren: __mf_77 } = exportModule;
//#endregion
export { router_exports as n, __mfe_internal__com_demo_hello_mf__loadShare___mf_0_angular_mf_1_router__loadShare___exports as t };
