/*!
* Qoopido.js library
*
* version: 3.6.2
* date:    2015-4-21
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
    window.qoopido.register("dom/event", definition, [ "../base", "../hook/event" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var hooks = modules["hook/event"];
    return modules["base"].extend({
        originalEvent: null,
        isDelegate: false,
        isDefaultPrevented: false,
        isPropagationStopped: false,
        isImmediatePropagationStopped: false,
        _properties: null,
        _constructor: function(event) {
            var self = this;
            self._properties = [];
            self._obtain(event);
        },
        _obtain: function(event) {
            hooks.process(this, event);
        },
        _dispose: function() {
            var self = this, i = 0, property;
            for (;(property = self._properties[i]) !== undefined; i++) {
                delete self[property];
            }
            delete self.delegate;
            self.originalEvent = null;
            self.isDelegate = false;
            self.isDefaultPrevented = false;
            self.isPropagationStopped = false;
            self.isImmediatePropagationStopped = false;
            self._properties.length = 0;
        },
        preventDefault: function() {
            var self = this, event = self.originalEvent;
            if (event.cancelable !== false) {
                self.isDefaultPrevented = true;
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            }
        },
        stopPropagation: function() {
            var self = this, event = self.originalEvent;
            self.isPropagationStopped = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            event.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            var self = this, event = self.originalEvent;
            self.isImmediatePropagationStopped = true;
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            self.stopPropagation();
        }
    });
});