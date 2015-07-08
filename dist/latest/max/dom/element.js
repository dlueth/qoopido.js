/*!
* Qoopido.js library
*
* version: 3.6.7
* date:    2015-07-08
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
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
    var stringObject = "object", stringString = "string", generateUuid = modules["function/unique/uuid"], contentAttribute = "textContent" in document.createElement("a") ? "textContent" : "innerText", isTag = new RegExp("^<(\\w+)\\s*/>$"), matchEvent = new RegExp("^[^-]+"), pool = modules["pool/module"] && modules["pool/module"].create(modules["dom/event"], null, true) || null, hooks = modules["hook/css"], storage = {}, events = {
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
            var self = this;
            element = resolveElement(element);
            if (!element._quid) {
                element._quid = generateUuid();
                self.type = element.tagName;
                self.element = element;
                self._listener = {};
                storage[element._quid] = self;
            } else {
                self = storage[element._quid];
            }
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
            if (self !== this) {
                self.dispose && self.dispose();
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