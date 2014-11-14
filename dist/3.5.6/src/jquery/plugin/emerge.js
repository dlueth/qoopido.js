/*!
* Qoopido.js library
*
* version: 3.5.6
* date:    2014-10-14
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
    window.qoopido.register("jquery/plugins/emerge", definition, [ "../../dom/element/emerge", "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, name = namespace.pop(), prototype, EVENT_EMERGED = "emerged", EVENT_DEMERGED = "demerged", JQUERY_EMERGED = "".concat(EVENT_EMERGED, ".", name), JQUERY_DEMERGED = "".concat(EVENT_DEMERGED, ".", name);
    jQuery.fn[name] = function(settings) {
        return this.each(function() {
            prototype.create(this, settings);
        });
    };
    prototype = modules["dom/element/emerge"].extend({
        _constructor: function(element, settings) {
            var self = this, object = jQuery(element);
            prototype._parent._constructor.call(self, element, settings);
            self.on(EVENT_EMERGED, function(event) {
                object.trigger(JQUERY_EMERGED, {
                    priority: event.data
                });
            });
            self.on(EVENT_DEMERGED, function() {
                object.trigger(JQUERY_DEMERGED);
            });
        }
    });
    return prototype;
});