/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-7
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition) {
    var dependencies = [ "../function/unique/uuid" ];
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
    var stringObject = "object", stringString = "string", getComputedStyle = window.getComputedStyle || modules["polyfill/window/getcomputedstyle"], generateUuid = modules["function/unique/uuid"], contentAttribute = "textContent" in document.createElement("a") ? "textContent" : "innerText", regex = new RegExp("^<(\\w+)\\s*/>$"), elements = {};
    function normalizeEvent(originalEvent) {
        var event = Object.create(originalEvent);
        event.originalEvent = originalEvent;
        event.type = originalEvent.type;
        event.preventDefault = function() {
            if (originalEvent.cancelable !== false) {
                originalEvent.returnValue = false;
                originalEvent.preventDefault();
            }
        };
        event.stopPropagation = function() {
            originalEvent.cancelBubble = true;
            originalEvent.stopPropagation();
        };
        event.stopImmediatePropagation = function() {
            originalEvent.cancelBubble = true;
            originalEvent.cancelImmediate = true;
            originalEvent.stopImmediatePropagation();
        };
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
    function emitEvent(type, detail) {
        this.element.dispatchEvent(new window.CustomEvent(type, {
            bubbles: true,
            cancelable: true,
            detail: detail
        }));
    }
    function resolveElement(element) {
        if (typeof element === "string") {
            try {
                if (regex.test(element) === true) {
                    element = document.createElement(element.replace(regex, "$1").toLowerCase());
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
    return modules["base"].extend({
        type: null,
        element: null,
        listener: {},
        _constructor: function(element, attributes, styles) {
            var self = this, uuid = element.quid || null;
            element = resolveElement(element);
            if (uuid && elements[uuid]) {
                return elements[uuid];
            } else {
                self.type = element.tagName;
                self.element = element;
                uuid = generateUuid();
                element.quid = uuid;
                elements[uuid] = self;
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
                    var i = 0, attribute;
                    for (;(attribute = attributes[i]) !== undefined; i++) {
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
                    var i = 0, property;
                    for (0; (property = properties[i]) !== undefined; i++) {
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
            var self = this, element = self.element, delegate = arguments.length > 2 ? arguments[1] : null, fn = arguments.length > 2 ? arguments[2] : arguments[1], uuid = fn.quid || (fn.quid = generateUuid()), i = 0, event;
            events = events.split(" ");
            for (;(event = events[i]) !== undefined; i++) {
                var id = event + "-" + uuid, pointer = self.listener[id] || (self.listener[id] = []), listener = function(event) {
                    event = normalizeEvent(event);
                    if (!delegate || event.target.matches(delegate)) {
                        fn.call(self, event);
                    }
                };
                pointer.push(listener);
                element.addEventListener(event, listener);
            }
            return self;
        },
        one: function(events) {
            var self = this, delegate = arguments.length > 2 ? arguments[1] : null, fn = arguments.length > 2 ? arguments[2] : arguments[1], each = (arguments.length > 2 ? arguments[3] : arguments[2]) !== false, listener = function(event) {
                self.off(each === true ? event.type : events, listener);
                fn.call(self, event);
            };
            fn.quid = listener.quid = generateUuid();
            if (delegate) {
                self.on(events, delegate, listener);
            } else {
                self.on(events, listener);
            }
            return self;
        },
        off: function(events, fn) {
            var self = this, element = self.element, i = 0, event, j = 0, listener;
            events = events.split(" ");
            for (;(event = events[i]) !== undefined; i++) {
                var id = fn.quid && event + "-" + fn.quid || null, pointer = id && self.listener[id] || null;
                if (pointer) {
                    for (;(listener = pointer[j]) !== undefined; j++) {
                        element.removeEventListener(event, listener);
                    }
                    delete self.listener[id];
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