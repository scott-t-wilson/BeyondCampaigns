/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/init.js":
/*!*********************!*\
  !*** ./src/init.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/combat.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./init.js */ "./src/init.js");

var map_url = "https://gamescape.app/maps"


var encounter_id;
(function () {
    encounter_id = uuid_from_url(document.URL);
    console.log("encounter_id:", encounter_id);
}());

function uuid_from_url(url){
    let uuid = null;
    let arr = url.match(/.*\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/);
    if (arr && arr.length == 2) {
        uuid = arr[1];
    }
    return uuid;
}

/******************************************************************************
 * 
 * REGISTER URL https://www.dndbeyond.com/combat-tracker/<uuid>
 *
******************************************************************************/
(0,_init_js__WEBPACK_IMPORTED_MODULE_0__.register_url)(
    "https://www.dndbeyond.com/combat-tracker/.*$",
    function load() {
        encounter_id = uuid_from_url(document.URL);
        console.log("register_url load:", encounter_id);
        clean_combat_tracker();
    },
    function unload() {
        console.log("BC: unloading campaign");
    }
);

var clean_combat_tracker = function(){
    console.log("Character Info: combat tracker loaded");
    // waitForKeyElements(".out-of-combat", label_characters);
    // waitForKeyElements(".in-combat", label_characters, true, false, 500, -1);
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".header-wrapper", function(obj){obj.hide();});
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".release-indicator", function(obj){obj.hide();});
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)("footer", function(obj){obj.hide();});
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".ddb-page-header", function(obj){
      obj.css("padding", "0");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".ddb-page-header__title", function(obj){
      obj.css("margin-bottom", "0");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".ddb-page-header__breadcrumbs", function(obj){
      obj.css("margin-bottom", "0");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".combat-tracker__combatants", function(obj){
      obj.addClass("gm_combat-tracker__combatants");
      obj.css("width", "500px");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".combat-tracker-page__combat-tracker", function(obj){
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "600px");
    });
        (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".combat-tracker-page", function(obj){
        obj.css("max-width", "100%");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".combat-tracker-page__content", function(obj){
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "100%");
        obj.css("posistion", "sticky");
        obj.css("display", "flex");
        obj.css("flex-direction", "column");
        obj.css("overflow-y", "scroll");
        console.log("adding change");
        obj.on("change", function(){
        console.log("change");
      });
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".container", function(obj){
        obj.css("margin", "0 25px 0 25px");
        obj.css("max-width", "initial");
    });
    (0,_init_js__WEBPACK_IMPORTED_MODULE_0__.waitForKeyElements)(".ddb-page-header__controls", function(obj){
        obj.prepend($("<div class='ddbeb-button'>Map</div>").on("click", toggle_map));
    });
}

})();

/******/ })()
;