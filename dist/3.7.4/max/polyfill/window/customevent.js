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
    global.qoopido.register("polyfill/window/customevent", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document;
    if (!global.CustomEvent) {
        var createEvent = document.createEvent ? function(type, eventInitDict, detail) {
            var event = document.createEvent("Event"), bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false, cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;
            event.initEvent(type, bubbles, cancelable);
            event.detail = detail;
            return event;
        } : function(type, eventInitDict, detail) {
            var event = document.createEventObject();
            event.type = type;
            event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
            event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;
            event.detail = detail;
            return event;
        };
        global.CustomEvent = Window.prototype.CustomEvent = function CustomEvent(type, eventInitDict, detail) {
            if (!type) {
                throw new Error("Not enough arguments");
            }
            return createEvent(type, eventInitDict, detail);
        };
    }
    return global.CustomEvent;
}, this);