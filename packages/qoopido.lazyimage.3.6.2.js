/*!
* Qoopido.js library
*
* version: 3.6.2
* date:    2015-4-21
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition, qoopido) {
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
(function(definition, global, navigator, window, document, undefined) {
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
    }
    function registerSingleton(id, definition, dependencies) {
        register(id, definition, dependencies, function(module) {
            modules[id] = module.create();
        });
    }
    var qoopido = global.qoopido || (global.qoopido = {
        register: register,
        registerSingleton: registerSingleton
    }), shared = qoopido.shared || (qoopido.shared = {}), modules = qoopido.modules || (qoopido.modules = {}), dependencies = [], isInternal = new RegExp("^\\.+\\/"), regexCanonicalize = new RegExp("(?:\\/|)[^\\/]*\\/\\.\\."), removeNeutral = new RegExp("(^\\/)|\\.\\/", "g");
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
}, this, navigator, window, document);
(function(definition) {
    window.qoopido.register("polyfill/string/ucfirst", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!String.prototype.ucfirst) {
        String.prototype.ucfirst = function() {
            var self = this;
            return self.charAt(0).toUpperCase() + self.slice(1);
        };
    }
    return String.prototype.ucfirst;
});
(function(definition) {
    window.qoopido.register("polyfill/string/lcfirst", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!String.prototype.lcfirst) {
        String.prototype.lcfirst = function() {
            var self = this;
            return self.charAt(0).toLowerCase() + self.slice(1);
        };
    }
    return String.prototype.lcfirst;
});
(function(definition) {
    window.qoopido.register("polyfill/window/getcomputedstyle", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.getComputedStyle) {
        var getComputedStyleRegex = new RegExp("(\\-([a-z]){1})", "g"), getComputedStyleCallback = function() {
            return arguments[2].toUpperCase();
        };
        return function(element, pseudo) {
            var self = this;
            self.getPropertyValue = function(property) {
                if (property === "float") {
                    property = "styleFloat";
                }
                if (getComputedStyleRegex.test(property)) {
                    property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
                }
                return element.currentStyle[property] || null;
            };
            return self;
        };
    } else {
        return window.getComputedStyle;
    }
});
(function(definition) {
    window.qoopido.register("polyfill/window/promise", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var STATE_PENDING = void 0, STATE_SEALED = 0, STATE_FULFILLED = 1, STATE_REJECTED = 2, queue = [];
    function addCallback(fn, arg) {
        var length = queue.push([ fn, arg ]);
        if (length === 1) {
            scheduleFlushCallbacks();
        }
    }
    function scheduleFlushCallbacks() {
        window.setTimeout(flushCallbacks, 1);
    }
    function flushCallbacks() {
        var i = 0, tuple;
        for (;(tuple = queue[i]) !== undefined; i++) {
            tuple[0](tuple[1]);
        }
        queue.length = 0;
    }
    function handleThenable(promise, value) {
        var then = null, resolved;
        try {
            if (promise === value) {
                throw new TypeError("A promises callback cannot return that same promise.");
            }
            if (typeof value === "function" || typeof value === "object" && value !== null) {
                then = value.then;
                if (typeof then === "function") {
                    then.call(value, function(val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        if (value !== val) {
                            resolve(promise, val);
                        } else {
                            fulfill(promise, val);
                        }
                    }, function(val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        reject(promise, val);
                    });
                    return true;
                }
            }
        } catch (exception) {
            if (resolved) {
                return true;
            }
            reject(promise, exception);
            return true;
        }
        return false;
    }
    function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
            resolve(promise, value);
        }
        function rejectPromise(reason) {
            reject(promise, reason);
        }
        try {
            resolver(resolvePromise, rejectPromise);
        } catch (exception) {
            rejectPromise(exception);
        }
    }
    function invokeCallback(settled, promise, callback, detail) {
        var hasCallback = typeof callback === "function", value, error, succeeded, failed;
        if (hasCallback) {
            try {
                value = callback(detail);
                succeeded = true;
            } catch (exception) {
                failed = true;
                error = exception;
            }
        } else {
            value = detail;
            succeeded = true;
        }
        if (handleThenable(promise, value)) {
            return;
        } else if (hasCallback && succeeded) {
            resolve(promise, value);
        } else if (failed) {
            reject(promise, error);
        } else if (settled === STATE_FULFILLED) {
            resolve(promise, value);
        } else if (settled === STATE_REJECTED) {
            reject(promise, value);
        }
    }
    function resolve(promise, value) {
        if (promise === value) {
            fulfill(promise, value);
        } else if (!handleThenable(promise, value)) {
            fulfill(promise, value);
        }
    }
    function fulfill(promise, value) {
        if (promise._state !== STATE_PENDING) {
            return;
        }
        promise._state = STATE_SEALED;
        promise._detail = value;
        addCallback(publishFulfillment, promise);
    }
    function reject(promise, reason) {
        if (promise._state !== STATE_PENDING) {
            return;
        }
        promise._state = STATE_SEALED;
        promise._detail = reason;
        addCallback(publishRejection, promise);
    }
    function publishFulfillment(promise) {
        publish(promise, promise._state = STATE_FULFILLED);
    }
    function publishRejection(promise) {
        publish(promise, promise._state = STATE_REJECTED);
    }
    function subscribe(parent, child, onFulfillment, onRejection) {
        var subscribers = parent._subscribers, length = subscribers.length;
        subscribers[length] = child;
        subscribers[length + STATE_FULFILLED] = onFulfillment;
        subscribers[length + STATE_REJECTED] = onRejection;
    }
    function publish(promise, settled) {
        var child, callback, subscribers = promise._subscribers, detail = promise._detail, i = 0;
        for (;(child = subscribers[i]) !== undefined; i += 3) {
            callback = subscribers[i + settled];
            invokeCallback(settled, child, callback, detail);
        }
        promise._subscribers = null;
    }
    function Promise(resolver) {
        var self = this;
        if (typeof resolver !== "function") {
            throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
        }
        self._subscribers = [];
        invokeResolver(resolver, self);
    }
    Promise.prototype = {
        _state: undefined,
        _detail: undefined,
        _subscribers: undefined,
        then: function(onFulfilled, onRejected) {
            var self = this, thenPromise = new Promise(function() {});
            if (self._state) {
                addCallback(function invokePromiseCallback() {
                    invokeCallback(self._state, thenPromise, arguments[self._state - 1], self._detail);
                });
            } else {
                subscribe(self, thenPromise, onFulfilled, onRejected);
            }
            return thenPromise;
        },
        "catch": function(onRejected) {
            return this.then(null, onRejected);
        }
    };
    if (!window.Promise) {
        window.Promise = Promise;
    }
    return window.Promise;
});
(function(definition) {
    var dependencies = [];
    if (!window.Promise) {
        dependencies.push("../polyfill/window/promise");
    }
    window.qoopido.register("promise/all", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return function all(promises) {
        if (Object.prototype.toString.call(promises) !== "[object Array]") {
            throw new TypeError("You must pass an array to all.");
        }
        return new window.Promise(function(resolve, reject) {
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
});
(function(definition) {
    var dependencies = [];
    if (!window.Promise) {
        dependencies.push("../polyfill/window/promise");
    }
    window.qoopido.register("promise/defer", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return function defer() {
        var self = this;
        self.promise = new window.Promise(function(resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
        });
    };
});
(function(definition) {
    var dependencies = [ "./base", "./promise/all", "./promise/defer" ];
    if (!String.prototype.ucfirst) {
        dependencies.push("./polyfill/string/ucfirst");
    }
    if (!String.prototype.lcfirst) {
        dependencies.push("./polyfill/string/lcfirst");
    }
    window.qoopido.registerSingleton("support", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var CombinedPromise = modules["promise/all"], DeferredPromise = modules["promise/defer"], matchPrefix = new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"), removeJsPrefix = new RegExp("^(?:webkit|khtml|icab|moz|ms|o)([A-Z])"), removeCssPrefix = new RegExp("^-(?:webkit|khtml|icab|moz|ms|o)-"), convertToCamelCase = new RegExp("-([a-z])", "gi"), convertToHyphens = new RegExp("([A-Z])", "g"), callbackUcfirst = function() {
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
            pElement = pElement || window;
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
            pElement = pElement || window;
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
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.promises.method[type] = lookup.promises.method[type] || {}, stored = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), method = this.getMethod(pMethod, pElement);
                !!method ? deferred.resolve(method) : deferred.reject();
                stored = lookup.promises.method[type][pMethod] = deferred.promise;
            }
            return stored;
        },
        testProperty: function(pProperty, pElement) {
            pElement = pElement || window;
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
});
(function(definition) {
    window.qoopido.register("function/merge", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
});
(function(definition) {
    window.qoopido.register("function/unique/uuid", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
});
(function(definition) {
    window.qoopido.registerSingleton("hook/event", definition, [ "../base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    function transferProperties(event, originalEvent, properties) {
        var i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
            event[property] = originalEvent[property];
        }
        event._properties = event._properties.concat(properties);
    }
    var hooks = {
        general: {
            properties: "type altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            process: function(event, originalEvent) {
                event.originalEvent = originalEvent;
                event.metaKey = originalEvent.metaKey && originalEvent.metaKey !== false ? true : false;
                if (!event.target) {
                    event.target = originalEvent.srcElement || document;
                }
                if (event.target.nodeType === 3) {
                    event.target = event.target.parentNode;
                }
            }
        },
        mouse: {
            regex: new RegExp("^(?:mouse|pointer|contextmenu|touch|click|dblclick|drag|drop)"),
            properties: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement relatedTarget which dataTransfer".split(" "),
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
            properties: "char charCode key keyCode which".split(" "),
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
});
(function(definition) {
    var dependencies = [ "../base", "../support" ];
    if (!window.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
    }
    window.qoopido.registerSingleton("hook/css", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var mSupport = modules["support"], getComputedStyle = window.getComputedStyle || modules["polyfill/window/getcomputedstyle"], hooks = {
        general: {
            get: function(element, property, value) {
                return getComputedStyle(element, null).getPropertyValue(property);
            },
            set: function(element, property, value) {
                element.style[property] = value;
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
            property = mSupport.getCssProperty(property, element)[1] || null;
            if (property) {
                return ((hook = this.get(property)) && hook[method] || this.get("general")[method])(element, property, value);
            }
        }
    });
});
(function(definition) {
    window.qoopido.register("dom/event", definition, [ "../base", "../hook/event" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
});
(function(definition) {
    var dependencies = [ "../base", "../function/unique/uuid", "../hook/css", "./event" ];
    if (!window.CustomEvent) {
        dependencies.push("../polyfill/window/customevent");
    }
    if (!window.addEventListener) {
        dependencies.push("../polyfill/window/addeventlistener");
    }
    if (!window.removeEventListener) {
        dependencies.push("../polyfill/window/removeeventlistener");
    }
    if (!window.dispatchEvent) {
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
    window.qoopido.register("dom/element", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var stringObject = "object", stringString = "string", generateUuid = modules["function/unique/uuid"], contentAttribute = "textContent" in document.createElement("a") ? "textContent" : "innerText", isTag = new RegExp("^<(\\w+)\\s*/>$"), matchEvent = new RegExp("^[^-]+"), pool = modules["pool/module"] && modules["pool/module"].create(modules["dom/event"], null, true) || null, storage = {}, hooks = modules["hook/css"], events = {
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
    return modules["base"].extend({
        type: null,
        element: null,
        _listener: null,
        _constructor: function(element, attributes, styles) {
            var self = this;
            element = resolveElement(element);
            self.type = element.tagName;
            self.element = element;
            self._listener = self._listener || {};
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
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
        getAttributes: function(attributes) {
            var self = this, result = {}, i = 0, attribute;
            if (attributes) {
                attributes = typeof attributes === stringString ? attributes.split(" ") : attributes;
                for (;(attribute = attributes[i]) !== undefined; i++) {
                    result[attribute] = self.element.getAttributes(attribute);
                }
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
        removeAttributes: function(attributes) {
            var self = this, i = 0, attribute;
            if (attributes) {
                attributes = typeof attributes === stringString ? attributes.split(" ") : attributes;
                for (;(attribute = attributes[i]) !== undefined; i++) {
                    self.element.removeAttribute(attribute);
                }
            }
            return self;
        },
        getStyle: function(property) {
            var self = this;
            if (property && typeof property === stringString) {
                return hooks.process("get", self.element, property);
            }
        },
        getStyles: function(properties) {
            var self = this, result = {}, i = 0, property;
            if (properties) {
                properties = typeof properties === stringString ? properties.split(" ") : properties;
                for (;(property = properties[i]) !== undefined; i++) {
                    result[property] = hooks.process("get", self.element, property);
                }
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
        removeStyles: function(properties) {
            var self = this, i = 0, property;
            if (properties) {
                properties = typeof properties === stringString ? properties.split(" ") : properties;
                for (;(property = properties[i]) !== undefined; i++) {
                    self.setStyle(property, "");
                }
            }
            return self;
        },
        siblings: function(selector) {
            var element = this.element, pointer = element.parentNode.firstChild, siblings = [];
            for (;pointer; pointer = pointer.nextSibling) {
                if (pointer.nodeType === 1 && pointer !== element) {
                    if (!selector || pointer.matches(selector)) {
                        siblings.push(pointer);
                    }
                }
            }
            return siblings;
        },
        siblingsBefore: function(selector) {
            var pointer = this.element.previousSibling, siblings = [];
            for (;pointer; pointer = pointer.previousSibling) {
                if (pointer.nodeType === 1) {
                    if (!selector || pointer.matches(selector)) {
                        siblings.push(pointer);
                    }
                }
            }
            return siblings;
        },
        siblingsAfter: function(selector) {
            var pointer = this.element.nextSibling, siblings = [];
            for (;pointer; pointer = pointer.nextSibling) {
                if (pointer.nodeType === 1) {
                    if (!selector || pointer.matches(selector)) {
                        siblings.push(pointer);
                    }
                }
            }
            return siblings;
        },
        previous: function(selector) {
            var pointer;
            if (!selector) {
                return this.element.previousSibling;
            } else {
                pointer = this.element.previousSibling;
                for (;pointer; pointer = pointer.previousSibling) {
                    if (pointer.nodeType === 1 && pointer.matches(selector)) {
                        return pointer;
                    }
                }
            }
        },
        next: function(selector) {
            var pointer;
            if (!selector) {
                return this.element.nextSibling;
            } else {
                pointer = this.element.nextSibling;
                for (;pointer; pointer = pointer.nextSibling) {
                    if (pointer.nodeType === 1 && pointer.matches(selector)) {
                        return pointer;
                    }
                }
            }
        },
        find: function(selector) {
            return this.element.querySelectorAll(selector);
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
            var element = this.element;
            return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
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
        hide: function() {
            return this.setStyle("display", "none");
        },
        show: function() {
            return this.removeStyle("display");
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
                    var uuid = event._quid || (event._quid = generateUuid()), delegateTo;
                    if (!storage[uuid]) {
                        storage[uuid] = pool && pool.obtain(event) || modules["dom/event"].create(event);
                    }
                    event = storage[uuid];
                    delegateTo = event.delegate;
                    window.clearTimeout(event._timeout);
                    if (!delegate || event.target.matches(delegate)) {
                        fn.call(event.target, event, event.originalEvent.detail);
                    }
                    if (delegateTo) {
                        delete event.delegate;
                        emitEvent.call(self, delegateTo, null, event._quid);
                    }
                    event._timeout = window.setTimeout(function() {
                        delete storage[uuid];
                        delete event._timeout;
                        event.dispose && event.dispose();
                    }, 5e3);
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
                fn.call(self, event, event.originalEvent.detail);
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
});
(function(definition) {
    window.qoopido.register("dom/element/emerge", definition, [ "../element", "../../function/merge", "../../function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var defaults = {
        interval: 50,
        threshold: "auto",
        recur: true,
        auto: 1,
        visibility: true
    }, documentElement = window.document.documentElement, viewport = {}, intervals = {}, elements = {}, prototype, EVENT_EMERGED = "emerged", EVENT_DEMERGED = "demerged", DOM_RESIZE = "resize orientationchange";
    window = modules["dom/element"].create(window);
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
            window.element.clearInterval(intervals[interval]);
            delete intervals[interval];
        }
    }
    function globalOnResize() {
        viewport.left = 0;
        viewport.top = 0;
        viewport.right = window.innerWidth || documentElement.clientWidth;
        viewport.bottom = window.innerHeight || documentElement.clientHeight;
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
            var self = this;
            prototype._parent._constructor.call(self, element);
            settings = modules["function/merge"]({}, defaults, settings || {});
            if (settings.threshold === "auto") {
                delete settings.threshold;
            }
            if (intervals[settings.interval] === undefined) {
                elements[settings.interval] = elements[settings.interval] || {
                    length: 0
                };
                intervals[settings.interval] = window.element.setInterval(function() {
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
            window.on(DOM_RESIZE, function() {
                instanceOnResize.call(self);
            });
            instanceOnResize.call(self);
        },
        remove: function() {
            var self = this;
            delete elements[self._settings.interval][self._quid];
            elements[self._settings.interval].length--;
        }
    });
    window.on(DOM_RESIZE, globalOnResize);
    globalOnResize();
    return prototype;
});
(function(definition) {
    window.qoopido.register("dom/element/lazyimage", definition, [ "./emerge", "../../function/merge" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
            var self = this;
            prototype._parent._constructor.call(self, element, modules["function/merge"]({}, defaults, settings || {}));
            self.on(EVENT_EMERGED, function onEmerge(event) {
                if (queue === 0 || event.data === 1) {
                    self.remove();
                    self.off(EVENT_EMERGED, onEmerge);
                    load.call(self);
                }
            });
        }
    });
    return prototype;
});