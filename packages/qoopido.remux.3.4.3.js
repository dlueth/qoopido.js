/*!
* Qoopido.js library
*
* version: 3.4.3
* date:    2014-6-11
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/(function(definition, qoopido) {
    if (qoopido.register) {
        qoopido.register("polyfill/object/defineproperty", definition);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/defineproperty"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.defineProperty || !function() {
        try {
            Object.defineProperty({}, "x", {});
            return true;
        } catch (exception) {
            return false;
        }
    }()) {
        var defineProperty = Object.defineProperty, defineGetter = Object.prototype.__defineGetter__, defineSetter = Object.prototype.__defineSetter__;
        Object.defineProperty = function(obj, prop, desc) {
            if (defineProperty) {
                try {
                    return defineProperty(obj, prop, desc);
                } catch (exception) {}
            }
            if (obj !== Object(obj)) {
                throw new TypeError("Object.defineProperty called on non-object");
            }
            if (defineGetter && "get" in desc) {
                defineGetter.call(obj, prop, desc.get);
            }
            if (defineSetter && "set" in desc) {
                defineSetter.call(obj, prop, desc.set);
            }
            if ("value" in desc) {
                obj[prop] = desc.value;
            }
            return obj;
        };
    }
    return Object.defineProperty;
}, window.qoopido = window.qoopido || {});
(function(definition, qoopido) {
    if (qoopido.register) {
        var dependencies = [];
        if (!Object.defineProperty || !function() {
            try {
                Object.defineProperty({}, "x", {});
                return true;
            } catch (exception) {
                return false;
            }
        }()) {
            dependencies.push("./defineproperty");
        }
        qoopido.register("polyfill/object/defineproperties", definition, dependencies);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/defineproperties"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.defineProperties) {
        Object.defineProperties = function(obj, properties) {
            if (obj !== Object(obj)) {
                throw new TypeError("Object.defineProperties called on non-object");
            }
            var name;
            for (name in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, name)) {
                    Object.defineProperty(obj, name, properties[name]);
                }
            }
            return obj;
        };
    }
    return Object.defineProperties;
}, window.qoopido = window.qoopido || {});
(function(definition, qoopido) {
    if (qoopido.register) {
        var dependencies = [];
        if (!Object.defineProperties) {
            dependencies.push("./defineproperties");
        }
        qoopido.register("polyfill/object/create", definition, dependencies);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/create"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.create) {
        Object.create = function(prototype, properties) {
            if (typeof prototype !== "object") {
                throw new TypeError();
            }
            function Constructor() {}
            Constructor.prototype = prototype;
            var obj = new Constructor();
            if (prototype) {
                obj.constructor = Constructor;
            }
            if (arguments.length > 1) {
                if (properties !== Object(properties)) {
                    throw new TypeError();
                }
                Object.defineProperties(obj, properties);
            }
            return obj;
        };
    }
    return Object.create;
}, window.qoopido = window.qoopido || {});
(function(definition, qoopido) {
    if (qoopido.register) {
        qoopido.register("polyfill/object/getownpropertynames", definition);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/getownpropertynames"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function(obj) {
            if (obj !== Object(obj)) {
                throw new TypeError("Object.getOwnPropertyNames called on non-object");
            }
            var props = [], p;
            for (p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    props.push(p);
                }
            }
            return props;
        };
    }
    return Object.getOwnPropertyNames;
}, window.qoopido = window.qoopido || {});
(function(definition, qoopido) {
    if (qoopido.register) {
        qoopido.register("polyfill/object/getownpropertydescriptor", definition);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/getownpropertydescriptor"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
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
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        Object.getOwnPropertyDescriptor = function(obj, property) {
            if (obj !== Object(obj)) {
                throw new TypeError();
            }
            try {
                return getOwnPropertyDescriptor.call(Object, obj, property);
            } catch (exception) {}
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                return {
                    value: obj[property],
                    enumerable: true,
                    writable: true,
                    configurable: true
                };
            }
        };
    }
    return Object.getOwnPropertyDescriptor;
}, window.qoopido = window.qoopido || {});
(function(definition, qoopido, navigator, window, document, undefined) {
    "use strict";
    var shared = qoopido.shared = qoopido.shared || {}, modules = qoopido.modules = qoopido.modules || {}, dependencies = [], isInternal = new RegExp("^\\.+\\/"), regexCanonicalize = new RegExp("(?:\\/|)[^\\/]*\\/\\.\\."), removeNeutral = new RegExp("(^\\/)|\\.\\/", "g"), register, registerSingleton;
    register = qoopido.register = function register(id, definition, dependencies, callback) {
        var namespace = id.split("/"), initialize;
        if (modules[id]) {
            return modules[id];
        }
        initialize = function() {
            if (dependencies) {
                var path = namespace.slice(0, -1).join("/"), i, dependency, internal;
                for (i = 0; (dependency = dependencies[i]) !== undefined; i++) {
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
            modules[id] = definition(modules, shared, namespace, navigator, window, document, undefined);
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
    };
    registerSingleton = qoopido.registerSingleton = function registerSingleton(id, definition, dependencies) {
        register(id, definition, dependencies, function(module) {
            modules[id] = module.create();
        });
    };
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
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    function getOwnPropertyDescriptors(object) {
        var descriptors = {}, properties = Object.getOwnPropertyNames(object), i, property;
        for (i = 0; (property = properties[i]) !== undefined; i++) {
            descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
        }
        return descriptors;
    }
    function prohibitCall() {
        if (typeof console !== "undefined") {
            console.error("[Qoopido.js] Operation prohibited on an actual instance");
        }
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
        extend: function(properties) {
            properties = properties || {};
            properties._parent = this;
            return Object.create(this, getOwnPropertyDescriptors(properties));
        }
    };
}, window.qoopido = window.qoopido || {}, navigator, window, document);
(function(definition) {
    window.qoopido.register("emitter", definition, [ "./base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
        },
        on: function(events, fn) {
            var self = this, i, event;
            events = events.split(" ");
            for (i = 0; (event = events[i]) !== undefined; i++) {
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
            var self = this, i, event, j, listener;
            if (events) {
                events = events.split(" ");
                for (i = 0; (event = events[i]) !== undefined; i++) {
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
            var self = this, i, listener;
            if (event !== undefined) {
                self._listener[event] = self._listener[event] || [];
                self._temp = self._listener[event].slice();
                for (i = 0; (listener = self._temp[i]) !== undefined; i++) {
                    listener.apply(self, arguments);
                }
                self._temp.length = 0;
            }
            return self;
        }
    });
});
(function(definition) {
    window.qoopido.register("polyfill/window/matchmedia", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.matchMedia) {
        var _doc = document, _viewport = _doc.documentElement, _queries = [], _queryID = 0, _type = "", _features = {}, _typeExpr = /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i, _mediaExpr = /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/, _timer = 0, _matches = function(media) {
            var mql = media.indexOf(",") !== -1 && media.split(",") || [ media ], mqIndex = mql.length - 1, mqLength = mqIndex, mq = null, negateType = null, negateTypeFound = "", negateTypeIndex = 0, negate = false, type = "", exprListStr = "", exprList = null, exprIndex = 0, exprLength = 0, expr = null, prefix = "", length = "", unit = "", value = "", feature = "", match = false;
            if (media === "") {
                return true;
            }
            do {
                mq = mql[mqLength - mqIndex];
                negate = false;
                negateType = mq.match(_typeExpr);
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
                match = type === _type || type === "all" || type === "";
                exprList = exprListStr.indexOf(" and ") !== -1 && exprListStr.split(" and ") || [ exprListStr ];
                exprIndex = exprList.length - 1;
                exprLength = exprIndex;
                if (match && exprIndex >= 0 && exprListStr !== "") {
                    do {
                        expr = exprList[exprIndex].match(_mediaExpr);
                        if (!expr || !_features[expr[3]]) {
                            match = false;
                            break;
                        }
                        prefix = expr[2];
                        length = expr[5];
                        value = length;
                        unit = expr[7];
                        feature = _features[expr[3]];
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
        }, _setFeature = function() {
            var w = window.innerWidth || _viewport.clientWidth, h = window.innerHeight || _viewport.clientHeight, dw = window.screen.width, dh = window.screen.height, c = window.screen.colorDepth, x = window.devicePixelRatio;
            _features.width = w;
            _features.height = h;
            _features["aspect-ratio"] = (w / h).toFixed(2);
            _features["device-width"] = dw;
            _features["device-height"] = dh;
            _features["device-aspect-ratio"] = (dw / dh).toFixed(2);
            _features.color = c;
            _features["color-index"] = Math.pow(2, c);
            _features.orientation = h >= w ? "portrait" : "landscape";
            _features.resolution = x && x * 96 || window.screen.deviceXDPI || 96;
            _features["device-pixel-ratio"] = x || 1;
        }, _watch = function() {
            clearTimeout(_timer);
            _timer = setTimeout(function() {
                var query = null, qIndex = _queryID - 1, qLength = qIndex, match = false;
                if (qIndex >= 0) {
                    _setFeature();
                    do {
                        query = _queries[qLength - qIndex];
                        if (query) {
                            match = _matches(query.mql.media);
                            if (match && !query.mql.matches || !match && query.mql.matches) {
                                query.mql.matches = match;
                                if (query.listeners) {
                                    for (var i = 0, il = query.listeners.length; i < il; i++) {
                                        if (query.listeners[i]) {
                                            query.listeners[i].call(window, query.mql);
                                        }
                                    }
                                }
                            }
                        }
                    } while (qIndex--);
                }
            }, 10);
        }, _init = function() {
            var head = _doc.getElementsByTagName("head")[0], style = _doc.createElement("style"), info = null, typeList = [ "screen", "print", "speech", "projection", "handheld", "tv", "braille", "embossed", "tty" ], typeIndex = 0, typeLength = typeList.length, cssText = "#mediamatchjs { position: relative; z-index: 0; }", eventPrefix = "", addEvent = window.addEventListener || (eventPrefix = "on") && window.attachEvent;
            style.type = "text/css";
            style.id = "mediamatchjs";
            head.appendChild(style);
            info = window.getComputedStyle && window.getComputedStyle(style) || style.currentStyle;
            for (;typeIndex < typeLength; typeIndex++) {
                cssText += "@media " + typeList[typeIndex] + " { #mediamatchjs { position: relative; z-index: " + typeIndex + " } }";
            }
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.textContent = cssText;
            }
            _type = typeList[info.zIndex * 1 || 0];
            head.removeChild(style);
            _setFeature();
            addEvent(eventPrefix + "resize", _watch);
            addEvent(eventPrefix + "orientationchange", _watch);
        };
        _init();
        window.matchMedia = function(media) {
            var id = _queryID, mql = {
                matches: false,
                media: media,
                addListener: function addListener(listener) {
                    _queries[id].listeners || (_queries[id].listeners = []);
                    listener && _queries[id].listeners.push(listener);
                },
                removeListener: function removeListener(listener) {
                    var query = _queries[id], i = 0, il = 0;
                    if (!query) {
                        return;
                    }
                    il = query.listeners.length;
                    for (;i < il; i++) {
                        if (query.listeners[i] === listener) {
                            query.listeners.splice(i, 1);
                        }
                    }
                }
            };
            if (media === "") {
                mql.matches = true;
                return mql;
            }
            mql.matches = _matches(media);
            _queryID = _queries.push({
                mql: mql,
                listeners: null
            });
            return mql;
        };
        return window.matchMedia;
    }
});
(function(definition) {
    var dependencies = [ "../emitter" ];
    if (!window.matchMedia) {
        dependencies.push("../polyfill/window/matchmedia");
    }
    window.qoopido.registerSingleton("component/remux", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, html = document.getElementsByTagName("html")[0], base = 16, state = {
        fontsize: null,
        layout: null,
        ratio: {}
    }, current = {
        fontsize: null,
        layout: null
    }, queries = [];
    function updateState(layout, fontsize) {
        var self = this;
        if (layout && fontsize) {
            html.className = layout;
            html.style.fontSize = fontsize + "px";
            state.layout = layout;
            state.fontsize = fontsize;
            if (current.fontsize !== state.fontsize || current.layout !== state.layout) {
                state.ratio.device = window.devicePixelRatio || 1;
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
    function addQuery(query, layout, fontsize, min, max) {
        var self = this, mql = window.matchMedia(query);
        mql.layout = layout;
        mql.fontsize = fontsize;
        mql.min = min;
        mql.max = max;
        queries.push(mql);
        mql.addListener(function(mql) {
            if (mql.matches === true) {
                updateState.call(self, mql.layout, mql.fontsize);
            }
        });
    }
    prototype = modules["emitter"].extend({
        _constructor: function() {
            var self = this, pBase = parseInt(html.getAttribute("data-base"), 10);
            prototype._parent._constructor.call(self);
            if (isNaN(pBase) === false) {
                base = pBase;
            }
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
            var self = this, parameter, id, layout, size, min, max, lMin, lMax, mq, mql;
            if (arguments.length > 1) {
                parameter = {};
                parameter[pId] = pLayout;
            } else {
                parameter = arguments[0];
            }
            for (id in parameter) {
                layout = parameter[id];
                lMin = Math.round(layout.width * (layout.min / base));
                lMax = Math.round(layout.width * (layout.max / base)) - 1;
                mq = "screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px )";
                addQuery.call(self, mq, id, null, lMin, lMax);
                for (size = layout.min; size <= layout.max; size++) {
                    lMin = Math.round(layout.width * (size / base));
                    lMax = Math.round(layout.width * ((size + 1) / base)) - 1;
                    mq = "screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px )";
                    addQuery.call(self, mq, id, size, lMin, lMax);
                    min = !min || lMin <= min.min ? queries[queries.length - 1] : min;
                    max = !max || lMax >= max.max ? queries[queries.length - 1] : max;
                }
            }
            addQuery.call(self, "screen and (max-width: " + (min.min - 1) + "px)", min.layout, min.fontsize, min.min, min.max);
            addQuery.call(self, "screen and (min-width: " + (max.max + 1) + "px)", max.layout, max.fontsize, max.min, max.max);
            for (var index in queries) {
                mql = queries[index];
                if (mql.matches === true) {
                    updateState.call(self, mql.layout, mql.fontsize);
                }
            }
            return self;
        }
    });
    return prototype;
});