/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-8
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
    window.qoopido.register("dom/event", definition, [ "../base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var hooks = {
        general: {
            properties: "type altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" ")
        },
        mouse: {
            regex: new RegExp("^(?:mouse|pointer|contextmenu)|click"),
            properties: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function() {
                var self = this, original = self.originalEvent, fromElement = original.fromElement, which = original.button, pointer;
                if (self.pageX == null && original.clientX != null) {
                    pointer = event.target.ownerDocument || document;
                    pointer = pointer.documentElement || pointer.body;
                    self.pageX = original.clientX + (pointer.scrollLeft || 0) - (pointer.clientLeft || 0);
                    self.pageY = original.clientY + (pointer.scrollTop || 0) - (pointer.clientTop || 0);
                }
                if (!self.relatedTarget && fromElement) {
                    self.relatedTarget = fromElement === self.target ? original.toElement : fromElement;
                }
                if (!self.which && which !== undefined) {
                    self.which = which & 1 ? 1 : which & 2 ? 3 : which & 4 ? 2 : 0;
                }
            }
        },
        key: {
            regex: new RegExp("^key"),
            properties: "char charCode key keyCode".split(" "),
            filter: function() {
                var self = this, original = self.originalEvent;
                if (self.which === null) {
                    self.which = original.charCode !== null ? original.charCode : original.keyCode;
                }
            }
        }
    };
    return modules["base"].extend({
        isDelegate: false,
        isDefaultPrevented: false,
        isPropagationStopped: false,
        isImmediatePropagationStopped: false,
        _constructor: function(event) {
            var self = this, type, key, hook, delegate, transfer = [], filter = [], i = 0, property, fn;
            type = event.type;
            for (key in hooks) {
                hook = hooks[key], delegate = hook.delegate;
                if (!hook.regex || hook.regex && hook.regex.test(type)) {
                    if (hook.properties) {
                        transfer = transfer.concat(hook.properties);
                    }
                    if (hook.filter) {
                        filter.push(hook.filter);
                    }
                }
                if (delegate) {
                    self.delegate = delegate;
                }
            }
            for (;(property = transfer[i]) !== undefined; i++) {
                self[property] = event[property];
            }
            self.originalEvent = event;
            if (!self.target) {
                self.target = event.srcElement || document;
            }
            if (self.target.nodeType === 3) {
                self.target = self.target.parentNode;
            }
            self.metaKey = event.metaKey && event.metaKey !== false ? true : false;
            for (i = 0; (fn = filter[i]) !== undefined; i++) {
                fn.call(self);
            }
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