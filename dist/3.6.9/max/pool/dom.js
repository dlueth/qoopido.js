/*!
* Qoopido.js library
*
* version: 3.6.9
* date:    2015-07-10
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("pool/dom", definition, [ "../pool" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype = modules["pool"].extend({
        _initPool: function() {
            return {};
        },
        _getPool: function(type) {
            var self = this;
            if (typeof type !== "string") {
                type = type.tagName.toLowerCase();
            }
            return self._pool[type] = self._pool[type] || [];
        },
        _dispose: function(element) {
            var property;
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            for (property in element) {
                if (Object.prototype.hasOwnProperty.call(element, property)) {
                    try {
                        element.removeAttribute(property);
                    } catch (exception) {
                        element.property = null;
                    }
                }
            }
            return element;
        },
        _obtain: function(type) {
            return document.createElement(type);
        }
    });
    shared.pool = shared.pool || {};
    shared.pool.dom = prototype.create();
    return prototype;
});