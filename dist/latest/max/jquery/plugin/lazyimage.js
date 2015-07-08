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
    window.qoopido.register("jquery/plugins/lazyimage", definition, [ "../../dom/element/lazyimage", "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, name = namespace.pop(), prototype, EVENT_REQUESTED = "requested", EVENT_LOADED = "loaded", JQUERY_REQUESTED = "".concat(EVENT_REQUESTED, ".", name), JQUERY_LOADED = "".concat(EVENT_LOADED, ".", name);
    jQuery.fn[name] = function(settings) {
        return this.each(function() {
            prototype.create(this, settings);
        });
    };
    prototype = modules["dom/element/lazyimage"].extend({
        _constructor: function(element, settings) {
            var self = this, object = jQuery(element);
            prototype._parent._constructor.call(self, element, settings);
            self.on(EVENT_REQUESTED, function() {
                object.trigger(JQUERY_REQUESTED);
            });
            self.on(EVENT_LOADED, function() {
                object.trigger(JQUERY_LOADED);
            });
        }
    });
    return prototype;
});