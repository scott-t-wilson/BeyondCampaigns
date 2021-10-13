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
export var globals = {};

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
                            body["_BC_url"] = url;
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
export function register_fetch(pattern, callback) {
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
export function register_url(pattern, load_func, unload_func) {
    if (typeof register_url.callbacks === 'undefined') {
        register_url.callbacks = [];
    }
    register_url.callbacks.push({
        regex: new RegExp(pattern),
        load: load_func,
        unload: unload_func
    });
}

export var gamelog = {
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

export function merge(target) {
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
export function waitForKeyElements(selectorOrFunction, callback, options) {
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

function update_character_vitals(character_id) {
    console.log("update_character_vitals");
    fetch(
        `https://character-service.dndbeyond.com/character/v5/character/${character_id}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + globals.cobalt_token
        }
    })
        .then(response => {
            return response.json();
        })
        .then(json => {
            console.log("update_character_vitals json:", json);
            // json.baseHitPoints
            // json.bonusHitPoints
            // json.temporaryHitPoints
        })
}


/******************************************************************************
 * 
 * REGISTER GAMELOG CHARACTER UPDATES
 * 
******************************************************************************/
gamelog.listen(function (json) {
    if (json.gameId == globals.gameId &&
        json.entityType == "character" &&
        json.eventType == "character-sheet/character-update/fulfilled"
    ) {
        console.log("character update, id:", json.entityId);
        update_character_vitals(json.entityId);
    }
});

/******************************************************************************
 * 
 * REGISTER GAMELOG ROLLS
 * 
******************************************************************************/
gamelog.listen(function (json) {
    // <div>Zach McShort|Unarmed Strike|to hit||1d20+4|5</div>
    // <div>Zach McShort|Crossbow, Light|damage||1d8|1</div>
    // <div>Zach McShort|Mace|damage||1d6+2|6</div>
    // <div>Zach McShort|con|save||1d20+5|6</div>
    // <div>Zach McShort|con|save|advantage|2d20kh1+5|19</div>
    // <div>Zach McShort|Stealth|check||1d20|9</div>
    // <div>Zach McShort|Stealth|check|disadvantage|2d20kl1|3</div>
    let gamelog_div = $(".bc-gamelog");
    console.log("gamelog:", json);
    if (gamelog_div.length > 0 && json.eventType == "dice/roll/fulfilled") {
        // json.dateTime
        // "dateTime": "1627510266612",
        //  ${json.data.context.name}|${json.data.action}|${json.data.rolls[0].rollType}|${json.data.rolls[0].rollKind}|${json.data.rolls[0].diceNotationStr}|${json.data.rolls[0].result.text}|${json.data.rolls[0].result.total}</div>`
        let entry = $(gamelog_template_html);
        $(".bc-gamelog").append(entry);
        entry.find(".bc-gamelog-name").text(json.data.context.name);
        if (json.data.rolls[0].rollKind == "advantage") {
            entry.find(".bc-icon-inline").attr("adjustment", "Advantage");
        }
        if (json.data.rolls[0].rollKind == "disadvantage") {
            entry.find(".bc-icon-inline").attr("adjustment", "Disadvantage");
        }
        entry.find(".bc-gamelog-roll-action").text(json.data.action);
        entry.find(".bc-gamelog-roll-type").text(json.data.rolls[0].rollType);
        entry.find(".bc-gamelog-result-total").text(json.data.rolls[0].result.total);
        entry.find(".bc-gamelog-dice-notation").text(json.data.rolls[0].diceNotationStr);
        entry.find(".bc-gamelog-detail-text").text(json.data.rolls[0].result.text);
        entry[0].scrollIntoView();
    }
});
  
var gamelog_template_html = `
<div class="bc-gamelog-entry">
    <div class="bc-gamelog-name">Zach McShort</div>
        <div class="bc-icon-inline" adjustment=""></div>
        <div class="bc-gamelog-roll-action">Insight</div>:
        <div class="bc-gamelog-roll-type">check</div>
        <div class="bc-gamelog-result-total">7</div>
    </div>
    <div class="bc-gamelog-entry bc-gamelog-detail">
        <div class="bc-gamelog-dice-notation">1d20+7</div>
        <div class="bc-gamelog-detail-result">
        <div class="bc-gamelog-detail-text">5+7</div>
    </div>
</div>
`