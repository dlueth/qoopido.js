/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-9
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
    if (!window.Event) {
        dependencies.push("./event");
    }
    window.qoopido.register("polyfill/window/customevent", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.CustomEvent) {
        window.CustomEvent = Window.prototype.CustomEvent = function CustomEvent(type, eventInitDict) {
            var event = new window.Event(type, eventInitDict);
            event.detail = eventInitDict && eventInitDict.detail;
            return event;
        };
    }
    return window.CustomEvent;
});