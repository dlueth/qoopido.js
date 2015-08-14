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
    global.qoopido.register("polyfill/string/ucfirst", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!String.prototype.ucfirst) {
        String.prototype.ucfirst = function() {
            var self = this;
            return self.charAt(0).toUpperCase() + self.slice(1);
        };
    }
    return String.prototype.ucfirst;
}, this);
(function(definition, global) {
    global.qoopido.register("polyfill/string/lcfirst", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!String.prototype.lcfirst) {
        String.prototype.lcfirst = function() {
            var self = this;
            return self.charAt(0).toLowerCase() + self.slice(1);
        };
    }
    return String.prototype.lcfirst;
}, this);
(function(definition, global) {
    global.qoopido.register("polyfill/window/promise", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    var isObject = function(value) {
        return typeof value === "object";
    }, isFunction = function(value) {
        return typeof value === "function";
    }, asap = isFunction(global.setImmediate) && global.setImmediate || function(fn) {
        setTimeout(fn, 1);
    };
    function bind(fn, context) {
        return function() {
            fn.apply(context, arguments);
        };
    }
    function handle(deferred) {
        var self = this;
        if (self._state === null) {
            self._deferreds.push(deferred);
            return;
        }
        asap(function() {
            var callback = self._state ? deferred.onFulfilled : deferred.onRejected, value;
            if (callback === null) {
                (self._state ? deferred.resolve : deferred.reject)(self._value);
                return;
            }
            try {
                value = callback(self._value);
            } catch (exception) {
                deferred.reject(exception);
                return;
            }
            deferred.resolve(value);
        });
    }
    function resolve(value) {
        var self = this, then;
        try {
            if (value === self) {
                throw new TypeError("A promise cannot be resolved with itself.");
            }
            if (value && (isObject(value) || isFunction(value))) {
                then = value.then;
                if (typeof then === "function") {
                    doResolve(bind(then, value), bind(resolve, self), bind(reject, self));
                    return;
                }
            }
            self._state = true;
            self._value = value;
            finale.call(self);
        } catch (exception) {
            reject.call(self, exception);
        }
    }
    function reject(value) {
        var self = this;
        self._state = false;
        self._value = value;
        finale.call(self);
    }
    function finale() {
        var self = this, i = 0, deferred;
        for (;(deferred = self._deferreds[i]) !== undefined; i++) {
            handle.call(self, deferred);
        }
        this._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
        var self = this;
        self.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
        self.onRejected = typeof onRejected === "function" ? onRejected : null;
        self.resolve = resolve;
        self.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function(value) {
                if (done) {
                    return;
                }
                done = true;
                onFulfilled(value);
            }, function(reason) {
                if (done) {
                    return;
                }
                done = true;
                onRejected(reason);
            });
        } catch (exception) {
            if (done) {
                return;
            }
            done = true;
            onRejected(exception);
        }
    }
    function Promise(fn) {
        var self = this;
        if (!isObject(self)) {
            throw new TypeError("Promises must be constructed via new");
        }
        if (!isFunction(fn)) {
            throw new TypeError("not a function");
        }
        self._state = null;
        self._value = null;
        self._deferreds = [];
        doResolve(fn, bind(resolve, self), bind(reject, self));
    }
    Promise.prototype["catch"] = function(onRejected) {
        return this.then(null, onRejected);
    };
    Promise.prototype["then"] = function(onFulfilled, onRejected) {
        var self = this;
        return new Promise(function(resolve, reject) {
            handle.call(self, new Handler(onFulfilled, onRejected, resolve, reject));
        });
    };
    Promise.resolve = function(value) {
        if (value && isObject(value) && value.constructor === Promise) {
            return value;
        }
        return new Promise(function(resolve) {
            resolve(value);
        });
    };
    Promise.reject = function(value) {
        return new Promise(function(resolve, reject) {
            reject(value);
        });
    };
    if (!global.Promise) {
        global.Promise = Promise;
    }
    return global.Promise;
}, this);
(function(definition, global) {
    var dependencies = [];
    if (!global.Promise) {
        dependencies.push("../polyfill/window/promise");
    }
    global.qoopido.register("promise/all", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    return function all(promises) {
        if (Object.prototype.toString.call(promises) !== "[object Array]") {
            throw new TypeError("You must pass an array to all.");
        }
        return new global.Promise(function(resolve, reject) {
            var results = [], remaining = promises.length, i = 0, promise;
            if (remaining === 0) {
                resolve([]);
            }
            function resolver(index) {
                return function(value) {
                    resolveAll(index, value);
                };
            }
            function resolveAll(index, value) {
                results[index] = value;
                if (--remaining === 0) {
                    resolve(results);
                }
            }
            for (;(promise = promises[i]) !== undefined; i++) {
                if (promise && typeof promise.then === "function") {
                    promise.then(resolver(i), reject);
                } else {
                    resolveAll(i, promise);
                }
            }
        });
    };
}, this);
(function(definition, global) {
    var dependencies = [];
    if (!global.Promise) {
        dependencies.push("../polyfill/window/promise");
    }
    global.qoopido.register("promise/defer", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    return function defer() {
        var self = this;
        self.promise = new global.Promise(function(resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
        });
    };
}, this);
(function(definition, global) {
    var dependencies = [ "./base", "./promise/all", "./promise/defer" ];
    if (!String.prototype.ucfirst) {
        dependencies.push("./polyfill/string/ucfirst");
    }
    if (!String.prototype.lcfirst) {
        dependencies.push("./polyfill/string/lcfirst");
    }
    global.qoopido.registerSingleton("support", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document, CombinedPromise = modules["promise/all"], DeferredPromise = modules["promise/defer"], matchPrefix = new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"), removeJsPrefix = new RegExp("^(?:webkit|khtml|icab|moz|ms|o)([A-Z])"), removeCssPrefix = new RegExp("^-(?:webkit|khtml|icab|moz|ms|o)-"), convertToCamelCase = new RegExp("-([a-z])", "gi"), convertToHyphens = new RegExp("([A-Z])", "g"), callbackUcfirst = function() {
        return arguments[1].ucfirst();
    }, lookup = {
        prefix: null,
        method: {},
        property: {},
        css: {},
        promises: {
            prefix: null,
            method: {},
            property: {},
            css: {},
            test: {}
        }
    };
    function normalize(value) {
        return value.replace(removeJsPrefix, "$1").lcfirst().replace(removeCssPrefix, "").replace(convertToCamelCase, callbackUcfirst);
    }
    return modules["base"].extend({
        test: {},
        pool: shared.pool && shared.pool.dom,
        testMultiple: function() {
            var test, tests = [], i = 0;
            for (;(test = arguments[i]) !== undefined; i++) {
                switch (typeof test) {
                  case "string":
                    tests.push(this.test[test]());
                    break;

                  case "boolean":
                    var deferred = new DeferredPromise();
                    !!test ? deferred.resolve() : deferred.reject();
                    tests.push(deferred.promise);
                    break;

                  default:
                    tests.push(test);
                    break;
                }
            }
            return new CombinedPromise(tests);
        },
        getPrefix: function() {
            var self = this, stored = lookup.prefix || null, property;
            if (stored === null) {
                var sample = self.pool ? self.pool.obtain("div") : document.createElement("div"), styles = sample.style;
                stored = false;
                for (property in styles) {
                    if (matchPrefix.test(property)) {
                        stored = property.match(matchPrefix)[0];
                    }
                }
                if (stored === false && "WebkitOpacity" in styles) {
                    stored = "WebKit";
                }
                if (stored === false && "KhtmlOpacity" in styles) {
                    stored = "Khtml";
                }
                stored = lookup.prefix = stored === false ? false : [ stored.toLowerCase(), stored.toLowerCase().ucfirst(), stored ];
                sample.dispose && sample.dispose();
            }
            return stored;
        },
        getMethod: function(pMethod, pElement) {
            pMethod = normalize(pMethod);
            pElement = pElement || global;
            var type = pElement.tagName, pointer = lookup.method[type] = lookup.method[type] || {}, stored = pointer[pMethod] = lookup.method[type][pMethod] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uMethod = pMethod.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pMethod + " " + uMethod + " " + prefixes.join(uMethod + " ") + uMethod).split(" ");
                } else {
                    candidates = [ pMethod ];
                }
                for (;(candidate = candidates[i]) !== undefined; i++) {
                    if (pElement[candidate] !== undefined && (typeof pElement[candidate] === "function" || typeof pElement[candidate] === "object")) {
                        stored = candidate;
                        break;
                    }
                }
                lookup.method[type][pMethod] = stored;
            }
            return stored;
        },
        getProperty: function(pProperty, pElement) {
            pProperty = normalize(pProperty);
            pElement = pElement || global;
            var type = pElement.tagName, pointer = lookup.property[type] = lookup.property[type] || {}, stored = pointer[pProperty] = lookup.property[type][pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uProperty = pProperty.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pProperty + " " + uProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" ");
                } else {
                    candidates = [ pProperty ];
                }
                for (i; (candidate = candidates[i]) !== undefined; i++) {
                    if (pElement[candidate] !== undefined) {
                        stored = candidate;
                        break;
                    }
                }
                lookup.property[type][pProperty] = stored;
            }
            return stored;
        },
        getCssProperty: function(pProperty) {
            pProperty = normalize(pProperty);
            var self = this, stored = lookup.css[pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidate, i = 0, sample = self.pool ? self.pool.obtain("div") : document.createElement("div"), uProperty = pProperty.ucfirst(), prefixes = this.getPrefix() || [], candidates = (pProperty + " " + uProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" "), prefix = "";
                for (i; (candidate = candidates[i]) !== undefined; i++) {
                    if (sample.style[candidate] !== undefined) {
                        stored = candidate;
                        if (i > 0) {
                            prefix = "-";
                        }
                        break;
                    }
                }
                stored = lookup.css[pProperty] = stored !== false ? [ prefix + stored.replace(convertToHyphens, "-$1").toLowerCase(), stored ] : false;
                sample.dispose && sample.dispose();
            }
            return stored;
        },
        supportsPrefix: function() {
            return !!this.getPrefix();
        },
        supportsMethod: function(pMethod, pElement) {
            return !!this.getMethod(pMethod, pElement);
        },
        supportsProperty: function(pProperty, pElement) {
            return !!this.getProperty(pProperty, pElement);
        },
        supportsCssProperty: function(pProperty) {
            return !!this.getCssProperty(pProperty);
        },
        testPrefix: function() {
            var stored = lookup.promises.prefix;
            if (stored === null) {
                var deferred = new DeferredPromise(), prefix = this.getPrefix();
                !!prefix ? deferred.resolve(prefix) : deferred.reject();
                stored = lookup.promises.prefix = deferred.promise;
            }
            return stored;
        },
        testMethod: function(pMethod, pElement) {
            pElement = pElement || global;
            var type = pElement.tagName, pointer = lookup.promises.method[type] = lookup.promises.method[type] || {}, stored = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), method = this.getMethod(pMethod, pElement);
                !!method ? deferred.resolve(method) : deferred.reject();
                stored = lookup.promises.method[type][pMethod] = deferred.promise;
            }
            return stored;
        },
        testProperty: function(pProperty, pElement) {
            pElement = pElement || global;
            var type = pElement.tagName, pointer = lookup.promises.property[type] = lookup.promises.property[type] || {}, stored = pointer[pProperty] = lookup.promises.property[type][pProperty] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), property = this.getProperty(pProperty, pElement);
                !!property ? deferred.resolve(property) : deferred.reject();
                stored = lookup.promises.property[type][pProperty] = deferred.promise;
            }
            return stored;
        },
        testCssProperty: function(pProperty) {
            var stored = lookup.promises.css[pProperty] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), property = this.getCssProperty(pProperty);
                !!property ? deferred.resolve(property) : deferred.reject();
                stored = lookup.promises.css[pProperty] = deferred.promise;
            }
            return stored;
        },
        addTest: function(pId, pTest) {
            return this.test[pId] = function() {
                var stored = lookup.promises.test[pId] || null;
                if (stored === null) {
                    var deferred = new DeferredPromise(), parameter = Array.prototype.slice.call(arguments);
                    parameter.splice(0, 0, deferred);
                    pTest.apply(null, parameter);
                    stored = lookup.promises.test[pId] = deferred.promise;
                }
                return stored;
            };
        }
    });
}, this);
(function(definition, global) {
    global.qoopido.register("function/merge", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    return function merge() {
        var target = arguments[0], i, properties, property, tgt, src;
        for (i = 1; (properties = arguments[i]) !== undefined; i++) {
            for (property in properties) {
                tgt = target[property];
                src = properties[property];
                if (src !== undefined) {
                    if (src !== null && typeof src === "object") {
                        if (src.length !== undefined) {
                            tgt = tgt && typeof tgt === "object" && tgt.length !== undefined ? tgt : [];
                        } else {
                            tgt = tgt && typeof tgt === "object" && tgt.length === undefined ? tgt : {};
                        }
                        target[property] = merge(tgt, src);
                    } else {
                        target[property] = src;
                    }
                }
            }
        }
        return target;
    };
}, this);
(function(definition, global) {
    global.qoopido.register("function/unique/uuid", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    var lookup = {}, regex = new RegExp("[xy]", "g");
    function generateUuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(regex, function(c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
        });
    }
    return function() {
        var result;
        do {
            result = generateUuid();
        } while (typeof lookup[result] !== "undefined");
        lookup[result] = true;
        return result;
    };
}, this);
(function(definition, global) {
    global.qoopido.registerSingleton("hook/event", definition, [ "../base" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document;
    function transferProperties(event, originalEvent, properties) {
        var i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
            event[property] = originalEvent[property];
        }
        event._properties = event._properties.concat(properties);
    }
    var hooks = {
        general: {
            properties: "type altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which path".split(" "),
            process: function(event, originalEvent) {
                var pointer;
                event.originalEvent = originalEvent;
                event.isDefaultPrevented = originalEvent.defaultPrevented ? true : false;
                event.isPropagationStopped = originalEvent.cancelBubble ? true : false;
                event.metaKey = originalEvent.metaKey && originalEvent.metaKey !== false ? true : false;
                if (!event.target) {
                    event.target = originalEvent.srcElement || document;
                }
                if (event.target.nodeType === 3) {
                    event.target = event.target.parentNode;
                }
                if (!event.path) {
                    event.path = [];
                    pointer = event.target;
                    do {
                        event.path.push(pointer);
                    } while (pointer = pointer.parentNode);
                    event.path.push(global);
                }
            }
        },
        mouse: {
            regex: new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),
            properties: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement dataTransfer".split(" "),
            process: function(event, originalEvent) {
                var pointer, fromElement, which;
                fromElement = originalEvent.fromElement;
                which = originalEvent.button;
                if (event.pageX === null && originalEvent.clientX !== null) {
                    pointer = event.target.ownerDocument || document;
                    pointer = pointer.documentElement || pointer.body;
                    event.pageX = originalEvent.clientX + (pointer.scrollLeft || 0) - (pointer.clientLeft || 0);
                    event.pageY = originalEvent.clientY + (pointer.scrollTop || 0) - (pointer.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? originalEvent.toElement : fromElement;
                }
                if (!event.which && which !== undefined) {
                    event.which = which & 1 ? 1 : which & 2 ? 3 : which & 4 ? 2 : 0;
                }
            }
        },
        key: {
            regex: new RegExp("^(?:key)"),
            properties: "char charCode key keyCode".split(" "),
            process: function(event, originalEvent) {
                if (event.which === null) {
                    event.which = originalEvent.charCode !== null ? originalEvent.charCode : originalEvent.keyCode;
                }
            }
        }
    };
    return modules["base"].extend({
        add: function(property, hook) {
            if (property && hook && hooks[property]) {
                hooks[property] = hook;
            }
            return this;
        },
        get: function(property) {
            if (property && hooks[property]) {
                return hooks[property];
            }
            return null;
        },
        process: function(event, originalEvent) {
            var id, hook, isMatch;
            for (id in hooks) {
                hook = hooks[id];
                isMatch = !hook.regex || hook.regex.test(originalEvent.type);
                if (isMatch) {
                    if (hook.properties) {
                        transferProperties(event, originalEvent, hook.properties);
                    }
                    if (hook.process) {
                        hook.process(event, originalEvent);
                    }
                    if (hook.delegate) {
                        event.delegate = hook.delegate;
                    }
                }
            }
        }
    });
}, this);
(function(definition, global) {
    var dependencies = [ "../base", "../support" ];
    if (!global.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
    }
    global.qoopido.registerSingleton("hook/css", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var mSupport = modules["support"], getComputedStyle = global.getComputedStyle || modules["polyfill/window/getcomputedstyle"], hooks = {
        general: {
            get: function(element, property) {
                return getComputedStyle(element, null).getPropertyValue(property[0]);
            },
            set: function(element, property, value) {
                element.style[property[1]] = value;
            }
        },
        opacity: !mSupport.supportsCssProperty("opacity") ? {
            regex: new RegExp("alpha\\(opacity=(.*)\\)", "i"),
            get: function(element, property, value) {
                value = getComputedStyle(element, null).getPropertyValue("filter").toString().match(this.regex);
                if (value) {
                    value = value[1] / 100;
                } else {
                    value = 1;
                }
                return value;
            },
            set: function(element, property, value) {
                var style = element.style;
                style.zoom = 1;
                style.filter = "alpha(opacity=" + (value * 100 + .5 >> 0) + ")";
            }
        } : null
    };
    return modules["base"].extend({
        add: function(property, hook) {
            if (property && hook && hooks[property]) {
                hooks[property] = hook;
            }
            return this;
        },
        get: function(property) {
            if (property && hooks[property]) {
                return hooks[property];
            }
            return null;
        },
        process: function(method, element, property, value) {
            var hook;
            property = mSupport.getCssProperty(property, element) || null;
            if (property) {
                return ((hook = this.get(property[1])) && hook[method] || this.get("general")[method])(element, property, value);
            }
        }
    });
}, this);
(function(definition, global) {
    global.qoopido.register("dom/event", definition, [ "../base", "../hook/event" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var hooks = modules["hook/event"];
    return modules["base"].extend({
        originalEvent: null,
        isDelegate: false,
        isDefaultPrevented: false,
        isPropagationStopped: false,
        isImmediatePropagationStopped: false,
        _properties: null,
        _constructor: function(event) {
            var self = this;
            self._properties = [];
            self._obtain(event);
            return self;
        },
        _obtain: function(event) {
            hooks.process(this, event);
        },
        _dispose: function() {
            var self = this, i = 0, property;
            for (;(property = self._properties[i]) !== undefined; i++) {
                delete self[property];
            }
            delete self.delegate;
            self.originalEvent = null;
            self.isDelegate = false;
            self.isDefaultPrevented = false;
            self.isPropagationStopped = false;
            self.isImmediatePropagationStopped = false;
            self._properties.length = 0;
        },
        preventDefault: function() {
            var self = this, event = self.originalEvent;
            if (event.cancelable !== false) {
                self.isDefaultPrevented = true;
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            }
        },
        stopPropagation: function() {
            var self = this, event = self.originalEvent;
            self.isPropagationStopped = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            event.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            var self = this, event = self.originalEvent;
            self.isImmediatePropagationStopped = true;
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            self.stopPropagation();
        }
    });
}, this);
(function(definition, global) {
    var dependencies = [ "../base", "../function/unique/uuid", "../hook/css", "./event" ];
    if (!global.CustomEvent) {
        dependencies.push("../polyfill/window/customevent");
    }
    if (!global.addEventListener) {
        dependencies.push("../polyfill/window/addeventlistener");
    }
    if (!global.removeEventListener) {
        dependencies.push("../polyfill/window/removeeventlistener");
    }
    if (!global.dispatchEvent) {
        dependencies.push("../polyfill/window/dispatchevent");
    }
    if (!Element.prototype.matches) {
        dependencies.push("../polyfill/element/matches");
    }
    if (!document.querySelector) {
        dependencies.push("../polyfill/document/queryselector");
    }
    if (!document.querySelectorAll) {
        dependencies.push("../polyfill/document/queryselectorall");
    }
    if (!String.prototype.trim) {
        dependencies.push("../polyfill/string/trim");
    }
    global.qoopido.register("dom/element", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document, stringObject = "object", stringString = "string", generateUuid = modules["function/unique/uuid"], head = document.getElementsByTagName("head")[0], contentAttribute = "textContent" in document.createElement("a") ? "textContent" : "innerText", previousSibling = typeof head.previousElementSibling !== "undefined" ? function previousSibling() {
        return this.previousElementSibling;
    } : function previousSibling() {
        var element = this;
        while (element = element.previousSibling) {
            if (element.nodeType === 1) {
                return element;
            }
        }
    }, nextSibling = typeof head.nextElementSibling !== "undefined" ? function nextSibling() {
        return this.nextElementSibling;
    } : function nextSibling() {
        var element = this;
        while (element = element.nextSibling) {
            if (element.nodeType === 1) {
                return element;
            }
        }
    }, isTag = new RegExp("^<(\\w+)\\s*/>$"), matchEvent = new RegExp("^[^-]+"), splitList = new RegExp(" +", "g"), pool = modules["pool/module"] && modules["pool/module"].create(modules["dom/event"], null, true) || null, hooks = modules["hook/css"], storage = {}, events = {
        custom: {
            type: "CustomEvent",
            method: "initCustomEvent"
        },
        html: {
            regex: new RegExp("^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$"),
            type: "HTMLEvents",
            method: "initEvent"
        },
        mouse: {
            regex: new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),
            type: "MouseEvents",
            method: "initMouseEvent"
        }
    };
    function resolveEvent(type) {
        var id, prototype, candidate;
        for (id in events) {
            prototype = events[id];
            if (!prototype.regex || prototype.regex.test(type)) {
                candidate = prototype;
            }
        }
        return candidate;
    }
    function emitEvent(type, detail, uuid) {
        var self = this, prototype = resolveEvent(type), event = document.createEvent(prototype.type);
        event[prototype.method](type, type === "load" ? false : true, true, detail);
        if (uuid) {
            event._quid = uuid;
            event.isDelegate = true;
        }
        self.element.dispatchEvent(event);
    }
    function resolveElement(element) {
        var tag;
        if (typeof element === "string") {
            try {
                if (isTag.test(element) === true) {
                    tag = element.replace(isTag, "$1").toLowerCase();
                    element = document.createElement(tag);
                } else {
                    element = document.querySelector(element);
                }
            } catch (exception) {
                element = null;
            }
        }
        if (!element) {
            throw new Error("[Qoopido.js] Element could not be resolved");
        }
        return element;
    }
    function resolveArguments(parameters) {
        return Array.prototype.concat.apply([], Array.prototype.splice.call(parameters, 0)).join(" ").split(splitList);
    }
    function matchesDelegate(event, delegate) {
        var i = 0, pointer;
        for (;(pointer = event.path[i]) !== undefined; i++) {
            if (pointer.matches(delegate)) {
                event.currentTarget = pointer;
                return true;
            }
            if (pointer === event.currentTarget) {
                break;
            }
        }
        return false;
    }
    return modules["base"].extend({
        type: null,
        element: null,
        _listener: null,
        _constructor: function(element, attributes, styles) {
            var self = this, uuid;
            element = resolveElement(element);
            uuid = element._quid;
            if (!uuid) {
                uuid = element._quid = generateUuid();
                self.type = element.tagName;
                self.element = element;
                self._listener = {};
                storage[uuid] = self;
            } else {
                self = storage[uuid];
            }
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
            if (self !== this) {
                this.dispose && this.dispose();
            }
            return self;
        },
        _obtain: function(element, attributes, styles) {
            this._constructor(element, attributes, styles);
        },
        _dispose: function() {
            var self = this, id, event;
            for (id in self._listener) {
                event = id.match(matchEvent);
                self.element.removeEventListener(event, self._listener[id]);
                delete self._listener[id];
            }
            self.type = null;
            self.element = null;
        },
        getContent: function(html) {
            var element = this.element;
            return html && html !== false ? element.innerHTML : element[contentAttribute];
        },
        setContent: function(content, html) {
            var self = this, element = self.element;
            if (html && html !== false) {
                element.innerHTML = content;
            } else {
                element[contentAttribute] = content;
            }
            return self;
        },
        getAttribute: function(attribute) {
            var self = this;
            if (attribute && typeof attribute === stringString) {
                return self.element.getAttribute(attribute);
            }
        },
        getAttributes: function() {
            var self = this, result = {}, attributes = resolveArguments(arguments), i = 0, attribute;
            for (;(attribute = attributes[i]) !== undefined; i++) {
                result[attribute] = self.element.getAttribute(attribute);
            }
            return result;
        },
        setAttribute: function(attribute, value) {
            var self = this;
            if (attribute && typeof attribute === stringString) {
                self.element.setAttribute(attribute, value);
            }
            return self;
        },
        setAttributes: function(attributes) {
            var self = this, attribute;
            if (attributes && typeof attributes === stringObject && !attributes.length) {
                for (attribute in attributes) {
                    self.element.setAttribute(attribute, attributes[attribute]);
                }
            }
            return self;
        },
        removeAttribute: function(attribute) {
            var self = this;
            if (attribute && typeof attribute === stringString) {
                self.element.removeAttribute(attribute);
            }
            return self;
        },
        removeAttributes: function() {
            var self = this, attributes = resolveArguments(arguments), i = 0, attribute;
            for (;(attribute = attributes[i]) !== undefined; i++) {
                self.element.removeAttribute(attribute);
            }
            return self;
        },
        getStyle: function(property) {
            var self = this;
            if (property && typeof property === stringString) {
                return hooks.process("get", self.element, property);
            }
        },
        getStyles: function() {
            var self = this, result = {}, properties = resolveArguments(arguments), i = 0, property;
            for (;(property = properties[i]) !== undefined; i++) {
                result[property] = hooks.process("get", self.element, property);
            }
            return result;
        },
        setStyle: function(property, value) {
            var self = this;
            if (property && typeof property === stringString) {
                hooks.process("set", self.element, property, value);
            }
            return self;
        },
        setStyles: function(properties) {
            var self = this, property;
            if (properties && typeof properties === stringObject && !properties.length) {
                for (property in properties) {
                    hooks.process("set", self.element, property, properties[property]);
                }
            }
            return self;
        },
        removeStyle: function(property) {
            var self = this;
            if (property && typeof property === stringString) {
                self.setStyle(property, "");
            }
            return self;
        },
        removeStyles: function() {
            var self = this, properties = resolveArguments(arguments), i = 0, property;
            for (;(property = properties[i]) !== undefined; i++) {
                self.setStyle(property, "");
            }
            return self;
        },
        siblings: function(selector) {
            var element = this.element, pointer = element.parentNode.firstChild, siblings = [];
            for (;pointer; pointer = nextSibling.call(pointer)) {
                if (pointer !== element && (!selector || pointer.matches(selector))) {
                    siblings.push(pointer);
                }
            }
            return siblings;
        },
        siblingsBefore: function(selector) {
            var pointer = this.element.previousSibling, siblings = [];
            for (;pointer; pointer = previousSibling.call(pointer)) {
                if (!selector || pointer.matches(selector)) {
                    siblings.push(pointer);
                }
            }
            return siblings;
        },
        siblingsAfter: function(selector) {
            var pointer = this.element.nextSibling, siblings = [];
            for (;pointer; pointer = nextSibling.call(pointer)) {
                if (!selector || pointer.matches(selector)) {
                    siblings.push(pointer);
                }
            }
            return siblings;
        },
        previous: function(selector) {
            var pointer = previousSibling.call(this.element);
            if (!selector) {
                return pointer;
            } else {
                for (;pointer; pointer = previousSibling.call(pointer)) {
                    if (pointer.matches(selector)) {
                        return pointer;
                    }
                }
            }
        },
        next: function(selector) {
            var pointer = nextSibling.call(this.element);
            if (!selector) {
                return pointer;
            } else {
                for (;pointer; pointer = nextSibling.call(pointer)) {
                    if (pointer.matches(selector)) {
                        return pointer;
                    }
                }
            }
        },
        find: function(selector) {
            var self = this.element, uuid, matches;
            selector = selector.trim();
            if (selector.charAt(0) === ">") {
                uuid = self._quid;
                self.setAttribute("data-quid", uuid);
                selector = '[data-quid="' + uuid + '"] ' + selector;
                matches = self.parentNode.querySelectorAll(selector);
                self.removeAttribute("data-quid");
            } else {
                matches = self.querySelectorAll(selector);
            }
            return matches;
        },
        parent: function(selector) {
            var pointer;
            if (!selector) {
                return this.element.parentNode;
            } else {
                pointer = this.element;
                for (;pointer; pointer = pointer.parentNode) {
                    if (pointer.matches(selector)) {
                        return pointer;
                    }
                }
            }
        },
        parents: function(selector) {
            var pointer = this.element.parentNode, parents = [];
            for (;pointer; pointer = pointer.parentNode) {
                if (pointer.nodeType === 9) {
                    return parents;
                } else if (pointer.nodeType === 1) {
                    if (!selector || pointer.matches(selector)) {
                        parents.push(pointer);
                    }
                }
            }
        },
        isVisible: function() {
            var self = this, element = self.element;
            return !(element.offsetWidth <= 0 && element.offsetHeight <= 0 || self.getStyle("visibility") === "hidden" || self.getStyle("opacity") <= 0);
        },
        hasClass: function(name) {
            return name ? new RegExp("(?:^|\\s)" + name + "(?:\\s|$)").test(this.element.className) : false;
        },
        addClass: function(name) {
            var self = this;
            if (name && !self.hasClass(name)) {
                self.element.className += self.element.className ? " " + name : name;
            }
            return self;
        },
        removeClass: function(name) {
            var self = this;
            if (name && self.hasClass(name)) {
                self.element.className = self.element.className.replace(new RegExp("(?:^|\\s)" + name + "(?!\\S)"), "");
            }
            return self;
        },
        toggleClass: function(name) {
            var self = this;
            if (name) {
                self.hasClass(name) ? self.removeClass(name) : self.addClass(name);
            }
            return self;
        },
        prepend: function(element) {
            var self = this, target = self.element;
            if (element) {
                try {
                    element = element.element || resolveElement(element);
                    target.firstChild ? target.insertBefore(element, target.firstChild) : self.append(element);
                } catch (exception) {
                    target.insertAdjacentHTML("afterBegin", element);
                }
            }
            return self;
        },
        append: function(element) {
            var self = this, target = self.element;
            if (element) {
                try {
                    target.appendChild(element.element || resolveElement(element));
                } catch (exception) {
                    target.insertAdjacentHTML("beforeEnd", element);
                }
            }
            return self;
        },
        prependTo: function(target) {
            var self = this, element = self.element;
            if (target) {
                (target = target.element || resolveElement(target)).firstChild ? target.insertBefore(element, target.firstChild) : self.appendTo(target);
            }
            return self;
        },
        appendTo: function(target) {
            var self = this;
            if (target) {
                (target.element || resolveElement(target)).appendChild(self.element);
            }
            return self;
        },
        insertBefore: function(target) {
            var self = this, element = self.element;
            if (target) {
                (target = target.element || resolveElement(target)).parentNode.insertBefore(element, target);
            }
            return self;
        },
        insertAfter: function(target) {
            var self = this, element = self.element;
            if (target) {
                (target = target.element || resolveElement(target)).nextSibling ? target.parentNode.insertBefore(element, target.nextSibling) : self.appendTo(target.parentNode);
            }
            return self;
        },
        replace: function(target) {
            var self = this, element = self.element;
            if (target) {
                (target = target.element || resolveElement(target)).parentNode.replaceChild(element, target);
            }
            return self;
        },
        replaceWith: function(element) {
            var self = this, target = self.element;
            if (element) {
                element = element.element || resolveElement(element);
                target.parentNode.replaceChild(element, target);
            }
            return self;
        },
        remove: function() {
            var self = this, element = self.element;
            element.parentNode.removeChild(element);
            return self;
        },
        on: function(events) {
            var self = this, element = self.element, delegate = arguments.length > 2 ? arguments[1] : null, fn = arguments.length > 2 ? arguments[2] : arguments[1], uuid = fn._quid || (fn._quid = generateUuid()), i = 0, event;
            events = events.split(" ");
            for (;(event = events[i]) !== undefined; i++) {
                var id = event + "-" + uuid, listener = function(event) {
                    var delegateTo;
                    event = pool && pool.obtain(event) || modules["dom/event"].create(event);
                    if (!event.isPropagationStopped) {
                        delegateTo = event.delegate;
                        event._quid = generateUuid();
                        if (!delegate || matchesDelegate(event, delegate)) {
                            fn.call(event.currentTarget, event, event.originalEvent.detail);
                        }
                        if (delegateTo) {
                            delete event.delegate;
                            emitEvent.call(self, delegateTo);
                        }
                    }
                    event.dispose && event.dispose();
                };
                listener.type = event;
                self._listener[id] = listener;
                element.addEventListener(event, listener);
            }
            return self;
        },
        one: function(events) {
            var self = this, delegate = arguments.length > 3 || typeof arguments[1] === "string" ? arguments[1] : null, fn = arguments.length > 3 || typeof arguments[2] === "function" ? arguments[2] : arguments[1], each = (arguments.length > 3 ? arguments[3] : arguments[2]) !== false, listener = function(event) {
                self.off(each === true ? event.type : events, listener);
                fn.call(this, event, event.originalEvent.detail);
            };
            fn._quid = listener._quid = generateUuid();
            if (delegate) {
                self.on(events, delegate, listener);
            } else {
                self.on(events, listener);
            }
            return self;
        },
        off: function(events, fn) {
            var self = this, element = self.element, i = 0, event, id, listener;
            events = events.split(" ");
            for (;(event = events[i]) !== undefined; i++) {
                id = fn._quid && event + "-" + fn._quid || null;
                listener = id && self._listener[id] || null;
                if (listener) {
                    element.removeEventListener(event, listener);
                    delete self._listener[id];
                } else {
                    element.removeEventListener(event, fn);
                }
            }
            return self;
        },
        emit: function(event, data) {
            var self = this;
            emitEvent.call(self, event, data);
            return self;
        }
    });
}, this);
(function(definition, global) {
    global.qoopido.register("dom/element/emerge", definition, [ "../element", "../../function/merge", "../../function/unique/uuid" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var defaults = {
        interval: 50,
        threshold: "auto",
        recur: true,
        auto: 1,
        visibility: true
    }, document = global.document, documentElement = document.documentElement, mGlobal = modules["dom/element"].create(global), viewport = {}, intervals = {}, elements = {}, prototype, EVENT_EMERGED = "emerged", EVENT_DEMERGED = "demerged", DOM_RESIZE = "resize orientationchange";
    if (document.compatMode !== "CSS1Compat") {
        throw "[Qoopido.js] Not in standards mode";
    }
    function tick(interval) {
        var index, pointer = elements[interval];
        for (index in pointer) {
            if (index !== "length") {
                checkState.call(pointer[index]);
            }
        }
        if (pointer.length === 0) {
            global.clearInterval(intervals[interval]);
            delete intervals[interval];
        }
    }
    function globalOnResize() {
        viewport.left = 0;
        viewport.top = 0;
        viewport.right = global.innerWidth || documentElement.clientWidth;
        viewport.bottom = global.innerHeight || documentElement.clientHeight;
    }
    function instanceOnResize() {
        var self = this, treshold = self._settings.threshold, x = treshold !== undefined ? treshold : documentElement.clientWidth * self._settings.auto, y = treshold !== undefined ? treshold : documentElement.clientHeight * self._settings.auto;
        self._viewport.left = viewport.left - x;
        self._viewport.top = viewport.top - y;
        self._viewport.right = viewport.right + x;
        self._viewport.bottom = viewport.bottom + y;
    }
    function checkState() {
        var self = this, state = false, priority = 2, boundaries;
        if (self.isVisible() && (self.getStyle("visibility") !== "hidden" || self._settings.visibility === false)) {
            boundaries = self.element.getBoundingClientRect();
            if ((boundaries.bottom >= self._viewport.top && boundaries.bottom <= self._viewport.bottom || boundaries.top >= self._viewport.top && boundaries.top <= self._viewport.bottom || self._viewport.bottom >= boundaries.top && self._viewport.bottom <= boundaries.bottom || self._viewport.top >= boundaries.top && self._viewport.top <= boundaries.bottom) && (boundaries.left >= self._viewport.left && boundaries.left <= self._viewport.right || boundaries.right >= self._viewport.left && boundaries.right <= self._viewport.right || self._viewport.left >= boundaries.left && self._viewport.left <= boundaries.right || self._viewport.right >= boundaries.left && self._viewport.right <= boundaries.right)) {
                if (self._settings.threshold === 0 || (boundaries.bottom >= viewport.top && boundaries.bottom <= viewport.bottom || boundaries.top >= viewport.top && boundaries.top <= viewport.bottom || viewport.bottom >= boundaries.top && viewport.bottom <= boundaries.bottom || viewport.top >= boundaries.top && viewport.top <= boundaries.bottom) && (boundaries.left >= viewport.left && boundaries.left <= viewport.right || boundaries.right >= viewport.left && boundaries.right <= viewport.right || viewport.left >= boundaries.left && viewport.left <= boundaries.right || viewport.right >= boundaries.left && viewport.right <= boundaries.right)) {
                    priority = 1;
                }
                state = true;
            }
        }
        if (state !== self._state || state === true && priority !== self._priority) {
            setState.call(self, state, priority);
        }
    }
    function setState(state, priority) {
        var self = this;
        self._state = state;
        self._priority = priority;
        if (self._settings.recur !== true) {
            self.remove();
        }
        if (state === true) {
            self.emit(EVENT_EMERGED, priority);
        } else {
            self.emit(EVENT_DEMERGED);
        }
    }
    prototype = modules["dom/element"].extend({
        _quid: null,
        _viewport: null,
        _settings: null,
        _state: null,
        _priority: null,
        _constructor: function(element, settings) {
            var self = prototype._parent._constructor.call(this, element);
            settings = modules["function/merge"]({}, defaults, settings || {});
            if (settings.threshold === "auto") {
                delete settings.threshold;
            }
            if (intervals[settings.interval] === undefined) {
                elements[settings.interval] = elements[settings.interval] || {
                    length: 0
                };
                intervals[settings.interval] = global.setInterval(function() {
                    tick(settings.interval);
                }, settings.interval);
            }
            self._quid = modules["function/unique/uuid"]();
            self._viewport = {};
            self._settings = settings;
            self._state = false;
            self._priority = 2;
            elements[settings.interval][self._quid] = self;
            elements[settings.interval].length++;
            mGlobal.on(DOM_RESIZE, function() {
                instanceOnResize.call(self);
            });
            instanceOnResize.call(self);
            return self;
        },
        remove: function() {
            var self = this;
            delete elements[self._settings.interval][self._quid];
            elements[self._settings.interval].length--;
        }
    });
    mGlobal.on(DOM_RESIZE, globalOnResize);
    globalOnResize();
    return prototype;
}, this);
(function(definition, global) {
    global.qoopido.register("dom/element/lazyimage", definition, [ "./emerge", "../../function/merge" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var defaults = {
        interval: 50,
        threshold: "auto",
        attribute: "data-lazyimage"
    }, queue = 0, prototype, EVENT_REQUESTED = "requested", EVENT_LOADED = "loaded", EVENT_FAILED = "failed", EVENT_EMERGED = "emerged", DOM_LOAD = "load", DOM_ERROR = "error", DOM_STATE = "".concat(DOM_LOAD, " ", DOM_ERROR);
    function load() {
        var self = this, attribute = self._settings.attribute;
        queue += 1;
        self.emit(EVENT_REQUESTED).one(DOM_STATE, function(event) {
            if (event.type === DOM_LOAD) {
                self.emit(EVENT_LOADED);
            } else {
                self.emit(EVENT_FAILED);
            }
            queue -= 1;
        }, false).setAttribute("src", self.getAttribute(attribute)).removeAttribute(attribute);
    }
    prototype = modules["dom/element/emerge"].extend({
        _constructor: function(element, settings) {
            var self = prototype._parent._constructor.call(this, element, modules["function/merge"]({}, defaults, settings || {}));
            self.on(EVENT_EMERGED, function onEmerge(event) {
                if (queue === 0 || event.data === 1) {
                    self.remove();
                    self.off(EVENT_EMERGED, onEmerge);
                    load.call(self);
                }
            });
            return self;
        }
    });
    return prototype;
}, this);