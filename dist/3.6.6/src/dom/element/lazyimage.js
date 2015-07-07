/*!
* Qoopido.js library
*
* version: 3.6.6
* date:    2015-7-7
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
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