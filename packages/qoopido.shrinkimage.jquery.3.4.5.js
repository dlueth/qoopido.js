/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-13
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
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
        var descriptors = {}, properties = Object.getOwnPropertyNames(object), i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
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
    window.qoopido.register("function/unique/string", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var lookup = {}, characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    function generateString(length) {
        var result = "", i = 0;
        length = parseInt(length, 10) || 12;
        for (;i < length; i++) {
            result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
        }
        return result;
    }
    return function(length) {
        var result;
        do {
            result = generateString(length);
        } while (typeof lookup[result] !== "undefined");
        lookup[result] = true;
        return result;
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
    window.qoopido.register("proxy", definition, [ "./base", "./function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["base"].extend({
        _constructor: function(context, fn) {
            var args = Array.prototype.splice.call(arguments, 2), proxy = function() {
                return fn.apply(context, Array.prototype.slice.call(arguments, 0).concat(args));
            };
            proxy._quid = modules["function/unique/uuid"]();
            return proxy;
        }
    });
});
(function(definition) {
    var dependencies = [ "../base", "../function/unique/uuid", "./event" ];
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
    if (!window.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
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
    var IE = function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 0; i--) {
                var div = document.createElement("div");
                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";
                if (div.getElementsByTagName("span").length) {
                    return i;
                }
            }
        }
        return undefined;
    }(), stringObject = "object", stringString = "string", stringNumber = "number", getComputedStyle = window.getComputedStyle || modules["polyfill/window/getcomputedstyle"], generateUuid = modules["function/unique/uuid"], contentAttribute = "textContent" in document.createElement("a") ? "textContent" : "innerText", isTag = new RegExp("^<(\\w+)\\s*/>$"), pool = modules["pool/module"] && modules["pool/module"].create(modules["dom/event"]) || null, storage = {
        elements: {},
        events: {}
    }, styleHooks = {
        opacity: IE <= 8 ? {
            map: "filter",
            regex: new RegExp("alpha\\(opacity=(.*)\\)", "i"),
            getValue: function(value) {
                value = value.toString().match(this.regex);
                if (value) {
                    value = value[1] / 100;
                } else {
                    value = 1;
                }
                return value;
            },
            setValue: function(value) {
                return {
                    zoom: 1,
                    opacity: value,
                    filter: "alpha(opacity=" + (value * 100 + .5 >> 0) + ")"
                };
            }
        } : null
    };
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
            throw new Error("Element could not be resolved");
        }
        return element;
    }
    function emitEvent(event, detail, uuid) {
        var self = this;
        event = new window.CustomEvent(event, {
            bubbles: event === "load" ? false : true,
            cancelable: true,
            detail: detail
        });
        if (uuid) {
            event._quid = uuid;
            event.isDelegate = true;
        }
        self.element.dispatchEvent(event);
    }
    return modules["base"].extend({
        type: null,
        element: null,
        _listener: null,
        _constructor: function(element, attributes, styles) {
            var self = this, uuid;
            self._listener = {};
            element = resolveElement(element);
            uuid = element._quid || null;
            if (uuid && storage.elements[uuid]) {
                return storage.elements[uuid];
            } else {
                self.type = element.tagName;
                self.element = element;
                uuid = generateUuid();
                element._quid = uuid;
                storage.elements[uuid] = self;
            }
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
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
                attribute = attribute.split(" ");
                if (attribute.length === 1) {
                    return self.element.getAttribute(attribute[0]);
                } else {
                    return self.getAttributes(attribute);
                }
            }
        },
        getAttributes: function(attributes) {
            var self = this, result = {};
            if (attributes) {
                attributes = typeof attributes === stringString ? attributes.split(" ") : attributes;
                if (typeof attributes === stringObject && attributes.length) {
                    var i = 0, attribute;
                    for (;(attribute = attributes[i]) !== undefined; i++) {
                        result[attribute] = self.element.getAttributes(attribute);
                    }
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
                attribute = attribute.split(" ");
                if (attribute.length === 1) {
                    self.element.removeAttribute(attribute[0]);
                } else {
                    self.removeAttributes(attribute);
                }
            }
            return self;
        },
        removeAttributes: function(attributes) {
            var self = this, i = 0, attribute;
            if (attributes) {
                attributes = typeof attributes === stringString ? attributes.split(" ") : attributes;
                if (typeof attributes === stringObject && attributes.length) {
                    for (;(attribute = attributes[i]) !== undefined; i++) {
                        self.element.removeAttribute(attribute);
                    }
                }
            }
            return self;
        },
        getStyle: function(property) {
            var self = this, map, value;
            if (property && typeof property === stringString) {
                property = property.split(" ");
                if (property.length === 1) {
                    property = property[0];
                    map = styleHooks[property] && styleHooks[property].map || property;
                    value = getComputedStyle(self.element, null).getPropertyValue(map);
                    return styleHooks[property] && styleHooks[property].getValue && styleHooks[property].getValue(value) || value;
                } else {
                    return self.getStyles(property);
                }
            }
        },
        getStyles: function(properties) {
            var self = this, result = {}, i = 0, property, map, value;
            if (properties) {
                properties = typeof properties === stringString ? properties.split(" ") : properties;
                if (typeof properties === stringObject && properties.length) {
                    for (;(property = properties[i]) !== undefined; i++) {
                        map = styleHooks[property] && styleHooks[property].map || property;
                        value = getComputedStyle(self.element, null).getPropertyValue(map);
                        return styleHooks[property] && styleHooks[property].getValue && styleHooks[property].getValue(value) || value;
                    }
                }
            }
            return result;
        },
        setStyle: function(property, value) {
            var self = this;
            if (property && typeof property === stringString) {
                value = styleHooks[property] && styleHooks[property].setValue && styleHooks[property].setValue(value) || value;
                if (typeof value === stringString || typeof value === stringNumber) {
                    self.element.style[property] = value;
                } else {
                    for (property in value) {
                        self.element.style[property] = value[property];
                    }
                }
            }
            return self;
        },
        setStyles: function(properties) {
            var self = this, property, value;
            if (properties && typeof properties === stringObject && !properties.length) {
                for (property in properties) {
                    value = styleHooks[property] && styleHooks[property].setValue && styleHooks[property].setValue(properties[property]) || properties[property];
                    if (typeof value === stringString || typeof value === stringNumber) {
                        self.element.style[property] = properties[property];
                    } else {
                        for (property in value) {
                            self.element.style[property] = value[property];
                        }
                    }
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
            return new RegExp("(?:^|\\s)" + name + "(?:\\s|$)").test(this.element.className);
        },
        addClass: function(name) {
            var self = this, temp;
            if (!self.hasClass(name)) {
                temp = self.element.className.split(" ");
                temp.push(name);
                self.element.className = temp.join(" ");
            }
            return self;
        },
        removeClass: function(name) {
            var self = this;
            if (self.hasClass(name)) {
                self.element.className = self.element.className.replace(new RegExp("(?:^|\\s)" + name + "(?!\\S)"));
            }
            return self;
        },
        toggleClass: function(name) {
            var self = this;
            self.hasClass(name) ? self.removeClass(name) : self.addClass(name);
            return self;
        },
        prepend: function(element) {
            var self = this, target = self.element;
            element = element.element || resolveElement(element);
            target.firstChild ? target.insertBefore(element, target.firstChild) : self.append(element);
            return self;
        },
        append: function(element) {
            var self = this;
            self.element.appendChild(element.element || resolveElement(element));
            return self;
        },
        replaceWith: function(element) {
            var self = this, target = self.element;
            element = element.element || resolveElement(element);
            target.parentNode.replaceChild(element, target);
            return self;
        },
        prependTo: function(target) {
            var self = this, element = self.element;
            (target = target.element || resolveElement(target)).firstChild ? target.insertBefore(element, target.firstChild) : self.appendTo(target);
            return self;
        },
        appendTo: function(target) {
            var self = this;
            (target.element || resolveElement(target)).appendChild(self.element);
            return self;
        },
        insertBefore: function(target) {
            var self = this, element = self.element;
            (target = target.element || resolveElement(target)).parentNode.insertBefore(element, target);
            return self;
        },
        insertAfter: function(target) {
            var self = this, element = self.element;
            (target = target.element || resolveElement(target)).nextSibling ? target.parentNode.insertBefore(element, target.nextSibling) : self.appendTo(target.parentNode);
            return self;
        },
        replace: function(target) {
            var self = this, element = self.element;
            (target = target.element || resolveElement(target)).parentNode.replaceChild(element, target);
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
                    var uuid = event._quid || (event._quid = generateUuid()), delegateTo;
                    if (!storage.events[uuid]) {
                        storage.events[uuid] = pool && pool.obtain(event) || modules["dom/event"].create(event);
                    }
                    event = storage.events[uuid];
                    delegateTo = event.delegate;
                    window.clearTimeout(event._timeout);
                    if (!delegate || event.target.matches(delegate)) {
                        fn.call(self, event, event.originalEvent.detail);
                    }
                    if (delegateTo) {
                        delete event.delegate;
                        emitEvent.call(self, delegateTo, null, event._quid);
                    }
                    event._timeout = window.setTimeout(function() {
                        delete storage.events[uuid];
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
    window.qoopido.registerSingleton("url", definition, [ "./base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var urlCurrent, regexLocal, regexParameter = new RegExp("[?&]?([^=]+)=([^&]*)", "g");
    try {
        urlCurrent = location;
    } catch (exception) {
        urlCurrent = getResolver();
    }
    regexLocal = new RegExp("".concat("^", urlCurrent.protocol, "//", urlCurrent.hostname), "i");
    function getResolver(url) {
        var resolver = document.createElement("a");
        resolver.href = url || "";
        return resolver;
    }
    return modules["base"].extend({
        resolve: function(url) {
            return getResolver(url).href;
        },
        redirect: function redirect(url, target) {
            target = target || window;
            target.location.href = this.resolve(url);
        },
        getParameter: function(url) {
            var params = {}, querystring = getResolver(url).search.split("+").join(" "), tokens;
            while (tokens = regexParameter.exec(querystring)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        },
        isLocal: function(url) {
            return regexLocal.test(this.resolve(url));
        }
    });
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
    window.qoopido.registerSingleton("support", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var CombinedPromise = modules["promise/all"], DeferredPromise = modules["promise/defer"], regexPrefix = new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"), regexProperty = new RegExp("-([a-z])", "gi"), regexCss = new RegExp("([A-Z])", "g"), callbackUcfirst = function() {
        return arguments[1].ucfirst();
    }, lookup = {
        prefix: null,
        method: {},
        property: {},
        css: {},
        element: {},
        promises: {
            prefix: null,
            method: {},
            property: {},
            css: {},
            test: {}
        }
    };
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
                    if (regexPrefix.test(property)) {
                        stored = property.match(regexPrefix)[0];
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
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.method[type] = lookup.method[type] || {}, stored = pointer[pMethod] = lookup.method[type][pMethod] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uMethod = pMethod.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pMethod + " " + prefixes.join(uMethod + " ") + uMethod).split(" ");
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
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.property[type] = lookup.property[type] || {}, stored = pointer[pProperty] = lookup.property[type][pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uProperty = pProperty.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" ");
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
            pProperty = pProperty.replace(regexProperty, callbackUcfirst);
            var self = this, stored = lookup.css[pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidate, i = 0, sample = self.pool ? self.pool.obtain("div") : document.createElement("div"), uProperty = pProperty.ucfirst(), prefixes = this.getPrefix() || [], candidates = (pProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" "), prefix = "";
                for (i; (candidate = candidates[i]) !== undefined; i++) {
                    if (sample.style[candidate] !== undefined) {
                        stored = candidate;
                        if (i > 0) {
                            prefix = "-";
                        }
                        break;
                    }
                }
                lookup.css[pProperty] = stored !== false ? [ prefix + stored.replace(regexCss, "-$1").toLowerCase(), stored ] : false;
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
    window.qoopido.register("support/capability/datauri", definition, [ "../../support", "../../dom/element" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/capability/datauri", function(deferred) {
        var sample = modules["dom/element"].create(support.pool ? support.pool.obtain("img") : document.createElement("img"));
        sample.one("error load", function(event) {
            if (event.type === "load" && sample.element.width === 1 && sample.element.height === 1) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
            sample.element.dispose && sample.element.dispose();
        }, false).setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
    });
});
(function(definition) {
    window.qoopido.register("support/element/canvas", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/canvas", function(deferred) {
        var sample = support.pool ? support.pool.obtain("canvas") : document.createElement("canvas");
        sample.getContext && sample.getContext("2d") ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
});
(function(definition) {
    window.qoopido.register("support/element/canvas/todataurl", definition, [ "../../../support", "../canvas" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/canvas/todataurl", function(deferred) {
        modules["support/element/canvas"]().then(function() {
            var sample = support.pool ? support.pool.obtain("canvas") : document.createElement("canvas");
            sample.toDataURL !== undefined ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
});
(function(definition) {
    window.qoopido.register("support/element/canvas/todataurl/png", definition, [ "../../../../support", "../todataurl" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/canvas/todataurl/png", function(deferred) {
        modules["support/element/canvas/todataurl"]().then(function() {
            var sample = support.pool ? support.pool.obtain("canvas") : document.createElement("canvas");
            sample.toDataURL("image/png").indexOf("data:image/png") === 0 ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
});
(function(definition) {
    window.qoopido.register("transport", definition, [ "./base", "./function/merge" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype;
    prototype = modules["base"].extend({
        setup: function(options) {
            var self = this;
            self._settings = modules["function/merge"]({}, self._settings, options);
            return self;
        },
        serialize: function(obj, prefix) {
            var parameter = [], id, key, value;
            for (id in obj) {
                key = prefix ? "".concat(prefix, "[", id, "]") : id;
                value = obj[id];
                parameter.push(typeof value === "object" ? this.serialize(value, key) : "".concat(encodeURIComponent(key), "=", encodeURIComponent(value)));
            }
            return parameter.join("&");
        }
    });
    return prototype;
}, window, document);
(function(definition) {
    window.qoopido.registerSingleton("transport/xhr", definition, [ "../transport", "../function/merge", "../function/unique/string", "../url", "../promise/defer" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, DeferredPromise = modules["promise/defer"], getXhr = typeof window.XMLHttpRequest !== "undefined" ? function(url) {
        if (modules["url"].isLocal(url)) {
            return new window.XMLHttpRequest();
        } else {
            return window.XDomainRequest ? new window.XDomainRequest() : new window.XMLHttpRequest();
        }
    } : function() {
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        } catch (exception) {
            return null;
        }
    };
    function sendRequest(method, url, content) {
        var self = this, xhr = self.xhr, settings = self.settings, id;
        content = content && typeof content === "object" ? self.serialize(content) : content;
        url = settings.cache === false ? "".concat(url, url.indexOf("?") > -1 ? "&" : "?", "_=" + new Date().getTime()) : url;
        url = content && method === "GET" ? "".concat(url, url.indexOf("?") > -1 ? "&" : "?", content) : url;
        for (id in settings.xhrOptions) {
            xhr[id] = settings.xhrOptions[id];
        }
        xhr.open(method, url, settings.async, settings.username, settings.password);
        if (xhr.setRequestHeader) {
            xhr.setRequestHeader("Accept", settings.accept);
            if (content && method !== "GET") {
                xhr.setRequestHeader("Content-Type", settings.contentType);
            }
            for (id in settings.header) {
                xhr.setRequestHeader(id, settings.header[id]);
            }
        }
        xhr.timeout = settings.timeout;
        xhr.onprogress = function(event) {
            onProgress.call(self, event);
        };
        xhr.onreadystatechange = xhr.onload = function() {
            onReadyStateChange.call(self);
        };
        xhr.onerror = function() {
            onError.call(self);
        };
        xhr.send(content || null);
        self.timeout = setTimeout(function() {
            onTimeout.call(self);
        }, settings.timeout);
    }
    function onProgress(event) {
        var self = this;
        if (self.timeout) {
            clearTimeout(self.timeout);
        }
        self.timeout = setTimeout(function() {
            onTimeout.call(self);
        }, self.settings.timeout);
    }
    function onReadyStateChange() {
        var self = this, xhr = self.xhr, dfd = self.dfd;
        if (xhr.readyState === undefined || xhr.readyState === 4) {
            clear.call(self);
            if (xhr.status === undefined || xhr.status === 200) {
                dfd.resolve({
                    data: xhr.responseText,
                    xhr: xhr
                });
            } else {
                dfd.reject({
                    status: xhr.status,
                    xhr: xhr
                });
            }
        }
    }
    function onError() {
        var self = this;
        clear.call(self);
        self.dfd.reject();
    }
    function onTimeout() {
        var self = this;
        self.xhr.abort();
        clear.call(self);
        self.dfd.reject();
    }
    function clear() {
        var self = this, xhr = self.xhr;
        if (self.timeout) {
            clearTimeout(self.timeout);
        }
        xhr.onprogress = xhr.onreadystatechange = xhr.onerror = null;
    }
    prototype = modules["transport"].extend({
        _settings: {
            accept: "*/*",
            timeout: 5e3,
            async: true,
            cache: false,
            header: {},
            username: null,
            password: null,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8 ",
            xhrOptions: {}
        },
        load: function(method, url, data, options) {
            var context = {};
            url = modules["url"].resolve(url);
            context.url = url;
            context.id = "".concat("xhr-", modules["function/unique/string"]());
            context.dfd = new DeferredPromise();
            context.xhr = getXhr(url);
            context.settings = modules["function/merge"]({}, this._settings, options);
            context.timeout = null;
            sendRequest.call(context, method.toUpperCase(), url, data);
            return context.dfd.promise;
        },
        get: function(url, data, options) {
            return this.load("GET", url, data, options);
        },
        post: function(url, data, options) {
            return this.load("POST", url, data, options);
        },
        put: function(url, data, options) {
            return this.load("PUT", url, data, options);
        },
        "delete": function(url, data, options) {
            return this.load("DELETE", url, data, options);
        },
        head: function(url, data, options) {
            return this.load("HEAD", url, data, options);
        }
    });
    return prototype;
}, window, document);
(function(definition) {
    var dependencies = [ "../element", "../../proxy", "../../function/merge", "../../url", "../../support", "../../support/capability/datauri", "../../support/element/canvas/todataurl/png", "../../transport/xhr" ];
    window.qoopido.register("dom/element/shrinkimage", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var JSON = window.JSON, name = namespace.pop(), defaults = {
        attribute: "data-" + name,
        quality: 80,
        debug: false
    }, pool = shared.pool && shared.pool.dom || null, lookup = {}, regexBackground = new RegExp('^url\\x28"{0,1}data:image/shrink,(.+?)"{0,1}\\x29$', "i"), regexPath = new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', "i"), regexSuffix = new RegExp("\\.png$", "i"), supported = modules["support"].testMultiple("/capability/datauri", "/element/canvas/todataurl/png"), prototype, loader, EVENT_QUEUED = "queued", EVENT_CACHED = "cached", EVENT_LOADED = "loaded", EVENT_FAILED = "failed", EVENT_STATE = "".concat(EVENT_LOADED, " ", EVENT_FAILED), DOM_LOAD = "load", DOM_ERROR = "error", DOM_STATE = "".concat(DOM_LOAD, " ", DOM_ERROR);
    function processMain(url, isBackground) {
        url = modules["url"].resolve(regexPath.exec(url)[1]);
        isBackground = isBackground ? true : false;
        var self = this, settings = modules["function/merge"]({}, self._settings, modules["url"].getParameter(url)), target = settings.target || (url = url.split("?")[0]).replace(regexSuffix, "".concat(".q", settings.quality, ".shrunk"));
        if (!isBackground) {
            self.removeAttribute(self._settings.attribute).hide();
        }
        supported.then(function() {
            if (settings.debug === true) {
                throw new Error("debug enabled");
            }
            switch (typeof lookup[target]) {
              case "object":
                lookup[target].one(EVENT_LOADED, function(event) {
                    assign.call(self, event.data, isBackground);
                });
                self.emit(EVENT_QUEUED);
                break;

              case "string":
                assign.call(self, lookup[target], isBackground);
                break;

              default:
                lookup[target] = loader.create(target, !isBackground ? self._element : null).one(EVENT_STATE, function(event, data) {
                    if (event.type === EVENT_LOADED) {
                        lookup[target] = data;
                        self.emit(EVENT_CACHED);
                        assign.call(self, data, isBackground);
                    } else {
                        lookup[target] = url;
                        assign.call(self, url, isBackground);
                    }
                }, false);
                break;
            }
        })["catch"](function() {
            lookup[target] = url;
            assign.call(self, url, isBackground);
        });
    }
    function assign(source, isBackground) {
        var self = this;
        if (isBackground) {
            self.setStyle("backgroundImage", "url(" + source + ")");
            self.emit(EVENT_LOADED);
        } else {
            self.one(DOM_LOAD, function() {
                self.show();
                self.emit(EVENT_LOADED);
            }).setAttribute("src", source);
        }
    }
    function processTransport(transport) {
        var self = this;
        transport.get(self._url).then(function(response) {
            try {
                var data = JSON.parse(response.data);
                data.width = parseInt(data.width, 10);
                data.height = parseInt(data.height, 10);
                processData.call(self, data);
            } catch (exception) {
                self.emit(EVENT_FAILED);
            }
        }, function() {
            self.emit(EVENT_FAILED);
        });
    }
    function processData(data) {
        var canvas, context, self = this, onLoadMain = function(event) {
            canvas = pool && pool.obtain("canvas") || document.createElement("canvas");
            canvas.style.display = "none";
            canvas.width = data.width;
            canvas.height = data.height;
            context = canvas.getContext("2d");
            context.clearRect(0, 0, data.width, data.height);
            context.drawImage(self.element, 0, 0, data.width, data.height);
            self.one(DOM_LOAD, onLoadAlpha).setAttribute("src", data.alpha);
            return suppressEvent(event);
        }, onLoadAlpha = function(event) {
            var result;
            context.globalCompositeOperation = "xor";
            context.drawImage(self.element, 0, 0, data.width, data.height);
            result = canvas.toDataURL("image/png");
            dispose();
            self.emit(EVENT_LOADED, result);
            return suppressEvent(event);
        }, dispose = function() {
            if (canvas) {
                canvas.dispose && canvas.dispose();
            }
            self.element.dispose && self.element.dispose();
        };
        self.one(DOM_STATE, function(event) {
            if (event.type === DOM_LOAD) {
                onLoadMain.call(this, event);
            } else {
                dispose();
                self.emit(EVENT_FAILED);
            }
        }, false).setAttribute("src", data.main);
    }
    function suppressEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    prototype = modules["dom/element"].extend({
        _constructor: function(element, settings) {
            var self = this, foreground, background;
            prototype._parent._constructor.call(self, element);
            self._settings = settings = modules["function/merge"]({}, defaults, settings);
            foreground = self.getAttribute(settings.attribute);
            background = self.getStyle("backgroundImage");
            if (self.type === "IMG") {
                processMain.call(self, foreground);
            }
            if (background !== "none" && regexBackground.test(background)) {
                processMain.call(self, background, true);
            }
        },
        hide: function() {
            this.setStyles({
                visibility: "hidden",
                opacity: 0
            });
        },
        show: function() {
            this.setStyles({
                visibility: "",
                opacity: ""
            });
        }
    });
    loader = modules["dom/element"].extend({
        _url: null,
        _constructor: function(url, element) {
            var self = this;
            if (!element) {
                element = pool && pool.obtain("img") || document.createElement("img");
            }
            loader._parent._constructor.call(self, element);
            self._url = url;
            processTransport.call(self, modules["transport/xhr"]);
        }
    });
    return prototype;
}, window);
(function(definition) {
    window.qoopido.register("jquery/plugins/shrinkimage", definition, [ "../../dom/element/shrinkimage", "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, name = namespace.pop(), prototype, EVENT_QUEUED = "queued", EVENT_CACHED = "cached", EVENT_LOADED = "loaded", EVENT_FAILED = "failed", JQUERY_QUEUED = "".concat(EVENT_QUEUED, ".", name), JQUERY_CACHED = "".concat(EVENT_CACHED, ".", name), JQUERY_LOADED = "".concat(EVENT_LOADED, ".", name), JQUERY_FAILED = "".concat(EVENT_FAILED, ".", name);
    jQuery.fn[name] = function(settings) {
        return this.each(function() {
            prototype.create(this, settings);
        });
    };
    prototype = modules["dom/element/shrinkimage"].extend({
        _constructor: function(element, settings) {
            var self = this, object = jQuery(element);
            prototype._parent._constructor.call(self, element, settings);
            self.on(EVENT_QUEUED, function() {
                object.trigger(JQUERY_QUEUED);
            });
            self.on(EVENT_CACHED, function() {
                object.trigger(JQUERY_CACHED);
            });
            self.on(EVENT_LOADED, function() {
                object.trigger(JQUERY_LOADED);
            });
            self.on(EVENT_FAILED, function() {
                object.trigger(JQUERY_FAILED);
            });
        }
    });
    return prototype;
});