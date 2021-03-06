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
    global.qoopido.register("jquery/plugins/lazyimage", definition, [ "../../dom/element/lazyimage", "jquery" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || global.jQuery, name = "lazyimage", prototype, EVENT_REQUESTED = "requested", EVENT_LOADED = "loaded", JQUERY_REQUESTED = "".concat(EVENT_REQUESTED, ".", name), JQUERY_LOADED = "".concat(EVENT_LOADED, ".", name);
    jQuery.fn[name] = function(settings) {
        return this.each(function() {
            prototype.create(this, settings);
        });
    };
    prototype = modules["dom/element/lazyimage"].extend({
        _constructor: function(element, settings) {
            var self = prototype._parent._constructor.call(this, element, settings), object = jQuery(element);
            self.on(EVENT_REQUESTED, function() {
                object.trigger(JQUERY_REQUESTED);
            });
            self.on(EVENT_LOADED, function() {
                object.trigger(JQUERY_LOADED);
            });
            return self;
        }
    });
    return prototype;
}, this);