/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@sifrr/storage/dist/sifrr.storage.min.js":
/*!***************************************************************!*\
  !*** ./node_modules/@sifrr/storage/dist/sifrr.storage.min.js ***!
  \***************************************************************/
/***/ (function() {

/*! Sifrr.Storage v0.0.9 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
this.Sifrr=this.Sifrr||{},this.Sifrr.Storage=function(t){"use strict";var e=Object.prototype.toString,r="~SS%l3g5k3~";function s(t){var e=t;if("string"==typeof t)try{e=t=JSON.parse(t)}catch(t){// do nothing
}if("string"==typeof t&&t.indexOf(r)>0){var[n,i,a]=t.split(r);e="ArrayBuffer"===n?new Uint8Array(i.split(",").map(t=>parseInt(t))).buffer:"Blob"===n?function(t,e){return new Blob([new Uint8Array(t.split(",")).buffer],{type:e})}(a,i):new window[n](i.split(","))}else if(Array.isArray(t))e=[],t.forEach((t,r)=>{e[r]=s(t)});else if("object"==typeof t){if(null===t)return null;for(var o in e={},t)e[o]=s(t[o])}return e}function n(t){if("object"!=typeof t)return JSON.stringify(t);if(null===t)return"null";if(Array.isArray(t))return JSON.stringify(t.map(t=>n(t)));var s=e.call(t).slice(8,-1);if("Object"===s){var i={};for(var a in t)i[a]=n(t[a]);return JSON.stringify(i)}return"ArrayBuffer"===s?t=new Uint8Array(t):"Blob"===s&&(t=t.type+r+function(t){var e=URL.createObjectURL(t),r=new XMLHttpRequest;r.open("GET",e,!1),r.send(),URL.revokeObjectURL(e);for(var s=new Uint8Array(r.response.length),n=0;n<r.response.length;++n)s[n]=r.response.charCodeAt(n);return s.toString()}(t)),s+r+t.toString()}
// always bind to storage
var i=(t,e)=>{var r=Date.now();return Object.keys(t).forEach(s=>{if(void 0!==t[s]){var{createdAt:n,ttl:i}=t[s];t[s]=t[s]&&t[s].value,0!==i&&r-n>i&&(delete t[s],e&&e(s))}}),t},a=(t,e)=>t&&t.value?(t.ttl=t.ttl||e,t.createdAt=Date.now(),t):{value:t,ttl:e,createdAt:Date.now()},o=(t,e,r)=>{if("string"==typeof t)return{[t]:a(e,r)};var s={};return Object.keys(t).forEach(e=>s[e]=a(t[e],r)),s},c=t=>Array.isArray(t)?t:[t],l={name:"SifrrStorage",version:1,description:"Sifrr Storage",size:5242880,ttl:0};class u{constructor(t=l){this.type=this.constructor.type,this.table={},Object.assign(this,l,t),this.tableName=this.name+this.version}// overwrited methods
select(t){var e=this.getStore(),r={};return t.forEach(t=>r[t]=e[t]),r}upsert(t){var e=this.getStore();for(var r in t)e[r]=t[r];return this.setStore(e),!0}delete(t){var e=this.getStore();return t.forEach(t=>delete e[t]),this.setStore(e),!0}deleteAll(){return this.setStore({}),!0}getStore(){return this.table}setStore(t){this.table=t}keys(){return Promise.resolve(this.getStore()).then(t=>Object.keys(t))}all(){return Promise.resolve(this.getStore()).then(t=>i(t,this.del.bind(this)))}get(t){return Promise.resolve(this.select(c(t))).then(t=>i(t,this.del.bind(this)))}set(t,e){return Promise.resolve(this.upsert(o(t,e,this.ttl)))}del(t){return Promise.resolve(this.delete(c(t)))}clear(){return Promise.resolve(this.deleteAll())}memoize(t,e=((...t)=>"string"==typeof t[0]?t[0]:n(t[0]))){return(...r)=>{var s=e(...r);return this.get(s).then(e=>{if(void 0===e[s]||null===e[s]){var n=t(...r);if(!(n instanceof Promise))throw Error("Only promise returning functions can be memoized");return n.then(t=>this.set(s,t).then(()=>t))}return e[s]})}}isSupported(t=!0){return!(!t||"undefined"!=typeof window&&"undefined"!=typeof document)||!(!window||!this.hasStore())}hasStore(){return!0}isEqual(t){return this.tableName==t.tableName&&this.type==t.type}// aliases
static stringify(t){return n(t)}static parse(t){return s(t)}static _add(t){this._all=this._all||[],this._all.push(t)}static _matchingInstance(t){for(var e=this._all||[],r=e.length,s=0;s<r;s++)if(e[s].isEqual(t))return e[s];return this._add(t),t}}class h extends u{constructor(t){return super(t),this.constructor._matchingInstance(this)}select(t){var e={},r=[];return t.forEach(t=>r.push(this._tx("readonly","get",t,void 0).then(r=>e[t]=r))),Promise.all(r).then(()=>e)}upsert(t){var e=[];for(var r in t)e.push(this._tx("readwrite","put",t[r],r));return Promise.all(e).then(()=>!0)}delete(t){var e=[];return t.forEach(t=>e.push(this._tx("readwrite","delete",t,void 0))),Promise.all(e).then(()=>!0)}deleteAll(){return this._tx("readwrite","clear",void 0,void 0)}_tx(t,e,r,s){var n=this;return this.store=this.store||this.createStore(n.tableName),this.store.then(i=>new Promise((a,o)=>{var c=i.transaction(n.tableName,t).objectStore(n.tableName),l=c[e].call(c,r,s);l.onsuccess=t=>a(t.target.result),l.onerror=t=>o(t.error)}))}getStore(){return this._tx("readonly","getAllKeys",void 0,void 0).then(this.select.bind(this))}createStore(t){return new Promise((e,r)=>{var s=window.indexedDB.open(t,1);s.onupgradeneeded=()=>{s.result.createObjectStore(t)},s.onsuccess=()=>e(s.result),s.onerror=()=>r(s.error)})}hasStore(){return!!window.indexedDB}static get type(){return"indexeddb"}}class p extends u{constructor(t){return super(t),this.constructor._matchingInstance(this)}parsedData(){}select(t){var e=t.map(()=>"?").join(", ");// Need to give array for ? values in executeSql's 2nd argument
return this.execSql("SELECT key, value FROM ".concat(this.tableName," WHERE key in (").concat(e,")"),t)}upsert(t){return this.getWebsql().transaction(e=>{for(var r in t)e.executeSql("INSERT OR REPLACE INTO ".concat(this.tableName,"(key, value) VALUES (?, ?)"),[r,this.constructor.stringify(t[r])])}),!0}delete(t){var e=t.map(()=>"?").join(", ");return this.execSql("DELETE FROM ".concat(this.tableName," WHERE key in (").concat(e,")"),t),!0}deleteAll(){return this.execSql("DELETE FROM ".concat(this.tableName)),!0}getStore(){return this.execSql("SELECT key, value FROM ".concat(this.tableName))}hasStore(){return!!window.openDatabase}getWebsql(){return this._store?this._store:(this._store=window.openDatabase("ss",1,this.description,this.size),this.execSql("CREATE TABLE IF NOT EXISTS ".concat(this.tableName," (key unique, value)")),this._store)}execSql(t,e=[]){var r=this;return new Promise(s=>{r.getWebsql().transaction((function(n){n.executeSql(t,e,(t,e)=>{s(r.parseResults(e))})}))})}parseResults(t){for(var e={},r=t.rows.length,s=0;s<r;s++)e[t.rows.item(s).key]=this.constructor.parse(t.rows.item(s).value);return e}static get type(){return"websql"}}class d extends u{constructor(t){return super(t),this.constructor._matchingInstance(this)}select(t){var e={};return t.forEach(t=>{var r=this.constructor.parse(this.getLocalStorage().getItem(this.tableName+"/"+t));null!==r&&(e[t]=r)}),e}upsert(t){for(var e in t)this.getLocalStorage().setItem(this.tableName+"/"+e,this.constructor.stringify(t[e]));return!0}delete(t){return t.map(t=>this.getLocalStorage().removeItem(this.tableName+"/"+t)),!0}deleteAll(){return Object.keys(this.getLocalStorage()).forEach(t=>{0===t.indexOf(this.tableName)&&this.getLocalStorage().removeItem(t)}),!0}getStore(){return this.select(Object.keys(this.getLocalStorage()).map(t=>{if(0===t.indexOf(this.tableName))return t.slice(this.tableName.length+1)}).filter(t=>void 0!==t))}getLocalStorage(){return window.localStorage}hasStore(){return!!window.localStorage}static get type(){return"localstorage"}}var f=new Date(0).toUTCString(),g="%3D",S=new RegExp(g,"g");class v extends u{constructor(t){return super(t),this.constructor._matchingInstance(this)}upsert(t){for(var e in t)this.setStore("".concat(this.tableName,"/").concat(e,"=").concat(this.constructor.stringify(t[e]).replace(/=/g,g),"; path=/"));return!0}delete(t){return t.forEach(t=>this.setStore("".concat(this.tableName,"/").concat(t,"=; expires=").concat(f,"; path=/"))),!0}deleteAll(){return this.keys().then(this.delete.bind(this))}getStore(){var t=document.cookie,e={};return t.split("; ").forEach(t=>{var[r,s]=t.split("=");0===r.indexOf(this.tableName)&&(e[r.slice(this.tableName.length+1)]=this.constructor.parse(s.replace(S,"=")))}),e}setStore(t){document.cookie=t}hasStore(){return void 0!==document.cookie}static get type(){return"cookies"}}class y extends u{constructor(t){return super(t),this.constructor._matchingInstance(this)}hasStore(){return!0}static get type(){return"jsonstorage"}}var m={[h.type]:h,[p.type]:p,[d.type]:d,[v.type]:v,[y.type]:y};return t.Cookies=v,t.IndexedDB=h,t.JsonStorage=y,t.LocalStorage=d,t.WebSQL=p,t.availableStores=m,t.getStorage=function(t){return function(t=[],e={}){t=t.concat([h.type,p.type,d.type,v.type,y.type]);for(var r=0;r<t.length;r++){var s=m[t[r]];if(s){var n=new s(e);if(n.isSupported())return n}}throw Error("No compatible storage found. Available types: "+Object.keys(m).join(", ")+".")}("string"==typeof t?[t]:(t||{}).priority,"string"==typeof t?{}:t)},t.default&&(t=t.default),t}({});
/*! (c) @aadityataparia */


/***/ }),

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "globals": () => (/* binding */ globals),
/* harmony export */   "register_fetch": () => (/* binding */ register_fetch),
/* harmony export */   "register_url": () => (/* binding */ register_url),
/* harmony export */   "gamelog": () => (/* binding */ gamelog),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "waitForKeyElements": () => (/* binding */ waitForKeyElements)
/* harmony export */ });
/*
register_fetch(pattern, callback)
register_url(pattern, load_func, unload_func)
gamelog.send(data)
gamelog.listen(callback)
waitForKeyElements(selectorOrFunction, callback, waitOnce, iframeSelector, interval, maxIntervals)
*/
// import { $, jQuery } from 'jquery';

// import _ from "lodash";

// const merge = require('lodash/merge');
// module.exports = window

// window["bc_globals"] = {};
var globals = {};

(function () {
    var scriptString = (function () {
        //
        // fetch proxy
        //
        function extend(fetch, middleware) {
            if (!middleware || middleware.length < 1) {
                return fetch;
            }
            var innerFetch = middleware.length === 1 ? fetch : extend(fetch, middleware.slice(1));
            var next = middleware[0];
            return function extendedFetch(url, options) {
                // ensure options is always an object
                try {
                    return Promise.resolve(next(url, options || {}, innerFetch));
                } catch (err) {
                    return Promise.reject(err);
                }
            };
        }

        function isObject(obj) {
            return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
        }

        function mergePair(target, source) {
            if (!isObject(target) || !isObject(source)) {
                return source;
            }
            for (var name in source) {
                if (source.hasOwnProperty(name)) {
                    var sourceValue = source[name];
                    var targetValue = target[name];
                    if (isObject(targetValue) && isObject(sourceValue)) {
                        mergePair(targetValue, sourceValue);
                    } else {
                        target[name] = source[name];
                    }
                }
            }
            return target;
        }

        function merge(target) {
            var output = target;
            var sources = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < sources.length; i++) {
                output = mergePair(output, sources[i]);
            }
            return output;
        }
        extend.merge = merge;

        function receiveJSON(receiveOptions) {
            return function (url, options, fetch) {
                // ask for json
                var patchedOptions = receiveOptions && receiveOptions.acceptHeader ?
                    setHttpHeaders(options, {
                        'Accept': 'application/json'
                    }) : options;
                console.log(url, patchedOptions);
                if (patchedOptions.returnRawResult) {
                    return fetch(url, patchedOptions);
                }
                return fetch(url, patchedOptions).then(function (result) {
                    let cloneResult = result.clone();

                    function resultTextHandler(text) {
                        var body = text;
                        if (text === undefined || text === null || text === '') {
                            body = undefined;
                        } else if (/application\/json/.test(result.headers.get('content-type'))) {
                            body = JSON.parse(text);
                        }
                        let fetch_proxies = document.querySelectorAll('fetch_proxy_url');
                        fetch_proxies.forEach(proxy_div => {
                            let regex = new RegExp(proxy_div.innerHTML);
                            if (regex.test(url)) {
                                body._BC_pattern = proxy_div.innerHTML;
                                window.postMessage(body, document.URL);
                            }
                        })
                        if (result.ok) {
                            return cloneResult;
                        }
                        // http error, promise fail
                        var err = new Error('http error ' + result.status + ': ' + result.statusText);
                        err.fetchResult = result;
                        err.status = result.status;
                        err.body = body;
                        throw err;
                    }

                    if (!result || typeof result.text !== 'function') {
                        return resultTextHandler();
                    }

                    return result.text().then(resultTextHandler);
                });
            };
        }
        fetch = extend(fetch, [receiveJSON()]);

        //
        // WebSocket Proxy
        //

        if (window.Proxy == undefined) return;
        var oldWS = window.WebSocket;
        var loggerIncrement = 1;
        var proxyDesc = {
            set: function (target, prop, val) {
                if (prop == 'onmessage') {
                    var oldMessage = val;
                    val = function (e) {
                        oldMessage(e);
                    };
                }
                return target[prop] = val;
            },
            get: function (target, prop) {
                var val = target[prop];
                if (prop == 'send') {
                    val = function (data) {
                        try {
                            let obj = JSON.parse(data);
                            console.debug(`BC: WebSocket #${target.WSLoggerId} >> `, obj);
                        } catch (e) {
                            console.debug(`BC: WebSocket #${target.WSLoggerId} >> `, data);
                        }
                        target.send(data);
                    }
                } else if (typeof val == 'function') {
                    val = val.bind(target);
                }
                return val;
            }
        };
        WebSocket = new Proxy(oldWS, {
            construct: function (target, args, newTarget) {
                var obj = new target(args[0]);
                let globalMessage = {
                    setGlobals: true,
                    globals: {},
                }
                let userId_arr = args[0].match(/userId=(\d*)/);
                if (userId_arr && userId_arr.length == 2) {
                    globalMessage.globals.userId = userId_arr[1];
                };
                let gameId_arr = args[0].match(/gameId=(\d*)/);
                if (gameId_arr && gameId_arr.length == 2) {
                    globalMessage.globals.gameId = gameId_arr[1];
                };
                window.postMessage(globalMessage, Document.URL);
                obj.WSLoggerId = loggerIncrement++;
                window.bc_gamelog_ws = obj;
                obj.addEventListener("message", function (event) {
                    try {
                        let message = JSON.parse(event.data);
                        message.gamelogReceive = true;
                        window.postMessage(message, Document.URL);
                    } catch (e) { }
                });
                return new Proxy(obj, proxyDesc);
            }
        });
        window.addEventListener("message", function (event) {
            if (event.data.hasOwnProperty("gamelogSend")) {
                console.log("page send:", event.data)
                delete event.data.gamelogSend;
                window.bc_gamelog_ws.send(JSON.stringify(event.data));
            }
        });
    });

    //
    // Inject html for WebSocket/fetch proxies
    //
    var observer = new MutationObserver(function () {
        if (document.head) {
            observer.disconnect();
            $("<script>").text('(' + scriptString + ')();').appendTo(document.head);
            register_fetch.callbacks.forEach(proxy_url => {
                if (proxy_url.domObj.parentNode == null) {
                    proxy_url.domObj.appendTo(document.head);
                }
            })
        }
    });
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    //
    // On window load, set up observer for URL changes 
    //
    var ci_observer = new MutationObserver(url_changed);
    window.addEventListener('load',
        function () {
            url_changed();
            ci_observer.observe($(document.body)[0], {
                childList: true,
            });
        }, false);

    var prev_url = "";
    function url_changed() {
        if (document.URL == prev_url) {
            return;
        } else {
            console.debug("BC: New URL: ", document.URL);
            if (register_url.callbacks) {
                register_url.callbacks.forEach(url => {
                    if (url.regex.test(prev_url)) {
                        url.unload();
                    }
                    if (url.regex.test(document.URL)) {
                        url.load();
                    }
                });
            }
            prev_url = document.URL;
        }
    }

})();

//  
// Register fetch callbacks
//
function register_fetch(pattern, callback) {
    if (typeof register_fetch.callbacks === 'undefined') {
        register_fetch.callbacks = [];
        window.addEventListener("message", function (event) {
            if (event.data.hasOwnProperty("_BC_pattern")) {
                register_fetch.callbacks.forEach(proxy_url => {
                    if (event.data._BC_pattern == proxy_url.pattern) {
                        proxy_url.callback(event.data);
                    }
                })
            }
        });
    }
    let domObj = $("<fetch_proxy_url>").text(pattern);
    register_fetch.callbacks.push({
        pattern: pattern,
        callback: callback,
        domObj: domObj
    });
    if (document.head) {
        domObj.appendTo(domObj);
    }
}

register_fetch("https://auth-service.dndbeyond.com/v1/cobalt-token", function (data) {
    globals.cobalt_token = data.token;
});

//
// Register callbacks for URL changes
//
function register_url(pattern, load_func, unload_func) {
    if (typeof register_url.callbacks === 'undefined') {
        register_url.callbacks = [];
    }
    register_url.callbacks.push({
        regex: new RegExp(pattern),
        load: load_func,
        unload: unload_func
    });
}

var gamelog = {
    callbacks: [],
    send: function (data) {
        data.gamelogSend = true;
        console.log("BC gamelog.send:", data);
        window.postMessage(data, Document.URL);
    },
    listen: function (fn) {
        gamelog.callbacks.push(fn);
    },
    receive: function (event) {
        if (event.data.hasOwnProperty("gamelogReceive")) {
            delete event.data.gamelogReceive;
            gamelog.callbacks.forEach(fn => fn(event.data));
        }
    }
}
window.addEventListener("message", gamelog.receive);

window.addEventListener("message", (event) => {
    if (event.data.hasOwnProperty("setGlobals")) {
        Object.entries(event.data.globals).forEach(([k, v]) => {
            globals[k] = v;
        });
    }
});



function extend(fetch, middleware) {
    if (!middleware || middleware.length < 1) {
        return fetch;
    }
    var innerFetch = middleware.length === 1 ? fetch : extend(fetch, middleware.slice(1));
    var next = middleware[0];
    return function extendedFetch(url, options) {
        // ensure options is always an object
        try {
            return Promise.resolve(next(url, options || {}, innerFetch));
        } catch (err) {
            return Promise.reject(err);
        }
    };
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

function mergePair(target, source) {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }
    for (var name in source) {
        if (source.hasOwnProperty(name)) {
            var sourceValue = source[name];
            var targetValue = target[name];
            if (isObject(targetValue) && isObject(sourceValue)) {
                mergePair(targetValue, sourceValue);
            } else {
                target[name] = source[name];
            }
        }
    }
    return target;
}

function merge(target) {
    var output = target;
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < sources.length; i++) {
        output = mergePair(output, sources[i]);
    }
    return output;
}
extend.merge = merge;



//
// Mashup of:
//     https://gist.github.com/BrockA/2625891
//     https://github.com/CoeJoder/waitForKeyElements.js
//
function waitForKeyElements(selectorOrFunction, callback, options) {
    let defaults = {
        waitOnce: true,
        iframeSelector: false,
        interval: 500,
        maxIntervals: 30,
        foundAttr: "wfke-alreadyFound",
    }
    let opt = Object.assign(defaults, options);
    // merge(opt, options);
    let targetNodes;
    if (typeof selectorOrFunction === "function") {
        targetNodes = selectorOrFunction();
        if (targetNodes === true) {
            callback();
            return;
        }
    } else {
        if (opt.iframeSelector) {
            targetNodes = $(opt.iframeSelector).contents().find(selectorOrFunction);
        } else {
            targetNodes = $(selectorOrFunction);
        }
    }
    let targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.each(function (key, target) {
            let target_obj = $(target);
            if (!target_obj.attr(opt.foundAttr)) {
                target_obj.attr(opt.foundAttr, true);
                callback(target_obj);
            }
        });
    }
    if (opt.maxIntervals !== 0 && !(targetsFound && opt.waitOnce)) {
        opt.maxIntervals -= 1;
        setTimeout(function () {
            waitForKeyElements(selectorOrFunction, callback, opt);
        }, opt.interval);
    } else if (opt.maxIntervals <= 0) {
        console.log("waitForKeyElements timeout:",
            selectorOrFunction, callback, opt.iframeSelector);
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./src/character.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init.js */ "./src/init.js");
/* harmony import */ var _sifrr_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sifrr/storage */ "./node_modules/@sifrr/storage/dist/sifrr.storage.min.js");



console.log("character.js: start", document.URL);

// Grab the character id from URL
let characterId_arr = document.URL.match(/https:\/\/www.dndbeyond.com\/profile\/.*\/characters\/(\d*)/);
if (characterId_arr && characterId_arr.length == 2) {
    _init_js__WEBPACK_IMPORTED_MODULE_0__.globals.characterId = characterId_arr[1];
};

// Wait for auth token, then request character json
(0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(() => {
    return (_init_js__WEBPACK_IMPORTED_MODULE_0__.globals.cobalt_token != undefined) && (_init_js__WEBPACK_IMPORTED_MODULE_0__.globals.characterId != undefined);
}, () => {
    // fetch(
    //     "https://character-service.dndbeyond.com/character/v5/character/" + globals.characterId, {
    //     method: "GET",
    //     cache: "no-cache",
    //     credentials: "include",
    //     headers: {
    //         "Authorization": "Bearer " + globals.cobalt_token
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => {
    //         parse_json(json.data);
    //     });
}, {
    interval: 2000,
    maxIntervals: 30,
});

var db = _sifrr_storage__WEBPACK_IMPORTED_MODULE_1__.Sifrr.Storage.getStorage({
    priority: ['indexeddb', 'websql', 'localstorage', 'cookies', 'jsonstorage'],
    name: "characters",
    version: 1, // version number (integer / float / string), 1 is treated same as '1'
    desciption: 'Beyond Campaigns webextension storage',
    size: 5 * 1024 * 1024, // Max db size in bytes only for websql (integer)
    ttl: 0 // Time to live/expire for data in table (in ms), 0 = forever
});
var character = null;

// Wait for dom load then extract
(0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(() => {
    let race_targets = $(".ddbc-character-summary__race");
    let avatar_targets = $(".ddbc-character-avatar__portrait");
    return avatar_targets.add(race_targets);
}, () => {
    character = parse_dom();
    db.set(character.id, { value: character });
}, {
    interval: 2000,
    maxIntervals: 30,
    foundAttr: "wfke-found-character",
});

function parse_json(data) {
    let lastUpdate = Date.parse(data.dateModified);
    // data.temporaryHitPoints;
    // data.overrideHitPoints;
    // data.bonusHitPoints;
    // data.baseHitPoints;
    // data.removedHitPoints;
}

function parse_dom() {
    let character = {
        id: _init_js__WEBPACK_IMPORTED_MODULE_0__.globals.characterId,
        name: $(".ddbc-character-name").text(),
        level: $(".ddbc-character-progression-summary__level").text().slice(6),
        race: $(".ddbc-character-summary__race").text(),
        class: $(".ddbc-character-summary__classes").text(),
        url: document.URL,
        last_update: Date.now().toString()
    };
    console.log("chracter.js: no avatar elements:", $(".ddbc-character-avatar__portrait"));
    console.log("chracter.js: background-image:", $(".ddbc-character-avatar__portrait").css("background-image"));

    let avatar_jq = $(".ddbc-character-avatar__portrait");
    let avatar_background_image = avatar_jq.css("background-image");
    if(avatar_background_image){
        character.avatar_url = ($(".ddbc-character-avatar__portrait").css("background-image").match(/(https.*)\?/))[1];
    }else{
        console.log("chracter.js: no avatar elements:", avatar_jq);
    }

    let stats = {};
    $(".ddbc-ability-summary").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-ability-summary__abbr").text()
        stats[stat_name] = {
            name: stat_name,
            full_name: obj.find(".ddbc-ability-summary__label").text(),
            value: obj.find(".ddbc-ability-summary__secondary").text(),
            modifier: obj.find(".ddbc-ability-summary__primary").text(),
        }
    })
    character.stats = stats;

    let saves = {};
    $(".ddbc-saving-throws-summary__ability").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-saving-throws-summary__ability-name").text()
        saves[stat_name] = {
            name: stat_name,
            modifier: obj.find(".ddbc-saving-throws-summary__ability-modifier").text(),
        }
    })
    $(".ct-dice-adjustment-summary"); // TODO Talash has Adv on wis saves... figure it out
    character.saves = saves;

    let skills = {};
    $(".ct-skills__item").each(function () {
        let obj = $(this);
        let skill_name = obj.find(".ct-skills__col--skill").text();
        let adjustment = obj.find(".ct-skills__adjustment[data-original-title]").attr("data-original-title");
        skills[skill_name.toLowerCase()] = {
            name: skill_name,
            stat: obj.find(".ct-skills__col--stat").text().toLowerCase(),
            modifier: obj.find(".ct-skills__col--modifier").text(),
            adjustment: adjustment || "",
        }
    });
    character.skills = skills;

    let defenses = {
        "resistance": [],
        "immunity": [],
        "vulnerability": []
    };
    $(".ct-defenses-summary__defense ").each(function () {
        let obj = $(this);
        let defense_type = obj.parent().prev().children().attr("data-original-title");
        let damage_type = obj.text();
        defenses[defense_type.toLowerCase()].push(damage_type);
    })
    character.defenses = defenses;

    let conditions = [];
    $(".ddbc-condition__name").each(function () {
        conditions.push($(this).text());
    });
    character.conditions = conditions;

    character.passives = {
        perception: $("div.ct-senses__callout-label:contains('Passive WIS (Perception)')").prev().text(),
        investigation: $("div.ct-senses__callout-label:contains('Passive INT (Investigation')").prev().text(),
        insight: $("div.ct-senses__callout-label:contains('Passive WIS (Insight)')").prev().text(),
        senses: $("ct-senses__summary").text(),
    };

    character.health = {
        hp_current: $("div.ct-health-summary__hp-item-label:contains('Current') + .ct-health-summary__hp-item-content").text(),
        hp_max: $("div.ct-health-summary__hp-item-label:contains('Max') + .ct-health-summary__hp-item-content").text(),
        hp_temp: $("div.ct-health-summary__hp-item-label:contains('Temp') + .ct-health-summary__hp-item-content").text(),
    };

    character.core = {
        ac: $(".ddbc-armor-class-box__value").text(),
        initiative: $(".ct-initiative-box__value").text(),
        speed: $(".ct-speed-box__box-value").find(".ddbc-distance-number__number").text(),
        languages: $(".ct-proficiency-groups__group-label:contains('Languages')").next().text(),
    }

    return character;
}

})();

/******/ })()
;