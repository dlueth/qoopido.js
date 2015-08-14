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
    var dependencies = [];
    if (!Array.prototype.indexOf) {
        dependencies.push("../array/indexof");
    }
    global.qoopido.register("polyfill/window/addeventlistener", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var documentElement = document.documentElement;
    if (!global.addEventListener) {
        global.addEventListener = Window.prototype.addEventListener = HTMLDocument.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener(type, listener) {
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
                        event.pageX = event.clientX + documentElement.scrollLeft;
                        event.pageY = event.clientY + documentElement.scrollTop;
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
    return global.addEventListener;
}, this);