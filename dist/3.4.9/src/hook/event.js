/*!
* Qoopido.js library
*
* version: 3.4.9
* date:    2014-7-26
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
    window.qoopido.registerSingleton("hook/event", definition, [ "../base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    function transferProperties(event, originalEvent, properties) {
        var i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
            event[property] = originalEvent[property];
        }
        event._properties = event._properties.concat(properties);
    }
    var hooks = {
        general: {
            properties: "type altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            process: function(event, originalEvent) {
                event.originalEvent = originalEvent;
                event.metaKey = originalEvent.metaKey && originalEvent.metaKey !== false ? true : false;
                if (!event.target) {
                    event.target = originalEvent.srcElement || document;
                }
                if (event.target.nodeType === 3) {
                    event.target = event.target.parentNode;
                }
            }
        },
        mouse: {
            regex: new RegExp("^(?:mouse|pointer|contextmenu|touch)|click"),
            properties: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement relatedTarget which".split(" "),
            process: function(event, originalEvent) {
                var pointer, fromElement, which;
                fromElement = originalEvent.fromElement;
                which = originalEvent.button;
                if (event.pageX === null && originalEvent.clientX !== null) {
                    pointer = event.target.ownerDocument || document;
                    pointer = pointer.documentElement || pointer.body;
                    event.pageX = originalEvent.clientX + (pointer.scrollLeft || 0) - (pointer.clientLeft || 0);
                    event.pageY = originalEvent.clientY + (pointer.scrollTop || 0) - (pointer.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? originalEvent.toElement : fromElement;
                }
                if (!event.which && which !== undefined) {
                    event.which = which & 1 ? 1 : which & 2 ? 3 : which & 4 ? 2 : 0;
                }
            }
        },
        key: {
            regex: new RegExp("^key"),
            properties: "char charCode key keyCode which".split(" "),
            process: function(event, originalEvent) {
                if (event.which === null) {
                    event.which = originalEvent.charCode !== null ? originalEvent.charCode : originalEvent.keyCode;
                }
            }
        }
    };
    return modules["base"].extend({
        add: function(property, hook) {
            if (property && hook && hooks[property]) {
                hooks[property] = hook;
            }
            return this;
        },
        get: function(property) {
            if (property && hooks[property]) {
                return hooks[property];
            }
            return null;
        },
        process: function(event, originalEvent) {
            var id, hook, isMatch;
            for (id in hooks) {
                hook = hooks[id];
                isMatch = !hook.regex || hook.regex.test(originalEvent.type);
                if (isMatch) {
                    if (hook.properties) {
                        transferProperties(event, originalEvent, hook.properties);
                    }
                    if (hook.process) {
                        hook.process(event, originalEvent);
                    }
                    if (hook.delegate) {
                        event.delegate = hook.delegate;
                    }
                }
            }
        }
    });
});