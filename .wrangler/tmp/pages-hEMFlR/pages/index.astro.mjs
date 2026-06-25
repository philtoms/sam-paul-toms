globalThis.process ??= {}; globalThis.process.env ??= {};
import { a6 as createAstro, a7 as createComponent, a1 as addAttribute, al as renderComponent, au as renderTemplate, aB as unescapeHTML, l as Fragment, a5 as commonjsGlobal, an as renderHead, as as renderSlot, ai as maybeRenderHead, aq as renderScript, aj as objectType, aa as dateType, a2 as arrayType, az as stringType, c as AstroError, T as RenderUndefinedEntryError, _ as UnknownContentCollectionError, ad as escape, av as renderUniqueStylesheet, ar as renderScriptElement, a8 as createHeadAndContent } from '../chunks/astro/server_k4Nw9Nby.mjs';
/* empty css                                 */
import { l as l$4, C as C$1, S as S$1, t as t$3 } from '../chunks/_@astro-renderers_BVV-WUqq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BVV-WUqq.mjs';
import { r as removeBase, b as isRemotePath, p as prependForwardSlash } from '../chunks/path_y9gdWwIq.mjs';
import { V as VALID_INPUT_FORMATS } from '../chunks/consts_CBOg0Lc-.mjs';
import { u as unflatten } from '../chunks/parse_DSt6RPqT.mjs';

function resolveAbsoluteUrl(path, siteUrl) {
  if (path.startsWith("http")) {
    return path;
  }
  const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const separator = path.startsWith("/") ? "" : "/";
  return `${base}${separator}${path}`;
}

const DEFAULT_SITE_NAME = "Sam Paul Toms";

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1, _b;
const $$Astro$4 = createAstro("https://sampaultoms.com");
const $$SEOHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SEOHead;
  const {
    title,
    description,
    image,
    canonicalUrl = Astro2.url.href,
    type = "website",
    structuredData,
    noindex,
    siteName = DEFAULT_SITE_NAME
  } = Astro2.props;
  const siteUrl = Astro2.site?.href || "";
  const absoluteImage = image && siteUrl ? resolveAbsoluteUrl(image, siteUrl) : image;
  return renderTemplate`<title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}><!-- Open Graph --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:type"${addAttribute(type, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}>${absoluteImage && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<meta property="og:image"${addAttribute(absoluteImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` })}`}<!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}>${absoluteImage && renderTemplate`<meta name="twitter:image"${addAttribute(absoluteImage, "content")}>`}<!-- Structured Data -->${structuredData && (Array.isArray(structuredData) ? structuredData.map((item) => renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(item)))) : renderTemplate(_b || (_b = __template$1(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(structuredData))))}<!-- Noindex -->${noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}`;
}, "/Users/phil/dev/sam/src/components/SEOHead.astro", void 0);

var t$2,r$2,u$3,i$2,o$2=0,f$2=[],c$2=l$4,e$2=c$2.__b,a$2=c$2.__r,v$2=c$2.diffed,l$3=c$2.__c,m$3=c$2.unmount,s$2=c$2.__;function p$3(n,t){c$2.__h&&c$2.__h(r$2,n,o$2||t),o$2=0;var u=r$2.__H||(r$2.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d$3(n){return o$2=1,h$3(D$1,n)}function h$3(n,u,i){var o=p$3(t$2++,2);if(o.t=n,!o.__c&&(o.__=[D$1(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r$2,!r$2.__f)){var f=function(n,t,r){if(!o.__c.__H)return  true;var u=o.__c.__H.__.filter(function(n){return n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=o.__c.props!==n;return u.some(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=true);}}),c&&c.call(this,n,t,r)||i};r$2.__f=true;var c=r$2.shouldComponentUpdate,e=r$2.componentWillUpdate;r$2.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r$2.shouldComponentUpdate=f;}return o.__N||o.__}function y$4(n,u){var i=p$3(t$2++,3);!c$2.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r$2.__H.__h.push(i));}function _$3(n,u){var i=p$3(t$2++,4);!c$2.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r$2.__h.push(i));}function A$1(n){return o$2=5,T$1(function(){return {current:n}},[])}function T$1(n,r){var u=p$3(t$2++,7);return C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function q$2(n,t){return o$2=8,T$1(function(){return n},t)}function j$3(){for(var n;n=f$2.shift();){var t=n.__H;if(n.__P&&t)try{t.__h.some(z$1),t.__h.some(B$1),t.__h=[];}catch(r){t.__h=[],c$2.__e(r,n.__v);}}}c$2.__b=function(n){r$2=null,e$2&&e$2(n);},c$2.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),s$2&&s$2(n,t);},c$2.__r=function(n){a$2&&a$2(n),t$2=0;var i=(r$2=n.__c).__H;i&&(u$3===r$2?(i.__h=[],r$2.__h=[],i.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0;})):(i.__h.some(z$1),i.__h.some(B$1),i.__h=[],t$2=0)),u$3=r$2;},c$2.diffed=function(n){v$2&&v$2(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f$2.push(t)&&i$2===c$2.requestAnimationFrame||((i$2=c$2.requestAnimationFrame)||w$3)(j$3)),t.__H.__.some(function(n){n.u&&(n.__H=n.u),n.u=void 0;})),u$3=r$2=null;},c$2.__c=function(n,t){t.some(function(n){try{n.__h.some(z$1),n.__h=n.__h.filter(function(n){return !n.__||B$1(n)});}catch(r){t.some(function(n){n.__h&&(n.__h=[]);}),t=[],c$2.__e(r,n.__v);}}),l$3&&l$3(n,t);},c$2.unmount=function(n){m$3&&m$3(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.some(function(n){try{z$1(n);}catch(n){t=n;}}),r.__H=void 0,t&&c$2.__e(t,r.__v));};var k="function"==typeof requestAnimationFrame;function w$3(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,35);k&&(t=requestAnimationFrame(r));}function z$1(n){var t=r$2,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r$2=t;}function B$1(n){var t=r$2;n.__c=n.__(),r$2=t;}function C(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D$1(n,t){return "function"==typeof t?t(n):t}

var i$1=Symbol.for("preact-signals");function t$1(){if(!(s$1>1)){var i,t=false;!function(){var i=c$1;c$1=void 0;while(void 0!==i){if(i.S.v===i.v)i.S.i=i.i;i=i.o;}}();while(void 0!==h$2){var n=h$2;h$2=void 0;v$1++;while(void 0!==n){var r=n.u;n.u=void 0;n.f&=-3;if(!(8&n.f)&&w$2(n))try{n.c();}catch(n){if(!t){i=n;t=true;}}n=r;}}v$1=0;s$1--;if(t)throw i}else s$1--;}function n$1(i){if(s$1>0)return i();e$1=++u$2;s$1++;try{return i()}finally{t$1();}}var r$1=void 0;function o$1(i){var t=r$1;r$1=void 0;try{return i()}finally{r$1=t;}}var h$2=void 0,s$1=0,v$1=0,u$2=0,e$1=0,c$1=void 0,d$2=0;function a$1(i){if(void 0!==r$1){var t=i.n;if(void 0===t||t.t!==r$1){t={i:0,S:i,p:r$1.s,n:void 0,t:r$1,e:void 0,x:void 0,r:t};if(void 0!==r$1.s)r$1.s.n=t;r$1.s=t;i.n=t;if(32&r$1.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=r$1.s;t.n=void 0;r$1.s.n=t;r$1.s=t;}return t}}}function l$2(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.l=0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name;}l$2.prototype.brand=i$1;l$2.prototype.h=function(){return  true};l$2.prototype.S=function(i){var t=this,n=this.t;if(n!==i&&void 0===i.e){i.x=n;this.t=i;if(void 0!==n)n.e=i;else o$1(function(){var i;null==(i=t.W)||i.call(t);});}};l$2.prototype.U=function(i){var t=this;if(void 0!==this.t){var n=i.e,r=i.x;if(void 0!==n){n.x=r;i.e=void 0;}if(void 0!==r){r.e=n;i.x=void 0;}if(i===this.t){this.t=r;if(void 0===r)o$1(function(){var i;null==(i=t.Z)||i.call(t);});}}};l$2.prototype.subscribe=function(i){var t=this;return j$2(function(){var n=t.value,o=r$1;r$1=void 0;try{i(n);}finally{r$1=o;}},{name:"sub"})};l$2.prototype.valueOf=function(){return this.value};l$2.prototype.toString=function(){return this.value+""};l$2.prototype.toJSON=function(){return this.value};l$2.prototype.peek=function(){var i=this;return o$1(function(){return i.value})};Object.defineProperty(l$2.prototype,"value",{get:function(){var i=a$1(this);if(void 0!==i)i.i=this.i;return this.v},set:function(i){if(i!==this.v){if(v$1>100)throw new Error("Cycle detected");!function(i){if(0!==s$1&&0===v$1)if(i.l!==e$1){i.l=e$1;c$1={S:i,v:i.v,i:i.i,o:c$1};}}(this);this.v=i;this.i++;d$2++;s$1++;try{for(var n=this.t;void 0!==n;n=n.x)n.t.N();}finally{t$1();}}}});function y$3(i,t){return new l$2(i,t)}function w$2(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function _$2(i){for(var t=i.s;void 0!==t;t=t.n){var n=t.S.n;if(void 0!==n)t.r=n;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function b$3(i){var t=i.s,n=void 0;while(void 0!==t){var r=t.p;if(-1===t.i){t.S.U(t);if(void 0!==r)r.n=t.n;if(void 0!==t.n)t.n.p=r;}else n=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=r;}i.s=n;}function p$2(i,t){l$2.call(this,void 0);this.x=i;this.s=void 0;this.g=d$2-1;this.f=4;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name;}p$2.prototype=new l$2;p$2.prototype.h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===d$2)return  true;this.g=d$2;this.f|=1;if(this.i>0&&!w$2(this)){this.f&=-2;return  true}var i=r$1;try{_$2(this);r$1=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}r$1=i;b$3(this);this.f&=-2;return  true};p$2.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t);}l$2.prototype.S.call(this,i);};p$2.prototype.U=function(i){if(void 0!==this.t){l$2.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t);}}};p$2.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(p$2.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var i=a$1(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function g$3(i,t){return new p$2(i,t)}function S(i){var n=i.m;i.m=void 0;if("function"==typeof n){s$1++;var o=r$1;r$1=void 0;try{n();}catch(t){i.f&=-2;i.f|=8;m$2(i);throw t}finally{r$1=o;t$1();}}}function m$2(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;S(i);}function x$2(i){if(r$1!==this)throw new Error("Out-of-order effect");b$3(this);r$1=i;this.f&=-2;if(8&this.f)m$2(this);t$1();}function E$1(i,t){this.x=i;this.m=void 0;this.s=void 0;this.u=void 0;this.f=32;this.name=null==t?void 0:t.name;}E$1.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.m=t;}finally{i();}};E$1.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;S(this);_$2(this);s$1++;var i=r$1;r$1=this;return x$2.bind(this,i)};E$1.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.u=h$2;h$2=this;}};E$1.prototype.d=function(){this.f|=8;if(!(1&this.f))m$2(this);};E$1.prototype.dispose=function(){this.d();};function j$2(i,t){var n=new E$1(i,t);try{n.c();}catch(i){n.d();throw i}var r=n.d.bind(n);r[Symbol.dispose]=r;return r}

var l$1,h$1,p$1="undefined"!=typeof window&&!!window.__PREACT_SIGNALS_DEVTOOLS__,_$1=[];j$2(function(){l$1=this.N;})();function g$2(i,r){l$4[i]=r.bind(null,l$4[i]||function(){});}function b$2(i){if(h$1){var n=h$1;h$1=void 0;n();}h$1=i&&i.S();}function y$2(i){var n=this,t=i.data,e=useSignal(t);e.value=t;var f=T$1(function(){var i=n,t=n.__v;while(t=t.__)if(t.__c){t.__c.__$f|=4;break}var o=g$3(function(){var i=e.value.value;return 0===i?0:true===i?"":i||""}),f=g$3(function(){return !Array.isArray(o.value)&&!t$3(o.value)}),a=j$2(function(){this.N=F$1;if(f.value){var n=o.value;if(i.__v&&i.__v.__e&&3===i.__v.__e.nodeType)i.__v.__e.data=n;}}),v=n.__$u.d;n.__$u.d=function(){a();v.call(this);};return [f,o]},[]),a=f[0],v=f[1];return a.value?v.peek():v.value}y$2.displayName="ReactiveTextNode";Object.defineProperties(l$2.prototype,{constructor:{configurable:true,value:void 0},type:{configurable:true,value:y$2},props:{configurable:true,get:function(){var i=this;return {data:{get value(){return i.value}}}}},__b:{configurable:true,value:1}});g$2("__b",function(i,n){if("string"==typeof n.type){var r,t=n.props;for(var o in t)if("children"!==o){var e=t[o];if(e instanceof l$2){if(!r)n.__np=r={};r[o]=e;t[o]=e.peek();}}}i(n);});g$2("__r",function(i,n){i(n);if(n.type!==S$1){b$2();var r,o=n.__c;if(o){o.__$f&=-2;if(void 0===(r=o.__$u))o.__$u=r=function(i,n){var r;j$2(function(){r=this;},{name:n});r.c=i;return r}(function(){var i;if(p$1)null==(i=r.y)||i.call(r);o.__$f|=1;o.setState({});},"function"==typeof n.type?n.type.displayName||n.type.name:"");}b$2(r);}});g$2("__e",function(i,n,r,t){b$2();i(n,r,t);});g$2("diffed",function(i,n){b$2();var r;if("string"==typeof n.type&&(r=n.__e)){var t=n.__np,o=n.props;if(t){var e=r.U;if(e)for(var f in e){var u=e[f];if(void 0!==u&&!(f in t)){u.d();e[f]=void 0;}}else {e={};r.U=e;}for(var a in t){var c=e[a],v=t[a];if(void 0===c){c=w$1(r,a,v);e[a]=c;}else c.o(v,o);}for(var s in t)o[s]=t[s];}}i(n);});function w$1(i,n,r,t){var o=n in i&&void 0===i.ownerSVGElement,e=y$3(r),f=r.peek();return {o:function(i,n){e.value=i;f=i.peek();},d:j$2(function(){this.N=F$1;var r=e.value.value;if(f!==r){f=void 0;if(o)i[n]=r;else if(null!=r&&(false!==r||"-"===n[4]))i.setAttribute(n,r);else i.removeAttribute(n);}else f=void 0;})}}g$2("unmount",function(i,n){if("string"==typeof n.type){var r=n.__e;if(r){var t=r.U;if(t){r.U=void 0;for(var o in t){var e=t[o];if(e)e.d();}}}n.__np=void 0;}else {var f=n.__c;if(f){var u=f.__$u;if(u){f.__$u=void 0;u.d();}}}i(n);});g$2("__h",function(i,n,r,t){if(t<3||9===t)n.__$f|=2;i(n,r,t);});C$1.prototype.shouldComponentUpdate=function(i,n){if(this.__R)return  true;var r=this.__$u,t=r&&void 0!==r.s;for(var o in n)return  true;if(this.__f||"boolean"==typeof this.u&&true===this.u){var e=2&this.__$f;if(!(t||e||4&this.__$f))return  true;if(1&this.__$f)return  true}else {if(!(t||4&this.__$f))return  true;if(3&this.__$f)return  true}for(var f in i)if("__source"!==f&&i[f]!==this.props[f])return  true;for(var u in this.props)if(!(u in i))return  true;return  false};function useSignal(i,n){return T$1(function(){return y$3(i,n)},[])}var q$1=function(i){queueMicrotask(function(){queueMicrotask(i);});};function x$1(){n$1(function(){var i;while(i=_$1.shift())l$1.call(i);});}function F$1(){if(1===_$1.push(this))(l$4.requestAnimationFrame||q$1)(x$1);}

const tracks = y$3([]);
const currentIndex = y$3(-1);
const isPlaying = y$3(false);
const volume = y$3(0.8);
const currentTime = y$3(0);
const duration = y$3(0);
const playbackState = y$3("idle");
const currentTrack = g$3(() => {
  const idx = currentIndex.value;
  const list = tracks.value;
  if (idx >= 0 && idx < list.length) {
    return list[idx];
  }
  return null;
});
function setPlaylist(newTracks, startIndex = 0) {
  tracks.value = newTracks;
  currentIndex.value = newTracks.length > 0 ? startIndex : -1;
  currentTime.value = 0;
  duration.value = 0;
}
function nextTrack() {
  const list = tracks.value;
  if (list.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % list.length;
  currentTime.value = 0;
}
function prevTrack() {
  const list = tracks.value;
  if (list.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + list.length) % list.length;
  currentTime.value = 0;
}
function isTrackCurrentlyPlaying(trackId) {
  const track = currentTrack.value;
  return track !== null && track.id === trackId && isPlaying.value === true;
}

var howler = {};

/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

var hasRequiredHowler;

function requireHowler () {
	if (hasRequiredHowler) return howler;
	hasRequiredHowler = 1;
	(function (exports) {
		(function() {

		  /** Global Methods **/
		  /***************************************************************************/

		  /**
		   * Create the global controller. All contained methods and properties apply
		   * to all sounds that are currently playing or will be in the future.
		   */
		  var HowlerGlobal = function() {
		    this.init();
		  };
		  HowlerGlobal.prototype = {
		    /**
		     * Initialize the global Howler object.
		     * @return {Howler}
		     */
		    init: function() {
		      var self = this || Howler;

		      // Create a global ID counter.
		      self._counter = 1000;

		      // Pool of unlocked HTML5 Audio objects.
		      self._html5AudioPool = [];
		      self.html5PoolSize = 10;

		      // Internal properties.
		      self._codecs = {};
		      self._howls = [];
		      self._muted = false;
		      self._volume = 1;
		      self._canPlayEvent = 'canplaythrough';
		      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

		      // Public properties.
		      self.masterGain = null;
		      self.noAudio = false;
		      self.usingWebAudio = true;
		      self.autoSuspend = true;
		      self.ctx = null;

		      // Set to false to disable the auto audio unlocker.
		      self.autoUnlock = true;

		      // Setup the various state values for global tracking.
		      self._setup();

		      return self;
		    },

		    /**
		     * Get/set the global volume for all sounds.
		     * @param  {Float} vol Volume from 0.0 to 1.0.
		     * @return {Howler/Float}     Returns self or current volume.
		     */
		    volume: function(vol) {
		      var self = this || Howler;
		      vol = parseFloat(vol);

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!self.ctx) {
		        setupAudioContext();
		      }

		      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
		        self._volume = vol;

		        // Don't update any of the nodes if we are muted.
		        if (self._muted) {
		          return self;
		        }

		        // When using Web Audio, we just need to adjust the master gain.
		        if (self.usingWebAudio) {
		          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		        }

		        // Loop through and change volume for all HTML5 audio nodes.
		        for (var i=0; i<self._howls.length; i++) {
		          if (!self._howls[i]._webAudio) {
		            // Get all of the sounds in this Howl group.
		            var ids = self._howls[i]._getSoundIds();

		            // Loop through all sounds and change the volumes.
		            for (var j=0; j<ids.length; j++) {
		              var sound = self._howls[i]._soundById(ids[j]);

		              if (sound && sound._node) {
		                sound._node.volume = sound._volume * vol;
		              }
		            }
		          }
		        }

		        return self;
		      }

		      return self._volume;
		    },

		    /**
		     * Handle muting and unmuting globally.
		     * @param  {Boolean} muted Is muted or not.
		     */
		    mute: function(muted) {
		      var self = this || Howler;

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!self.ctx) {
		        setupAudioContext();
		      }

		      self._muted = muted;

		      // With Web Audio, we just need to mute the master gain.
		      if (self.usingWebAudio) {
		        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
		      }

		      // Loop through and mute all HTML5 Audio nodes.
		      for (var i=0; i<self._howls.length; i++) {
		        if (!self._howls[i]._webAudio) {
		          // Get all of the sounds in this Howl group.
		          var ids = self._howls[i]._getSoundIds();

		          // Loop through all sounds and mark the audio node as muted.
		          for (var j=0; j<ids.length; j++) {
		            var sound = self._howls[i]._soundById(ids[j]);

		            if (sound && sound._node) {
		              sound._node.muted = (muted) ? true : sound._muted;
		            }
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Handle stopping all sounds globally.
		     */
		    stop: function() {
		      var self = this || Howler;

		      // Loop through all Howls and stop them.
		      for (var i=0; i<self._howls.length; i++) {
		        self._howls[i].stop();
		      }

		      return self;
		    },

		    /**
		     * Unload and destroy all currently loaded Howl objects.
		     * @return {Howler}
		     */
		    unload: function() {
		      var self = this || Howler;

		      for (var i=self._howls.length-1; i>=0; i--) {
		        self._howls[i].unload();
		      }

		      // Create a new AudioContext to make sure it is fully reset.
		      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
		        self.ctx.close();
		        self.ctx = null;
		        setupAudioContext();
		      }

		      return self;
		    },

		    /**
		     * Check for codec support of specific extension.
		     * @param  {String} ext Audio file extention.
		     * @return {Boolean}
		     */
		    codecs: function(ext) {
		      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
		    },

		    /**
		     * Setup various state values for global tracking.
		     * @return {Howler}
		     */
		    _setup: function() {
		      var self = this || Howler;

		      // Keeps track of the suspend/resume state of the AudioContext.
		      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

		      // Automatically begin the 30-second suspend process
		      self._autoSuspend();

		      // Check if audio is available.
		      if (!self.usingWebAudio) {
		        // No audio is available on this system if noAudio is set to true.
		        if (typeof Audio !== 'undefined') {
		          try {
		            var test = new Audio();

		            // Check if the canplaythrough event is available.
		            if (typeof test.oncanplaythrough === 'undefined') {
		              self._canPlayEvent = 'canplay';
		            }
		          } catch(e) {
		            self.noAudio = true;
		          }
		        } else {
		          self.noAudio = true;
		        }
		      }

		      // Test to make sure audio isn't disabled in Internet Explorer.
		      try {
		        var test = new Audio();
		        if (test.muted) {
		          self.noAudio = true;
		        }
		      } catch (e) {}

		      // Check for supported codecs.
		      if (!self.noAudio) {
		        self._setupCodecs();
		      }

		      return self;
		    },

		    /**
		     * Check for browser support for various codecs and cache the results.
		     * @return {Howler}
		     */
		    _setupCodecs: function() {
		      var self = this || Howler;
		      var audioTest = null;

		      // Must wrap in a try/catch because IE11 in server mode throws an error.
		      try {
		        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
		      } catch (err) {
		        return self;
		      }

		      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
		        return self;
		      }

		      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

		      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
		      var ua = self._navigator ? self._navigator.userAgent : '';
		      var checkOpera = ua.match(/OPR\/(\d+)/g);
		      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);
		      var checkSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
		      var safariVersion = ua.match(/Version\/(.*?) /);
		      var isOldSafari = (checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15);

		      self._codecs = {
		        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
		        mpeg: !!mpegTest,
		        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
		        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
		        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
		        wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType('audio/wav')).replace(/^no$/, ''),
		        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
		        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
		        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        m4b: !!(audioTest.canPlayType('audio/x-m4b;') || audioTest.canPlayType('audio/m4b;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
		        weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
		        webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
		        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
		        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
		      };

		      return self;
		    },

		    /**
		     * Some browsers/devices will only allow audio to be played after a user interaction.
		     * Attempt to automatically unlock audio on the first user interaction.
		     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		     * @return {Howler}
		     */
		    _unlockAudio: function() {
		      var self = this || Howler;

		      // Only run this if Web Audio is supported and it hasn't already been unlocked.
		      if (self._audioUnlocked || !self.ctx) {
		        return;
		      }

		      self._audioUnlocked = false;
		      self.autoUnlock = false;

		      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
		      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
		      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
		      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
		        self._mobileUnloaded = true;
		        self.unload();
		      }

		      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
		      // http://stackoverflow.com/questions/24119684
		      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

		      // Call this method on touch start to create and play a buffer,
		      // then check if the audio actually played to determine if
		      // audio has now been unlocked on iOS, Android, etc.
		      var unlock = function(e) {
		        // Create a pool of unlocked HTML5 Audio objects that can
		        // be used for playing sounds without user interaction. HTML5
		        // Audio objects must be individually unlocked, as opposed
		        // to the WebAudio API which only needs a single activation.
		        // This must occur before WebAudio setup or the source.onended
		        // event will not fire.
		        while (self._html5AudioPool.length < self.html5PoolSize) {
		          try {
		            var audioNode = new Audio();

		            // Mark this Audio object as unlocked to ensure it can get returned
		            // to the unlocked pool when released.
		            audioNode._unlocked = true;

		            // Add the audio node to the pool.
		            self._releaseHtml5Audio(audioNode);
		          } catch (e) {
		            self.noAudio = true;
		            break;
		          }
		        }

		        // Loop through any assigned audio nodes and unlock them.
		        for (var i=0; i<self._howls.length; i++) {
		          if (!self._howls[i]._webAudio) {
		            // Get all of the sounds in this Howl group.
		            var ids = self._howls[i]._getSoundIds();

		            // Loop through all sounds and unlock the audio nodes.
		            for (var j=0; j<ids.length; j++) {
		              var sound = self._howls[i]._soundById(ids[j]);

		              if (sound && sound._node && !sound._node._unlocked) {
		                sound._node._unlocked = true;
		                sound._node.load();
		              }
		            }
		          }
		        }

		        // Fix Android can not play in suspend state.
		        self._autoResume();

		        // Create an empty buffer.
		        var source = self.ctx.createBufferSource();
		        source.buffer = self._scratchBuffer;
		        source.connect(self.ctx.destination);

		        // Play the empty buffer.
		        if (typeof source.start === 'undefined') {
		          source.noteOn(0);
		        } else {
		          source.start(0);
		        }

		        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
		        if (typeof self.ctx.resume === 'function') {
		          self.ctx.resume();
		        }

		        // Setup a timeout to check that we are unlocked on the next event loop.
		        source.onended = function() {
		          source.disconnect(0);

		          // Update the unlocked state and prevent this check from happening again.
		          self._audioUnlocked = true;

		          // Remove the touch start listener.
		          document.removeEventListener('touchstart', unlock, true);
		          document.removeEventListener('touchend', unlock, true);
		          document.removeEventListener('click', unlock, true);
		          document.removeEventListener('keydown', unlock, true);

		          // Let all sounds know that audio has been unlocked.
		          for (var i=0; i<self._howls.length; i++) {
		            self._howls[i]._emit('unlock');
		          }
		        };
		      };

		      // Setup a touch start listener to attempt an unlock in.
		      document.addEventListener('touchstart', unlock, true);
		      document.addEventListener('touchend', unlock, true);
		      document.addEventListener('click', unlock, true);
		      document.addEventListener('keydown', unlock, true);

		      return self;
		    },

		    /**
		     * Get an unlocked HTML5 Audio object from the pool. If none are left,
		     * return a new Audio object and throw a warning.
		     * @return {Audio} HTML5 Audio object.
		     */
		    _obtainHtml5Audio: function() {
		      var self = this || Howler;

		      // Return the next object from the pool if one exists.
		      if (self._html5AudioPool.length) {
		        return self._html5AudioPool.pop();
		      }

		      //.Check if the audio is locked and throw a warning.
		      var testPlay = new Audio().play();
		      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
		        testPlay.catch(function() {
		          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
		        });
		      }

		      return new Audio();
		    },

		    /**
		     * Return an activated HTML5 Audio object to the pool.
		     * @return {Howler}
		     */
		    _releaseHtml5Audio: function(audio) {
		      var self = this || Howler;

		      // Don't add audio to the pool if we don't know if it has been unlocked.
		      if (audio._unlocked) {
		        self._html5AudioPool.push(audio);
		      }

		      return self;
		    },

		    /**
		     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
		     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
		     * @return {Howler}
		     */
		    _autoSuspend: function() {
		      var self = this;

		      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
		        return;
		      }

		      // Check if any sounds are playing.
		      for (var i=0; i<self._howls.length; i++) {
		        if (self._howls[i]._webAudio) {
		          for (var j=0; j<self._howls[i]._sounds.length; j++) {
		            if (!self._howls[i]._sounds[j]._paused) {
		              return self;
		            }
		          }
		        }
		      }

		      if (self._suspendTimer) {
		        clearTimeout(self._suspendTimer);
		      }

		      // If no sound has played after 30 seconds, suspend the context.
		      self._suspendTimer = setTimeout(function() {
		        if (!self.autoSuspend) {
		          return;
		        }

		        self._suspendTimer = null;
		        self.state = 'suspending';

		        // Handle updating the state of the audio context after suspending.
		        var handleSuspension = function() {
		          self.state = 'suspended';

		          if (self._resumeAfterSuspend) {
		            delete self._resumeAfterSuspend;
		            self._autoResume();
		          }
		        };

		        // Either the state gets suspended or it is interrupted.
		        // Either way, we need to update the state to suspended.
		        self.ctx.suspend().then(handleSuspension, handleSuspension);
		      }, 30000);

		      return self;
		    },

		    /**
		     * Automatically resume the Web Audio AudioContext when a new sound is played.
		     * @return {Howler}
		     */
		    _autoResume: function() {
		      var self = this;

		      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
		        return;
		      }

		      if (self.state === 'running' && self.ctx.state !== 'interrupted' && self._suspendTimer) {
		        clearTimeout(self._suspendTimer);
		        self._suspendTimer = null;
		      } else if (self.state === 'suspended' || self.state === 'running' && self.ctx.state === 'interrupted') {
		        self.ctx.resume().then(function() {
		          self.state = 'running';

		          // Emit to all Howls that the audio has resumed.
		          for (var i=0; i<self._howls.length; i++) {
		            self._howls[i]._emit('resume');
		          }
		        });

		        if (self._suspendTimer) {
		          clearTimeout(self._suspendTimer);
		          self._suspendTimer = null;
		        }
		      } else if (self.state === 'suspending') {
		        self._resumeAfterSuspend = true;
		      }

		      return self;
		    }
		  };

		  // Setup the global audio controller.
		  var Howler = new HowlerGlobal();

		  /** Group Methods **/
		  /***************************************************************************/

		  /**
		   * Create an audio group controller.
		   * @param {Object} o Passed in properties for this group.
		   */
		  var Howl = function(o) {
		    var self = this;

		    // Throw an error if no source is provided.
		    if (!o.src || o.src.length === 0) {
		      console.error('An array of source files must be passed with any new Howl.');
		      return;
		    }

		    self.init(o);
		  };
		  Howl.prototype = {
		    /**
		     * Initialize a new Howl group object.
		     * @param  {Object} o Passed in properties for this group.
		     * @return {Howl}
		     */
		    init: function(o) {
		      var self = this;

		      // If we don't have an AudioContext created yet, run the setup.
		      if (!Howler.ctx) {
		        setupAudioContext();
		      }

		      // Setup user-defined default properties.
		      self._autoplay = o.autoplay || false;
		      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
		      self._html5 = o.html5 || false;
		      self._muted = o.mute || false;
		      self._loop = o.loop || false;
		      self._pool = o.pool || 5;
		      self._preload = (typeof o.preload === 'boolean' || o.preload === 'metadata') ? o.preload : true;
		      self._rate = o.rate || 1;
		      self._sprite = o.sprite || {};
		      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
		      self._volume = o.volume !== undefined ? o.volume : 1;
		      self._xhr = {
		        method: o.xhr && o.xhr.method ? o.xhr.method : 'GET',
		        headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
		        withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false,
		      };

		      // Setup all other default properties.
		      self._duration = 0;
		      self._state = 'unloaded';
		      self._sounds = [];
		      self._endTimers = {};
		      self._queue = [];
		      self._playLock = false;

		      // Setup event listeners.
		      self._onend = o.onend ? [{fn: o.onend}] : [];
		      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
		      self._onload = o.onload ? [{fn: o.onload}] : [];
		      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
		      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
		      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
		      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
		      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
		      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
		      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
		      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
		      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
		      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
		      self._onresume = [];

		      // Web Audio or HTML5 Audio?
		      self._webAudio = Howler.usingWebAudio && !self._html5;

		      // Automatically try to enable audio.
		      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
		        Howler._unlockAudio();
		      }

		      // Keep track of this Howl group in the global controller.
		      Howler._howls.push(self);

		      // If they selected autoplay, add a play event to the load queue.
		      if (self._autoplay) {
		        self._queue.push({
		          event: 'play',
		          action: function() {
		            self.play();
		          }
		        });
		      }

		      // Load the source file unless otherwise specified.
		      if (self._preload && self._preload !== 'none') {
		        self.load();
		      }

		      return self;
		    },

		    /**
		     * Load the audio file.
		     * @return {Howler}
		     */
		    load: function() {
		      var self = this;
		      var url = null;

		      // If no audio is available, quit immediately.
		      if (Howler.noAudio) {
		        self._emit('loaderror', null, 'No audio support.');
		        return;
		      }

		      // Make sure our source is in an array.
		      if (typeof self._src === 'string') {
		        self._src = [self._src];
		      }

		      // Loop through the sources and pick the first one that is compatible.
		      for (var i=0; i<self._src.length; i++) {
		        var ext, str;

		        if (self._format && self._format[i]) {
		          // If an extension was specified, use that instead.
		          ext = self._format[i];
		        } else {
		          // Make sure the source is a string.
		          str = self._src[i];
		          if (typeof str !== 'string') {
		            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
		            continue;
		          }

		          // Extract the file extension from the URL or base64 data URI.
		          ext = /^data:audio\/([^;,]+);/i.exec(str);
		          if (!ext) {
		            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
		          }

		          if (ext) {
		            ext = ext[1].toLowerCase();
		          }
		        }

		        // Log a warning if no extension was found.
		        if (!ext) {
		          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
		        }

		        // Check if this extension is available.
		        if (ext && Howler.codecs(ext)) {
		          url = self._src[i];
		          break;
		        }
		      }

		      if (!url) {
		        self._emit('loaderror', null, 'No codec support for selected audio sources.');
		        return;
		      }

		      self._src = url;
		      self._state = 'loading';

		      // If the hosting page is HTTPS and the source isn't,
		      // drop down to HTML5 Audio to avoid Mixed Content errors.
		      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
		        self._html5 = true;
		        self._webAudio = false;
		      }

		      // Create a new sound object and add it to the pool.
		      new Sound(self);

		      // Load and decode the audio data for playback.
		      if (self._webAudio) {
		        loadBuffer(self);
		      }

		      return self;
		    },

		    /**
		     * Play a sound or resume previous playback.
		     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
		     * @param  {Boolean} internal Internal Use: true prevents event firing.
		     * @return {Number}          Sound ID.
		     */
		    play: function(sprite, internal) {
		      var self = this;
		      var id = null;

		      // Determine if a sprite, sound id or nothing was passed
		      if (typeof sprite === 'number') {
		        id = sprite;
		        sprite = null;
		      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
		        // If the passed sprite doesn't exist, do nothing.
		        return null;
		      } else if (typeof sprite === 'undefined') {
		        // Use the default sound sprite (plays the full audio length).
		        sprite = '__default';

		        // Check if there is a single paused sound that isn't ended.
		        // If there is, play that sound. If not, continue as usual.
		        if (!self._playLock) {
		          var num = 0;
		          for (var i=0; i<self._sounds.length; i++) {
		            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
		              num++;
		              id = self._sounds[i]._id;
		            }
		          }

		          if (num === 1) {
		            sprite = null;
		          } else {
		            id = null;
		          }
		        }
		      }

		      // Get the selected node, or get one from the pool.
		      var sound = id ? self._soundById(id) : self._inactiveSound();

		      // If the sound doesn't exist, do nothing.
		      if (!sound) {
		        return null;
		      }

		      // Select the sprite definition.
		      if (id && !sprite) {
		        sprite = sound._sprite || '__default';
		      }

		      // If the sound hasn't loaded, we must wait to get the audio's duration.
		      // We also need to wait to make sure we don't run into race conditions with
		      // the order of function calls.
		      if (self._state !== 'loaded') {
		        // Set the sprite value on this sound.
		        sound._sprite = sprite;

		        // Mark this sound as not ended in case another sound is played before this one loads.
		        sound._ended = false;

		        // Add the sound to the queue to be played on load.
		        var soundId = sound._id;
		        self._queue.push({
		          event: 'play',
		          action: function() {
		            self.play(soundId);
		          }
		        });

		        return soundId;
		      }

		      // Don't play the sound if an id was passed and it is already playing.
		      if (id && !sound._paused) {
		        // Trigger the play event, in order to keep iterating through queue.
		        if (!internal) {
		          self._loadQueue('play');
		        }

		        return sound._id;
		      }

		      // Make sure the AudioContext isn't suspended, and resume it if it is.
		      if (self._webAudio) {
		        Howler._autoResume();
		      }

		      // Determine how long to play for and where to start playing.
		      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
		      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
		      var timeout = (duration * 1000) / Math.abs(sound._rate);
		      var start = self._sprite[sprite][0] / 1000;
		      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
		      sound._sprite = sprite;

		      // Mark the sound as ended instantly so that this async playback
		      // doesn't get grabbed by another call to play while this one waits to start.
		      sound._ended = false;

		      // Update the parameters of the sound.
		      var setParams = function() {
		        sound._paused = false;
		        sound._seek = seek;
		        sound._start = start;
		        sound._stop = stop;
		        sound._loop = !!(sound._loop || self._sprite[sprite][2]);
		      };

		      // End the sound instantly if seek is at the end.
		      if (seek >= stop) {
		        self._ended(sound);
		        return;
		      }

		      // Begin the actual playback.
		      var node = sound._node;
		      if (self._webAudio) {
		        // Fire this when the sound is ready to play to begin Web Audio playback.
		        var playWebAudio = function() {
		          self._playLock = false;
		          setParams();
		          self._refreshBuffer(sound);

		          // Setup the playback params.
		          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
		          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		          sound._playStart = Howler.ctx.currentTime;

		          // Play the sound using the supported method.
		          if (typeof node.bufferSource.start === 'undefined') {
		            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
		          } else {
		            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
		          }

		          // Start a new timer if none is present.
		          if (timeout !== Infinity) {
		            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		          }

		          if (!internal) {
		            setTimeout(function() {
		              self._emit('play', sound._id);
		              self._loadQueue();
		            }, 0);
		          }
		        };

		        if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
		          playWebAudio();
		        } else {
		          self._playLock = true;

		          // Wait for the audio context to resume before playing.
		          self.once('resume', playWebAudio);

		          // Cancel the end timer.
		          self._clearTimer(sound._id);
		        }
		      } else {
		        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
		        var playHtml5 = function() {
		          node.currentTime = seek;
		          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
		          node.volume = sound._volume * Howler.volume();
		          node.playbackRate = sound._rate;

		          // Some browsers will throw an error if this is called without user interaction.
		          try {
		            var play = node.play();

		            // Support older browsers that don't support promises, and thus don't have this issue.
		            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
		              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
		              self._playLock = true;

		              // Set param values immediately.
		              setParams();

		              // Releases the lock and executes queued actions.
		              play
		                .then(function() {
		                  self._playLock = false;
		                  node._unlocked = true;
		                  if (!internal) {
		                    self._emit('play', sound._id);
		                  } else {
		                    self._loadQueue();
		                  }
		                })
		                .catch(function() {
		                  self._playLock = false;
		                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
		                    'on mobile devices and Chrome where playback was not within a user interaction.');

		                  // Reset the ended and paused values.
		                  sound._ended = true;
		                  sound._paused = true;
		                });
		            } else if (!internal) {
		              self._playLock = false;
		              setParams();
		              self._emit('play', sound._id);
		            }

		            // Setting rate before playing won't work in IE, so we set it again here.
		            node.playbackRate = sound._rate;

		            // If the node is still paused, then we can assume there was a playback issue.
		            if (node.paused) {
		              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
		                'on mobile devices and Chrome where playback was not within a user interaction.');
		              return;
		            }

		            // Setup the end timer on sprites or listen for the ended event.
		            if (sprite !== '__default' || sound._loop) {
		              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		            } else {
		              self._endTimers[sound._id] = function() {
		                // Fire ended on this audio node.
		                self._ended(sound);

		                // Clear this listener.
		                node.removeEventListener('ended', self._endTimers[sound._id], false);
		              };
		              node.addEventListener('ended', self._endTimers[sound._id], false);
		            }
		          } catch (err) {
		            self._emit('playerror', sound._id, err);
		          }
		        };

		        // If this is streaming audio, make sure the src is set and load again.
		        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
		          node.src = self._src;
		          node.load();
		        }

		        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
		        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
		        if (node.readyState >= 3 || loadedNoReadyState) {
		          playHtml5();
		        } else {
		          self._playLock = true;
		          self._state = 'loading';

		          var listener = function() {
		            self._state = 'loaded';
		            
		            // Begin playback.
		            playHtml5();

		            // Clear this listener.
		            node.removeEventListener(Howler._canPlayEvent, listener, false);
		          };
		          node.addEventListener(Howler._canPlayEvent, listener, false);

		          // Cancel the end timer.
		          self._clearTimer(sound._id);
		        }
		      }

		      return sound._id;
		    },

		    /**
		     * Pause playback and save current position.
		     * @param  {Number} id The sound ID (empty to pause all in group).
		     * @return {Howl}
		     */
		    pause: function(id) {
		      var self = this;

		      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'pause',
		          action: function() {
		            self.pause(id);
		          }
		        });

		        return self;
		      }

		      // If no id is passed, get all ID's to be paused.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Clear the end timer.
		        self._clearTimer(ids[i]);

		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound && !sound._paused) {
		          // Reset the seek position.
		          sound._seek = self.seek(ids[i]);
		          sound._rateSeek = 0;
		          sound._paused = true;

		          // Stop currently running fades.
		          self._stopFade(ids[i]);

		          if (sound._node) {
		            if (self._webAudio) {
		              // Make sure the sound has been created.
		              if (!sound._node.bufferSource) {
		                continue;
		              }

		              if (typeof sound._node.bufferSource.stop === 'undefined') {
		                sound._node.bufferSource.noteOff(0);
		              } else {
		                sound._node.bufferSource.stop(0);
		              }

		              // Clean up the buffer source.
		              self._cleanBuffer(sound._node);
		            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
		              sound._node.pause();
		            }
		          }
		        }

		        // Fire the pause event, unless `true` is passed as the 2nd argument.
		        if (!arguments[1]) {
		          self._emit('pause', sound ? sound._id : null);
		        }
		      }

		      return self;
		    },

		    /**
		     * Stop playback and reset to start.
		     * @param  {Number} id The sound ID (empty to stop all in group).
		     * @param  {Boolean} internal Internal Use: true prevents event firing.
		     * @return {Howl}
		     */
		    stop: function(id, internal) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to stop when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'stop',
		          action: function() {
		            self.stop(id);
		          }
		        });

		        return self;
		      }

		      // If no id is passed, get all ID's to be stopped.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Clear the end timer.
		        self._clearTimer(ids[i]);

		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound) {
		          // Reset the seek position.
		          sound._seek = sound._start || 0;
		          sound._rateSeek = 0;
		          sound._paused = true;
		          sound._ended = true;

		          // Stop currently running fades.
		          self._stopFade(ids[i]);

		          if (sound._node) {
		            if (self._webAudio) {
		              // Make sure the sound's AudioBufferSourceNode has been created.
		              if (sound._node.bufferSource) {
		                if (typeof sound._node.bufferSource.stop === 'undefined') {
		                  sound._node.bufferSource.noteOff(0);
		                } else {
		                  sound._node.bufferSource.stop(0);
		                }

		                // Clean up the buffer source.
		                self._cleanBuffer(sound._node);
		              }
		            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
		              sound._node.currentTime = sound._start || 0;
		              sound._node.pause();

		              // If this is a live stream, stop download once the audio is stopped.
		              if (sound._node.duration === Infinity) {
		                self._clearSound(sound._node);
		              }
		            }
		          }

		          if (!internal) {
		            self._emit('stop', sound._id);
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Mute/unmute a single sound or all sounds in this Howl group.
		     * @param  {Boolean} muted Set to true to mute and false to unmute.
		     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
		     * @return {Howl}
		     */
		    mute: function(muted, id) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to mute when capable.
		      if (self._state !== 'loaded'|| self._playLock) {
		        self._queue.push({
		          event: 'mute',
		          action: function() {
		            self.mute(muted, id);
		          }
		        });

		        return self;
		      }

		      // If applying mute/unmute to all sounds, update the group's value.
		      if (typeof id === 'undefined') {
		        if (typeof muted === 'boolean') {
		          self._muted = muted;
		        } else {
		          return self._muted;
		        }
		      }

		      // If no id is passed, get all ID's to be muted.
		      var ids = self._getSoundIds(id);

		      for (var i=0; i<ids.length; i++) {
		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        if (sound) {
		          sound._muted = muted;

		          // Cancel active fade and set the volume to the end value.
		          if (sound._interval) {
		            self._stopFade(sound._id);
		          }

		          if (self._webAudio && sound._node) {
		            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
		          } else if (sound._node) {
		            sound._node.muted = Howler._muted ? true : muted;
		          }

		          self._emit('mute', sound._id);
		        }
		      }

		      return self;
		    },

		    /**
		     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
		     *   volume() -> Returns the group's volume value.
		     *   volume(id) -> Returns the sound id's current volume.
		     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
		     *   volume(vol, id) -> Sets the volume of passed sound id.
		     * @return {Howl/Number} Returns self or current volume.
		     */
		    volume: function() {
		      var self = this;
		      var args = arguments;
		      var vol, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // Return the value of the groups' volume.
		        return self._volume;
		      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
		        // First check if this is an ID, and if not, assume it is a new volume.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else {
		          vol = parseFloat(args[0]);
		        }
		      } else if (args.length >= 2) {
		        vol = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // Update the volume or return the current volume.
		      var sound;
		      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
		        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
		        if (self._state !== 'loaded'|| self._playLock) {
		          self._queue.push({
		            event: 'volume',
		            action: function() {
		              self.volume.apply(self, args);
		            }
		          });

		          return self;
		        }

		        // Set the group volume.
		        if (typeof id === 'undefined') {
		          self._volume = vol;
		        }

		        // Update one or all volumes.
		        id = self._getSoundIds(id);
		        for (var i=0; i<id.length; i++) {
		          // Get the sound.
		          sound = self._soundById(id[i]);

		          if (sound) {
		            sound._volume = vol;

		            // Stop currently running fades.
		            if (!args[2]) {
		              self._stopFade(id[i]);
		            }

		            if (self._webAudio && sound._node && !sound._muted) {
		              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
		            } else if (sound._node && !sound._muted) {
		              sound._node.volume = vol * Howler.volume();
		            }

		            self._emit('volume', sound._id);
		          }
		        }
		      } else {
		        sound = id ? self._soundById(id) : self._sounds[0];
		        return sound ? sound._volume : 0;
		      }

		      return self;
		    },

		    /**
		     * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
		     * @param  {Number} from The value to fade from (0.0 to 1.0).
		     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
		     * @param  {Number} len  Time in milliseconds to fade.
		     * @param  {Number} id   The sound id (omit to fade all sounds).
		     * @return {Howl}
		     */
		    fade: function(from, to, len, id) {
		      var self = this;

		      // If the sound hasn't loaded, add it to the load queue to fade when capable.
		      if (self._state !== 'loaded' || self._playLock) {
		        self._queue.push({
		          event: 'fade',
		          action: function() {
		            self.fade(from, to, len, id);
		          }
		        });

		        return self;
		      }

		      // Make sure the to/from/len values are numbers.
		      from = Math.min(Math.max(0, parseFloat(from)), 1);
		      to = Math.min(Math.max(0, parseFloat(to)), 1);
		      len = parseFloat(len);

		      // Set the volume to the start position.
		      self.volume(from, id);

		      // Fade the volume of one or all sounds.
		      var ids = self._getSoundIds(id);
		      for (var i=0; i<ids.length; i++) {
		        // Get the sound.
		        var sound = self._soundById(ids[i]);

		        // Create a linear fade or fall back to timeouts with HTML5 Audio.
		        if (sound) {
		          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
		          if (!id) {
		            self._stopFade(ids[i]);
		          }

		          // If we are using Web Audio, let the native methods do the actual fade.
		          if (self._webAudio && !sound._muted) {
		            var currentTime = Howler.ctx.currentTime;
		            var end = currentTime + (len / 1000);
		            sound._volume = from;
		            sound._node.gain.setValueAtTime(from, currentTime);
		            sound._node.gain.linearRampToValueAtTime(to, end);
		          }

		          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
		        }
		      }

		      return self;
		    },

		    /**
		     * Starts the internal interval to fade a sound.
		     * @param  {Object} sound Reference to sound to fade.
		     * @param  {Number} from The value to fade from (0.0 to 1.0).
		     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
		     * @param  {Number} len  Time in milliseconds to fade.
		     * @param  {Number} id   The sound id to fade.
		     * @param  {Boolean} isGroup   If true, set the volume on the group.
		     */
		    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
		      var self = this;
		      var vol = from;
		      var diff = to - from;
		      var steps = Math.abs(diff / 0.01);
		      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
		      var lastTick = Date.now();

		      // Store the value being faded to.
		      sound._fadeTo = to;

		      // Update the volume value on each interval tick.
		      sound._interval = setInterval(function() {
		        // Update the volume based on the time since the last tick.
		        var tick = (Date.now() - lastTick) / len;
		        lastTick = Date.now();
		        vol += diff * tick;

		        // Round to within 2 decimal points.
		        vol = Math.round(vol * 100) / 100;

		        // Make sure the volume is in the right bounds.
		        if (diff < 0) {
		          vol = Math.max(to, vol);
		        } else {
		          vol = Math.min(to, vol);
		        }

		        // Change the volume.
		        if (self._webAudio) {
		          sound._volume = vol;
		        } else {
		          self.volume(vol, sound._id, true);
		        }

		        // Set the group's volume.
		        if (isGroup) {
		          self._volume = vol;
		        }

		        // When the fade is complete, stop it and fire event.
		        if ((to < from && vol <= to) || (to > from && vol >= to)) {
		          clearInterval(sound._interval);
		          sound._interval = null;
		          sound._fadeTo = null;
		          self.volume(to, sound._id);
		          self._emit('fade', sound._id);
		        }
		      }, stepLen);
		    },

		    /**
		     * Internal method that stops the currently playing fade when
		     * a new fade starts, volume is changed or the sound is stopped.
		     * @param  {Number} id The sound id.
		     * @return {Howl}
		     */
		    _stopFade: function(id) {
		      var self = this;
		      var sound = self._soundById(id);

		      if (sound && sound._interval) {
		        if (self._webAudio) {
		          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
		        }

		        clearInterval(sound._interval);
		        sound._interval = null;
		        self.volume(sound._fadeTo, id);
		        sound._fadeTo = null;
		        self._emit('fade', id);
		      }

		      return self;
		    },

		    /**
		     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   loop() -> Returns the group's loop value.
		     *   loop(id) -> Returns the sound id's loop value.
		     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
		     *   loop(loop, id) -> Sets the loop value of passed sound id.
		     * @return {Howl/Boolean} Returns self or current loop value.
		     */
		    loop: function() {
		      var self = this;
		      var args = arguments;
		      var loop, id, sound;

		      // Determine the values for loop and id.
		      if (args.length === 0) {
		        // Return the grou's loop value.
		        return self._loop;
		      } else if (args.length === 1) {
		        if (typeof args[0] === 'boolean') {
		          loop = args[0];
		          self._loop = loop;
		        } else {
		          // Return this sound's loop value.
		          sound = self._soundById(parseInt(args[0], 10));
		          return sound ? sound._loop : false;
		        }
		      } else if (args.length === 2) {
		        loop = args[0];
		        id = parseInt(args[1], 10);
		      }

		      // If no id is passed, get all ID's to be looped.
		      var ids = self._getSoundIds(id);
		      for (var i=0; i<ids.length; i++) {
		        sound = self._soundById(ids[i]);

		        if (sound) {
		          sound._loop = loop;
		          if (self._webAudio && sound._node && sound._node.bufferSource) {
		            sound._node.bufferSource.loop = loop;
		            if (loop) {
		              sound._node.bufferSource.loopStart = sound._start || 0;
		              sound._node.bufferSource.loopEnd = sound._stop;

		              // If playing, restart playback to ensure looping updates.
		              if (self.playing(ids[i])) {
		                self.pause(ids[i], true);
		                self.play(ids[i], true);
		              }
		            }
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   rate() -> Returns the first sound node's current playback rate.
		     *   rate(id) -> Returns the sound id's current playback rate.
		     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
		     *   rate(rate, id) -> Sets the playback rate of passed sound id.
		     * @return {Howl/Number} Returns self or the current playback rate.
		     */
		    rate: function() {
		      var self = this;
		      var args = arguments;
		      var rate, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // We will simply return the current rate of the first node.
		        id = self._sounds[0]._id;
		      } else if (args.length === 1) {
		        // First check if this is an ID, and if not, assume it is a new rate value.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else {
		          rate = parseFloat(args[0]);
		        }
		      } else if (args.length === 2) {
		        rate = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // Update the playback rate or return the current value.
		      var sound;
		      if (typeof rate === 'number') {
		        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
		        if (self._state !== 'loaded' || self._playLock) {
		          self._queue.push({
		            event: 'rate',
		            action: function() {
		              self.rate.apply(self, args);
		            }
		          });

		          return self;
		        }

		        // Set the group rate.
		        if (typeof id === 'undefined') {
		          self._rate = rate;
		        }

		        // Update one or all volumes.
		        id = self._getSoundIds(id);
		        for (var i=0; i<id.length; i++) {
		          // Get the sound.
		          sound = self._soundById(id[i]);

		          if (sound) {
		            // Keep track of our position when the rate changed and update the playback
		            // start position so we can properly adjust the seek position for time elapsed.
		            if (self.playing(id[i])) {
		              sound._rateSeek = self.seek(id[i]);
		              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
		            }
		            sound._rate = rate;

		            // Change the playback rate.
		            if (self._webAudio && sound._node && sound._node.bufferSource) {
		              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
		            } else if (sound._node) {
		              sound._node.playbackRate = rate;
		            }

		            // Reset the timers.
		            var seek = self.seek(id[i]);
		            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
		            var timeout = (duration * 1000) / Math.abs(sound._rate);

		            // Start a new end timer if sound is already playing.
		            if (self._endTimers[id[i]] || !sound._paused) {
		              self._clearTimer(id[i]);
		              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
		            }

		            self._emit('rate', sound._id);
		          }
		        }
		      } else {
		        sound = self._soundById(id);
		        return sound ? sound._rate : self._rate;
		      }

		      return self;
		    },

		    /**
		     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
		     *   seek() -> Returns the first sound node's current seek position.
		     *   seek(id) -> Returns the sound id's current seek position.
		     *   seek(seek) -> Sets the seek position of the first sound node.
		     *   seek(seek, id) -> Sets the seek position of passed sound id.
		     * @return {Howl/Number} Returns self or the current seek position.
		     */
		    seek: function() {
		      var self = this;
		      var args = arguments;
		      var seek, id;

		      // Determine the values based on arguments.
		      if (args.length === 0) {
		        // We will simply return the current position of the first node.
		        if (self._sounds.length) {
		          id = self._sounds[0]._id;
		        }
		      } else if (args.length === 1) {
		        // First check if this is an ID, and if not, assume it is a new seek position.
		        var ids = self._getSoundIds();
		        var index = ids.indexOf(args[0]);
		        if (index >= 0) {
		          id = parseInt(args[0], 10);
		        } else if (self._sounds.length) {
		          id = self._sounds[0]._id;
		          seek = parseFloat(args[0]);
		        }
		      } else if (args.length === 2) {
		        seek = parseFloat(args[0]);
		        id = parseInt(args[1], 10);
		      }

		      // If there is no ID, bail out.
		      if (typeof id === 'undefined') {
		        return 0;
		      }

		      // If the sound hasn't loaded, add it to the load queue to seek when capable.
		      if (typeof seek === 'number' && (self._state !== 'loaded' || self._playLock)) {
		        self._queue.push({
		          event: 'seek',
		          action: function() {
		            self.seek.apply(self, args);
		          }
		        });

		        return self;
		      }

		      // Get the sound.
		      var sound = self._soundById(id);

		      if (sound) {
		        if (typeof seek === 'number' && seek >= 0) {
		          // Pause the sound and update position for restarting playback.
		          var playing = self.playing(id);
		          if (playing) {
		            self.pause(id, true);
		          }

		          // Move the position of the track and cancel timer.
		          sound._seek = seek;
		          sound._ended = false;
		          self._clearTimer(id);

		          // Update the seek position for HTML5 Audio.
		          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
		            sound._node.currentTime = seek;
		          }

		          // Seek and emit when ready.
		          var seekAndEmit = function() {
		            // Restart the playback if the sound was playing.
		            if (playing) {
		              self.play(id, true);
		            }

		            self._emit('seek', id);
		          };

		          // Wait for the play lock to be unset before emitting (HTML5 Audio).
		          if (playing && !self._webAudio) {
		            var emitSeek = function() {
		              if (!self._playLock) {
		                seekAndEmit();
		              } else {
		                setTimeout(emitSeek, 0);
		              }
		            };
		            setTimeout(emitSeek, 0);
		          } else {
		            seekAndEmit();
		          }
		        } else {
		          if (self._webAudio) {
		            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
		            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
		            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
		          } else {
		            return sound._node.currentTime;
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
		     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
		     * @return {Boolean} True if playing and false if not.
		     */
		    playing: function(id) {
		      var self = this;

		      // Check the passed sound ID (if any).
		      if (typeof id === 'number') {
		        var sound = self._soundById(id);
		        return sound ? !sound._paused : false;
		      }

		      // Otherwise, loop through all sounds and check if any are playing.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (!self._sounds[i]._paused) {
		          return true;
		        }
		      }

		      return false;
		    },

		    /**
		     * Get the duration of this sound. Passing a sound id will return the sprite duration.
		     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
		     * @return {Number} Audio duration in seconds.
		     */
		    duration: function(id) {
		      var self = this;
		      var duration = self._duration;

		      // If we pass an ID, get the sound and return the sprite length.
		      var sound = self._soundById(id);
		      if (sound) {
		        duration = self._sprite[sound._sprite][1] / 1000;
		      }

		      return duration;
		    },

		    /**
		     * Returns the current loaded state of this Howl.
		     * @return {String} 'unloaded', 'loading', 'loaded'
		     */
		    state: function() {
		      return this._state;
		    },

		    /**
		     * Unload and destroy the current Howl object.
		     * This will immediately stop all sound instances attached to this group.
		     */
		    unload: function() {
		      var self = this;

		      // Stop playing any active sounds.
		      var sounds = self._sounds;
		      for (var i=0; i<sounds.length; i++) {
		        // Stop the sound if it is currently playing.
		        if (!sounds[i]._paused) {
		          self.stop(sounds[i]._id);
		        }

		        // Remove the source or disconnect.
		        if (!self._webAudio) {
		          // Set the source to 0-second silence to stop any downloading (except in IE).
		          self._clearSound(sounds[i]._node);

		          // Remove any event listeners.
		          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
		          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
		          sounds[i]._node.removeEventListener('ended', sounds[i]._endFn, false);

		          // Release the Audio object back to the pool.
		          Howler._releaseHtml5Audio(sounds[i]._node);
		        }

		        // Empty out all of the nodes.
		        delete sounds[i]._node;

		        // Make sure all timers are cleared out.
		        self._clearTimer(sounds[i]._id);
		      }

		      // Remove the references in the global Howler object.
		      var index = Howler._howls.indexOf(self);
		      if (index >= 0) {
		        Howler._howls.splice(index, 1);
		      }

		      // Delete this sound from the cache (if no other Howl is using it).
		      var remCache = true;
		      for (i=0; i<Howler._howls.length; i++) {
		        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
		          remCache = false;
		          break;
		        }
		      }

		      if (cache && remCache) {
		        delete cache[self._src];
		      }

		      // Clear global errors.
		      Howler.noAudio = false;

		      // Clear out `self`.
		      self._state = 'unloaded';
		      self._sounds = [];
		      self = null;

		      return null;
		    },

		    /**
		     * Listen to a custom event.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to call.
		     * @param  {Number}   id    (optional) Only listen to events for this sound.
		     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
		     * @return {Howl}
		     */
		    on: function(event, fn, id, once) {
		      var self = this;
		      var events = self['_on' + event];

		      if (typeof fn === 'function') {
		        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
		      }

		      return self;
		    },

		    /**
		     * Remove a custom event. Call without parameters to remove all events.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
		     * @param  {Number}   id    (optional) Only remove events for this sound.
		     * @return {Howl}
		     */
		    off: function(event, fn, id) {
		      var self = this;
		      var events = self['_on' + event];
		      var i = 0;

		      // Allow passing just an event and ID.
		      if (typeof fn === 'number') {
		        id = fn;
		        fn = null;
		      }

		      if (fn || id) {
		        // Loop through event store and remove the passed function.
		        for (i=0; i<events.length; i++) {
		          var isId = (id === events[i].id);
		          if (fn === events[i].fn && isId || !fn && isId) {
		            events.splice(i, 1);
		            break;
		          }
		        }
		      } else if (event) {
		        // Clear out all events of this type.
		        self['_on' + event] = [];
		      } else {
		        // Clear out all events of every type.
		        var keys = Object.keys(self);
		        for (i=0; i<keys.length; i++) {
		          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
		            self[keys[i]] = [];
		          }
		        }
		      }

		      return self;
		    },

		    /**
		     * Listen to a custom event and remove it once fired.
		     * @param  {String}   event Event name.
		     * @param  {Function} fn    Listener to call.
		     * @param  {Number}   id    (optional) Only listen to events for this sound.
		     * @return {Howl}
		     */
		    once: function(event, fn, id) {
		      var self = this;

		      // Setup the event listener.
		      self.on(event, fn, id, 1);

		      return self;
		    },

		    /**
		     * Emit all events of a specific type and pass the sound id.
		     * @param  {String} event Event name.
		     * @param  {Number} id    Sound ID.
		     * @param  {Number} msg   Message to go with event.
		     * @return {Howl}
		     */
		    _emit: function(event, id, msg) {
		      var self = this;
		      var events = self['_on' + event];

		      // Loop through event store and fire all functions.
		      for (var i=events.length-1; i>=0; i--) {
		        // Only fire the listener if the correct ID is used.
		        if (!events[i].id || events[i].id === id || event === 'load') {
		          setTimeout(function(fn) {
		            fn.call(this, id, msg);
		          }.bind(self, events[i].fn), 0);

		          // If this event was setup with `once`, remove it.
		          if (events[i].once) {
		            self.off(event, events[i].fn, events[i].id);
		          }
		        }
		      }

		      // Pass the event type into load queue so that it can continue stepping.
		      self._loadQueue(event);

		      return self;
		    },

		    /**
		     * Queue of actions initiated before the sound has loaded.
		     * These will be called in sequence, with the next only firing
		     * after the previous has finished executing (even if async like play).
		     * @return {Howl}
		     */
		    _loadQueue: function(event) {
		      var self = this;

		      if (self._queue.length > 0) {
		        var task = self._queue[0];

		        // Remove this task if a matching event was passed.
		        if (task.event === event) {
		          self._queue.shift();
		          self._loadQueue();
		        }

		        // Run the task if no event type is passed.
		        if (!event) {
		          task.action();
		        }
		      }

		      return self;
		    },

		    /**
		     * Fired when playback ends at the end of the duration.
		     * @param  {Sound} sound The sound object to work with.
		     * @return {Howl}
		     */
		    _ended: function(sound) {
		      var self = this;
		      var sprite = sound._sprite;

		      // If we are using IE and there was network latency we may be clipping
		      // audio before it completes playing. Lets check the node to make sure it
		      // believes it has completed, before ending the playback.
		      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
		        setTimeout(self._ended.bind(self, sound), 100);
		        return self;
		      }

		      // Should this sound loop?
		      var loop = !!(sound._loop || self._sprite[sprite][2]);

		      // Fire the ended event.
		      self._emit('end', sound._id);

		      // Restart the playback for HTML5 Audio loop.
		      if (!self._webAudio && loop) {
		        self.stop(sound._id, true).play(sound._id);
		      }

		      // Restart this timer if on a Web Audio loop.
		      if (self._webAudio && loop) {
		        self._emit('play', sound._id);
		        sound._seek = sound._start || 0;
		        sound._rateSeek = 0;
		        sound._playStart = Howler.ctx.currentTime;

		        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
		        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
		      }

		      // Mark the node as paused.
		      if (self._webAudio && !loop) {
		        sound._paused = true;
		        sound._ended = true;
		        sound._seek = sound._start || 0;
		        sound._rateSeek = 0;
		        self._clearTimer(sound._id);

		        // Clean up the buffer source.
		        self._cleanBuffer(sound._node);

		        // Attempt to auto-suspend AudioContext if no sounds are still playing.
		        Howler._autoSuspend();
		      }

		      // When using a sprite, end the track.
		      if (!self._webAudio && !loop) {
		        self.stop(sound._id, true);
		      }

		      return self;
		    },

		    /**
		     * Clear the end timer for a sound playback.
		     * @param  {Number} id The sound ID.
		     * @return {Howl}
		     */
		    _clearTimer: function(id) {
		      var self = this;

		      if (self._endTimers[id]) {
		        // Clear the timeout or remove the ended listener.
		        if (typeof self._endTimers[id] !== 'function') {
		          clearTimeout(self._endTimers[id]);
		        } else {
		          var sound = self._soundById(id);
		          if (sound && sound._node) {
		            sound._node.removeEventListener('ended', self._endTimers[id], false);
		          }
		        }

		        delete self._endTimers[id];
		      }

		      return self;
		    },

		    /**
		     * Return the sound identified by this ID, or return null.
		     * @param  {Number} id Sound ID
		     * @return {Object}    Sound object or null.
		     */
		    _soundById: function(id) {
		      var self = this;

		      // Loop through all sounds and find the one with this ID.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (id === self._sounds[i]._id) {
		          return self._sounds[i];
		        }
		      }

		      return null;
		    },

		    /**
		     * Return an inactive sound from the pool or create a new one.
		     * @return {Sound} Sound playback object.
		     */
		    _inactiveSound: function() {
		      var self = this;

		      self._drain();

		      // Find the first inactive node to recycle.
		      for (var i=0; i<self._sounds.length; i++) {
		        if (self._sounds[i]._ended) {
		          return self._sounds[i].reset();
		        }
		      }

		      // If no inactive node was found, create a new one.
		      return new Sound(self);
		    },

		    /**
		     * Drain excess inactive sounds from the pool.
		     */
		    _drain: function() {
		      var self = this;
		      var limit = self._pool;
		      var cnt = 0;
		      var i = 0;

		      // If there are less sounds than the max pool size, we are done.
		      if (self._sounds.length < limit) {
		        return;
		      }

		      // Count the number of inactive sounds.
		      for (i=0; i<self._sounds.length; i++) {
		        if (self._sounds[i]._ended) {
		          cnt++;
		        }
		      }

		      // Remove excess inactive sounds, going in reverse order.
		      for (i=self._sounds.length - 1; i>=0; i--) {
		        if (cnt <= limit) {
		          return;
		        }

		        if (self._sounds[i]._ended) {
		          // Disconnect the audio source when using Web Audio.
		          if (self._webAudio && self._sounds[i]._node) {
		            self._sounds[i]._node.disconnect(0);
		          }

		          // Remove sounds until we have the pool size.
		          self._sounds.splice(i, 1);
		          cnt--;
		        }
		      }
		    },

		    /**
		     * Get all ID's from the sounds pool.
		     * @param  {Number} id Only return one ID if one is passed.
		     * @return {Array}    Array of IDs.
		     */
		    _getSoundIds: function(id) {
		      var self = this;

		      if (typeof id === 'undefined') {
		        var ids = [];
		        for (var i=0; i<self._sounds.length; i++) {
		          ids.push(self._sounds[i]._id);
		        }

		        return ids;
		      } else {
		        return [id];
		      }
		    },

		    /**
		     * Load the sound back into the buffer source.
		     * @param  {Sound} sound The sound object to work with.
		     * @return {Howl}
		     */
		    _refreshBuffer: function(sound) {
		      var self = this;

		      // Setup the buffer source for playback.
		      sound._node.bufferSource = Howler.ctx.createBufferSource();
		      sound._node.bufferSource.buffer = cache[self._src];

		      // Connect to the correct node.
		      if (sound._panner) {
		        sound._node.bufferSource.connect(sound._panner);
		      } else {
		        sound._node.bufferSource.connect(sound._node);
		      }

		      // Setup looping and playback rate.
		      sound._node.bufferSource.loop = sound._loop;
		      if (sound._loop) {
		        sound._node.bufferSource.loopStart = sound._start || 0;
		        sound._node.bufferSource.loopEnd = sound._stop || 0;
		      }
		      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

		      return self;
		    },

		    /**
		     * Prevent memory leaks by cleaning up the buffer source after playback.
		     * @param  {Object} node Sound's audio node containing the buffer source.
		     * @return {Howl}
		     */
		    _cleanBuffer: function(node) {
		      var self = this;
		      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

		      if (!node.bufferSource) {
		        return self;
		      }

		      if (Howler._scratchBuffer && node.bufferSource) {
		        node.bufferSource.onended = null;
		        node.bufferSource.disconnect(0);
		        if (isIOS) {
		          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
		        }
		      }
		      node.bufferSource = null;

		      return self;
		    },

		    /**
		     * Set the source to a 0-second silence to stop any downloading (except in IE).
		     * @param  {Object} node Audio node to clear.
		     */
		    _clearSound: function(node) {
		      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
		      if (!checkIE) {
		        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
		      }
		    }
		  };

		  /** Single Sound Methods **/
		  /***************************************************************************/

		  /**
		   * Setup the sound object, which each node attached to a Howl group is contained in.
		   * @param {Object} howl The Howl parent group.
		   */
		  var Sound = function(howl) {
		    this._parent = howl;
		    this.init();
		  };
		  Sound.prototype = {
		    /**
		     * Initialize a new Sound object.
		     * @return {Sound}
		     */
		    init: function() {
		      var self = this;
		      var parent = self._parent;

		      // Setup the default parameters.
		      self._muted = parent._muted;
		      self._loop = parent._loop;
		      self._volume = parent._volume;
		      self._rate = parent._rate;
		      self._seek = 0;
		      self._paused = true;
		      self._ended = true;
		      self._sprite = '__default';

		      // Generate a unique ID for this sound.
		      self._id = ++Howler._counter;

		      // Add itself to the parent's pool.
		      parent._sounds.push(self);

		      // Create the new node.
		      self.create();

		      return self;
		    },

		    /**
		     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
		     * @return {Sound}
		     */
		    create: function() {
		      var self = this;
		      var parent = self._parent;
		      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

		      if (parent._webAudio) {
		        // Create the gain node for controlling volume (the source will connect to this).
		        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
		        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
		        self._node.paused = true;
		        self._node.connect(Howler.masterGain);
		      } else if (!Howler.noAudio) {
		        // Get an unlocked Audio object from the pool.
		        self._node = Howler._obtainHtml5Audio();

		        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
		        self._errorFn = self._errorListener.bind(self);
		        self._node.addEventListener('error', self._errorFn, false);

		        // Listen for 'canplaythrough' event to let us know the sound is ready.
		        self._loadFn = self._loadListener.bind(self);
		        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

		        // Listen for the 'ended' event on the sound to account for edge-case where
		        // a finite sound has a duration of Infinity.
		        self._endFn = self._endListener.bind(self);
		        self._node.addEventListener('ended', self._endFn, false);

		        // Setup the new audio node.
		        self._node.src = parent._src;
		        self._node.preload = parent._preload === true ? 'auto' : parent._preload;
		        self._node.volume = volume * Howler.volume();

		        // Begin loading the source.
		        self._node.load();
		      }

		      return self;
		    },

		    /**
		     * Reset the parameters of this sound to the original state (for recycle).
		     * @return {Sound}
		     */
		    reset: function() {
		      var self = this;
		      var parent = self._parent;

		      // Reset all of the parameters of this sound.
		      self._muted = parent._muted;
		      self._loop = parent._loop;
		      self._volume = parent._volume;
		      self._rate = parent._rate;
		      self._seek = 0;
		      self._rateSeek = 0;
		      self._paused = true;
		      self._ended = true;
		      self._sprite = '__default';

		      // Generate a new ID so that it isn't confused with the previous sound.
		      self._id = ++Howler._counter;

		      return self;
		    },

		    /**
		     * HTML5 Audio error listener callback.
		     */
		    _errorListener: function() {
		      var self = this;

		      // Fire an error event and pass back the code.
		      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

		      // Clear the event listener.
		      self._node.removeEventListener('error', self._errorFn, false);
		    },

		    /**
		     * HTML5 Audio canplaythrough listener callback.
		     */
		    _loadListener: function() {
		      var self = this;
		      var parent = self._parent;

		      // Round up the duration to account for the lower precision in HTML5 Audio.
		      parent._duration = Math.ceil(self._node.duration * 10) / 10;

		      // Setup a sprite if none is defined.
		      if (Object.keys(parent._sprite).length === 0) {
		        parent._sprite = {__default: [0, parent._duration * 1000]};
		      }

		      if (parent._state !== 'loaded') {
		        parent._state = 'loaded';
		        parent._emit('load');
		        parent._loadQueue();
		      }

		      // Clear the event listener.
		      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
		    },

		    /**
		     * HTML5 Audio ended listener callback.
		     */
		    _endListener: function() {
		      var self = this;
		      var parent = self._parent;

		      // Only handle the `ended`` event if the duration is Infinity.
		      if (parent._duration === Infinity) {
		        // Update the parent duration to match the real audio duration.
		        // Round up the duration to account for the lower precision in HTML5 Audio.
		        parent._duration = Math.ceil(self._node.duration * 10) / 10;

		        // Update the sprite that corresponds to the real duration.
		        if (parent._sprite.__default[1] === Infinity) {
		          parent._sprite.__default[1] = parent._duration * 1000;
		        }

		        // Run the regular ended method.
		        parent._ended(self);
		      }

		      // Clear the event listener since the duration is now correct.
		      self._node.removeEventListener('ended', self._endFn, false);
		    }
		  };

		  /** Helper Methods **/
		  /***************************************************************************/

		  var cache = {};

		  /**
		   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
		   * @param  {Howl} self
		   */
		  var loadBuffer = function(self) {
		    var url = self._src;

		    // Check if the buffer has already been cached and use it instead.
		    if (cache[url]) {
		      // Set the duration from the cache.
		      self._duration = cache[url].duration;

		      // Load the sound into this Howl.
		      loadSound(self);

		      return;
		    }

		    if (/^data:[^;]+;base64,/.test(url)) {
		      // Decode the base64 data URI without XHR, since some browsers don't support it.
		      var data = atob(url.split(',')[1]);
		      var dataView = new Uint8Array(data.length);
		      for (var i=0; i<data.length; ++i) {
		        dataView[i] = data.charCodeAt(i);
		      }

		      decodeAudioData(dataView.buffer, self);
		    } else {
		      // Load the buffer from the URL.
		      var xhr = new XMLHttpRequest();
		      xhr.open(self._xhr.method, url, true);
		      xhr.withCredentials = self._xhr.withCredentials;
		      xhr.responseType = 'arraybuffer';

		      // Apply any custom headers to the request.
		      if (self._xhr.headers) {
		        Object.keys(self._xhr.headers).forEach(function(key) {
		          xhr.setRequestHeader(key, self._xhr.headers[key]);
		        });
		      }

		      xhr.onload = function() {
		        // Make sure we get a successful response back.
		        var code = (xhr.status + '')[0];
		        if (code !== '0' && code !== '2' && code !== '3') {
		          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
		          return;
		        }

		        decodeAudioData(xhr.response, self);
		      };
		      xhr.onerror = function() {
		        // If there is an error, switch to HTML5 Audio.
		        if (self._webAudio) {
		          self._html5 = true;
		          self._webAudio = false;
		          self._sounds = [];
		          delete cache[url];
		          self.load();
		        }
		      };
		      safeXhrSend(xhr);
		    }
		  };

		  /**
		   * Send the XHR request wrapped in a try/catch.
		   * @param  {Object} xhr XHR to send.
		   */
		  var safeXhrSend = function(xhr) {
		    try {
		      xhr.send();
		    } catch (e) {
		      xhr.onerror();
		    }
		  };

		  /**
		   * Decode audio data from an array buffer.
		   * @param  {ArrayBuffer} arraybuffer The audio data.
		   * @param  {Howl}        self
		   */
		  var decodeAudioData = function(arraybuffer, self) {
		    // Fire a load error if something broke.
		    var error = function() {
		      self._emit('loaderror', null, 'Decoding audio data failed.');
		    };

		    // Load the sound on success.
		    var success = function(buffer) {
		      if (buffer && self._sounds.length > 0) {
		        cache[self._src] = buffer;
		        loadSound(self, buffer);
		      } else {
		        error();
		      }
		    };

		    // Decode the buffer into an audio source.
		    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
		      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
		    } else {
		      Howler.ctx.decodeAudioData(arraybuffer, success, error);
		    }
		  };

		  /**
		   * Sound is now loaded, so finish setting everything up and fire the loaded event.
		   * @param  {Howl} self
		   * @param  {Object} buffer The decoded buffer sound source.
		   */
		  var loadSound = function(self, buffer) {
		    // Set the duration.
		    if (buffer && !self._duration) {
		      self._duration = buffer.duration;
		    }

		    // Setup a sprite if none is defined.
		    if (Object.keys(self._sprite).length === 0) {
		      self._sprite = {__default: [0, self._duration * 1000]};
		    }

		    // Fire the loaded event.
		    if (self._state !== 'loaded') {
		      self._state = 'loaded';
		      self._emit('load');
		      self._loadQueue();
		    }
		  };

		  /**
		   * Setup the audio context when available, or switch to HTML5 Audio mode.
		   */
		  var setupAudioContext = function() {
		    // If we have already detected that Web Audio isn't supported, don't run this step again.
		    if (!Howler.usingWebAudio) {
		      return;
		    }

		    // Check if we are using Web Audio and setup the AudioContext if we are.
		    try {
		      if (typeof AudioContext !== 'undefined') {
		        Howler.ctx = new AudioContext();
		      } else if (typeof webkitAudioContext !== 'undefined') {
		        Howler.ctx = new webkitAudioContext();
		      } else {
		        Howler.usingWebAudio = false;
		      }
		    } catch(e) {
		      Howler.usingWebAudio = false;
		    }

		    // If the audio context creation still failed, set using web audio to false.
		    if (!Howler.ctx) {
		      Howler.usingWebAudio = false;
		    }

		    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
		    // If it is, disable Web Audio as it causes crashing.
		    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
		    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
		    var version = appVersion ? parseInt(appVersion[1], 10) : null;
		    if (iOS && version && version < 9) {
		      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
		      if (Howler._navigator && !safari) {
		        Howler.usingWebAudio = false;
		      }
		    }

		    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
		    if (Howler.usingWebAudio) {
		      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
		      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
		      Howler.masterGain.connect(Howler.ctx.destination);
		    }

		    // Re-run the setup on Howler.
		    Howler._setup();
		  };

		  // Add support for CommonJS libraries such as browserify.
		  {
		    exports.Howler = Howler;
		    exports.Howl = Howl;
		  }

		  // Add to global in Node.js (for testing, etc).
		  if (typeof commonjsGlobal !== 'undefined') {
		    commonjsGlobal.HowlerGlobal = HowlerGlobal;
		    commonjsGlobal.Howler = Howler;
		    commonjsGlobal.Howl = Howl;
		    commonjsGlobal.Sound = Sound;
		  } else if (typeof window !== 'undefined') {  // Define globally in case AMD is not available or unused.
		    window.HowlerGlobal = HowlerGlobal;
		    window.Howler = Howler;
		    window.Howl = Howl;
		    window.Sound = Sound;
		  }
		})();


		/*!
		 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
		 *  
		 *  howler.js v2.2.4
		 *  howlerjs.com
		 *
		 *  (c) 2013-2020, James Simpson of GoldFire Studios
		 *  goldfirestudios.com
		 *
		 *  MIT License
		 */

		(function() {

		  // Setup default properties.
		  HowlerGlobal.prototype._pos = [0, 0, 0];
		  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

		  /** Global Methods **/
		  /***************************************************************************/

		  /**
		   * Helper method to update the stereo panning position of all current Howls.
		   * Future Howls will not use this value unless explicitly set.
		   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
		   * @return {Howler/Number}     Self or current stereo panning value.
		   */
		  HowlerGlobal.prototype.stereo = function(pan) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Loop through all Howls and update their stereo panning.
		    for (var i=self._howls.length-1; i>=0; i--) {
		      self._howls[i].stereo(pan);
		    }

		    return self;
		  };

		  /**
		   * Get/set the position of the listener in 3D cartesian space. Sounds using
		   * 3D position will be relative to the listener's position.
		   * @param  {Number} x The x-position of the listener.
		   * @param  {Number} y The y-position of the listener.
		   * @param  {Number} z The z-position of the listener.
		   * @return {Howler/Array}   Self or current listener position.
		   */
		  HowlerGlobal.prototype.pos = function(x, y, z) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? self._pos[1] : y;
		    z = (typeof z !== 'number') ? self._pos[2] : z;

		    if (typeof x === 'number') {
		      self._pos = [x, y, z];

		      if (typeof self.ctx.listener.positionX !== 'undefined') {
		        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
		      } else {
		        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
		      }
		    } else {
		      return self._pos;
		    }

		    return self;
		  };

		  /**
		   * Get/set the direction the listener is pointing in the 3D cartesian space.
		   * A front and up vector must be provided. The front is the direction the
		   * face of the listener is pointing, and up is the direction the top of the
		   * listener is pointing. Thus, these values are expected to be at right angles
		   * from each other.
		   * @param  {Number} x   The x-orientation of the listener.
		   * @param  {Number} y   The y-orientation of the listener.
		   * @param  {Number} z   The z-orientation of the listener.
		   * @param  {Number} xUp The x-orientation of the top of the listener.
		   * @param  {Number} yUp The y-orientation of the top of the listener.
		   * @param  {Number} zUp The z-orientation of the top of the listener.
		   * @return {Howler/Array}     Returns self or the current orientation vectors.
		   */
		  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self.ctx || !self.ctx.listener) {
		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    var or = self._orientation;
		    y = (typeof y !== 'number') ? or[1] : y;
		    z = (typeof z !== 'number') ? or[2] : z;
		    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
		    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
		    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

		    if (typeof x === 'number') {
		      self._orientation = [x, y, z, xUp, yUp, zUp];

		      if (typeof self.ctx.listener.forwardX !== 'undefined') {
		        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
		        self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
		      } else {
		        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
		      }
		    } else {
		      return or;
		    }

		    return self;
		  };

		  /** Group Methods **/
		  /***************************************************************************/

		  /**
		   * Add new properties to the core init.
		   * @param  {Function} _super Core init method.
		   * @return {Howl}
		   */
		  Howl.prototype.init = (function(_super) {
		    return function(o) {
		      var self = this;

		      // Setup user-defined default properties.
		      self._orientation = o.orientation || [1, 0, 0];
		      self._stereo = o.stereo || null;
		      self._pos = o.pos || null;
		      self._pannerAttr = {
		        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
		        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
		        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
		        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
		        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
		        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
		        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
		        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
		      };

		      // Setup event listeners.
		      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
		      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
		      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

		      // Complete initilization with howler.js core's init function.
		      return _super.call(this, o);
		    };
		  })(Howl.prototype.init);

		  /**
		   * Get/set the stereo panning of the audio source for this sound or all in the group.
		   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Number}    Returns self or the current stereo panning value.
		   */
		  Howl.prototype.stereo = function(pan, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'stereo',
		        action: function() {
		          self.stereo(pan, id);
		        }
		      });

		      return self;
		    }

		    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
		    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

		    // Setup the group's stereo panning if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's stereo panning if no parameters are passed.
		      if (typeof pan === 'number') {
		        self._stereo = pan;
		        self._pos = [pan, 0, 0];
		      } else {
		        return self._stereo;
		      }
		    }

		    // Change the streo panning of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof pan === 'number') {
		          sound._stereo = pan;
		          sound._pos = [pan, 0, 0];

		          if (sound._node) {
		            // If we are falling back, make sure the panningModel is equalpower.
		            sound._pannerAttr.panningModel = 'equalpower';

		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner || !sound._panner.pan) {
		              setupPanner(sound, pannerType);
		            }

		            if (pannerType === 'spatial') {
		              if (typeof sound._panner.positionX !== 'undefined') {
		                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
		                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
		                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
		              } else {
		                sound._panner.setPosition(pan, 0, 0);
		              }
		            } else {
		              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
		            }
		          }

		          self._emit('stereo', sound._id);
		        } else {
		          return sound._stereo;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
		   * @param  {Number} x  The x-position of the audio source.
		   * @param  {Number} y  The y-position of the audio source.
		   * @param  {Number} z  The z-position of the audio source.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
		   */
		  Howl.prototype.pos = function(x, y, z, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change position when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'pos',
		        action: function() {
		          self.pos(x, y, z, id);
		        }
		      });

		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? 0 : y;
		    z = (typeof z !== 'number') ? -0.5 : z;

		    // Setup the group's spatial position if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's spatial position if no parameters are passed.
		      if (typeof x === 'number') {
		        self._pos = [x, y, z];
		      } else {
		        return self._pos;
		      }
		    }

		    // Change the spatial position of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof x === 'number') {
		          sound._pos = [x, y, z];

		          if (sound._node) {
		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner || sound._panner.pan) {
		              setupPanner(sound, 'spatial');
		            }

		            if (typeof sound._panner.positionX !== 'undefined') {
		              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
		              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
		              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
		            } else {
		              sound._panner.setPosition(x, y, z);
		            }
		          }

		          self._emit('pos', sound._id);
		        } else {
		          return sound._pos;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
		   * space. Depending on how direction the sound is, based on the `cone` attributes,
		   * a sound pointing away from the listener can be quiet or silent.
		   * @param  {Number} x  The x-orientation of the source.
		   * @param  {Number} y  The y-orientation of the source.
		   * @param  {Number} z  The z-orientation of the source.
		   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
		   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
		   */
		  Howl.prototype.orientation = function(x, y, z, id) {
		    var self = this;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
		    if (self._state !== 'loaded') {
		      self._queue.push({
		        event: 'orientation',
		        action: function() {
		          self.orientation(x, y, z, id);
		        }
		      });

		      return self;
		    }

		    // Set the defaults for optional 'y' & 'z'.
		    y = (typeof y !== 'number') ? self._orientation[1] : y;
		    z = (typeof z !== 'number') ? self._orientation[2] : z;

		    // Setup the group's spatial orientation if no ID is passed.
		    if (typeof id === 'undefined') {
		      // Return the group's spatial orientation if no parameters are passed.
		      if (typeof x === 'number') {
		        self._orientation = [x, y, z];
		      } else {
		        return self._orientation;
		      }
		    }

		    // Change the spatial orientation of one or all sounds in group.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      // Get the sound.
		      var sound = self._soundById(ids[i]);

		      if (sound) {
		        if (typeof x === 'number') {
		          sound._orientation = [x, y, z];

		          if (sound._node) {
		            // Check if there is a panner setup and create a new one if not.
		            if (!sound._panner) {
		              // Make sure we have a position to setup the node with.
		              if (!sound._pos) {
		                sound._pos = self._pos || [0, 0, -0.5];
		              }

		              setupPanner(sound, 'spatial');
		            }

		            if (typeof sound._panner.orientationX !== 'undefined') {
		              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
		              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
		              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
		            } else {
		              sound._panner.setOrientation(x, y, z);
		            }
		          }

		          self._emit('orientation', sound._id);
		        } else {
		          return sound._orientation;
		        }
		      }
		    }

		    return self;
		  };

		  /**
		   * Get/set the panner node's attributes for a sound or group of sounds.
		   * This method can optionall take 0, 1 or 2 arguments.
		   *   pannerAttr() -> Returns the group's values.
		   *   pannerAttr(id) -> Returns the sound id's values.
		   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
		   *   pannerAttr(o, id) -> Set's the values of passed sound id.
		   *
		   *   Attributes:
		   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
		   *                      inside of which there will be no volume reduction.
		   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
		   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
		   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
		   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
		   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
		   *                     listener. Can be `linear`, `inverse` or `exponential.
		   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
		   *                   will not be reduced any further.
		   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
		   *                   This is simply a variable of the distance model and has a different effect depending on which model
		   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
		   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
		   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
		   *                     with `inverse` and `exponential`.
		   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
		   *                     Can be `HRTF` or `equalpower`.
		   *
		   * @return {Howl/Object} Returns self or current panner attributes.
		   */
		  Howl.prototype.pannerAttr = function() {
		    var self = this;
		    var args = arguments;
		    var o, id, sound;

		    // Stop right here if not using Web Audio.
		    if (!self._webAudio) {
		      return self;
		    }

		    // Determine the values based on arguments.
		    if (args.length === 0) {
		      // Return the group's panner attribute values.
		      return self._pannerAttr;
		    } else if (args.length === 1) {
		      if (typeof args[0] === 'object') {
		        o = args[0];

		        // Set the grou's panner attribute values.
		        if (typeof id === 'undefined') {
		          if (!o.pannerAttr) {
		            o.pannerAttr = {
		              coneInnerAngle: o.coneInnerAngle,
		              coneOuterAngle: o.coneOuterAngle,
		              coneOuterGain: o.coneOuterGain,
		              distanceModel: o.distanceModel,
		              maxDistance: o.maxDistance,
		              refDistance: o.refDistance,
		              rolloffFactor: o.rolloffFactor,
		              panningModel: o.panningModel
		            };
		          }

		          self._pannerAttr = {
		            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
		            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
		            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
		            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
		            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
		            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
		            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
		            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
		          };
		        }
		      } else {
		        // Return this sound's panner attribute values.
		        sound = self._soundById(parseInt(args[0], 10));
		        return sound ? sound._pannerAttr : self._pannerAttr;
		      }
		    } else if (args.length === 2) {
		      o = args[0];
		      id = parseInt(args[1], 10);
		    }

		    // Update the values of the specified sounds.
		    var ids = self._getSoundIds(id);
		    for (var i=0; i<ids.length; i++) {
		      sound = self._soundById(ids[i]);

		      if (sound) {
		        // Merge the new values into the sound.
		        var pa = sound._pannerAttr;
		        pa = {
		          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
		          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
		          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
		          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
		          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
		          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
		          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
		          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
		        };

		        // Create a new panner node if one doesn't already exist.
		        var panner = sound._panner;
		        if (!panner) {
		          // Make sure we have a position to setup the node with.
		          if (!sound._pos) {
		            sound._pos = self._pos || [0, 0, -0.5];
		          }

		          // Create a new panner node.
		          setupPanner(sound, 'spatial');
		          panner = sound._panner;
		        }

		        // Update the panner values or create a new panner if none exists.
		        panner.coneInnerAngle = pa.coneInnerAngle;
		        panner.coneOuterAngle = pa.coneOuterAngle;
		        panner.coneOuterGain = pa.coneOuterGain;
		        panner.distanceModel = pa.distanceModel;
		        panner.maxDistance = pa.maxDistance;
		        panner.refDistance = pa.refDistance;
		        panner.rolloffFactor = pa.rolloffFactor;
		        panner.panningModel = pa.panningModel;
		      }
		    }

		    return self;
		  };

		  /** Single Sound Methods **/
		  /***************************************************************************/

		  /**
		   * Add new properties to the core Sound init.
		   * @param  {Function} _super Core Sound init method.
		   * @return {Sound}
		   */
		  Sound.prototype.init = (function(_super) {
		    return function() {
		      var self = this;
		      var parent = self._parent;

		      // Setup user-defined default properties.
		      self._orientation = parent._orientation;
		      self._stereo = parent._stereo;
		      self._pos = parent._pos;
		      self._pannerAttr = parent._pannerAttr;

		      // Complete initilization with howler.js core Sound's init function.
		      _super.call(this);

		      // If a stereo or position was specified, set it up.
		      if (self._stereo) {
		        parent.stereo(self._stereo);
		      } else if (self._pos) {
		        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
		      }
		    };
		  })(Sound.prototype.init);

		  /**
		   * Override the Sound.reset method to clean up properties from the spatial plugin.
		   * @param  {Function} _super Sound reset method.
		   * @return {Sound}
		   */
		  Sound.prototype.reset = (function(_super) {
		    return function() {
		      var self = this;
		      var parent = self._parent;

		      // Reset all spatial plugin properties on this sound.
		      self._orientation = parent._orientation;
		      self._stereo = parent._stereo;
		      self._pos = parent._pos;
		      self._pannerAttr = parent._pannerAttr;

		      // If a stereo or position was specified, set it up.
		      if (self._stereo) {
		        parent.stereo(self._stereo);
		      } else if (self._pos) {
		        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
		      } else if (self._panner) {
		        // Disconnect the panner.
		        self._panner.disconnect(0);
		        self._panner = undefined;
		        parent._refreshBuffer(self);
		      }

		      // Complete resetting of the sound.
		      return _super.call(this);
		    };
		  })(Sound.prototype.reset);

		  /** Helper Methods **/
		  /***************************************************************************/

		  /**
		   * Create a new panner node and save it on the sound.
		   * @param  {Sound} sound Specific sound to setup panning on.
		   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
		   */
		  var setupPanner = function(sound, type) {
		    type = type || 'spatial';

		    // Create the new panner node.
		    if (type === 'spatial') {
		      sound._panner = Howler.ctx.createPanner();
		      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
		      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
		      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
		      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
		      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
		      sound._panner.refDistance = sound._pannerAttr.refDistance;
		      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
		      sound._panner.panningModel = sound._pannerAttr.panningModel;

		      if (typeof sound._panner.positionX !== 'undefined') {
		        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
		        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
		        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
		      } else {
		        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
		      }

		      if (typeof sound._panner.orientationX !== 'undefined') {
		        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
		        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
		        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
		      } else {
		        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
		      }
		    } else {
		      sound._panner = Howler.ctx.createStereoPanner();
		      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
		    }

		    sound._panner.connect(sound._node);

		    // Update the connections.
		    if (!sound._paused) {
		      sound._parent.pause(sound._id, true).play(sound._id, true);
		    }
		  };
		})(); 
	} (howler));
	return howler;
}

var howlerExports = requireHowler();

let howl = null;
let rafId = null;
let trackEffectDispose = null;
let fadeIntervalId = null;
function startTimeTracking() {
  if (rafId !== null) return;
  const tick = () => {
    if (howl && howl.playing()) {
      currentTime.value = howl.seek();
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}
function stopTimeTracking() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
function load(track) {
  destroyHowl();
  playbackState.value = "loading";
  howl = new howlerExports.Howl({
    src: [track.audioUrl],
    html5: true,
    // Required for streaming large files
    volume: volume.peek(),
    preload: true,
    format: ["mp3"],
    onload: () => {
      duration.value = howl.duration();
      playbackState.value = "paused";
    },
    onloaderror: () => {
      playbackState.value = "error";
    },
    onplay: () => {
      isPlaying.value = true;
      playbackState.value = "playing";
      startTimeTracking();
    },
    onpause: () => {
      isPlaying.value = false;
      playbackState.value = "paused";
      stopTimeTracking();
    },
    onstop: () => {
      isPlaying.value = false;
      playbackState.value = "paused";
      stopTimeTracking();
    },
    onend: () => {
      isPlaying.value = false;
      stopTimeTracking();
      nextTrack();
    }
  });
}
function cancelFade() {
  if (fadeIntervalId !== null) {
    clearInterval(fadeIntervalId);
    fadeIntervalId = null;
  }
}
function destroyHowl() {
  cancelFade();
  stopTimeTracking();
  if (howl) {
    howl.unload();
    howl = null;
  }
}
function initReactiveSubscription() {
  if (trackEffectDispose) {
    trackEffectDispose();
  }
  trackEffectDispose = j$2(() => {
    const track = currentTrack.value;
    if (track) {
      load(track);
      play();
    }
  });
}
function play() {
  if (howl) {
    howl.play();
  }
}
function pause() {
  if (howl) {
    howl.pause();
  }
}
function fadeAndPause(fadeDuration = 500) {
  if (!howl || !howl.playing()) return;
  cancelFade();
  const startVolume = howl.volume();
  const steps = 20;
  const stepTime = fadeDuration / steps;
  const volumeStep = startVolume / steps;
  let currentStep = 0;
  fadeIntervalId = setInterval(() => {
    currentStep++;
    if (currentStep >= steps) {
      clearInterval(fadeIntervalId);
      fadeIntervalId = null;
      howl.volume(0);
      howl.pause();
      howl.volume(volume.peek());
    } else {
      howl.volume(startVolume - volumeStep * currentStep);
    }
  }, stepTime);
}
function togglePlay() {
  if (!howl) return;
  if (howl.playing()) {
    pause();
  } else {
    play();
  }
}
function seek(fraction) {
  if (!howl) return;
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const seekTime = clampedFraction * duration.value;
  howl.seek(seekTime);
  currentTime.value = seekTime;
}
function setVolume(level) {
  const clampedLevel = Math.max(0, Math.min(1, level));
  volume.value = clampedLevel;
  if (howl) {
    howl.volume(clampedLevel);
  }
}
function destroy$2() {
  cancelFade();
  destroyHowl();
  if (trackEffectDispose) {
    trackEffectDispose();
    trackEffectDispose = null;
  }
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
  playbackState.value = "idle";
}

function getAccentHoverColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--color-accent-hover").trim();
  return value || "#facc15";
}

const defaults = {
  height: 40,
  waveColor: "#6b7280",
  progressColor: "#facc15",
  barWidth: 2,
  barGap: 1,
  barRadius: 2
};
function createSvgWaveform(container, options) {
  const resolvedOptions = {
    ...defaults,
    progressColor: getAccentHoverColor(),
    ...options
  };
  let peaks = [];
  let currentFraction = 0;
  let seekCallback = null;
  let clickHandler = null;
  let dragHandler = null;
  let mouseUpHandler = null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", String(resolvedOptions.height));
  svg.style.display = "block";
  svg.style.cursor = "pointer";
  container.appendChild(svg);
  const instance = {
    loadPeaks: () => {
    },
    setProgress: () => {
    },
    onSeek: () => () => {
    },
    destroy: () => {
    }
  };
  function renderBars() {
    svg.innerHTML = "";
    if (peaks.length === 0) return;
    const {
      barWidth,
      barGap,
      barRadius,
      height,
      waveColor,
      progressColor
    } = resolvedOptions;
    const step = barWidth + barGap;
    const svgWidth = peaks.length * step;
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    const progressIndex = Math.floor(currentFraction * peaks.length);
    for (let i = 0; i < peaks.length; i++) {
      const barHeight = Math.max(2, peaks[i] * height);
      const y = (height - barHeight) / 2;
      const x = i * step;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(barWidth));
      rect.setAttribute("height", String(barHeight));
      rect.setAttribute("rx", String(barRadius));
      rect.setAttribute("ry", String(barRadius));
      rect.setAttribute("fill", i < progressIndex ? progressColor : waveColor);
      rect.dataset.index = String(i);
      svg.appendChild(rect);
    }
  }
  function getFraction(e) {
    const rect = svg.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const x = e.clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }
  instance.loadPeaks = (newPeaks) => {
    peaks = newPeaks;
    renderBars();
  };
  instance.setProgress = (fraction) => {
    if (peaks.length === 0) return;
    currentFraction = Math.max(0, Math.min(1, fraction));
    const progressIndex = Math.floor(currentFraction * peaks.length);
    const rects = svg.querySelectorAll("rect");
    rects.forEach((rect, i) => {
      rect.setAttribute("fill", i < progressIndex ? resolvedOptions.progressColor : resolvedOptions.waveColor);
    });
  };
  instance.onSeek = (callback) => {
    seekCallback = callback;
    const handleClick = (e) => {
      if (seekCallback) {
        const fraction = getFraction(e);
        seekCallback(fraction);
        instance.setProgress(fraction);
      }
    };
    const handleDrag = (e) => {
      if (e.buttons > 0 && seekCallback) {
        const fraction = getFraction(e);
        seekCallback(fraction);
        instance.setProgress(fraction);
      }
    };
    const handleMouseUp = () => {
    };
    svg.addEventListener("mousedown", handleClick);
    svg.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleMouseUp);
    clickHandler = handleClick;
    dragHandler = handleDrag;
    mouseUpHandler = handleMouseUp;
    return () => {
      svg.removeEventListener("mousedown", handleClick);
      svg.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      clickHandler = null;
      dragHandler = null;
      mouseUpHandler = null;
      seekCallback = null;
    };
  };
  instance.destroy = () => {
    if (clickHandler) svg.removeEventListener("mousedown", clickHandler);
    if (dragHandler) svg.removeEventListener("mousemove", dragHandler);
    if (mouseUpHandler) window.removeEventListener("mouseup", mouseUpHandler);
    if (svg.parentNode) svg.parentNode.removeChild(svg);
  };
  return instance;
}

let instance = null;
function init$1(container, options) {
  destroy$1();
  instance = createSvgWaveform(container, options);
}
function loadPeaks(peaks) {
  if (!instance) return;
  instance.loadPeaks(peaks);
}
function setProgress(fraction) {
  if (!instance) return;
  instance.setProgress(fraction);
}
function onSeek(callback) {
  if (!instance) return () => {
  };
  return instance.onSeek(callback);
}
function destroy$1() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}

function getR2PublicUrl() {
  return "https://pub-c5ae7ba52e3b488eba38f21ccca05bca.r2.dev";
}
function resolveAudioUrl(audioFile) {
  if (!audioFile) return "";
  if (audioFile.startsWith("http://") || audioFile.startsWith("https://")) {
    return audioFile;
  }
  const base = getR2PublicUrl().replace(/\/$/, "");
  const path = audioFile.replace(/^\//, "");
  return `${base}/${path}`;
}
function getWaveformPeaksUrl(audioUrl) {
  const contentDirs = ["works/", "releases/"];
  let relativePath;
  try {
    const url = new URL(audioUrl);
    const pathname = url.pathname;
    for (const dir of contentDirs) {
      const idx = pathname.indexOf("/" + dir);
      if (idx !== -1) {
        relativePath = pathname.slice(idx + 1);
        break;
      }
    }
    if (!relativePath) {
      relativePath = pathname.replace(/^\//, "");
    }
  } catch {
    relativePath = audioUrl.replace(/^\//, "");
  }
  const jsonPath = relativePath.replace(/\.mp3$/i, ".json");
  return `/waveforms/${jsonPath}`;
}
function buildTrackFromContent(trackData, releaseSlug, trackIndex, artist, artworkUrl) {
  return {
    id: `${releaseSlug}-${trackIndex}`,
    title: trackData.title,
    artist,
    audioUrl: trackData.audioFile ? resolveAudioUrl(trackData.audioFile) : "",
    artworkUrl,
    icon: trackData.icon,
    subtitle: trackData.subtitle,
    credit: trackData.credit
  };
}

function extractYouTubeId(url) {
  const patterns = [/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/, /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/, /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return "";
}
function buildYouTubeEmbedUrl(videoId, startTime, options) {
  const base = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  let url = base;
  if (startTime) {
    url += `&start=${encodeURIComponent(startTime)}`;
  }
  if (options?.loop) {
    url += `&loop=1&playlist=${encodeURIComponent(videoId)}`;
  }
  if (options?.autoplay) {
    url += `&autoplay=1&mute=1`;
  }
  return url;
}

const AUDIO_PLAYER_SEEK = "audio-player:seek";
const AUDIO_PLAYER_FADE_PAUSE = "audio-player:fade-pause";
function seekPlayer(trackId, fraction) {
  document.dispatchEvent(new CustomEvent(AUDIO_PLAYER_SEEK, {
    detail: {
      trackId,
      fraction
    }
  }));
}
function fadeAndPausePlayer() {
  document.dispatchEvent(new CustomEvent(AUDIO_PLAYER_FADE_PAUSE));
}

let apiLoaded = false;
let apiReady = false;
const pendingIframes = /* @__PURE__ */ new Set();
const players = /* @__PURE__ */ new WeakMap();
const playerVideoIds = /* @__PURE__ */ new WeakMap();
let observer = null;
function isYouTubeIframe(iframe) {
  const src = iframe.getAttribute("src") ?? "";
  return src.includes("youtube.com/embed/");
}
function attachPlayer(iframe) {
  if (players.has(iframe)) return;
  try {
    const player = new window.YT.Player(iframe, {
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            fadeAndPausePlayer();
          }
        }
      }
    });
    players.set(iframe, player);
    playerVideoIds.set(iframe, extractYouTubeId(iframe.getAttribute("src") ?? ""));
  } catch {
  }
}
function reattachPlayer(iframe) {
  players.delete(iframe);
  playerVideoIds.delete(iframe);
  attachPlayer(iframe);
}
function processIframe(iframe) {
  if (apiReady) {
    attachPlayer(iframe);
  } else {
    pendingIframes.add(iframe);
  }
}
function scanExistingIframes() {
  const iframes = document.querySelectorAll('iframe[src*="youtube.com/embed/"]');
  for (const iframe of iframes) {
    processIframe(iframe);
  }
}
function loadAPI() {
  if (apiLoaded) return;
  apiLoaded = true;
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    for (const iframe of pendingIframes) {
      attachPlayer(iframe);
    }
    pendingIframes.clear();
  };
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
}
function observeDynamicIframes() {
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        const target = mutation.target;
        if (!(target instanceof HTMLIFrameElement) || !isYouTubeIframe(target)) {
          continue;
        }
        if (players.has(target)) {
          const oldId = playerVideoIds.get(target);
          const newId = extractYouTubeId(target.getAttribute("src") ?? "");
          if (oldId !== newId) {
            reattachPlayer(target);
          }
        } else {
          processIframe(target);
        }
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLIFrameElement && isYouTubeIframe(node)) {
          processIframe(node);
        }
        if (node instanceof HTMLElement) {
          const iframes = node.querySelectorAll('iframe[src*="youtube.com/embed/"]');
          for (const iframe of iframes) {
            processIframe(iframe);
          }
        }
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"]
  });
}
function init() {
  loadAPI();
  scanExistingIframes();
  observeDynamicIframes();
}
function destroy() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  pendingIframes.clear();
}

var f$1=0;function u$1(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f$1,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a) void 0===p[c]&&(p[c]=a[c]);return l$4.vnode&&l$4.vnode(l),l}

const categoryIcons = {
  music: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "audio-player-icon",
    children: [u$1("path", {
      d: "M9 18V5l12-2v13"
    }), u$1("circle", {
      cx: "6",
      cy: "18",
      r: "3"
    }), u$1("circle", {
      cx: "18",
      cy: "16",
      r: "3"
    })]
  }),
  film: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "audio-player-icon",
    children: [u$1("rect", {
      x: "2",
      y: "2",
      width: "20",
      height: "20",
      rx: "2.18",
      ry: "2.18"
    }), u$1("line", {
      x1: "7",
      y1: "2",
      x2: "7",
      y2: "22"
    }), u$1("line", {
      x1: "17",
      y1: "2",
      x2: "17",
      y2: "22"
    }), u$1("line", {
      x1: "2",
      y1: "12",
      x2: "22",
      y2: "12"
    }), u$1("line", {
      x1: "2",
      y1: "7",
      x2: "7",
      y2: "7"
    }), u$1("line", {
      x1: "2",
      y1: "17",
      x2: "7",
      y2: "17"
    }), u$1("line", {
      x1: "17",
      y1: "7",
      x2: "22",
      y2: "7"
    }), u$1("line", {
      x1: "17",
      y1: "17",
      x2: "22",
      y2: "17"
    })]
  }),
  tv: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "audio-player-icon",
    children: [u$1("rect", {
      x: "2",
      y: "7",
      width: "20",
      height: "15",
      rx: "2",
      ry: "2"
    }), u$1("polyline", {
      points: "17 2 12 7 7 2"
    })]
  }),
  trailer: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    class: "audio-player-icon",
    children: u$1("path", {
      "fill-rule": "evenodd",
      d: "M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z",
      "clip-rule": "evenodd"
    })
  })
};
function isUrlIcon$1(value) {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("images");
}
function trackIcon(icon) {
  if (icon && isUrlIcon$1(icon)) {
    return u$1("img", {
      src: icon,
      alt: "",
      class: "w-full h-full object-cover"
    });
  }
  return categoryIcons[icon ?? "music"] ?? categoryIcons.music;
}
function Player() {
  const waveformContainerRef = A$1(null);
  const rafIdRef = A$1(null);
  const bodyPaddingRef = A$1(false);
  y$4(() => {
    initReactiveSubscription();
    init();
    document.body.classList.add("audio-player-body-padding");
    bodyPaddingRef.current = true;
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      destroy();
      destroy$2();
      destroy$1();
      if (bodyPaddingRef.current) {
        document.body.classList.remove("audio-player-body-padding");
      }
    };
  }, []);
  y$4(() => {
    if (waveformContainerRef.current && currentTrack.value) {
      init$1(waveformContainerRef.current);
      const peaksUrl = getWaveformPeaksUrl(currentTrack.value.audioUrl);
      fetch(peaksUrl).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch peaks: ${res.status}`);
        return res.json();
      }).then((data) => {
        loadPeaks(data.peaks);
      }).catch(() => {
      });
    }
  }, [currentTrack.value?.id]);
  y$4(() => {
    if (!isPlaying.value) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }
    const tick = () => {
      const dur = duration.value;
      const time = currentTime.value;
      if (dur > 0) {
        setProgress(time / dur);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying.value]);
  y$4(() => {
    const handlePlay = (e) => {
      const detail = e.detail;
      if (detail?.tracks) {
        setPlaylist(detail.tracks, detail.startIndex ?? 0);
      }
    };
    const handlePause = () => {
      pause();
    };
    const handleAdd = (e) => {
      const detail = e.detail;
      if (detail?.track) {
        const currentTracks = tracks.value;
        const newTracks = [...currentTracks, detail.track];
        if (currentTracks.length === 0) {
          setPlaylist(newTracks, 0);
        } else {
          tracks.value = newTracks;
        }
      }
    };
    const handleSeek = (e) => {
      const detail = e.detail;
      if (detail?.trackId && currentTrack.value?.id === detail.trackId) {
        seek(detail.fraction);
      }
    };
    const handleToggle = () => {
      togglePlay();
    };
    const handleFadePause = () => {
      fadeAndPause();
    };
    document.addEventListener("audio-player:play", handlePlay);
    document.addEventListener("audio-player:pause", handlePause);
    document.addEventListener("audio-player:add", handleAdd);
    document.addEventListener("audio-player:seek", handleSeek);
    document.addEventListener("audio-player:toggle", handleToggle);
    document.addEventListener("audio-player:fade-pause", handleFadePause);
    return () => {
      document.removeEventListener("audio-player:play", handlePlay);
      document.removeEventListener("audio-player:pause", handlePause);
      document.removeEventListener("audio-player:add", handleAdd);
      document.removeEventListener("audio-player:seek", handleSeek);
      document.removeEventListener("audio-player:toggle", handleToggle);
      document.removeEventListener("audio-player:fade-pause", handleFadePause);
    };
  }, []);
  y$4(() => {
    const unsub = onSeek((fraction) => {
      seek(fraction);
    });
    return unsub;
  }, [currentTrack.value?.id]);
  const handleTogglePlay = q$2(() => {
    togglePlay();
  }, []);
  const handlePrev = q$2(() => {
    prevTrack();
  }, []);
  const handleNext = q$2(() => {
    nextTrack();
  }, []);
  const handleVolumeChange = q$2((e) => {
    const target = e.target;
    setVolume(parseFloat(target.value));
  }, []);
  const handleVolumeIconClick = q$2(() => {
    if (volume.value > 0) {
      setVolume(0);
    } else {
      setVolume(0.8);
    }
  }, []);
  const fmt = T$1(() => (secs) => {
    if (!isFinite(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);
  const track = currentTrack.value;
  const isIdle = playbackState.value === "idle" && !track;
  if (isIdle) {
    return u$1("div", {
      class: "audio-player-bar audio-player-bar--collapsed"
    });
  }
  return u$1("div", {
    class: "audio-player-bar audio-player-bar--expanded",
    children: [u$1("div", {
      class: "audio-player-track-info",
      children: [u$1("span", {
        class: "audio-player-track-info__icon",
        children: trackIcon(track?.icon)
      }), u$1("div", {
        class: "audio-player-track-info__details",
        children: [u$1("span", {
          class: "audio-player-track-info__title",
          children: track?.title ?? "—"
        }), u$1("span", {
          class: "audio-player-track-info__artist",
          children: track?.subtitle ?? ""
        }), track?.credit ? u$1("span", {
          class: "audio-player-track-info__credit",
          children: track.credit
        }) : null]
      })]
    }), u$1("div", {
      class: "audio-player-transport",
      children: [u$1("button", {
        class: "audio-player-btn audio-player-btn--skip",
        onClick: handlePrev,
        "aria-label": "Previous track",
        children: u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "audio-player-icon",
          children: [u$1("polygon", {
            points: "19 20 9 12 19 4 19 20",
            fill: "currentColor",
            stroke: "none"
          }), u$1("line", {
            x1: "5",
            y1: "4",
            x2: "5",
            y2: "20"
          })]
        })
      }), u$1("button", {
        class: "audio-player-btn audio-player-btn--play",
        onClick: handleTogglePlay,
        "aria-label": isPlaying.value ? "Pause" : "Play",
        children: isPlaying.value ? u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "none",
          class: "audio-player-icon",
          children: [u$1("rect", {
            x: "6",
            y: "4",
            width: "4",
            height: "16",
            rx: "1"
          }), u$1("rect", {
            x: "14",
            y: "4",
            width: "4",
            height: "16",
            rx: "1"
          })]
        }) : u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "none",
          class: "audio-player-icon",
          children: u$1("polygon", {
            points: "7 3 21 12 7 21 7 3"
          })
        })
      }), u$1("button", {
        class: "audio-player-btn audio-player-btn--skip",
        onClick: handleNext,
        "aria-label": "Next track",
        children: u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "audio-player-icon",
          children: [u$1("polygon", {
            points: "5 4 15 12 5 20 5 4",
            fill: "currentColor",
            stroke: "none"
          }), u$1("line", {
            x1: "19",
            y1: "4",
            x2: "19",
            y2: "20"
          })]
        })
      })]
    }), u$1("span", {
      class: "audio-player-time audio-player-time--current",
      children: fmt(currentTime.value)
    }), u$1("div", {
      ref: waveformContainerRef,
      class: "audio-player-waveform"
    }), u$1("span", {
      class: "audio-player-time audio-player-time--total",
      children: fmt(duration.value)
    }), u$1("div", {
      class: "audio-player-volume",
      children: [u$1("input", {
        type: "range",
        class: "audio-player-volume__slider",
        min: "0",
        max: "1",
        step: "0.01",
        value: volume.value,
        onInput: handleVolumeChange,
        "aria-label": "Volume"
      }), u$1("span", {
        class: "audio-player-volume__icon",
        onClick: handleVolumeIconClick,
        role: "button",
        tabindex: 0,
        "aria-label": volume.value > 0 ? "Mute" : "Unmute",
        children: volume.value > 0 ? u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "audio-player-icon",
          children: [u$1("polygon", {
            points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5",
            fill: "currentColor",
            stroke: "none"
          }), u$1("path", {
            d: "M15.54 8.46a5 5 0 0 1 0 7.07"
          }), u$1("path", {
            d: "M19.07 4.93a10 10 0 0 1 0 14.14"
          })]
        }) : u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: "audio-player-icon",
          children: [u$1("polygon", {
            points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5",
            fill: "currentColor",
            stroke: "none"
          }), u$1("line", {
            x1: "23",
            y1: "9",
            x2: "17",
            y2: "15"
          }), u$1("line", {
            x1: "17",
            y1: "9",
            x2: "23",
            y2: "15"
          })]
        })
      })]
    })]
  });
}

const CONTACT_MODAL_OPEN = "contact-modal:open";
const CONTACT_MODAL_CLOSE = "contact-modal:close";

const TURNSTILE_SITE_KEY = "";
function ContactModal() {
  const whatsappPhone = "";
  const [isOpen, setIsOpen] = d$3(false);
  const [isVisible, setIsVisible] = d$3(false);
  const previousFocusRef = A$1(null);
  const modalPanelRef = A$1(null);
  const [turnstileToken, setTurnstileToken] = d$3("");
  A$1(null);
  const turnstileWidgetIdRef = A$1(null);
  const open = q$2(() => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    document.body.classList.add("overflow-hidden");
  }, []);
  const close = q$2(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }, 200);
  }, []);
  y$4(() => {
    const handleOpen = () => open();
    const handleClose = () => close();
    document.addEventListener(CONTACT_MODAL_OPEN, handleOpen);
    document.addEventListener(CONTACT_MODAL_CLOSE, handleClose);
    return () => {
      document.removeEventListener(CONTACT_MODAL_OPEN, handleOpen);
      document.removeEventListener(CONTACT_MODAL_CLOSE, handleClose);
    };
  }, [open, close]);
  y$4(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);
  y$4(() => {
    if (isOpen && isVisible && modalPanelRef.current) {
      modalPanelRef.current.focus();
    }
  }, [isOpen, isVisible]);
  y$4(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  y$4(() => {
    return;
  }, [isOpen, isVisible]);
  const [formState, setFormState] = d$3({
    name: "",
    email: "",
    message: "",
    fax: ""
  });
  const [errors, setErrors] = d$3({});
  const [showSuccess, setShowSuccess] = d$3(false);
  const [submitError, setSubmitError] = d$3("");
  const [isSubmitting, setIsSubmitting] = d$3(false);
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const newErrors = {};
    if (!formState.name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    if (!formState.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!isValidEmail(formState.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formState.message.trim()) {
      newErrors.message = "Please enter a message.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            message: formState.message,
            fax: formState.fax,
            ...turnstileToken ? {
              turnstileToken
            } : {}
          })
        });
        const data = await response.json();
        if (data.ok) {
          setFormState({
            name: "",
            email: "",
            message: "",
            fax: ""
          });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3e3);
        } else {
          setSubmitError(data.error || "Something went wrong.");
        }
      } catch {
        setSubmitError("Something went wrong. Please try again later.");
      } finally {
        setIsSubmitting(false);
        if (turnstileWidgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(turnstileWidgetIdRef.current);
          } catch {
          }
        }
        setTurnstileToken("");
      }
    }
  };
  if (!isOpen) return null;
  return u$1("div", {
    class: `fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Contact form",
    children: [u$1("div", {
      class: "absolute inset-0 bg-black/60",
      onClick: close
    }), u$1("div", {
      ref: modalPanelRef,
      tabindex: -1,
      onClick: (e) => e.stopPropagation(),
      class: "relative bg-bg-elevated rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto outline-none",
      children: [u$1("div", {
        class: "flex items-center justify-between mb-6",
        children: [u$1("h2", {
          class: "text-2xl font-bold text-white",
          children: "Get In Touch"
        }), u$1("button", {
          type: "button",
          onClick: close,
          "aria-label": "Close modal",
          class: "text-white/70 hover:text-white transition-colors p-1 cursor-pointer",
          children: u$1("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "w-6 h-6",
            children: [u$1("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), u$1("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })]
          })
        })]
      }), u$1("form", {
        "aria-label": "Contact form",
        onSubmit: handleSubmit,
        class: "space-y-6",
        children: [u$1("div", {
          class: "absolute -left-[9999px] opacity-0 h-0 overflow-hidden",
          "aria-hidden": "true",
          children: [u$1("label", {
            for: "modal-contact-fax",
            children: "Fax"
          }), u$1("input", {
            type: "text",
            id: "modal-contact-fax",
            name: "fax",
            tabindex: -1,
            autocomplete: "off",
            value: formState.fax,
            onInput: (e) => setFormState({
              ...formState,
              fax: e.target.value
            })
          })]
        }), u$1("div", {
          children: [u$1("label", {
            for: "modal-contact-name",
            class: "block text-white/70 text-sm font-medium mb-2",
            children: "Name"
          }), u$1("input", {
            type: "text",
            id: "modal-contact-name",
            name: "name",
            required: true,
            placeholder: "Your name",
            value: formState.name,
            onInput: (e) => setFormState({
              ...formState,
              name: e.target.value
            }),
            class: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200"
          }), errors.name && u$1("p", {
            class: "text-red-400 text-sm mt-1",
            children: errors.name
          })]
        }), u$1("div", {
          children: [u$1("label", {
            for: "modal-contact-email",
            class: "block text-white/70 text-sm font-medium mb-2",
            children: "Email"
          }), u$1("input", {
            type: "email",
            id: "modal-contact-email",
            name: "email",
            required: true,
            placeholder: "you@example.com",
            value: formState.email,
            onInput: (e) => setFormState({
              ...formState,
              email: e.target.value
            }),
            class: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200"
          }), errors.email && u$1("p", {
            class: "text-red-400 text-sm mt-1",
            children: errors.email
          })]
        }), u$1("div", {
          children: [u$1("label", {
            for: "modal-contact-message",
            class: "block text-white/70 text-sm font-medium mb-2",
            children: "Message"
          }), u$1("textarea", {
            id: "modal-contact-message",
            name: "message",
            rows: 5,
            required: true,
            placeholder: "Your message...",
            value: formState.message,
            onInput: (e) => setFormState({
              ...formState,
              message: e.target.value
            }),
            class: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors duration-200 resize-y"
          }), errors.message && u$1("p", {
            class: "text-red-400 text-sm mt-1",
            children: errors.message
          })]
        }), TURNSTILE_SITE_KEY, u$1("button", {
          type: "submit",
          disabled: isSubmitting,
          class: "bg-accent text-white rounded-lg px-6 py-3 font-medium hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          children: isSubmitting ? "Sending..." : "Send Message"
        }), submitError && u$1("p", {
          class: "text-red-400 text-sm",
          children: submitError
        }), showSuccess && u$1("p", {
          class: "text-green-400 text-sm",
          children: "Message sent! We'll get back to you soon."
        })]
      }), whatsappPhone]
    })]
  });
}

const ABOUT_MODAL_OPEN = "about-modal:open";
const ABOUT_MODAL_CLOSE = "about-modal:close";

function AboutModal(props) {
  const {
    title,
    photo,
    photoAlt,
    genreTags,
    pressQuotes
  } = props;
  const [isOpen, setIsOpen] = d$3(false);
  const [isVisible, setIsVisible] = d$3(false);
  const previousFocusRef = A$1(null);
  const modalPanelRef = A$1(null);
  const open = q$2(() => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    document.body.classList.add("overflow-hidden");
  }, []);
  const close = q$2(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }, 200);
  }, []);
  y$4(() => {
    const handleOpen = () => open();
    const handleClose = () => close();
    document.addEventListener(ABOUT_MODAL_OPEN, handleOpen);
    document.addEventListener(ABOUT_MODAL_CLOSE, handleClose);
    return () => {
      document.removeEventListener(ABOUT_MODAL_OPEN, handleOpen);
      document.removeEventListener(ABOUT_MODAL_CLOSE, handleClose);
    };
  }, [open, close]);
  y$4(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);
  y$4(() => {
    if (isOpen && isVisible && modalPanelRef.current) {
      modalPanelRef.current.focus();
    }
  }, [isOpen, isVisible]);
  y$4(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  const bioHtml = typeof document !== "undefined" ? document.getElementById("about-bio-content")?.innerHTML ?? "" : "";
  if (!isOpen) return null;
  return u$1("div", {
    class: `fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "About",
    children: [u$1("div", {
      class: "absolute inset-0 bg-black/60",
      onClick: close
    }), u$1("div", {
      ref: modalPanelRef,
      tabindex: -1,
      onClick: (e) => e.stopPropagation(),
      class: "relative bg-bg-elevated rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto outline-none",
      children: [u$1("div", {
        class: "flex items-center justify-end mb-4",
        children: u$1("button", {
          type: "button",
          onClick: close,
          "aria-label": "Close modal",
          class: "text-white/70 hover:text-white transition-colors p-1 cursor-pointer",
          children: u$1("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "w-6 h-6",
            children: [u$1("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), u$1("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })]
          })
        })
      }), u$1("section", {
        class: "flex flex-col md:flex-row gap-8 md:gap-12",
        children: [u$1("div", {
          class: "md:w-2/5 shrink-0",
          children: u$1("img", {
            src: photo,
            alt: photoAlt,
            class: "w-full rounded-lg object-cover max-h-[500px] shadow-2xl"
          })
        }), u$1("div", {
          class: "md:w-3/5",
          children: [u$1("h1", {
            class: "text-4xl font-bold text-white mb-6",
            children: title
          }), u$1("div", {
            class: "text-white/80 leading-relaxed space-y-4",
            dangerouslySetInnerHTML: {
              __html: bioHtml
            }
          })]
        })]
      })]
    })]
  });
}

const PROJECT_MODAL_OPEN = "project-modal:open";
const PROJECT_MODAL_CLOSE = "project-modal:close";

function ProjectModal() {
  const [isOpen, setIsOpen] = d$3(false);
  const [isVisible, setIsVisible] = d$3(false);
  const [projectData, setProjectData] = d$3(null);
  const [activeVideoUrl, setActiveVideoUrl] = d$3(void 0);
  const previousFocusRef = A$1(null);
  const modalPanelRef = A$1(null);
  const open = q$2((data) => {
    setProjectData(data);
    setActiveVideoUrl(data.video ?? data.videoThumbnails?.[0]?.youtubeUrl);
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    document.body.classList.add("overflow-hidden");
  }, []);
  const close = q$2(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      setProjectData(null);
      document.body.classList.remove("overflow-hidden");
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }, 200);
  }, []);
  y$4(() => {
    const handleOpen = (e) => {
      const customEvent = e;
      if (customEvent.detail) {
        open(customEvent.detail);
      }
    };
    const handleClose = () => close();
    document.addEventListener(PROJECT_MODAL_OPEN, handleOpen);
    document.addEventListener(PROJECT_MODAL_CLOSE, handleClose);
    return () => {
      document.removeEventListener(PROJECT_MODAL_OPEN, handleOpen);
      document.removeEventListener(PROJECT_MODAL_CLOSE, handleClose);
    };
  }, [open, close]);
  y$4(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);
  y$4(() => {
    if (isOpen && isVisible && modalPanelRef.current) {
      modalPanelRef.current.focus();
    }
  }, [isOpen, isVisible]);
  y$4(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  if (!isOpen || !projectData) return null;
  const activeVideo = activeVideoUrl ?? projectData.video;
  const isMainVideo = activeVideo === projectData.video;
  const videoId = activeVideo ? extractYouTubeId(activeVideo) : "";
  const startTime = isMainVideo ? projectData.videoStartTime : projectData.videoThumbnails?.find((t) => t.youtubeUrl === activeVideo)?.startTime;
  const embedUrl = buildYouTubeEmbedUrl(videoId, startTime, {
    loop: projectData.loop,
    autoplay: projectData.autoplay
  });
  return u$1("div", {
    class: `fixed inset-0 z-60 flex items-center justify-center p-0 md:p-4 transition-opacity duration-200 ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": projectData.title,
    children: [u$1("div", {
      class: "absolute inset-0 bg-black/60",
      onClick: close
    }), u$1("div", {
      ref: modalPanelRef,
      tabindex: -1,
      onClick: (e) => e.stopPropagation(),
      class: "relative bg-bg-elevated rounded-none md:rounded-lg shadow-xl max-w-3xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto outline-none",
      children: [u$1("div", {
        class: "flex items-center justify-end mb-4",
        children: u$1("button", {
          type: "button",
          onClick: close,
          "aria-label": "Close modal",
          class: "text-white/70 hover:text-white transition-colors p-1 cursor-pointer",
          children: u$1("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: "w-6 h-6",
            children: [u$1("line", {
              x1: "18",
              y1: "6",
              x2: "6",
              y2: "18"
            }), u$1("line", {
              x1: "6",
              y1: "6",
              x2: "18",
              y2: "18"
            })]
          })
        })
      }), u$1("section", {
        class: "flex flex-col md:flex-row gap-8 md:gap-12",
        children: [u$1("div", {
          class: "md:w-2/5 shrink-0",
          children: u$1("img", {
            src: projectData.popupImage ?? projectData.image,
            alt: projectData.title,
            class: "w-full rounded-lg object-cover max-h-[500px] shadow-2xl"
          })
        }), u$1("div", {
          class: "md:w-3/5",
          children: [u$1("h2", {
            class: "text-xl md:text-3xl font-bold text-white mb-4",
            children: projectData.title
          }), projectData.summaryHtml ? u$1("div", {
            class: "text-sm md:text-base text-white/80 leading-relaxed space-y-4 [&_a]:text-accent [&_a]:underline [&_a:hover]:text-accent-hover",
            dangerouslySetInnerHTML: {
              __html: projectData.summaryHtml
            }
          }) : u$1("p", {
            class: "text-sm md:text-base text-white/80 leading-relaxed",
            children: projectData.summary
          }), projectData.dir && u$1("p", {
            class: "text-sm text-white/60 mt-2",
            children: ["Directed by ", projectData.dir]
          })]
        })]
      }), videoId && u$1("div", {
        class: "mt-6",
        children: [u$1("div", {
          class: "relative w-full overflow-hidden rounded-lg shadow-xl",
          style: "padding-bottom: 56.25%",
          children: u$1("iframe", {
            src: embedUrl,
            title: `${projectData.title} — video`,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "",
            loading: "lazy",
            class: "absolute inset-0 h-full w-full"
          })
        }), projectData.videoThumbnails && projectData.videoThumbnails.length > 0 && u$1("div", {
          class: "mt-4 flex flex-wrap gap-2 justify-center",
          children: projectData.videoThumbnails.map((thumb, i) => {
            const isActive = thumb.youtubeUrl === activeVideoUrl;
            return u$1("button", {
              type: "button",
              onClick: () => setActiveVideoUrl(thumb.youtubeUrl),
              "aria-label": `Play video ${i + 1}`,
              "aria-pressed": isActive ? "true" : "false",
              class: `shrink-0 rounded-md overflow-hidden border-2 transition-colors cursor-pointer ${isActive ? "border-accent ring-2 ring-accent" : "border-transparent opacity-70 hover:opacity-100"}`,
              children: u$1("img", {
                src: thumb.image,
                alt: "",
                loading: "lazy",
                class: "w-18 h-18 object-cover block"
              })
            });
          })
        })]
      })]
    })]
  });
}

const $$Astro$3 = createAstro("https://sampaultoms.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const siteName = DEFAULT_SITE_NAME;
  const {
    title = siteName,
    description = `Official music portfolio of ${siteName} — listen to tracks, albums, and EPs.`,
    image,
    canonicalUrl,
    type = "website",
    structuredData,
    noindex,
    aboutTitle = "",
    aboutPhoto = "",
    aboutPhotoAlt = "",
    aboutGenreTags = [],
    aboutPressQuotes = []
  } = Astro2.props;
  const accentColor = "#852929";
  return renderTemplate`<html lang="en"${addAttribute(`--color-accent: ${accentColor}; --color-accent-hover: color-mix(in srgb, var(--color-accent) 80%, white); --color-accent-muted: var(--color-accent);`, "style")}> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderComponent($$result, "SEOHead", $$SEOHead, { "title": title, "description": description, "image": image, "canonicalUrl": canonicalUrl, "type": type, "structuredData": structuredData, "noindex": noindex, "siteName": siteName })}${renderHead()}</head> <body class="bg-bg text-text antialiased min-h-screen"> ${renderSlot($$result, $$slots["default"])} <div data-astro-transition-persist="audio-player" class="fixed bottom-0 z-50"> ${renderComponent($$result, "Player", Player, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/phil/dev/sam/src/components/AudioPlayer/Player", "client:component-export": "default" })} </div> ${renderComponent($$result, "ContactModal", ContactModal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/phil/dev/sam/src/components/ContactModal", "client:component-export": "default" })} ${renderComponent($$result, "ProjectModal", ProjectModal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/phil/dev/sam/src/components/ProjectModal", "client:component-export": "default" })} ${aboutTitle && renderTemplate`${renderComponent($$result, "AboutModal", AboutModal, { "client:load": true, "title": aboutTitle, "photo": aboutPhoto, "photoAlt": aboutPhotoAlt, "genreTags": aboutGenreTags, "pressQuotes": aboutPressQuotes, "client:component-hydration": "load", "client:component-path": "/Users/phil/dev/sam/src/components/AboutModal", "client:component-export": "default" })}`} </body></html>`;
}, "/Users/phil/dev/sam/src/layouts/BaseLayout.astro", "self");

const $$HeroBanner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="hero-banner" class="fixed top-0 left-0 right-0 z-0 flex aspect-[16/5] items-center justify-center overflow-hidden md:aspect-[27/9]"> <img src="/images/banner/SPT_v111.png" alt="" class="h-full w-full min-w-full object-cover"> <div class="absolute inset-0 bg-black/20"></div> <div class="hero-top-fade absolute left-0 right-0 top-0"></div> <div class="hero-bottom-fade absolute bottom-0 left-0 right-0"></div> </div> ${renderScript($$result, "/Users/phil/dev/sam/src/components/HeroBanner.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/phil/dev/sam/src/components/HeroBanner.astro", void 0);

const $$Astro$2 = createAstro("https://sampaultoms.com");
const $$CompactBio = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CompactBio;
  const { summary } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div> <p class="text-lg max-[430px]:text-sm leading-relaxed text-text/70">${summary}</p> <button id="about-modal-btn" type="button" class="mt-3 inline-block text-sm font-medium text-accent transition-colors hover:text-accent-hover cursor-pointer">
Read more &rarr;
</button> ${renderSlot($$result, $$slots["default"])} </div> ${renderScript($$result, "/Users/phil/dev/sam/src/components/CompactBio.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/phil/dev/sam/src/components/CompactBio.astro", void 0);

const $$Astro$1 = createAstro("https://sampaultoms.com");
const $$SocialLinksBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SocialLinksBar;
  const { allTracksJson } = Astro2.props;
  const socialImdb = "https://www.imdb.com/name/nm7622530/";
  const socialTidal = "https://stage.tidal.com/artist/41934098";
  const socialSpotify = "https://open.spotify.com/artist/6TbhQeGTrmiaPNbOzeNdT1?si=eGc6u_BBR5GkraCZe68cWg";
  const socialInstagram = "https://www.instagram.com/sammytoms/";
  const socialAppleMusic = "https://music.apple.com/us/artist/sam-paul-toms/1706293772";
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center gap-1 flex-wrap max-[430px]:justify-center" data-social-links-bar${addAttribute(allTracksJson, "data-tracks")}>  <button id="play-all-btn" class="flex items-center justify-center mr-3 w-10 h-10 bg-accent rounded-full text-black transition-colors hover:bg-accent-hover" aria-label="Play all tracks"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"> <polygon points="7 3 21 12 7 21 7 3"></polygon> </svg> </button>  <a${addAttribute(socialImdb, "href")} aria-label="IMDB" class="group flex items-center justify-center w-5 h-5 text-text-secondary transition-colors hover:text-text relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"> <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect> <path d="M7 2v20"></path> <path d="M17 8l-4 4 4 4"></path> </svg> <span class="absolute top-full mt-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 border border-white/50 rounded-sm px-2 py-0.5 text-xs font-bold text-text-secondary whitespace-nowrap">IMDB</span> </a> <a${addAttribute(socialTidal, "href")} aria-label="Tidal" class="group flex items-center justify-center w-5 h-5 text-text-secondary transition-colors hover:text-text relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"> <path d="M12 2L6.5 7.5 12 13l5.5-5.5L12 2zm0 11L6.5 18.5 12 24l5.5-5.5L12 13z"></path> </svg> <span class="absolute top-full mt-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 border border-white/50 rounded-sm px-2 py-0.5 text-xs font-bold text-text-secondary whitespace-nowrap">
Tidal
</span> </a> <a${addAttribute(socialSpotify, "href")} aria-label="Spotify" class="group flex items-center justify-center w-5 h-5 text-text-secondary transition-colors hover:text-text relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"> <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.06 19.8 8.82c.5.3.66 1.02.36 1.56-.3.42-1.02.6-1.56.3z"></path> </svg> <span class="absolute top-full mt-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 border border-white/50 rounded-sm px-2 py-0.5 text-xs font-bold text-text-secondary whitespace-nowrap">
Spotify
</span> </a> <a${addAttribute(socialInstagram, "href")} aria-label="Instagram" class="group flex items-center justify-center w-5 h-5 text-text-secondary transition-colors hover:text-text relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"> <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect> <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path> <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line> </svg> <span class="absolute top-full mt-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 border border-white/50 rounded-sm px-2 py-0.5 text-xs font-bold text-text-secondary whitespace-nowrap">
Instagram
</span> </a> <a${addAttribute(socialAppleMusic, "href")} aria-label="Apple Music" class="group flex items-center justify-center w-5 h-5 text-text-secondary transition-colors hover:text-text relative"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.22 1.25 20.56 24.61" fill="currentColor" class="w-4 h-4"> <path d="M17.39 14.21c0-2.022 0.93-3.5 2.734-4.648-1.038-1.476-2.57-2.24-4.592-2.406-1.97-0.164-4.102 1.094-4.868 1.094-0.82 0-2.68-1.04-4.156-1.04C3.446 7.266 0.218 9.62 0.218 14.484c0 1.422 0.22 2.9 0.766 4.43 0.712 2.024 3.226 6.946 5.852 6.836 1.368 0 2.352-0.984 4.156-0.984 1.75 0 2.626 0.984 4.156 0.984 2.68 0 4.978-4.484 5.634-6.508-3.556-1.696-3.392-4.92-3.392-5.032m-3.06-8.968c1.474-1.75 1.31-3.39 1.31-3.992-1.312 0.11-2.844 0.93-3.72 1.914-0.982 1.094-1.53 2.46-1.42 3.938 1.42 0.108 2.734-0.602 3.828-1.86"></path> </svg> <span class="absolute top-full mt-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 border border-white/50 rounded-sm px-2 py-0.5 text-xs font-bold text-text-secondary whitespace-nowrap">
Apple Music
</span> </a> <button type="button" id="contact-btn" aria-label="Contact" class="border border-white/50 rounded-full ml-3 px-3 py-1.5 text-xs text-text transition-colors hover:bg-text hover:text-bg cursor-pointer max-[430px]:w-full max-[430px]:ml-0 max-[430px]:mt-2 max-[430px]:text-center">
Contact
</button> </div> ${renderScript($$result, "/Users/phil/dev/sam/src/components/SocialLinksBar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/phil/dev/sam/src/components/SocialLinksBar.astro", void 0);

function isUrlIcon(value) {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("images");
}
function getPlaceholderPeaks(count = 200) {
  return Array(count).fill(0.5);
}
const icons = {
  music: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "w-5 h-5",
    children: [u$1("path", {
      d: "M9 18V5l12-2v13"
    }), u$1("circle", {
      cx: "6",
      cy: "18",
      r: "3"
    }), u$1("circle", {
      cx: "18",
      cy: "16",
      r: "3"
    })]
  }),
  film: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "w-5 h-5",
    children: [u$1("rect", {
      x: "2",
      y: "2",
      width: "20",
      height: "20",
      rx: "2.18",
      ry: "2.18"
    }), u$1("line", {
      x1: "7",
      y1: "2",
      x2: "7",
      y2: "22"
    }), u$1("line", {
      x1: "17",
      y1: "2",
      x2: "17",
      y2: "22"
    }), u$1("line", {
      x1: "2",
      y1: "12",
      x2: "22",
      y2: "12"
    }), u$1("line", {
      x1: "2",
      y1: "7",
      x2: "7",
      y2: "7"
    }), u$1("line", {
      x1: "2",
      y1: "17",
      x2: "7",
      y2: "17"
    }), u$1("line", {
      x1: "17",
      y1: "7",
      x2: "22",
      y2: "7"
    }), u$1("line", {
      x1: "17",
      y1: "17",
      x2: "22",
      y2: "17"
    })]
  }),
  tv: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "w-5 h-5",
    children: [u$1("rect", {
      x: "2",
      y: "7",
      width: "20",
      height: "15",
      rx: "2",
      ry: "2"
    }), u$1("polyline", {
      points: "17 2 12 7 7 2"
    })]
  }),
  trailer: u$1("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    class: "w-5 h-5",
    children: u$1("path", {
      "fill-rule": "evenodd",
      d: "M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z",
      "clip-rule": "evenodd"
    })
  })
};
function MiniWaveform({
  audioUrl,
  trackId,
  height = 24
}) {
  const containerRef = A$1(null);
  const waveformRef = A$1(null);
  y$4(() => {
    if (!containerRef.current || !audioUrl) return;
    const waveform = createSvgWaveform(containerRef.current, {
      height,
      waveColor: "#6b7280",
      progressColor: getAccentHoverColor(),
      barWidth: 2,
      barGap: 1,
      barRadius: 1
    });
    waveformRef.current = waveform;
    waveform.loadPeaks(getPlaceholderPeaks());
    if (trackId) {
      waveform.onSeek((fraction) => {
        const activeTrack = currentTrack.peek();
        if (activeTrack?.id === trackId) {
          seekPlayer(trackId, fraction);
        }
      });
    }
    const peaksUrl = getWaveformPeaksUrl(audioUrl);
    fetch(peaksUrl).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch peaks: ${res.status}`);
      }
      return res.json();
    }).then((data) => {
      if (waveformRef.current) {
        waveformRef.current.loadPeaks(data.peaks);
      }
    }).catch((err) => {
      console.warn(`Failed to load waveform peaks for ${audioUrl}:`, err.message);
    });
    let disposeEffect = null;
    if (trackId) {
      disposeEffect = j$2(() => {
        const activeTrack = currentTrack.value;
        if (activeTrack?.id !== trackId) {
          if (waveformRef.current) {
            waveformRef.current.setProgress(0);
          }
          return;
        }
        const time = currentTime.value;
        const dur = duration.value;
        if (dur > 0 && waveformRef.current) {
          waveformRef.current.setProgress(Math.max(0, Math.min(1, time / dur)));
        }
      });
    }
    return () => {
      if (disposeEffect) {
        disposeEffect();
      }
      waveform.destroy();
      waveformRef.current = null;
    };
  }, [audioUrl, height]);
  return u$1("div", {
    ref: containerRef,
    class: "w-96 h-6 hidden sm:block"
  });
}
function TrackRow({
  track,
  audioUrl,
  trackId,
  onPlay
}) {
  const icon = isUrlIcon(track.icon) ? u$1("img", {
    src: track.icon,
    alt: "",
    class: "w-full h-full object-cover"
  }) : icons[track.icon] || icons.music;
  return u$1("button", {
    type: "button",
    class: "group flex w-full md:w-4/5 items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5",
    onClick: onPlay,
    children: [u$1("span", {
      class: "relative shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-text/40 transition-colors group-hover:text-accent overflow-hidden",
      children: [icon, trackId && currentTrack.value?.id === trackId && u$1("button", {
        type: "button",
        class: "track-row-play-overlay absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-accent",
        onClick: (e) => {
          e.stopPropagation();
          document.dispatchEvent(new CustomEvent("audio-player:toggle"));
        },
        "aria-label": isPlaying.value ? "Pause" : "Play",
        children: isPlaying.value ? u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          class: "w-5 h-5",
          children: [u$1("rect", {
            x: "6",
            y: "4",
            width: "4",
            height: "16",
            rx: "1"
          }), u$1("rect", {
            x: "14",
            y: "4",
            width: "4",
            height: "16",
            rx: "1"
          })]
        }) : u$1("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          class: "w-5 h-5",
          children: u$1("polygon", {
            points: "7 3 21 12 7 21"
          })
        })
      })]
    }), u$1("span", {
      class: "min-w-0 flex-1",
      children: [u$1("span", {
        class: "block truncate text-sm font-medium",
        children: track.title
      }), track.subtitle && u$1("span", {
        class: "block truncate text-xs text-text/50",
        children: track.subtitle
      }), track.credit && u$1("span", {
        class: "block truncate text-xs text-text/40",
        children: track.credit
      })]
    }), audioUrl ? u$1(MiniWaveform, {
      audioUrl,
      trackId
    }) : null, u$1("span", {
      class: "shrink-0 text-xs text-text/40 tabular-nums",
      children: track.duration
    })]
  });
}

function PlaylistAccordion({
  sections,
  playableTracksMap,
  allTracks
}) {
  const [openSlugs, setOpenSlugs] = d$3(() => new Set(sections.map((s) => s.slug)));
  const toggleSection = (slug) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };
  const handleTrackPlay = (sectionSlug, trackIndex) => {
    if (allTracks.length === 0) return;
    let globalIndex = 0;
    for (const section of sections) {
      if (section.slug === sectionSlug) {
        globalIndex += trackIndex;
        break;
      }
      globalIndex += section.tracks.length;
    }
    const track = allTracks[globalIndex];
    if (track && isTrackCurrentlyPlaying(track.id)) {
      return;
    }
    document.dispatchEvent(new CustomEvent("audio-player:play", {
      detail: {
        tracks: allTracks,
        startIndex: globalIndex
      }
    }));
  };
  return u$1("div", {
    class: "playlist-accordion",
    children: sections.map((section) => {
      const isOpen = openSlugs.has(section.slug);
      const trackCount = section.tracks.length;
      return u$1("div", {
        class: "accordion-section",
        children: [u$1("button", {
          type: "button",
          class: "accordion-header",
          onClick: () => toggleSection(section.slug),
          "aria-expanded": isOpen,
          children: [u$1("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: `accordion-chevron w-5 h-5 text-text/80 ${isOpen ? "rotate-90" : ""}`,
            children: u$1("path", {
              d: "m9 5 7 7 -7 7"
            })
          }), u$1("span", {
            class: "accordion-header-text",
            children: [u$1("span", {
              class: "text-lg font-semibold",
              children: section.title
            }), u$1("span", {
              class: "text-xs text-text/40",
              children: [trackCount, " ", trackCount === 1 ? "track" : "tracks"]
            }), section.credit && u$1("span", {
              class: "block text-xs text-text/50 mt-0.5",
              children: section.credit
            })]
          })]
        }), u$1("div", {
          class: `accordion-content ${isOpen ? "accordion-content--open" : ""}`,
          children: u$1("div", {
            children: section.tracks.map((track, i) => u$1(TrackRow, {
              track,
              audioUrl: playableTracksMap[section.slug]?.[i]?.audioUrl,
              trackId: playableTracksMap[section.slug]?.[i]?.id,
              onPlay: () => handleTrackPlay(section.slug, i)
            }, `${section.slug}-${i}`))
          })
        })]
      }, section.slug);
    })
  });
}

/**
 * marked v18.0.5 - a markdown parser
 * Copyright (c) 2018-2026, MarkedJS. (MIT License)
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT License)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

function M(){return {async:false,breaks:false,extensions:null,gfm:true,hooks:null,pedantic:false,renderer:null,silent:false,tokenizer:null,walkTokens:null}}var T=M();function N(l){T=l;}var _={exec:()=>null};function E(l){let e=[];return t=>{let n=Math.max(0,Math.min(3,t-1)),s=e[n];return s||(s=l(n),e[n]=s),s}}function d$1(l,e=""){let t=typeof l=="string"?l:l.source,n={replace:(s,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(m$1.caret,"$1"),t=t.replace(s,i),n},getRegex:()=>new RegExp(t,e)};return n}var Te=((l="")=>{try{return !!new RegExp("(?<=1)(?<!1)"+l)}catch{return  false}})(),m$1={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:l=>new RegExp(`^( {0,3}${l})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:E(l=>new RegExp(`^ {0,${l}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:E(l=>new RegExp(`^ {0,${l}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:E(l=>new RegExp(`^ {0,${l}}(?:\`\`\`|~~~)`)),headingBeginRegex:E(l=>new RegExp(`^ {0,${l}}#`)),htmlBeginRegex:E(l=>new RegExp(`^ {0,${l}}<(?:[a-z].*>|!--)`,"i")),blockquoteBeginRegex:E(l=>new RegExp(`^ {0,${l}}>`))},Oe=/^(?:[ \t]*(?:\n|$))+/,we=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ye=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,B=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Pe=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,j$1=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,oe=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ae=d$1(oe).replace(/bull/g,j$1).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Se=d$1(oe).replace(/bull/g,j$1).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),F=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,$e=/^[^\n]+/,U=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Le=d$1(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",U).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),_e=d$1(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,j$1).getRegex(),H="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",K=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ze=d$1("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",K).replace("tag",H).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),le=d$1(F).replace("hr",B).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",H).getRegex(),Me=d$1(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",le).getRegex(),W={blockquote:Me,code:we,def:Le,fences:ye,heading:Pe,hr:B,html:ze,lheading:ae,list:_e,newline:Oe,paragraph:le,table:_,text:$e},se=d$1("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",B).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",H).getRegex(),Ee={...W,lheading:Se,table:se,paragraph:d$1(F).replace("hr",B).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",se).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",H).getRegex()},Ie={...W,html:d$1(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",K).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:_,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:d$1(F).replace("hr",B).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ae).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ae=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ce=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ue=/^( {2,}|\\)\n(?!\s*$)/,Be=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,I=/[\p{P}\p{S}]/u,Z=/[\s\p{P}\p{S}]/u,X=/[^\s\p{P}\p{S}]/u,De=d$1(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Z).getRegex(),pe=/(?!~)[\p{P}\p{S}]/u,qe=/(?!~)[\s\p{P}\p{S}]/u,ve=/(?:[^\s\p{P}\p{S}]|~)/u,He=d$1(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Te?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ce=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ze=d$1(ce,"u").replace(/punct/g,I).getRegex(),Ge=d$1(ce,"u").replace(/punct/g,pe).getRegex(),he="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ne=d$1(he,"gu").replace(/notPunctSpace/g,X).replace(/punctSpace/g,Z).replace(/punct/g,I).getRegex(),Qe=d$1(he,"gu").replace(/notPunctSpace/g,ve).replace(/punctSpace/g,qe).replace(/punct/g,pe).getRegex(),je=d$1("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,X).replace(/punctSpace/g,Z).replace(/punct/g,I).getRegex(),Fe=d$1(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,I).getRegex(),Ue="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ke=d$1(Ue,"gu").replace(/notPunctSpace/g,X).replace(/punctSpace/g,Z).replace(/punct/g,I).getRegex(),We=d$1(/\\(punct)/,"gu").replace(/punct/g,I).getRegex(),Xe=d$1(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Je=d$1(K).replace("(?:-->|$)","-->").getRegex(),Ve=d$1("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Je).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),v=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Ye=d$1(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",v).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ke=d$1(/^!?\[(label)\]\[(ref)\]/).replace("label",v).replace("ref",U).getRegex(),de=d$1(/^!?\[(ref)\](?:\[\])?/).replace("ref",U).getRegex(),et=d$1("reflink|nolink(?!\\()","g").replace("reflink",ke).replace("nolink",de).getRegex(),ie=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,J={_backpedal:_,anyPunctuation:We,autolink:Xe,blockSkip:He,br:ue,code:Ce,del:_,delLDelim:_,delRDelim:_,emStrongLDelim:Ze,emStrongRDelimAst:Ne,emStrongRDelimUnd:je,escape:Ae,link:Ye,nolink:de,punctuation:De,reflink:ke,reflinkSearch:et,tag:Ve,text:Be,url:_},tt={...J,link:d$1(/^!?\[(label)\]\((.*?)\)/).replace("label",v).getRegex(),reflink:d$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",v).getRegex()},Q={...J,emStrongRDelimAst:Qe,emStrongLDelim:Ge,delLDelim:Fe,delRDelim:Ke,url:d$1(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ie).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:d$1(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ie).getRegex()},nt={...Q,br:d$1(ue).replace("{2,}","*").getRegex(),text:d$1(Q.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},D={normal:W,gfm:Ee,pedantic:Ie},A={normal:J,gfm:Q,breaks:nt,pedantic:tt};var rt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ge=l=>rt[l];function O(l,e){if(e){if(m$1.escapeTest.test(l))return l.replace(m$1.escapeReplace,ge)}else if(m$1.escapeTestNoEncode.test(l))return l.replace(m$1.escapeReplaceNoEncode,ge);return l}function V(l){try{l=encodeURI(l).replace(m$1.percentDecode,"%");}catch{return null}return l}function Y(l,e){let t=l.replace(m$1.findPipe,(r,i,o)=>{let u=false,a=i;for(;--a>=0&&o[a]==="\\";)u=!u;return u?"|":" |"}),n=t.split(m$1.splitPipe),s=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;s<n.length;s++)n[s]=n[s].trim().replace(m$1.slashPipe,"|");return n}function $(l,e,t){let n=l.length;if(n===0)return "";let s=0;for(;s<n;){let r=l.charAt(n-s-1);if(r===e&&true)s++;else break}return l.slice(0,n-s)}function ee(l){let e=l.split(`
`),t=e.length-1;for(;t>=0&&m$1.blankLine.test(e[t]);)t--;return e.length-t<=2?l:e.slice(0,t+1).join(`
`)}function fe(l,e){if(l.indexOf(e[1])===-1)return  -1;let t=0;for(let n=0;n<l.length;n++)if(l[n]==="\\")n++;else if(l[n]===e[0])t++;else if(l[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function me(l,e=0){let t=e,n="";for(let s of l)if(s==="	"){let r=4-t%4;n+=" ".repeat(r),t+=r;}else n+=s,t++;return n}function xe(l,e,t,n,s){let r=e.href,i=e.title||null,o=l[1].replace(s.other.outputLinkReplace,"$1");n.state.inLink=true;let u={type:l[0].charAt(0)==="!"?"image":"link",raw:t,href:r,title:i,text:o,tokens:n.inlineTokens(o)};return n.state.inLink=false,u}function st(l,e,t){let n=l.match(t.other.indentCodeCompensation);if(n===null)return e;let s=n[1];return e.split(`
`).map(r=>{let i=r.match(t.other.beginningSpace);if(i===null)return r;let[o]=i;return o.length>=s.length?r.slice(s.length):r}).join(`
`)}var w=class{options;rules;lexer;constructor(e){this.options=e||T;}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return {type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:ee(t[0]),s=n.replace(this.rules.other.codeRemoveIndent,"");return {type:"code",raw:n,codeBlockStyle:"indented",text:s}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=st(n,t[3]||"",this.rules);return {type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=$(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim());}return {type:"heading",raw:$(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return {type:"hr",raw:$(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=$(t[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let o=false,u=[],a;for(a=0;a<n.length;a++)if(this.rules.other.blockquoteStart.test(n[a]))u.push(n[a]),o=true;else if(!o)u.push(n[a]);else break;n=n.slice(a);let c=u.join(`
`),p=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${c}`:c,r=r?`${r}
${p}`:p;let k=this.lexer.state.top;if(this.lexer.state.top=true,this.lexer.blockTokens(p,i,true),this.lexer.state.top=k,n.length===0)break;let h=i.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let R=h,f=R.raw+`
`+n.join(`
`),S=this.blockquote(f);i[i.length-1]=S,s=s.substring(0,s.length-R.raw.length)+S.raw,r=r.substring(0,r.length-R.text.length)+S.text;break}else if(h?.type==="list"){let R=h,f=R.raw+`
`+n.join(`
`),S=this.list(f);i[i.length-1]=S,s=s.substring(0,s.length-h.raw.length)+S.raw,r=r.substring(0,r.length-R.raw.length)+S.raw,n=f.substring(i.at(-1).raw.length).split(`
`);continue}}return {type:"blockquote",raw:s,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:false,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=false;for(;e;){let a=false,c="",p="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let k=me(t[2].split(`
`,1)[0],t[1].length),h=e.split(`
`,1)[0],R=!k.trim(),f=0;if(this.options.pedantic?(f=2,p=k.trimStart()):R?f=t[1].length+1:(f=k.search(this.rules.other.nonSpaceChar),f=f>4?1:f,p=k.slice(f),f+=t[1].length),R&&this.rules.other.blankLine.test(h)&&(c+=h+`
`,e=e.substring(h.length+1),a=true),!a){let S=this.rules.other.nextBulletRegex(f),te=this.rules.other.hrRegex(f),ne=this.rules.other.fencesBeginRegex(f),re=this.rules.other.headingBeginRegex(f),be=this.rules.other.htmlBeginRegex(f),Re=this.rules.other.blockquoteBeginRegex(f);for(;e;){let G=e.split(`
`,1)[0],C;if(h=G,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),C=h):C=h.replace(this.rules.other.tabCharGlobal,"    "),ne.test(h)||re.test(h)||be.test(h)||Re.test(h)||S.test(h)||te.test(h))break;if(C.search(this.rules.other.nonSpaceChar)>=f||!h.trim())p+=`
`+C.slice(f);else {if(R||k.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||ne.test(k)||re.test(k)||te.test(k))break;p+=`
`+h;}R=!h.trim(),c+=G+`
`,e=e.substring(G.length+1),k=C.slice(f);}}r.loose||(o?r.loose=true:this.rules.other.doubleBlankLine.test(c)&&(o=true)),r.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:false,text:p,tokens:[]}),r.raw+=c;}let u=r.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let a of r.items){this.lexer.state.top=false,a.tokens=this.lexer.blockTokens(a.text,[]);let c=a.tokens[0];if(a.task&&(c?.type==="text"||c?.type==="paragraph")){a.text=a.text.replace(this.rules.other.listReplaceTask,""),c.raw=c.raw.replace(this.rules.other.listReplaceTask,""),c.text=c.text.replace(this.rules.other.listReplaceTask,"");for(let k=this.lexer.inlineQueue.length-1;k>=0;k--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[k].src)){this.lexer.inlineQueue[k].src=this.lexer.inlineQueue[k].src.replace(this.rules.other.listReplaceTask,"");break}let p=this.rules.other.listTaskCheckbox.exec(a.raw);if(p){let k={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};a.checked=k.checked,r.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=k.raw+a.tokens[0].raw,a.tokens[0].text=k.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(k)):a.tokens.unshift({type:"paragraph",raw:k.raw,text:k.raw,tokens:[k]}):a.tokens.unshift(k);}}else a.task&&(a.task=false);if(!r.loose){let p=a.tokens.filter(h=>h.type==="space"),k=p.length>0&&p.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=k;}}if(r.loose)for(let a of r.items){a.loose=true;for(let c of a.tokens)c.type==="text"&&(c.type="paragraph");}return r}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=ee(t[0]);return {type:"html",block:true,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return {type:"def",tag:n,raw:$(t[0],`
`),href:s,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Y(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:$(t[0],`
`),header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:true,align:i.align[o]});for(let o of r)i.rows.push(Y(o,i.header.length).map((u,a)=>({text:u,tokens:this.lexer.inline(u),header:false,align:i.align[a]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return {type:"heading",raw:$(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return {type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return {type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return {type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return !this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=true:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=false),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=true:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=false),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:false,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=$(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else {let i=fe(t[2],"()");if(i===-2)return;if(i>-1){let u=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,u).trim(),t[3]="";}}let s=t[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3]);}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),xe(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return {type:"text",raw:i,text:i}}return xe(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4]||s[4]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(s[1]||s[3]||"")||!n||this.rules.inline.punctuation.exec(n)){let i=[...s[0]].length-1,o,u,a=i,c=0,p=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,t=t.slice(-1*e.length+i);(s=p.exec(t))!==null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o)continue;if(u=[...o].length,s[3]||s[4]){a+=u;continue}else if((s[5]||s[6])&&i%3&&!((i+u)%3)){c+=u;continue}if(a-=u,a>0)continue;u=Math.min(u,u+a+c);let k=[...s[0]][0].length,h=e.slice(0,i+s.index+k+u);if(Math.min(i,u)%2){let f=h.slice(1,-1);return {type:"em",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}let R=h.slice(2,-2);return {type:"strong",raw:h,text:R,tokens:this.lexer.inlineTokens(R)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return {type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(!s)return;if(!(s[1]||"")||!n||this.rules.inline.punctuation.exec(n)){let i=[...s[0]].length-1,o,u,a=i,c=this.rules.inline.delRDelim;for(c.lastIndex=0,t=t.slice(-1*e.length+i);(s=c.exec(t))!==null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o||(u=[...o].length,u!==i))continue;if(s[3]||s[4]){a+=u;continue}if(a-=u,a>0)continue;u=Math.min(u,u+a);let p=[...s[0]][0].length,k=e.slice(0,i+s.index+p+u),h=k.slice(i,-i);return {type:"del",raw:k,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else {let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0];}return {type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return {type:"text",raw:t[0],text:t[0],escaped:n}}}};var x=class l{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||T,this.options.tokenizer=this.options.tokenizer||new w,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:false,inRawBlock:false,top:true};let t={other:m$1,block:D.normal,inline:A.normal};this.options.pedantic?(t.block=D.pedantic,t.inline=A.pedantic):this.options.gfm&&(t.block=D.gfm,this.options.breaks?t.inline=A.breaks:t.inline=A.gfm),this.tokenizer.rules=t;}static get rules(){return {block:D,inline:A}}static lex(e,t){return new l(t).lex(e)}static lexInline(e,t){return new l(t).inlineTokens(e)}lex(e){e=e.replace(m$1.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens);}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=false){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(m$1.tabCharGlobal,"    ").replace(m$1.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else {this.infiniteLoopError(e.charCodeAt(0));break}let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),true):false))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let o=t.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,u=e.slice(1),a;this.options.extensions.startBlock.forEach(c=>{a=c.call({lexer:this},u),typeof a=="number"&&a>=0&&(o=Math.min(o,a));}),o<1/0&&o>=0&&(i=e.substring(0,o+1));}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let o=t.at(-1);n&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=true,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let n=e,s=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(n))!==null;)a.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(n))!==null;)n=n.slice(0,s.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let r;for(;(s=this.tokenizer.rules.inline.blockSkip.exec(n))!==null;)r=s[2]?s[2].length:0,n=n.slice(0,s.index+r)+"["+"a".repeat(s[0].length-r-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let i=false,o="",u=1/0;for(;e;){if(e.length<u)u=e.length;else {this.infiniteLoopError(e.charCodeAt(0));break}i||(o=""),i=false;let a;if(this.options.extensions?.inline?.some(p=>(a=p.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),true):false))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let p=t.at(-1);a.type==="text"&&p?.type==="text"?(p.raw+=a.raw,p.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,n,o)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e,n,o)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let c=e;if(this.options.extensions?.startInline){let p=1/0,k=e.slice(1),h;this.options.extensions.startInline.forEach(R=>{h=R.call({lexer:this},k),typeof h=="number"&&h>=0&&(p=Math.min(p,h));}),p<1/0&&p>=0&&(c=e.substring(0,p+1));}if(a=this.tokenizer.inlineText(c)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(o=a.raw.slice(-1)),i=true;let p=t.at(-1);p?.type==="text"?(p.raw+=a.raw,p.text+=a.text):t.push(a);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t="Infinite loop on byte: "+e;if(this.options.silent)console.error(t);else throw new Error(t)}};var y$1=class y{options;parser;constructor(e){this.options=e||T;}space(e){return ""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(m$1.notSpaceStart)?.[0],r=e.replace(m$1.endingNewline,"")+`
`;return s?'<pre><code class="language-'+O(s)+'">'+(n?r:O(r,true))+`</code></pre>
`:"<pre><code>"+(n?r:O(r,true))+`</code></pre>
`}blockquote({tokens:e}){return `<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return ""}heading({tokens:e,depth:t}){return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return `<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let u=e.items[o];s+=this.listitem(u);}let r=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return "<"+r+i+`>
`+s+"</"+r+`>
`}listitem(e){return `<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return "<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return `<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let s="";for(let r=0;r<e.rows.length;r++){let i=e.rows[r];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);s+=this.tablerow({text:n});}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return `<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return (e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return `<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return `<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return `<code>${O(e,true)}</code>`}br(e){return "<br>"}del({tokens:e}){return `<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),r=V(e);if(r===null)return s;e=r;let i='<a href="'+e+'"';return t&&(i+=' title="'+O(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=V(e);if(r===null)return O(n);e=r;let i=`<img src="${e}" alt="${O(n)}"`;return t&&(i+=` title="${O(t)}"`),i+=">",i}text(e){return "tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:O(e.text)}};var L=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return ""+e}image({text:e}){return ""+e}br(){return ""}checkbox({raw:e}){return e}};var b$1=class l{options;renderer;textRenderer;constructor(e){this.options=e||T,this.options.renderer=this.options.renderer||new y$1,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new L;}static parse(e,t){return new l(t).parse(e)}static parseInline(e,t){return new l(t).parseInline(e)}parse(e){this.renderer.parser=this;let t="";for(let n=0;n<e.length;n++){let s=e[n];if(this.options.extensions?.renderers?.[s.type]){let i=s,o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==false||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){t+=o||"";continue}}let r=s;switch(r.type){case "space":{t+=this.renderer.space(r);break}case "hr":{t+=this.renderer.hr(r);break}case "heading":{t+=this.renderer.heading(r);break}case "code":{t+=this.renderer.code(r);break}case "table":{t+=this.renderer.table(r);break}case "blockquote":{t+=this.renderer.blockquote(r);break}case "list":{t+=this.renderer.list(r);break}case "checkbox":{t+=this.renderer.checkbox(r);break}case "html":{t+=this.renderer.html(r);break}case "def":{t+=this.renderer.def(r);break}case "paragraph":{t+=this.renderer.paragraph(r);break}case "text":{t+=this.renderer.text(r);break}default:{let i='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let o=this.options.extensions.renderers[r.type].call({parser:this},r);if(o!==false||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(r.type)){n+=o||"";continue}}let i=r;switch(i.type){case "escape":{n+=t.text(i);break}case "html":{n+=t.html(i);break}case "link":{n+=t.link(i);break}case "image":{n+=t.image(i);break}case "checkbox":{n+=t.checkbox(i);break}case "strong":{n+=t.strong(i);break}case "em":{n+=t.em(i);break}case "codespan":{n+=t.codespan(i);break}case "br":{n+=t.br(i);break}case "del":{n+=t.del(i);break}case "text":{n+=t.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}};var P=class{options;block;constructor(e){this.options=e||T;}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?x.lex:x.lexInline}provideParser(e=this.block){return e?b$1.parse:b$1.parseInline}};var q=class{defaults=M();options=this.setOptions;parse=this.parseMarkdown(true);parseInline=this.parseMarkdown(false);Parser=b$1;Renderer=y$1;TextRenderer=L;Lexer=x;Tokenizer=w;Hooks=P;constructor(...e){this.use(...e);}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case "table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of r.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,t));break}case "list":{let r=s;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let o=r[i].flat(1/0);n=n.concat(this.walkTokens(o,t));}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)));}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||false,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=t.renderers[r.name];i?t.renderers[r.name]=function(...o){let u=r.renderer.apply(this,o);return u===false&&(u=i.apply(this,o)),u}:t.renderers[r.name]=r.renderer;}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[r.level];i?i.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]));}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens);}),s.extensions=t),n.renderer){let r=this.defaults.renderer||new y$1(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,u=n.renderer[o],a=r[o];r[o]=(...c)=>{let p=u.apply(r,c);return p===false&&(p=a.apply(r,c)),p||""};}s.renderer=r;}if(n.tokenizer){let r=this.defaults.tokenizer||new w(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,u=n.tokenizer[o],a=r[o];r[o]=(...c)=>{let p=u.apply(r,c);return p===false&&(p=a.apply(r,c)),p};}s.tokenizer=r;}if(n.hooks){let r=this.defaults.hooks||new P;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,u=n.hooks[o],a=r[o];P.passThroughHooks.has(i)?r[o]=c=>{if(this.defaults.async&&P.passThroughHooksRespectAsync.has(i))return (async()=>{let k=await u.call(r,c);return a.call(r,k)})();let p=u.call(r,c);return a.call(r,p)}:r[o]=(...c)=>{if(this.defaults.async)return (async()=>{let k=await u.apply(r,c);return k===false&&(k=await a.apply(r,c)),k})();let p=u.apply(r,c);return p===false&&(p=a.apply(r,c)),p};}s.hooks=r;}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(o){let u=[];return u.push(i.call(this,o)),r&&(u=u.concat(r.call(this,o))),u};}this.defaults={...this.defaults,...s};}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return x.lex(e,t??this.defaults)}parser(e,t){return b$1.parse(e,t??this.defaults)}parseMarkdown(e){return (n,s)=>{let r={...s},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===true&&r.async===false)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return (async()=>{let u=i.hooks?await i.hooks.preprocess(n):n,c=await(i.hooks?await i.hooks.provideLexer(e):e?x.lex:x.lexInline)(u,i),p=i.hooks?await i.hooks.processAllTokens(c):c;i.walkTokens&&await Promise.all(this.walkTokens(p,i.walkTokens));let h=await(i.hooks?await i.hooks.provideParser(e):e?b$1.parse:b$1.parseInline)(p,i);return i.hooks?await i.hooks.postprocess(h):h})().catch(o);try{i.hooks&&(n=i.hooks.preprocess(n));let a=(i.hooks?i.hooks.provideLexer(e):e?x.lex:x.lexInline)(n,i);i.hooks&&(a=i.hooks.processAllTokens(a)),i.walkTokens&&this.walkTokens(a,i.walkTokens);let p=(i.hooks?i.hooks.provideParser(e):e?b$1.parse:b$1.parseInline)(a,i);return i.hooks&&(p=i.hooks.postprocess(p)),p}catch(u){return o(u)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+O(n.message+"",true)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}};var z=new q;function g$1(l,e){return z.parse(l,e)}g$1.options=g$1.setOptions=function(l){return z.setOptions(l),g$1.defaults=z.defaults,N(g$1.defaults),g$1};g$1.getDefaults=M;g$1.defaults=T;g$1.use=function(...l){return z.use(...l),g$1.defaults=z.defaults,N(g$1.defaults),g$1};g$1.walkTokens=function(l,e){return z.walkTokens(l,e)};g$1.parseInline=z.parseInline;g$1.Parser=b$1;g$1.parser=b$1.parse;g$1.Renderer=y$1;g$1.TextRenderer=L;g$1.Lexer=x;g$1.lexer=x.lex;g$1.Tokenizer=w;g$1.Hooks=P;g$1.parse=g$1;g$1.options;g$1.setOptions;g$1.use;g$1.walkTokens;g$1.parseInline;b$1.parse;x.lex;

const marked = new q({
  breaks: true,
  gfm: true
});
function renderMarkdown(md) {
  return marked.parse(md, {
    async: false
  });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://sampaultoms.com");
const $$ProjectGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProjectGrid;
  const { projects } = Astro2.props;
  const sorted = [...projects].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  return renderTemplate`${maybeRenderHead()}<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="project-grid"> ${sorted.map((project, index) => renderTemplate`<div class="card cursor-pointer p-3 project-card"${addAttribute(index, "data-project-index")}> <div class="artwork-container"> <img${addAttribute(project.image, "src")}${addAttribute(project.title, "alt")} loading="lazy"> </div> <div class="pt-3 px-1"> <h3 class="text-sm font-semibold text-white truncate">${project.title}</h3> </div> </div>`)} </div> ${renderScript($$result, "/Users/phil/dev/sam/src/components/ProjectGrid.astro?astro&type=script&index=0&lang.ts")}  ${sorted.map((project, index) => renderTemplate(_a || (_a = __template(['<script type="application/json"', ">", "<\/script>"])), addAttribute(`project-data-${index}`, "id"), unescapeHTML(JSON.stringify({
    title: project.title,
    summary: project.summary,
    summaryHtml: renderMarkdown(project.summary),
    image: project.image,
    popupImage: project.popupImage,
    video: project.video,
    videoStartTime: project.videoStartTime,
    videoThumbnails: project.videoThumbnails,
    loop: project.loop,
    autoplay: project.autoplay,
    dir: project.dir,
    publishDate: project.publishDate.toISOString()
  }).replace(/</g, "\\u003c"))))}`;
}, "/Users/phil/dev/sam/src/components/ProjectGrid.astro", void 0);

const POLAROID_FRAMES = ["/images/carousel/polaroid1.png", "/images/carousel/polaroid2.png", "/images/carousel/polaroid3.png", "/images/carousel/polaroid4.png"];
function smoothScrollTo(element, targetX, duration, frameRef, onComplete) {
  cancelAnimationFrame(frameRef.current);
  const startX = element.scrollLeft;
  const distance = targetX - startX;
  if (Math.abs(distance) < 1) {
    if (onComplete) onComplete();
    return;
  }
  const startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.scrollLeft = startX + distance * eased;
    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      element.scrollLeft = targetX;
      if (onComplete) onComplete();
    }
  }
  frameRef.current = requestAnimationFrame(animate);
}
function CarouselCard({
  item,
  itemCount,
  isActive,
  slideNumber
}) {
  return u$1("div", {
    class: `media-carousel__card${isActive ? " media-carousel__card--active" : ""}`,
    role: "group",
    "aria-roledescription": "slide",
    "aria-label": `${slideNumber} of ${itemCount}: ${item.title}`,
    children: [u$1("div", {
      class: "media-carousel__media",
      children: [item.type === "image" && u$1("img", {
        src: item.src,
        alt: item.alt || item.title,
        loading: "lazy"
      }), item.type === "video" && (() => {
        const videoId = extractYouTubeId(item.src);
        return videoId ? u$1("iframe", {
          src: `https://www.youtube.com/embed/${videoId}`,
          title: item.title,
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: true,
          loading: "lazy"
        }) : u$1("img", {
          src: item.thumbnail || item.src,
          alt: item.alt || item.title,
          loading: "lazy"
        });
      })(), item.type === "instagram" && u$1(S$1, {
        children: [u$1("img", {
          src: item.thumbnail || item.src,
          alt: item.alt || item.title,
          loading: "lazy"
        }), item.instagramUrl && u$1("a", {
          href: item.instagramUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "media-carousel__instagram-overlay",
          "aria-label": `View ${item.title} on Instagram`,
          children: u$1("span", {
            class: "media-carousel__instagram-icon",
            children: u$1("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              children: [u$1("rect", {
                x: "2",
                y: "2",
                width: "20",
                height: "20",
                rx: "5",
                ry: "5"
              }), u$1("path", {
                d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
              }), u$1("line", {
                x1: "17.5",
                y1: "6.5",
                x2: "17.51",
                y2: "6.5"
              })]
            })
          })
        })]
      })]
    }), u$1("img", {
      class: "media-carousel__polaroid-frame",
      src: POLAROID_FRAMES[item.order % POLAROID_FRAMES.length],
      "aria-hidden": "true",
      alt: ""
    })]
  });
}
function MediaCarousel({
  items
}) {
  const [activeIndex, setActiveIndex] = d$3(0);
  const viewportRef = A$1(null);
  const animFrameRef = A$1(0);
  const isAnimating = A$1(false);
  const itemCount = items.length;
  const totalSlots = itemCount + 4;
  const REAL_OFFSET = 2;
  const centerScrollX = q$2((slot) => {
    const viewport = viewportRef.current;
    if (!viewport) return 0;
    const child = viewport.children[slot];
    if (!child) return viewport.scrollLeft;
    const cRect = child.getBoundingClientRect();
    const vRect = viewport.getBoundingClientRect();
    return viewport.scrollLeft + cRect.left - vRect.left - (vRect.width - cRect.width) / 2;
  }, []);
  const jumpToSlot = q$2((slot, realIndex) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    isAnimating.current = true;
    viewport.scrollLeft = centerScrollX(slot);
    setActiveIndex(realIndex);
    requestAnimationFrame(() => {
      isAnimating.current = false;
    });
  }, [centerScrollX]);
  const handleCloneCheck = q$2((slot) => {
    if (slot === 1) {
      jumpToSlot(REAL_OFFSET + itemCount - 1, itemCount - 1);
    } else if (slot === itemCount + 2) {
      jumpToSlot(REAL_OFFSET, 0);
    }
  }, [itemCount, jumpToSlot]);
  const getClosestSlot = q$2(() => {
    const viewport = viewportRef.current;
    if (!viewport) return REAL_OFFSET;
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = REAL_OFFSET;
    let bestDist = Infinity;
    for (let i = 0; i < totalSlots; i++) {
      const child = viewport.children[i];
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [totalSlots]);
  const goTo = q$2((realIndex) => {
    const wrapped = (realIndex % itemCount + itemCount) % itemCount;
    const viewport = viewportRef.current;
    if (!viewport) return;
    cancelAnimationFrame(animFrameRef.current);
    let slot;
    if (realIndex >= itemCount && activeIndex === itemCount - 1) {
      slot = itemCount + 2;
    } else if (realIndex < 0 && activeIndex === 0) {
      slot = 1;
    } else {
      slot = wrapped + REAL_OFFSET;
    }
    isAnimating.current = true;
    setActiveIndex(wrapped);
    smoothScrollTo(viewport, centerScrollX(slot), 350, animFrameRef, () => {
      isAnimating.current = false;
      handleCloneCheck(slot);
    });
  }, [itemCount, activeIndex, centerScrollX, handleCloneCheck]);
  const goNext = q$2(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = q$2(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  _$3(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.children[REAL_OFFSET];
    if (card) {
      const spacerW = Math.max(0, (viewport.clientWidth - card.offsetWidth) / 2);
      const spacerStart = viewport.children[0];
      const spacerEnd = viewport.children[totalSlots - 1];
      spacerStart.style.width = `${spacerW}px`;
      spacerEnd.style.width = `${spacerW}px`;
    }
    viewport.scrollLeft = centerScrollX(REAL_OFFSET);
  }, [centerScrollX, totalSlots]);
  y$4(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => {
      const card = viewport.children[REAL_OFFSET];
      if (!card) return;
      const spacerW = Math.max(0, (viewport.clientWidth - card.offsetWidth) / 2);
      const spacerStart = viewport.children[0];
      const spacerEnd = viewport.children[totalSlots - 1];
      spacerStart.style.width = `${spacerW}px`;
      spacerEnd.style.width = `${spacerW}px`;
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [totalSlots]);
  y$4(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    const carousel = viewportRef.current?.parentElement;
    if (!carousel) return;
    carousel.addEventListener("keydown", handleKeyDown);
    return () => carousel.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);
  y$4(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let rafId = 0;
    let settleTimer;
    let isTouching = false;
    let lastSlot = REAL_OFFSET;
    const onScroll = () => {
      if (isAnimating.current) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const slot = getClosestSlot();
        lastSlot = slot;
        if (slot >= REAL_OFFSET && slot < REAL_OFFSET + itemCount) {
          setActiveIndex(slot - REAL_OFFSET);
        }
        if (isTouching) return;
        clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          if (isAnimating.current) return;
          if (lastSlot === 1 || lastSlot === itemCount + 2) {
            handleCloneCheck(lastSlot);
            return;
          }
          const sl = viewport.scrollLeft;
          const maxSl = viewport.scrollWidth - viewport.clientWidth;
          if (sl >= maxSl - 2 && lastSlot === REAL_OFFSET + itemCount - 1) {
            isAnimating.current = true;
            viewport.scrollLeft = centerScrollX(REAL_OFFSET);
            setActiveIndex(0);
            requestAnimationFrame(() => {
              isAnimating.current = false;
            });
          } else if (sl <= 2 && lastSlot === REAL_OFFSET) {
            isAnimating.current = true;
            viewport.scrollLeft = centerScrollX(REAL_OFFSET + itemCount - 1);
            setActiveIndex(itemCount - 1);
            requestAnimationFrame(() => {
              isAnimating.current = false;
            });
          }
        }, 150);
      });
    };
    const onTouchStart = () => {
      isTouching = true;
      clearTimeout(settleTimer);
    };
    const onTouchEnd = () => {
      isTouching = false;
    };
    const onPointerDown = () => {
      isTouching = true;
      clearTimeout(settleTimer);
    };
    const onPointerUp = () => {
      isTouching = false;
    };
    viewport.addEventListener("scroll", onScroll, {
      passive: true
    });
    viewport.addEventListener("touchstart", onTouchStart, {
      passive: true
    });
    viewport.addEventListener("touchend", onTouchEnd, {
      passive: true
    });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointerup", onPointerUp);
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointerup", onPointerUp);
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
    };
  }, [itemCount, getClosestSlot, centerScrollX, handleCloneCheck]);
  if (itemCount === 0) return null;
  const renderedItems = [
    items[itemCount - 1],
    // slot 1: clone-last
    ...items,
    // slots 2..N+1: real items
    items[0]
    // slot N+2: clone-first
  ];
  return u$1("div", {
    class: "media-carousel",
    role: "region",
    "aria-label": "Media gallery",
    tabIndex: 0,
    children: [u$1("button", {
      type: "button",
      class: "media-carousel__nav-btn media-carousel__nav-btn--prev",
      onClick: goPrev,
      "aria-label": "Previous item",
      children: u$1("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        children: u$1("path", {
          d: "m15 18 -6 -6 6 -6"
        })
      })
    }), u$1("div", {
      ref: viewportRef,
      class: "media-carousel__viewport",
      children: [u$1("div", {
        "aria-hidden": "true",
        style: {
          flexShrink: 0
        }
      }), renderedItems.map((item, i) => {
        const slot = i + 1;
        const isClone = slot === 1 || slot === itemCount + 2;
        const realIdx = isClone ? slot === 1 ? itemCount - 1 : 0 : slot - REAL_OFFSET;
        return u$1(CarouselCard, {
          item,
          itemCount,
          isActive: slot === activeIndex + REAL_OFFSET,
          slideNumber: realIdx + 1
        }, slot === 1 ? "clone-last" : slot === itemCount + 2 ? "clone-first" : `real-${item.order}`);
      }), u$1("div", {
        "aria-hidden": "true",
        style: {
          flexShrink: 0
        }
      })]
    }), u$1("button", {
      type: "button",
      class: "media-carousel__nav-btn media-carousel__nav-btn--next",
      onClick: goNext,
      "aria-label": "Next item",
      children: u$1("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        children: u$1("path", {
          d: "m9 18 6 -6 -6 -6"
        })
      })
    }), u$1("div", {
      class: "media-carousel__dots",
      role: "tablist",
      "aria-label": "Carousel navigation",
      children: items.map((item, index) => u$1("button", {
        type: "button",
        class: `media-carousel__dot${index === activeIndex ? " media-carousel__dot--active" : ""}`,
        onClick: () => goTo(index),
        role: "tab",
        "aria-selected": index === activeIndex,
        "aria-label": `Go to slide ${index + 1}: ${item.title}`
      }, `dot-${item.order}`))
    })]
  });
}

var e=e=>Object.prototype.toString.call(e),t=e=>ArrayBuffer.isView(e)&&!(e instanceof DataView),o=t=>"[object Date]"===e(t),n=t=>"[object RegExp]"===e(t),r=t=>"[object Error]"===e(t),s=t=>"[object Boolean]"===e(t),l=t=>"[object Number]"===e(t),i=t=>"[object String]"===e(t),c=Array.isArray,u=Object.getOwnPropertyDescriptor,a=Object.prototype.propertyIsEnumerable,f=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,h=Object.keys;function d(e){const t=h(e),o=f(e);for(let n=0;n<o.length;n++)a.call(e,o[n])&&t.push(o[n]);return t}function b(e,t){return !u(e,t)?.writable}function y(e,u){if("object"==typeof e&&null!==e){let a;if(c(e))a=[];else if(o(e))a=new Date(e.getTime?e.getTime():e);else if(n(e))a=new RegExp(e);else if(r(e))a={message:e.message};else if(s(e)||l(e)||i(e))a=Object(e);else {if(t(e))return e.slice();a=Object.create(Object.getPrototypeOf(e));}const f=u.includeSymbols?d:h;for(const t of f(e))a[t]=e[t];return a}return e}var g={includeSymbols:false,immutable:false};function m(e,t,o=g){const n=[],r=[];let s=true;const l=o.includeSymbols?d:h,i=!!o.immutable;return function e(u){const a=i?y(u,o):u,f={};let h=true;const d={node:a,node_:u,path:[].concat(n),parent:r[r.length-1],parents:r,key:n[n.length-1],isRoot:0===n.length,level:n.length,circular:void 0,isLeaf:false,notLeaf:true,notRoot:true,isFirst:false,isLast:false,update:function(e,t=false){d.isRoot||(d.parent.node[d.key]=e),d.node=e,t&&(h=false);},delete:function(e){delete d.parent.node[d.key],e&&(h=false);},remove:function(e){c(d.parent.node)?d.parent.node.splice(d.key,1):delete d.parent.node[d.key],e&&(h=false);},keys:null,before:function(e){f.before=e;},after:function(e){f.after=e;},pre:function(e){f.pre=e;},post:function(e){f.post=e;},stop:function(){s=false;},block:function(){h=false;}};if(!s)return d;function g(){if("object"==typeof d.node&&null!==d.node){d.keys&&d.node_===d.node||(d.keys=l(d.node)),d.isLeaf=0===d.keys.length;for(let e=0;e<r.length;e++)if(r[e].node_===u){d.circular=r[e];break}}else d.isLeaf=true,d.keys=null;d.notLeaf=!d.isLeaf,d.notRoot=!d.isRoot;}g();const m=t(d,d.node);if(void 0!==m&&d.update&&d.update(m),f.before&&f.before(d,d.node),!h)return d;if("object"==typeof d.node&&null!==d.node&&!d.circular){r.push(d),g();for(const[t,o]of Object.entries(d.keys??[])){n.push(o),f.pre&&f.pre(d,d.node[o],o);const r=e(d.node[o]);i&&p.call(d.node,o)&&!b(d.node,o)&&(d.node[o]=r.node),r.isLast=!!d.keys?.length&&+t==d.keys.length-1,r.isFirst=0==+t,f.post&&f.post(d,r),n.pop();}r.pop();}return f.after&&f.after(d,d.node),d}(e).node}var j=class{#e;#t;constructor(e,t=g){this.#e=e,this.#t=t;}get(e){let t=this.#e;for(let o=0;t&&o<e.length;o++){const n=e[o];if(!p.call(t,n)||!this.#t.includeSymbols&&"symbol"==typeof n)return;t=t[n];}return t}has(e){let t=this.#e;for(let o=0;t&&o<e.length;o++){const n=e[o];if(!p.call(t,n)||!this.#t.includeSymbols&&"symbol"==typeof n)return  false;t=t[n];}return  true}set(e,t){let o=this.#e,n=0;for(n=0;n<e.length-1;n++){const t=e[n];p.call(o,t)||(o[t]={}),o=o[t];}return o[e[n]]=t,t}map(e){return m(this.#e,e,{immutable:true,includeSymbols:!!this.#t.includeSymbols})}forEach(e){return this.#e=m(this.#e,e,this.#t),this.#e}reduce(e,t){const o=1===arguments.length;let n=o?this.#e:t;return this.forEach(((t,r)=>{t.isRoot&&o||(n=e(t,n,r));})),n}paths(){const e=[];return this.forEach((t=>{e.push(t.path);})),e}nodes(){const e=[];return this.forEach((t=>{e.push(t.node);})),e}clone(){const e=[],o=[],n=this.#t;return t(this.#e)?this.#e.slice():function t(r){for(let t=0;t<e.length;t++)if(e[t]===r)return o[t];if("object"==typeof r&&null!==r){const s=y(r,n);e.push(r),o.push(s);const l=n.includeSymbols?d:h;for(const e of l(r))s[e]=t(r[e]);return e.pop(),o.pop(),s}return r}(this.#e)}};

/*
How it works:
`this.#head` is an instance of `Node` which keeps track of its current value and nests another instance of `Node` that keeps the value that comes after it. When a value is provided to `.enqueue()`, the code needs to iterate through `this.#head`, going deeper and deeper to find the last value. However, iterating through every single item is slow. This problem is solved by saving a reference to the last value as `this.#tail` so that it can reference it to add a new value.
*/

class Node {
	value;
	next;

	constructor(value) {
		this.value = value;
	}
}

class Queue {
	#head;
	#tail;
	#size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this.#head) {
			this.#tail.next = node;
			this.#tail = node;
		} else {
			this.#head = node;
			this.#tail = node;
		}

		this.#size++;
	}

	dequeue() {
		const current = this.#head;
		if (!current) {
			return;
		}

		this.#head = this.#head.next;
		this.#size--;

		// Clean up tail reference when queue becomes empty
		if (!this.#head) {
			this.#tail = undefined;
		}

		return current.value;
	}

	peek() {
		if (!this.#head) {
			return;
		}

		return this.#head.value;

		// TODO: Node.js 18.
		// return this.#head?.value;
	}

	clear() {
		this.#head = undefined;
		this.#tail = undefined;
		this.#size = 0;
	}

	get size() {
		return this.#size;
	}

	* [Symbol.iterator]() {
		let current = this.#head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}

	* drain() {
		while (this.#head) {
			yield this.dequeue();
		}
	}
}

function pLimit(concurrency) {
	validateConcurrency(concurrency);

	const queue = new Queue();
	let activeCount = 0;

	const resumeNext = () => {
		if (activeCount < concurrency && queue.size > 0) {
			queue.dequeue()();
			// Since `pendingCount` has been decreased by one, increase `activeCount` by one.
			activeCount++;
		}
	};

	const next = () => {
		activeCount--;

		resumeNext();
	};

	const run = async (function_, resolve, arguments_) => {
		const result = (async () => function_(...arguments_))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (function_, resolve, arguments_) => {
		// Queue `internalResolve` instead of the `run` function
		// to preserve asynchronous context.
		new Promise(internalResolve => {
			queue.enqueue(internalResolve);
		}).then(
			run.bind(undefined, function_, resolve, arguments_),
		);

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// after the `internalResolve` function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency) {
				resumeNext();
			}
		})();
	};

	const generator = (function_, ...arguments_) => new Promise(resolve => {
		enqueue(function_, resolve, arguments_);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value() {
				queue.clear();
			},
		},
		concurrency: {
			get: () => concurrency,

			set(newConcurrency) {
				validateConcurrency(newConcurrency);
				concurrency = newConcurrency;

				queueMicrotask(() => {
					// eslint-disable-next-line no-unmodified-loop-condition
					while (activeCount < concurrency && queue.size > 0) {
						resumeNext();
					}
				});
			},
		},
	});

	return generator;
}

function validateConcurrency(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('../chunks/_astro_data-layer-content_DQAAZidY.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_ACCENT_COLOR": "#852929", "PUBLIC_SOCIAL_APPLE_MUSIC": "https://music.apple.com/us/artist/sam-paul-toms/1706293772", "PUBLIC_SOCIAL_IMDB": "https://www.imdb.com/name/nm7622530/", "PUBLIC_SOCIAL_INSTAGRAM": "https://www.instagram.com/sammytoms/", "PUBLIC_SOCIAL_SPOTIFY": "https://open.spotify.com/artist/6TbhQeGTrmiaPNbOzeNdT1?si=eGc6u_BBR5GkraCZe68cWg", "PUBLIC_SOCIAL_TIDAL": "https://stage.tidal.com/artist/41934098", "PUBLIC_UMAMI_SRC": "", "PUBLIC_UMAMI_WEBSITE_ID": "", "PUBLIC_WHATSAPP_PHONE": "", "SITE": "https://sampaultoms.com", "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
objectType({
  tags: arrayType(stringType()).optional(),
  lastModified: dateType().optional()
});
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection,
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('../chunks/content-assets_XqCgPAV2.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (entry.legacyId) {
          entry = emulateLegacyEntry(entry);
        }
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function emulateLegacyEntry({ legacyId, ...entry }) {
  const legacyEntry = {
    ...entry,
    id: legacyId,
    slug: entry.id
  };
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: () => renderEntry(legacyEntry)
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('../chunks/content-assets_XqCgPAV2.mjs');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('../chunks/_astro_assets_DkMCGR1J.mjs').then(n => n._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...Object.assign(__vite_import_meta_env__, { _: process.env._ }).DEV ? { "data-image-component": "true" } : {}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new j(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('../chunks/content-modules_Bvq7llv8.mjs');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: isRemotePath(link) ? link : prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const liveCollections = {};

const contentDir = '/src/content/';

const contentEntryGlob = "";
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = "";
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = "";
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
	liveCollections,
});

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const aboutEntries = await getCollection("about");
  const aboutEntry = aboutEntries[0];
  const { Content: AboutContent } = await renderEntry(aboutEntry);
  const {
    title: aboutTitle,
    photo: aboutPhoto,
    photoAlt: aboutPhotoAlt,
    genreTags: aboutGenreTags,
    pressQuotes: aboutPressQuotes
  } = aboutEntry.data;
  const sectionOrder = [
    "documentary",
    "film",
    "library",
    "trailers-themes-idents"
  ];
  const worksEntries = await getCollection("works");
  const sortedWorks = worksEntries.sort(
    (a, b) => sectionOrder.indexOf(a.data.slug) - sectionOrder.indexOf(b.data.slug)
  );
  const sections = sortedWorks.map((entry) => ({
    title: entry.data.title,
    slug: entry.data.slug,
    description: entry.data.description,
    descriptionHtml: entry.data.description ? renderMarkdown(entry.data.description) : void 0,
    credit: entry.data.credit,
    tracks: entry.data.tracks.map((t) => ({
      title: t.title,
      subtitle: t.subtitle,
      credit: t.credit,
      duration: t.duration,
      icon: t.icon ?? "music"
    }))
  }));
  const playableTracksMap = {};
  for (const entry of sortedWorks) {
    playableTracksMap[entry.data.slug] = entry.data.tracks.map(
      (track, i) => buildTrackFromContent(track, entry.data.slug, i, "Sam", "/favicon.svg")
    );
  }
  const allTracks = sortedWorks.flatMap(
    (entry) => entry.data.tracks.map(
      (track, i) => buildTrackFromContent(track, entry.data.slug, i, "Sam", "/favicon.svg")
    )
  );
  const allTracksJson = JSON.stringify(allTracks);
  const projectsEntries = await getCollection("projects");
  const galleryEntries = await getCollection("gallery");
  const galleryItems = galleryEntries.sort((a, b) => a.data.order - b.data.order).map((entry) => entry.data);
  const siteName = DEFAULT_SITE_NAME;
  const bioSummary = `${siteName} is an award-nominated London-based composer, producer, and multi-instrumentalist. Specializing in emotive music for media, ${siteName} has created scores for dramatic and documentary film, idents, trailers, and more.`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${siteName} — Composer & Producer`, "description": `Official music portfolio of ${siteName}. Listen to tracks, albums, and EPs.`, "image": "/favicon.svg", "type": "website", "aboutTitle": aboutTitle, "aboutPhoto": aboutPhoto, "aboutPhotoAlt": aboutPhotoAlt, "aboutGenreTags": aboutGenreTags, "aboutPressQuotes": aboutPressQuotes }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroBanner", $$HeroBanner, {})} ${maybeRenderHead()}<main class="relative z-10 mt-[calc(100vw*9/22-4rem)] md:mt-[calc(100vw*9/26-4rem)] max-w-[1052px] mx-auto">  <section class="section"> <div class="container"> ${renderComponent($$result2, "CompactBio", $$CompactBio, { "summary": bioSummary }, { "default": async ($$result3) => renderTemplate` <div class="mt-6"> ${renderComponent($$result3, "SocialLinksBar", $$SocialLinksBar, { "allTracksJson": allTracksJson })} </div> ` })} </div> </section>  <section class="section"> <div class="container max-w-3xl"> ${renderComponent($$result2, "PlaylistAccordion", PlaylistAccordion, { "client:load": true, "sections": sections, "playableTracksMap": playableTracksMap, "allTracks": allTracks, "client:component-hydration": "load", "client:component-path": "/Users/phil/dev/sam/src/components/PlaylistAccordion", "client:component-export": "default" })} </div> </section>  <section class="section"> ${renderComponent($$result2, "MediaCarousel", MediaCarousel, { "client:visible": true, "items": galleryItems, "client:component-hydration": "visible", "client:component-path": "/Users/phil/dev/sam/src/components/MediaCarousel", "client:component-export": "default" })} </section>  <section class="section"> <div class="container"> ${renderComponent($$result2, "ProjectGrid", $$ProjectGrid, { "projects": projectsEntries.map((p) => p.data) })} </div> </section> </main> <div id="about-bio-content" style="display:none"> ${renderComponent($$result2, "AboutContent", AboutContent, {})} </div> ` })}`;
}, "/Users/phil/dev/sam/src/pages/index.astro", void 0);
const $$file = "/Users/phil/dev/sam/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
