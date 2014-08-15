/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-15
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
    var dependencies = [];
    if (!Array.prototype.indexOf) {
        dependencies.push("../array/indexof");
    }
    window.qoopido.register("polyfill/window/removeeventlistener", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.removeEventListener) {
        window.removeEventListener = Window.prototype.removeEventListener = HTMLDocument.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener(type, listener) {
            var element = this;
            if (element._events && element._events[type] && element._events[type].list) {
                var index = element._events[type].list.indexOf(listener);
                if (index > -1) {
                    element._events[type].list.splice(index, 1);
                    if (!element._events[type].list.length) {
                        element.detachEvent && element.detachEvent("on" + type, element._events[type]);
                    }
                }
            }
        };
    }
    return window.removeEventListener;
});