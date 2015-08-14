/*!
* Qoopido.js library
*
* version: 3.7.4
* date:    2015-08-14
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition, global, undefined) {
    "use strict";
    function register(id, definition, dependencies, callback) {
        var namespace = id.split("/"), initialize;
        if (modules[id]) {
            return modules[id];
        }
        initialize = function() {
            if (dependencies) {
                var path = namespace.slice(0, -1).join("/"), i = 0, dependency, internal;
                for (;(dependency = dependencies[i]) !== undefined; i++) {
                    internal = isInternal.test(dependency);
                    if (internal) {
                        dependency = canonicalize(path + "/" + dependency);
                    }
                    if (!modules[dependency] && arguments[i]) {
                        modules[dependency] = arguments[i];
                    }
                    if (internal && !modules[dependency] && typeof console !== "undefined") {
                        console.error("".concat("[Qoopido.js] ", id, ": Could not load dependency ", dependency));
                    }
                }
            }
            modules[id] = definition(modules, shared, global, undefined);
            if (callback) {
                callback(modules[id]);
            }
            return modules[id];
        };
        if (typeof module !== "undefined" && module.exports) {
            module.exports = define(initialize);
        } else if (typeof define === "function" && define.amd) {
            dependencies ? define(dependencies, initialize) : define(initialize);
        } else {
            initialize();
        }
    }
    function registerSingleton(id, definition, dependencies) {
        register(id, definition, dependencies, function(module) {
            modules[id] = module.create();
        });
    }
    var qoopido = global.qoopido || (global.qoopido = {}), shared = qoopido.shared || (qoopido.shared = {}), modules = qoopido.modules || (qoopido.modules = {}), dependencies = [], isInternal = new RegExp("^\\.+\\/"), regexCanonicalize = new RegExp("(?:\\/|)[^\\/]*\\/\\.\\."), removeNeutral = new RegExp("(^\\/)|\\.\\/", "g");
    qoopido.register = register;
    qoopido.registerSingleton = registerSingleton;
    function canonicalize(path) {
        var collapsed;
        while ((collapsed = path.replace(regexCanonicalize, "")) !== path) {
            path = collapsed;
        }
        return path.replace(removeNeutral, "");
    }
    if (!Object.create) {
        dependencies.push("./polyfill/object/create");
    }
    if (!Object.getOwnPropertyNames) {
        dependencies.push("./polyfill/object/getownpropertynames");
    }
    if (!Object.getOwnPropertyDescriptor || !function() {
        try {
            Object.getOwnPropertyDescriptor({
                x: 0
            }, "x");
            return true;
        } catch (exception) {
            return false;
        }
    }()) {
        dependencies.push("./polyfill/object/getownpropertydescriptor");
    }
    register("base", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    function getOwnPropertyDescriptors(object) {
        var descriptors = {}, properties = Object.getOwnPropertyNames(object), i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
            descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
        }
        return descriptors;
    }
    function prohibitCall() {
        throw new Error("[Qoopido.js] Operation prohibited");
    }
    return {
        create: function() {
            var instance = Object.create(this, getOwnPropertyDescriptors(this)), result;
            if (instance._constructor) {
                result = instance._constructor.apply(instance, arguments);
            }
            instance.create = instance.extend = prohibitCall;
            return result || instance;
        },
        extend: function(properties, final) {
            var instance;
            properties = properties || {};
            final = final === true;
            properties._parent = this;
            instance = Object.create(this, getOwnPropertyDescriptors(properties));
            if (final === true) {
                instance.extend = prohibitCall;
            }
            return instance;
        }
    };
}, this);
(function(definition, global) {
    var dependencies = [];
    if (!global.getComputedStyle) {
        dependencies.push("polyfill/window/getcomputedstyle");
    }
    if (!Array.prototype.indexOf) {
        dependencies.push("../array/indexof");
    }
    global.qoopido.register("polyfill/window/matchmedia", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var identifier = "qoopidoPolyfillWindowMatchmedia", document = global.document, viewport = document.documentElement, queries = [], lookup = {}, features = {}, regex = {
        type: /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,
        media: /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/
    }, timeout;
    function detectFeatures() {
        var ww = global.innerWidth || viewport.clientWidth, wh = global.innerHeight || viewport.clientHeight, dw = global.screen.width, dh = global.screen.height, cd = global.screen.colorDepth, pr = global.devicePixelRatio;
        features["width"] = ww;
        features["height"] = wh;
        features["aspect-ratio"] = (ww / wh).toFixed(2);
        features["color"] = cd;
        features["color-index"] = Math.pow(2, cd);
        features["device-aspect-ratio"] = (dw / dh).toFixed(2);
        features["device-height"] = dh;
        features["device-width"] = dw;
        features["device-pixel-ratio"] = pr || 1;
        features["resolution"] = pr && pr * 96 || global.screen.deviceXDPI || 96;
        features["orientation"] = wh >= ww ? "portrait" : "landscape";
    }
    function createQuery(query) {
        var mql = {
            matches: false,
            media: query,
            addListener: function addListener(listener) {
                listener && listeners.push(listener);
            },
            removeListener: function removeListener(listener) {
                var i = 0, pointer;
                for (;(pointer = listeners[i]) !== undefined; i++) {
                    if (pointer === listener) {
                        listeners.splice(i, 1);
                    }
                }
            }
        }, index, listeners;
        if (query === "") {
            mql.matches = true;
        } else {
            mql.matches = checkQueryMatch(query);
        }
        queries.push({
            mql: mql,
            listeners: []
        });
        index = queries.length - 1;
        lookup[query] = index;
        listeners = queries[index].listeners;
        return mql;
    }
    function checkQueryMatch(query) {
        var mql = query.indexOf(",") !== -1 && query.split(",") || [ query ], mqIndex = mql.length - 1, mqLength = mqIndex, mq = null, negateType = null, negateTypeFound = "", negateTypeIndex = 0, negate = false, type = "", exprListStr = "", exprList = null, exprIndex = 0, exprLength = 0, expr = null, prefix = "", length = "", unit = "", value = "", feature = "", match = false;
        if (query === "") {
            return true;
        }
        do {
            mq = mql[mqLength - mqIndex];
            negate = false;
            negateType = mq.match(regex.type);
            if (negateType) {
                negateTypeFound = negateType[0];
                negateTypeIndex = negateType.index;
            }
            if (!negateType || mq.substring(0, negateTypeIndex).indexOf("(") === -1 && (negateTypeIndex || !negateType[3] && negateTypeFound !== negateType.input)) {
                match = false;
                continue;
            }
            exprListStr = mq;
            negate = negateType[1] === "not";
            if (!negateTypeIndex) {
                type = negateType[2];
                exprListStr = mq.substring(negateTypeFound.length);
            }
            match = type === features.type || type === "all" || type === "";
            exprList = exprListStr.indexOf(" and ") !== -1 && exprListStr.split(" and ") || [ exprListStr ];
            exprIndex = exprList.length - 1;
            exprLength = exprIndex;
            if (match && exprIndex >= 0 && exprListStr !== "") {
                do {
                    expr = exprList[exprIndex].match(regex.media);
                    if (!expr || !features[expr[3]]) {
                        match = false;
                        break;
                    }
                    prefix = expr[2];
                    length = expr[5];
                    value = length;
                    unit = expr[7];
                    feature = features[expr[3]];
                    if (unit) {
                        if (unit === "px") {
                            value = Number(length);
                        } else if (unit === "em" || unit === "rem") {
                            value = 16 * length;
                        } else if (expr[8]) {
                            value = (length / expr[8]).toFixed(2);
                        } else if (unit === "dppx") {
                            value = length * 96;
                        } else if (unit === "dpcm") {
                            value = length * .3937;
                        } else {
                            value = Number(length);
                        }
                    }
                    if (prefix === "min-" && value) {
                        match = feature >= value;
                    } else if (prefix === "max-" && value) {
                        match = feature <= value;
                    } else if (value) {
                        match = feature === value;
                    } else {
                        match = !!feature;
                    }
                    if (!match) {
                        break;
                    }
                } while (exprIndex--);
            }
            if (match) {
                break;
            }
        } while (mqIndex--);
        return negate ? !match : match;
    }
    function delayedOnResize() {
        var match = false, i = 0, j = 0, query, listener;
        if (queries.length > 0) {
            detectFeatures();
            for (;(query = queries[i]) !== undefined; i++) {
                match = checkQueryMatch(query.mql.media);
                if (match && !query.mql.matches || !match && query.mql.matches) {
                    query.mql.matches = match;
                    if (query.listeners) {
                        for (;(listener = query.listeners[j]) !== undefined; j++) {
                            listener.call(global, query.mql);
                        }
                    }
                }
            }
        }
    }
    function delayOnResize() {
        global.clearTimeout(timeout);
        timeout = global.setTimeout(delayedOnResize, 10);
    }
    function initialize() {
        var target = document.getElementsByTagName("script")[0], style = document.createElement("style"), types = [ "screen", "print", "speech", "projection", "handheld", "tv", "braille", "embossed", "tty" ], cssText = "#" + identifier + " { position: relative; z-index: 0; }", prefix = "", addListener = global.addEventListener || (prefix = "on") && global.attachEvent, i = 0, pointer;
        style.type = "text/css";
        style.id = identifier;
        target.parentNode.insertBefore(style, target);
        for (;(pointer = types[i]) !== undefined; i++) {
            cssText += "@media " + pointer + " { #" + identifier + " { position: relative; z-index: " + i + " } }";
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = cssText;
        } else {
            style.textContent = cssText;
        }
        features.type = types[(global.getComputedStyle || modules["polyfill/window/getcomputedstyle"])(style).zIndex * 1 || 0];
        style.parentNode.removeChild(style);
        addListener(prefix + "resize", delayOnResize);
        addListener(prefix + "orientationchange", delayOnResize);
    }
    if (!global.matchMedia) {
        initialize();
        detectFeatures();
        global.matchMedia = function(query) {
            var index = lookup[query] || false;
            if (index === false) {
                return createQuery(query);
            } else {
                return queries[index].mql;
            }
        };
    }
    return global.matchMedia;
}, this);
(function(definition, global) {
    global.qoopido.register("emitter", definition, [ "./base" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var excludeMethods = /^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;
    function map(context, method) {
        var event = method.charAt(0).toUpperCase() + method.slice(1);
        context._mapped[method] = context[method];
        return function() {
            var args = Array.prototype.slice.call(arguments), returnValue;
            context.emit.apply(context, [ "pre" + event, args ]);
            returnValue = context._mapped[method].apply(context, args);
            context.emit.apply(context, [ "post" + event, args, returnValue ]);
            return returnValue;
        };
    }
    return modules["base"].extend({
        _mapped: null,
        _listener: null,
        _temp: null,
        _constructor: function() {
            var self = this, method;
            self._mapped = {};
            self._listener = {};
            for (method in self) {
                if (typeof self[method] === "function" && excludeMethods.test(method) === false) {
                    self[method] = map(self, method);
                }
            }
            return self;
        },
        on: function(events, fn) {
            var self = this, i = 0, event;
            events = events.split(" ");
            for (;(event = events[i]) !== undefined; i++) {
                (self._listener[event] = self._listener[event] || []).push(fn);
            }
            return self;
        },
        one: function(events, fn, each) {
            each = each !== false;
            var self = this;
            self.on(events, function listener(event) {
                self.off(each === true ? event : events, listener);
                fn.apply(this, arguments);
            });
            return self;
        },
        off: function(events, fn) {
            var self = this, i = 0, event, j, listener;
            if (events) {
                events = events.split(" ");
                for (;(event = events[i]) !== undefined; i++) {
                    self._listener[event] = self._listener[event] || [];
                    if (fn) {
                        for (j = 0; (listener = self._listener[event][j]) !== undefined; j++) {
                            if (listener === fn) {
                                self._listener[event].splice(j, 1);
                                j--;
                            }
                        }
                    } else {
                        self._listener[event].length = 0;
                    }
                }
            } else {
                for (event in self._listener) {
                    self._listener[event].length = 0;
                }
            }
            return self;
        },
        emit: function(event) {
            var self = this, i = 0, listener;
            if (event !== undefined) {
                self._listener[event] = self._listener[event] || [];
                self._temp = self._listener[event].slice();
                for (;(listener = self._temp[i]) !== undefined; i++) {
                    listener.apply(self, arguments);
                }
                self._temp.length = 0;
            }
            return self;
        }
    });
}, this);
(function(definition, global) {
    var dependencies = [ "../emitter" ];
    if (!global.matchMedia) {
        dependencies.push("../polyfill/window/matchmedia");
    }
    global.qoopido.register("component/sense", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var prototype, queries = {};
    function onQueryStateChange() {
        var self = this, mql = self.mql;
        if (mql.matches === true) {
            self.emit("matched");
        } else {
            self.emit("dematched");
        }
    }
    prototype = modules["emitter"].extend({
        mql: null,
        _constructor: function(query) {
            var self = prototype._parent._constructor.call(this), mql = self.mql = queries[query] || (queries[query] = global.matchMedia(query)), listener = function() {
                onQueryStateChange.call(self);
            };
            mql.addListener(listener);
            global.setTimeout(listener, 0);
            return self;
        },
        matches: function() {
            return this.mql.matches;
        }
    });
    return prototype;
}, this);
(function(definition, global) {
    global.qoopido.registerSingleton("component/remux", definition, [ "../emitter", "./sense" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var prototype, html = document.getElementsByTagName("html")[0], base = 16, state = {
        fontsize: null,
        layout: null,
        ratio: {}
    }, current = {
        fontsize: null,
        layout: null
    };
    function updateState(layout, fontsize) {
        var self = this;
        if (layout && fontsize) {
            html.className = layout;
            html.style.fontSize = fontsize + "px";
            state.layout = layout;
            state.fontsize = fontsize;
            if (current.fontsize !== state.fontsize || current.layout !== state.layout) {
                state.ratio.device = global.devicePixelRatio || 1;
                state.ratio.fontsize = state.fontsize / base;
                state.ratio.total = state.ratio.device * state.ratio.fontsize;
                if (current.layout !== state.layout) {
                    self.emit("layoutchanged", state);
                }
                if (current.fontsize !== state.fontsize) {
                    self.emit("fontsizechanged", state);
                }
                self.emit("statechanged", state);
                current.fontsize = state.fontsize;
                current.layout = state.layout;
            }
        }
        return self;
    }
    function addQuery(query, layout, fontsize) {
        var self = this;
        global.setTimeout(function() {
            modules["component/sense"].create(query).on("matched", function() {
                updateState.call(self, layout, fontsize);
            });
        }, 0);
    }
    prototype = modules["emitter"].extend({
        _constructor: function() {
            var self = prototype._parent._constructor.call(this), pBase = parseInt(html.getAttribute("data-base"), 10);
            if (isNaN(pBase) === false) {
                base = pBase;
            }
            return self;
        },
        getState: function() {
            return state;
        },
        getLayout: function() {
            return state.layout;
        },
        getFontsize: function() {
            return state.fontsize;
        },
        setLayout: function(layout, fontsize) {
            var self = this;
            updateState.call(self, layout, fontsize);
            return self;
        },
        addLayout: function(pId, pLayout) {
            var self = this, parameter, id, layout, size, min, max, lMin, lMax;
            if (arguments.length > 1) {
                parameter = {};
                parameter[pId] = pLayout;
            } else {
                parameter = arguments[0];
            }
            for (id in parameter) {
                layout = parameter[id];
                for (size = layout.min; size <= layout.max; size++) {
                    lMin = Math.round(layout.width * (size / base));
                    lMax = Math.round(layout.width * ((size + 1) / base)) - 1;
                    addQuery.call(self, "screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px )", id, size);
                    min = !min || lMin < min.width ? {
                        width: lMin,
                        fontsize: size,
                        layout: id
                    } : min;
                    max = !max || lMax >= max.width ? {
                        width: lMax,
                        fontsize: size,
                        layout: id
                    } : max;
                }
            }
            addQuery.call(self, "screen and (max-width: " + (min.width - 1) + "px)", min.layout, min.fontsize);
            addQuery.call(self, "screen and (min-width: " + (max.width + 1) + "px)", max.layout, max.fontsize);
            return self;
        }
    });
    return prototype;
}, this);