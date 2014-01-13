/*
 * Qoopido jquery/plugin/lazyimage
 *
 * jQuery plugin for Qoopido module /dom/element/lazyimage
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../dom/element/emerge
 * @external jQuery
 */
;(function(definition) {
	window.qoopido.register('jquery/plugins/lazyimage', definition, [ '../../dom/element/lazyimage', 'jquery' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var
	// variables
		jQuery = modules['jquery'] || window.jQuery,
		name   = namespace.pop(),

	// classes
		prototype,

	// events
		EVENT_REQUESTED  = 'requested',
		EVENT_LOADED     = 'loaded',
		JQUERY_REQUESTED = ''.concat(EVENT_REQUESTED, '.', name),
		JQUERY_LOADED    = ''.concat(EVENT_LOADED, '.', name);

	jQuery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	prototype = modules['dom/element/lazyimage'].extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = jQuery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_REQUESTED, function() { object.trigger(JQUERY_REQUESTED); });
			self.on(EVENT_LOADED, function() { object.trigger(JQUERY_LOADED); });
		}
	});

	return prototype;
}));