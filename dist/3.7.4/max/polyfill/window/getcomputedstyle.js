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
(function(definition, global) {
    global.qoopido.register("polyfill/window/getcomputedstyle", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!global.getComputedStyle) {
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
        return global.getComputedStyle;
    }
}, this);