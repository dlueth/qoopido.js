/*!
* Qoopido.js library
*
* version: 3.3.2
* date:    2014-5-24
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
    return true;
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
    return true;
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
    return true;
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
    return true;
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
    window.qoopido.register("polyfill/window/getcomputedstyle", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.getComputedStyle) {
        var getComputedStyleRegex = new RegExp("(\\-([a-z]){1})", "g"), getComputedStyleCallback = function() {
            return arguments[2].toUpperCase();
        };
        window.getComputedStyle = function(element, pseudo) {
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
    }
    return true;
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
    var dependencies = [ "../proxy" ];
    if (!window.getComputedStyle) {
        dependencies.push("../polyfill/window/getcomputedstyle");
    }
    window.qoopido.register("dom/element", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var attachListener, detachListener, emitEvent, stringObject = "object", stringString = "string";
    function normalizeEvent(event) {
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
        if (element["on" + name] !== undefined) {
            luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
            element[luid] = function() {
                fn.call(this, normalizeEvent(window.event));
            };
            element.attachEvent("on" + name, element[luid]);
        } else {
            name = "".concat("fake[", name, "]");
            element[name] = null;
            element.attachEvent("onpropertychange", function(event) {
                if (event.propertyName === name) {
                    fn.call(this, normalizeEvent(element[name]));
                }
            });
        }
    };
    detachListener = window.removeEventListener ? function(name, fn) {
        var self = this, element = self.element, luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        element.removeEventListener(name, element[luid], false);
        delete element[luid];
    } : function(name, fn) {
        var self = this, element = self.element, luid = "".concat("listener[", name, "][", fn._quid || fn, "]");
        element.detachEvent("on" + name, element[luid]);
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
                    return window.getComputedStyle(self.element, null).getPropertyValue(property[0]);
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
                        result[property] = window.getComputedStyle(self.element, null).getPropertyValue(property);
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
    window.qoopido.register("dom/element/emerge", definition, [ "../element", "../../function/merge", "../../function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var defaults = {
        interval: 50,
        threshold: "auto",
        recur: true,
        auto: .5,
        visibility: true
    }, documentElement = window.document.documentElement, viewport = {}, intervals = {}, elements = {}, prototype, EVENT_EMERGED = "emerged", EVENT_DEMERGED = "demerged", DOM_RESIZE = "resize orientationchange";
    window = modules["dom/element"].create(window);
    if (document.compatMode !== "CSS1Compat") {
        throw "This script requires your browser to work in standards mode";
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
        viewport.right = documentElement.clientWidth;
        viewport.bottom = documentElement.clientHeight;
    }
    function instanceOnResize() {
        var self = this, x = self._settings.threshold || documentElement.clientWidth * self._settings.auto, y = self._settings.threshold || documentElement.clientHeight * self._settings.auto;
        self._viewport.left = viewport.left - x;
        self._viewport.top = viewport.top - y;
        self._viewport.right = viewport.right + x;
        self._viewport.bottom = viewport.bottom + y;
    }
    function checkState() {
        var self = this, state = false, priority = 2, boundaries;
        if (self.isVisible() && (self.getStyle("visibility") !== "hidden" || self._settings.visibility === false)) {
            boundaries = self.element.getBoundingClientRect();
            if (boundaries.left >= self._viewport.left && boundaries.top >= self._viewport.top && boundaries.left <= self._viewport.right && boundaries.top <= self._viewport.bottom || boundaries.right >= self._viewport.left && boundaries.bottom >= self._viewport.top && boundaries.right <= self._viewport.right && boundaries.bottom <= self._viewport.bottom) {
                if (boundaries.left >= viewport.left && boundaries.top >= viewport.top && boundaries.left <= viewport.right && boundaries.top <= viewport.bottom || boundaries.right >= viewport.left && boundaries.bottom >= viewport.top && boundaries.right <= viewport.right && boundaries.bottom <= viewport.bottom) {
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
        _element: null,
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
(function(definition) {
    window.qoopido.register("jquery/plugins/lazyimage", definition, [ "../../dom/element/lazyimage", "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, name = namespace.pop(), prototype, EVENT_REQUESTED = "requested", EVENT_LOADED = "loaded", JQUERY_REQUESTED = "".concat(EVENT_REQUESTED, ".", name), JQUERY_LOADED = "".concat(EVENT_LOADED, ".", name);
    jQuery.fn[name] = function(settings) {
        return this.each(function() {
            prototype.create(this, settings);
        });
    };
    prototype = modules["dom/element/lazyimage"].extend({
        _constructor: function(element, settings) {
            var self = this, object = jQuery(element);
            prototype._parent._constructor.call(self, element, settings);
            self.on(EVENT_REQUESTED, function() {
                object.trigger(JQUERY_REQUESTED);
            });
            self.on(EVENT_LOADED, function() {
                object.trigger(JQUERY_LOADED);
            });
        }
    });
    return prototype;
});