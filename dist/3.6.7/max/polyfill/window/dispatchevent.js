/*!
* Qoopido.js library
*
* version: 3.6.7
* date:    2015-07-08
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("polyfill/window/dispatchevent", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.dispatchEvent) {
        window.dispatchEvent = Window.prototype.dispatchEvent = HTMLDocument.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
            if (!arguments.length) {
                throw new Error("Not enough arguments");
            }
            if (!event || typeof event.type !== "string") {
                throw new Error("DOM Events Exception 0");
            }
            var element = this, type = event.type;
            try {
                if (!event.bubbles) {
                    event.cancelBubble = true;
                    var cancelBubbleEvent = function(event) {
                        event.cancelBubble = true;
                        (element || window).detachEvent("on" + type, cancelBubbleEvent);
                    };
                    this.attachEvent("on" + type, cancelBubbleEvent);
                }
                this.fireEvent("on" + type, event);
            } catch (error) {
                event.target = element;
                do {
                    event.currentTarget = element;
                    if (element._events && element._events[type]) {
                        element._events[type].call(element, event);
                    }
                    if (element["on" + type]) {
                        element["on" + type].call(element, event);
                    }
                    element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
                } while (element && !event.cancelBubble);
            }
            return true;
        };
    }
    return window.dispatchEvent;
});