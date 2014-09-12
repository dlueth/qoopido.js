/*!
* Qoopido.js library
*
* version: 3.5.2
* date:    2014-8-12
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
    window.qoopido.register("dom/element/emerge", definition, [ "../element", "../../function/merge", "../../function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var defaults = {
        interval: 50,
        threshold: "auto",
        recur: true,
        auto: 1,
        visibility: true
    }, documentElement = window.document.documentElement, viewport = {}, intervals = {}, elements = {}, prototype, EVENT_EMERGED = "emerged", EVENT_DEMERGED = "demerged", DOM_RESIZE = "resize orientationchange";
    window = modules["dom/element"].create(window);
    if (document.compatMode !== "CSS1Compat") {
        throw "[Qoopido.js] Not in standards mode";
    }
    function tick(interval) {
        var index, pointer = elements[interval];
        for (index in pointer) {
            if (index !== "length") {
                checkState.call(pointer[index]);
            }
        }
        if (pointer.length === 0) {
            window.element.clearInterval(intervals[interval]);
            delete intervals[interval];
        }
    }
    function globalOnResize() {
        viewport.left = 0;
        viewport.top = 0;
        viewport.right = window.innerWidth || documentElement.clientWidth;
        viewport.bottom = window.innerHeight || documentElement.clientHeight;
    }
    function instanceOnResize() {
        var self = this, treshold = self._settings.threshold, x = treshold !== undefined ? treshold : documentElement.clientWidth * self._settings.auto, y = treshold !== undefined ? treshold : documentElement.clientHeight * self._settings.auto;
        self._viewport.left = viewport.left - x;
        self._viewport.top = viewport.top - y;
        self._viewport.right = viewport.right + x;
        self._viewport.bottom = viewport.bottom + y;
    }
    function checkState() {
        var self = this, state = false, priority = 2, boundaries;
        if (self.isVisible() && (self.getStyle("visibility") !== "hidden" || self._settings.visibility === false)) {
            boundaries = self.element.getBoundingClientRect();
            if ((boundaries.bottom >= self._viewport.top && boundaries.bottom <= self._viewport.bottom || boundaries.top >= self._viewport.top && boundaries.top <= self._viewport.bottom || self._viewport.bottom >= boundaries.top && self._viewport.bottom <= boundaries.bottom || self._viewport.top >= boundaries.top && self._viewport.top <= boundaries.bottom) && (boundaries.left >= self._viewport.left && boundaries.left <= self._viewport.right || boundaries.right >= self._viewport.left && boundaries.right <= self._viewport.right || self._viewport.left >= boundaries.left && self._viewport.left <= boundaries.right || self._viewport.right >= boundaries.left && self._viewport.right <= boundaries.right)) {
                if (self._settings.threshold === 0 || (boundaries.bottom >= viewport.top && boundaries.bottom <= viewport.bottom || boundaries.top >= viewport.top && boundaries.top <= viewport.bottom || viewport.bottom >= boundaries.top && viewport.bottom <= boundaries.bottom || viewport.top >= boundaries.top && viewport.top <= boundaries.bottom) && (boundaries.left >= viewport.left && boundaries.left <= viewport.right || boundaries.right >= viewport.left && boundaries.right <= viewport.right || viewport.left >= boundaries.left && viewport.left <= boundaries.right || viewport.right >= boundaries.left && viewport.right <= boundaries.right)) {
                    priority = 1;
                }
                state = true;
            }
        }
        if (state !== self._state || state === true && priority !== self._priority) {
            setState.call(self, state, priority);
        }
    }
    function setState(state, priority) {
        var self = this;
        self._state = state;
        self._priority = priority;
        if (self._settings.recur !== true) {
            self.remove();
        }
        if (state === true) {
            self.emit(EVENT_EMERGED, priority);
        } else {
            self.emit(EVENT_DEMERGED);
        }
    }
    prototype = modules["dom/element"].extend({
        _quid: null,
        _viewport: null,
        _settings: null,
        _state: null,
        _priority: null,
        _constructor: function(element, settings) {
            var self = this;
            prototype._parent._constructor.call(self, element);
            settings = modules["function/merge"]({}, defaults, settings || {});
            if (settings.threshold === "auto") {
                delete settings.threshold;
            }
            if (intervals[settings.interval] === undefined) {
                elements[settings.interval] = elements[settings.interval] || {
                    length: 0
                };
                intervals[settings.interval] = window.element.setInterval(function() {
                    tick(settings.interval);
                }, settings.interval);
            }
            self._quid = modules["function/unique/uuid"]();
            self._viewport = {};
            self._settings = settings;
            self._state = false;
            self._priority = 2;
            elements[settings.interval][self._quid] = self;
            elements[settings.interval].length++;
            window.on(DOM_RESIZE, function() {
                instanceOnResize.call(self);
            });
            instanceOnResize.call(self);
        },
        remove: function() {
            var self = this;
            delete elements[self._settings.interval][self._quid];
            elements[self._settings.interval].length--;
        }
    });
    window.on(DOM_RESIZE, globalOnResize);
    globalOnResize();
    return prototype;
});