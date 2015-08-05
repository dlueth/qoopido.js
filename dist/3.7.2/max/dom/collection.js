/*!
* Qoopido.js library
*
* version: 3.7.2
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("dom/collection", definition, [ "../base", "./element" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var mDomElement = modules["dom/element"], pool = modules["pool/module"] && modules["pool/module"].create(mDomElement, null, true) || null;
    function buildFragment() {
        var self = this, elements = self.elements, fragment = document.createDocumentFragment(), i = 0, element;
        for (;(element = elements[i]) !== undefined; i++) {
            fragment.appendChild(element.element);
        }
        return fragment;
    }
    function map(method) {
        var self = this, elements = self.elements, parameter = Array.prototype.slice.call(arguments, 1), i = 0, element;
        for (;(element = elements[i]) !== undefined; i++) {
            element[method].apply(element, parameter);
        }
        return self;
    }
    function mapFragment(target, method) {
        var self = this;
        target = target && target.element ? target : pool && pool.obtain(target) || mDomElement.create(target);
        if (target) {
            target[method].call(target, buildFragment.call(self));
            target.dispose && target.dispose();
        }
        return self;
    }
    return modules["base"].extend({
        elements: null,
        _constructor: function(elements, attributes, styles) {
            var self = this, selectors, selector, i, element;
            self.elements = [];
            if (elements && typeof elements === "string") {
                selectors = elements.split(",");
                elements = [];
                for (i = 0; (selector = selectors[i]) !== undefined; i++) {
                    try {
                        elements = elements.concat(Array.prototype.slice.call(document.querySelectorAll(selector)));
                    } catch (exception) {}
                }
            }
            for (i = 0; (element = elements[i]) !== undefined; i++) {
                self.elements.push(pool && pool.obtain(element) || mDomElement.create(element));
            }
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
            return self;
        },
        get: function(index) {
            return this.elements[index] || null;
        },
        each: function(fn) {
            var self = this, elements = self.elements, i = 0, element;
            for (;(element = elements[i]) !== undefined; i++) {
                fn.call(element, i);
            }
            return self;
        },
        setAttribute: function(attribute, value) {
            return map.call(this, "setAttribute", attribute, value);
        },
        setAttributes: function(attributes) {
            return map.call(this, "setAttributes", attributes);
        },
        removeAttribute: function(attribute) {
            return map.call(this, "removeAttribute", attribute);
        },
        removeAttributes: function(attributes) {
            return map.call(this, "removeAttributes", attributes);
        },
        setStyle: function(property, value) {
            return map.call(this, "setStyle", property, value);
        },
        setStyles: function(properties) {
            return map.call(this, "setStyles", properties);
        },
        removeStyle: function(property) {
            return map.call(this, "removeStyle", property);
        },
        removeStyles: function(properties) {
            return map.call(this, "removeStyles", properties);
        },
        addClass: function(name) {
            return map.call(this, "addClass", name);
        },
        removeClass: function(name) {
            return map.call(this, "removeClass", name);
        },
        toggleClass: function(name) {
            return map.call(this, "toggleClass", name);
        },
        prependTo: function(target) {
            return mapFragment.call(this, target, "prepend");
        },
        appendTo: function(target) {
            return mapFragment.call(this, target, "append");
        },
        insertBefore: function(target) {
            var self = this;
            target = target && target.element ? target : pool && pool.obtain(target) || mDomElement.create(target);
            if (target) {
                target.element.parentNode.insertBefore(buildFragment.call(self), target.element);
                target.dispose && target.dispose();
            }
            return self;
        },
        insertAfter: function(target) {
            var self = this;
            target = target && target.element ? target : pool && pool.obtain(target) || mDomElement.create(target);
            if (target) {
                target.element.nextSibling ? target.element.parentNode.insertBefore(buildFragment.call(self), target.element.nextSibling) : target.element.appendChild(buildFragment.call(self));
                target.dispose && target.dispose();
            }
            return self;
        },
        replace: function(target) {
            var self = this, elements = self.elements, i = 0, element;
            for (;(element = elements[i]) !== undefined; i++) {
                if (i === 0) {
                    element.replace(target);
                } else {
                    element.insertAfter(elements[i - 1]);
                }
            }
            return self;
        },
        hide: function() {
            return map.call(this, "hide");
        },
        show: function() {
            return map.call(this, "show");
        },
        remove: function(index) {
            var self = this, elements = self.elements, i, element;
            if ((index || index === 0) && (element = self.elements[index]) !== undefined) {
                element.remove();
                element.dispose && element.dispose();
                elements.splice(index, 1);
            } else {
                i = elements.length - 1;
                for (;(element = elements[i]) !== undefined; i--) {
                    element.remove();
                    element.dispose && element.dispose();
                    elements.pop();
                }
            }
            return self;
        },
        on: function() {
            return map.apply(this, [ "on" ].concat(Array.prototype.slice.call(arguments)));
        },
        one: function(events) {
            return map.apply(this, [ "one" ].concat(Array.prototype.slice.call(arguments)));
        },
        off: function(events, fn) {
            return map.apply(this, [ "off" ].concat(Array.prototype.slice.call(arguments)));
        },
        emit: function(event, data) {
            return map.apply(this, [ "emit" ].concat(Array.prototype.slice.call(arguments)));
        }
    });
});