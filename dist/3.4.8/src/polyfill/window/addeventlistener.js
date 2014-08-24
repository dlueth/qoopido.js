/*!
* Qoopido.js library
*
* version: 3.4.8
* date:    2014-7-24
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
    window.qoopido.register("polyfill/window/addeventlistener", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.addEventListener) {
        window.addEventListener = Window.prototype.addEventListener = HTMLDocument.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener(type, listener) {
            var element = this;
            if (!element._events) {
                element._events = {};
            }
            if (!element._events[type]) {
                element._events[type] = function(event) {
                    var list = element._events[event.type].list, events = Array.prototype.concat.call([], list), index = 0, pointer;
                    event.preventDefault = function preventDefault() {
                        if (event.cancelable !== false) {
                            event.returnValue = false;
                        }
                    };
                    event.stopPropagation = function stopPropagation() {
                        event.cancelBubble = true;
                    };
                    event.stopImmediatePropagation = function stopImmediatePropagation() {
                        event.cancelBubble = true;
                        event.cancelImmediate = true;
                    };
                    event.currentTarget = element;
                    event.relatedTarget = event.fromElement || null;
                    event.target = event.srcElement || element;
                    event.timeStamp = new Date().getTime();
                    if (event.clientX) {
                        event.pageX = event.clientX + document.documentElement.scrollLeft;
                        event.pageY = event.clientY + document.documentElement.scrollTop;
                    }
                    for (;(pointer = events[index]) !== undefined && !event.cancelImmediate; ++index) {
                        if (list.indexOf(pointer) > -1) {
                            pointer.call(element, event);
                        }
                    }
                };
                element._events[type].list = [];
                element.attachEvent && element.attachEvent("on" + type, element._events[type]);
            }
            element._events[type].list.push(listener);
        };
    }
    return window.addEventListener;
});