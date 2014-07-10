/*!
* Qoopido.js library
*
* version: 3.4.2
* date:    2014-6-10
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
        if (typeof define === "function" && define.amd) {
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
                for (i = 0; (listener = self._listener[event][i]) !== undefined; i++) {
                    listener.apply(self, arguments);
                }
            }
            return self;
        }
    });
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
    window.qoopido.register("polyfill/window/getcomputedstyle", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.getComputedStyle) {
        var getComputedStyleRegex = new RegExp("(\\-([a-z]){1})", "g"), getComputedStyleCallback = function() {
            return arguments[2].toUpperCase();
        };
        return function(element, pseudo) {
            var self = this;
            self.element = element;
            self.getPropertyValue = function(property) {
                if (property === "float") {
                    property = "styleFloat";
                }
                if (getComputedStyleRegex.test(property)) {
                    property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
                }
                return element.currentStyle[property] ? element.currentStyle[property] : null;
            };
            return self;
        };
    } else {
        return window.getComputedStyle;
    }
});
(function(definition) {
    var dependencies = [ "../proxy" ];
    if (!window.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
    }
    window.qoopido.register("dom/element", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var attachListener, detachListener, emitEvent, stringObject = "object", stringString = "string", getComputedStyle = window.getComputedStyle || modules["polyfill/window/getcomputedstyle"];
    function normalizeEvent(event) {
        event = event || window.event;
        if (!event.target) {
            event.target = event.srcElement || document;
        }
        if (event.target.nodeType === 3) {
            event.target = event.target.parentNode;
        }
        if (!event.relatedTarget && event.fromElement) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        }
        return event;
    }
    attachListener = window.addEventListener ? function(name, fn) {
        var self = this, element = self.element, luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        element[luid] = function(event) {
            fn.call(this, normalizeEvent(event));
        };
        element.addEventListener(name, element[luid], false);
    } : function(name, fn) {
        var self = this, element = self.element, luid;
        luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        if (element["on" + name] !== undefined) {
            element[luid] = function(event) {
                fn.call(this, normalizeEvent(event || window.event));
            };
            element.attachEvent("on" + name, element[luid]);
        } else {
            name = "".concat("fake[", name, "]");
            element[name] = null;
            element[luid] = function(event) {
                if (event.propertyName === name) {
                    fn.call(this, normalizeEvent(element[name]));
                }
            };
            element.attachEvent("onpropertychange", element[luid]);
        }
    };
    detachListener = window.removeEventListener ? function(name, fn) {
        var self = this, element = self.element, luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        element.removeEventListener(name, element[luid], false);
        delete element[luid];
    } : function(name, fn) {
        var self = this, element = self.element, luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        if (element["on" + name] !== undefined) {
            element.detachEvent("on" + name, element[luid]);
        } else {
            element.detachEvent("onpropertychange", element[luid]);
        }
        delete element[luid];
    };
    emitEvent = document.createEvent ? function(type, data) {
        var self = this, element = self.element, event = document.createEvent("HTMLEvents");
        event.initEvent(type, true, true);
        event.data = data;
        element.dispatchEvent(event);
    } : function(type, data) {
        var self = this, element = self.element, event = document.createEventObject();
        event.type = event.eventType = type;
        event.data = data;
        try {
            element.fireEvent("on" + event.eventType, event);
        } catch (exception) {
            var name = "".concat("fake[", type, "]");
            if (element[name] !== undefined) {
                element[name] = event;
            }
        }
    };
    return modules["base"].extend({
        type: null,
        element: null,
        listener: null,
        _constructor: function(element) {
            var self = this;
            if (!element) {
                throw new Error("Missing element argument");
            }
            self.type = element.tagName;
            self.element = element;
            self.listener = {};
        },
        getAttribute: function(attribute) {
            if (attribute && typeof attribute === stringString) {
                var self = this;
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
                    var i, attribute;
                    for (i = 0; (attribute = attributes[i]) !== undefined; i++) {
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
            var self = this;
            if (attributes && typeof attributes === stringObject && !attributes.length) {
                var attribute;
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
            var self = this;
            if (attributes) {
                attributes = typeof attributes === stringString ? attributes.split(" ") : attributes;
                if (typeof attributes === stringObject && attributes.length) {
                    var i, attribute;
                    for (i = 0; (attribute = attributes[i]) !== undefined; i++) {
                        self.element.removeAttribute(attribute);
                    }
                }
            }
            return self;
        },
        getStyle: function(property) {
            if (property && typeof property === stringString) {
                var self = this;
                property = property.split(" ");
                if (property.length === 1) {
                    return getComputedStyle(self.element, null).getPropertyValue(property[0]);
                } else {
                    return self.getStyles(property);
                }
            }
        },
        getStyles: function(properties) {
            var self = this, result = {};
            if (properties) {
                properties = typeof properties === stringString ? properties.split(" ") : properties;
                if (typeof properties === stringObject && properties.length) {
                    var i, property;
                    for (i = 0; (property = properties[i]) !== undefined; i++) {
                        result[property] = getComputedStyle(self.element, null).getPropertyValue(property);
                    }
                }
            }
            return result;
        },
        setStyle: function(property, value) {
            var self = this;
            if (property && typeof property === stringString) {
                self.element.style[property] = value;
            }
            return self;
        },
        setStyles: function(properties) {
            var self = this;
            if (properties && typeof properties === stringObject && !properties.length) {
                var property;
                for (property in properties) {
                    self.element.style[property] = properties[property];
                }
            }
            return self;
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
                self.element.className = self.element.className.replace(new RegExp("(?:^|\\s)" + name + "(?!\\S)"), "");
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
            element = element.element || element;
            target.firstChild ? target.insertBefore(element, target.firstChild) : self.append(element);
            return self;
        },
        append: function(element) {
            var self = this;
            self.element.appendChild(element.element || element);
            return self;
        },
        replaceWith: function(element) {
            var self = this, target = self.element;
            element = element.element || element;
            target.parentNode.replaceChild(element, target);
            return self;
        },
        prependTo: function(target) {
            var self = this, element = self.element;
            (target = target.element || target).firstChild ? target.insertBefore(element, target.firstChild) : self.appendTo(target);
            return self;
        },
        appendTo: function(target) {
            var self = this;
            (target.element || target).appendChild(self.element);
            return self;
        },
        insertBefore: function(target) {
            var self = this, element = self.element;
            (target = target.element || target).parentNode.insertBefore(element, target);
            return self;
        },
        insertAfter: function(target) {
            var self = this, element = self.element;
            (target = target.element || target).nextSibling ? target.parentNode.insertBefore(element, target.nextSibling) : self.appendTo(target.parentNode);
            return self;
        },
        replace: function(target) {
            var self = this, element = self.element;
            (target = target.element || target).parentNode.replaceChild(element, target);
            return self;
        },
        remove: function() {
            var self = this, element = self.element;
            element.parentNode.removeChild(element);
            return self;
        },
        on: function(events, fn) {
            var self = this, i, listener;
            events = events.split(" ");
            for (i = 0; (listener = events[i]) !== undefined; i++) {
                (self.listener[listener] = self.listener[listener] || []).push(fn);
                attachListener.call(self, listener, fn);
            }
            return self;
        },
        one: function(events, fn, each) {
            each = each !== false;
            var self = this, listener = modules["proxy"].create(self, function(event) {
                self.off(each === true ? event.type : events, listener);
                fn.call(self, event);
            });
            self.on(events, listener);
            return self;
        },
        off: function(events, fn) {
            var self = this, i, event, j, listener;
            if (events) {
                events = events.split(" ");
                for (i = 0; (event = events[i]) !== undefined; i++) {
                    self.listener[event] = self.listener[event] || [];
                    if (fn) {
                        for (j = 0; (listener = self.listener[event][j]) !== undefined; j++) {
                            if (listener === fn) {
                                self.listener[event].splice(j, 1);
                                detachListener.call(self, event, listener);
                                j--;
                            }
                        }
                    } else {
                        while (self.listener[event].length > 0) {
                            detachListener.call(self, event, self.listener[event].pop());
                        }
                    }
                }
            } else {
                for (event in self.listener) {
                    while (self.listener[event].length > 0) {
                        detachListener.call(self, event, self.listener[event].pop());
                    }
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
    var dependencies = [ "../emitter", "../dom/element" ];
    if (!window.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
    }
    window.qoopido.registerSingleton("component/remux", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, style, property, html = document.getElementsByTagName("html")[0], base = 16, state = {
        fontsize: null,
        layout: null,
        ratio: {}
    }, current = {
        fontsize: null,
        layout: null
    }, delay = null, regex = new RegExp("[\"']", "g"), getComputedStyle = window.getComputedStyle || modules["polyfill/window/getcomputedstyle"];
    function insertRule(rule) {
        if (style.styleSheet && style.styleSheet.insertRule) {
            style.styleSheet.insertRule(rule, style.styleSheet.cssRules.length);
        } else if (style.sheet) {
            style.appendChild(document.createTextNode(rule));
        }
    }
    function updateState(fontsize, layout) {
        var self = this;
        fontsize = fontsize || parseInt(getComputedStyle(html).getPropertyValue("font-size"), 10);
        layout = layout || (property === "font-family" ? getComputedStyle(html).getPropertyValue(property) : getComputedStyle(html, ":after").getPropertyValue(property)) || null;
        if (property === "font-family" && layout === "sans-serif") {
            layout = null;
        }
        if (property === "content" && layout === "none") {
            layout = null;
        }
        if (layout) {
            layout = layout.replace(regex, "");
        }
        if (fontsize && layout) {
            state.fontsize = fontsize;
            state.layout = layout;
            if (state.layout !== null && (state.fontsize !== current.fontsize || state.layout !== current.layout)) {
                current.fontsize = state.fontsize;
                current.layout = state.layout;
                state.ratio.device = window.devicePixelRatio || 1;
                state.ratio.fontsize = state.fontsize / base;
                state.ratio.total = state.ratio.device * state.ratio.fontsize;
                self.emit("statechange", state);
            }
        }
        return self;
    }
    prototype = modules["emitter"].extend({
        _constructor: function() {
            var self = this, pBase = parseInt(html.getAttribute("data-base"), 10), delayedUpdate = function delayedUpdate() {
                if (delay !== null) {
                    window.clearTimeout(delay);
                }
                delay = window.setTimeout(function() {
                    updateState.call(self);
                }, 20);
            }, temp;
            prototype._parent._constructor.call(self);
            if (isNaN(pBase) === false) {
                base = pBase;
            }
            style = document.createElement("style");
            style.type = "text/css";
            if (typeof style.sheet !== "undefined") {
                style.appendChild(document.createTextNode(""));
            }
            document.getElementsByTagName("head")[0].appendChild(style);
            insertRule('html:before { content: "remux"; display: none; }');
            insertRule("html:after { display: none; }");
            temp = getComputedStyle(html, ":before").getPropertyValue("content");
            if (temp !== null) {
                temp = temp.replace(regex, "");
            }
            property = temp === "remux" ? "content" : "font-family";
            modules["dom/element"].create(window).on("resize orientationchange", delayedUpdate);
            updateState.call(self);
        },
        getState: function() {
            return state;
        },
        getLayout: function() {
            return state.layout;
        },
        forceLayout: function(fontsize, layout) {
            var self = this;
            updateState.call(self, fontsize, layout);
            return self;
        },
        addLayout: function(pId, pLayout) {
            var self = this, parameter, id, layout, size, lMin, lMax;
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
                switch (property) {
                  case "font-family":
                    insertRule("@media screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px ) { html { " + property + ': "' + id + '"; } }');
                    break;

                  default:
                    insertRule("@media screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px ) { html:after { " + property + ': "' + id + '"; } }');
                    break;
                }
                for (size = layout.min; size <= layout.max; size++) {
                    insertRule("@media screen and (min-width: " + Math.round(layout.width * (size / base)) + "px) and (max-width: " + (Math.round(layout.width * ((size + 1) / base)) - 1) + "px ) { html { font-size: " + size + "px; } }");
                }
            }
            updateState.call(self);
            window.setTimeout(function() {
                updateState.call(self);
            }, 50);
            return self;
        }
    });
    return prototype;
});