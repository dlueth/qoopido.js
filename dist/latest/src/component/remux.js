/*!
* Qoopido.js library
*
* version: 3.5.0
* date:    2014-7-29
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
    window.qoopido.registerSingleton("component/remux", definition, [ "../emitter", "./sense" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, html = document.getElementsByTagName("html")[0], base = 16, state = {
        fontsize: null,
        layout: null,
        ratio: {}
    }, current = {
        fontsize: null,
        layout: null
    };
    function updateState(layout, fontsize) {
        var self = this;
        if (layout && fontsize) {
            html.className = layout;
            html.style.fontSize = fontsize + "px";
            state.layout = layout;
            state.fontsize = fontsize;
            if (current.fontsize !== state.fontsize || current.layout !== state.layout) {
                state.ratio.device = window.devicePixelRatio || 1;
                state.ratio.fontsize = state.fontsize / base;
                state.ratio.total = state.ratio.device * state.ratio.fontsize;
                if (current.layout !== state.layout) {
                    self.emit("layoutchanged", state);
                }
                if (current.fontsize !== state.fontsize) {
                    self.emit("fontsizechanged", state);
                }
                self.emit("statechanged", state);
                current.fontsize = state.fontsize;
                current.layout = state.layout;
            }
        }
        return self;
    }
    function addQuery(query, layout, fontsize) {
        var self = this;
        window.setTimeout(function() {
            modules["component/sense"].create(query).on("matched", function() {
                updateState.call(self, layout, fontsize);
            });
        }, 0);
    }
    prototype = modules["emitter"].extend({
        _constructor: function() {
            var self = this, pBase = parseInt(html.getAttribute("data-base"), 10);
            prototype._parent._constructor.call(self);
            if (isNaN(pBase) === false) {
                base = pBase;
            }
        },
        getState: function() {
            return state;
        },
        getLayout: function() {
            return state.layout;
        },
        getFontsize: function() {
            return state.fontsize;
        },
        setLayout: function(layout, fontsize) {
            var self = this;
            updateState.call(self, layout, fontsize);
            return self;
        },
        addLayout: function(pId, pLayout) {
            var self = this, parameter, id, layout, size, min, max, lMin, lMax;
            if (arguments.length > 1) {
                parameter = {};
                parameter[pId] = pLayout;
            } else {
                parameter = arguments[0];
            }
            for (id in parameter) {
                layout = parameter[id];
                for (size = layout.min; size <= layout.max; size++) {
                    lMin = Math.round(layout.width * (size / base));
                    lMax = Math.round(layout.width * ((size + 1) / base)) - 1;
                    addQuery.call(self, "screen and (min-width: " + lMin + "px) and (max-width: " + lMax + "px )", id, size);
                    min = !min || lMin < min.width ? {
                        width: lMin,
                        fontsize: size,
                        layout: id
                    } : min;
                    max = !max || lMax >= max.width ? {
                        width: lMax,
                        fontsize: size,
                        layout: id
                    } : max;
                }
            }
            addQuery.call(self, "screen and (max-width: " + (min.width - 1) + "px)", min.layout, min.fontsize);
            addQuery.call(self, "screen and (min-width: " + (max.width + 1) + "px)", max.layout, max.fontsize);
            return self;
        }
    });
    return prototype;
});