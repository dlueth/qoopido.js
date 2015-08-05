/*!
* Qoopido.js library
*
* version: 3.7.2
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("jquery/extension/selector", definition, [ "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, $window = jQuery(window), $document = jQuery(document);
    jQuery.extend(jQuery.expr[":"], {
        loaded: function(el) {
            return jQuery(el).data("loaded");
        },
        scrollable: function(el, i, m) {
            return jQuery(el).css("overflow") === "auto";
        },
        width: function(el, i, m) {
            if (!m[3] || !/^(<|>)\d+$/.test(m[3])) {
                return false;
            }
            return m[3].substr(0, 1) === ">" ? jQuery(el).width() > m[3].substr(1) : jQuery(el).width() < m[3].substr(1);
        },
        height: function(el, i, m) {
            if (!m[3] || !/^(<|>)\d+$/.test(m[3])) {
                return false;
            }
            return m[3].substr(0, 1) === ">" ? jQuery(el).height() > m[3].substr(1) : jQuery(el).height() < m[3].substr(1);
        },
        leftOf: function(el, i, m) {
            if (!m[3]) {
                return false;
            }
            el = jQuery(el);
            m = jQuery(m[3]);
            return el.offset().left + el.width() < m.offset().left;
        },
        rightOf: function(el, i, m) {
            if (!m[3]) {
                return false;
            }
            el = jQuery(el);
            m = jQuery(m[3]);
            return el.offset().left > m.offset().left + m.width();
        },
        external: function(el) {
            if (!el.href) {
                return false;
            }
            return el.hostname && el.hostname !== window.location.hostname;
        },
        inView: function(el) {
            el = jQuery(el);
            var w = $window, d = $document, eO = el.offset(), dS = {
                top: d.scrollTop(),
                height: d.scrollLeft()
            };
            return !(eO.top > w.height() + dS.top || eO.top + el.height() < dS.top || eO.left > w.width() + dS.left || eO.left + el.width() < dS.left);
        },
        largerThan: function(el, i, m) {
            if (!m[3]) {
                return false;
            }
            el = jQuery(el);
            m = jQuery(m[3]);
            return el.width() * el.height() > m.width() * m.height();
        },
        isBold: function(el) {
            return jQuery(el).css("fontWeight") === "700";
        },
        color: function(el, i, m) {
            if (!m[3]) {
                return false;
            }
            return jQuery(el).css("color") === m[3];
        },
        hasId: function(el) {
            el = jQuery(el);
            return el.attr("id") !== undefined && el.attr("id") !== "";
        }
    });
    return jQuery;
});