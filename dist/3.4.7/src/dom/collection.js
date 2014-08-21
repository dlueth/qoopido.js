/*!
* Qoopido.js library
*
* version: 3.4.7
* date:    2014-7-21
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
    window.qoopido.register("dom/collection", definition, [ "../base", "./element" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var mDomElement = modules["dom/element"];
    function map(method) {
        var self = this, elements = self.elements, parameter = Array.prototype.slice.call(arguments, 1), i = 0, element;
        for (;(element = elements[i]) !== undefined; i++) {
            element[method].apply(element, parameter);
        }
        return self;
    }
    function reverseMap(method) {
        var self = this, elements = self.elements, parameter = Array.prototype.slice.call(arguments, 1), i = elements.length - 1, element;
        for (;(element = elements[i]) !== undefined; i--) {
            element[method].apply(element, parameter);
        }
        return self;
    }
    return modules["base"].extend({
        elements: null,
        _constructor: function(elements, attributes, styles) {
            var self = this, i = 0, element;
            self.elements = [];
            elements = typeof elements === "string" ? document.querySelectorAll(elements) : elements;
            for (;(element = elements[i]) !== undefined; i++) {
                self.elements.push(mDomElement.create(element));
            }
            if (typeof attributes === "object" && attributes !== null) {
                self.setAttributes(attributes);
            }
            if (typeof styles === "object" && styles !== null) {
                self.setStyles(styles);
            }
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
            return reverseMap.call(this, "prependTo", target);
        },
        appendTo: function(target) {
            return map.call(this, "appendTo", target);
        },
        insertBefore: function(target) {
            return map.call(this, "insertBefore", target);
        },
        insertAfter: function(target) {
            return reverseMap.call(this, "insertAfter", target);
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
        remove: function(index) {
            var self = this, elements = self.elements, i, element;
            if (index || index === 0) {
                element = self.elements[index];
                if (element) {
                    element.remove();
                    elements.splice(index, 1);
                }
            } else {
                i = elements.length - 1;
                for (;(element = elements[i]) !== undefined; i--) {
                    element.remove();
                    elements.pop();
                }
            }
            return self;
        },
        on: function() {
            return map.apply(this, [ "on" ].concat(Array.prototype.slice.call(arguments, 0)));
        },
        one: function(events) {
            return map.apply(this, [ "one" ].concat(Array.prototype.slice.call(arguments, 0)));
        },
        off: function(events, fn) {
            return map.apply(this, [ "off" ].concat(Array.prototype.slice.call(arguments, 0)));
        },
        emit: function(event, data) {
            return map.apply(this, [ "emit" ].concat(Array.prototype.slice.call(arguments, 0)));
        }
    });
});