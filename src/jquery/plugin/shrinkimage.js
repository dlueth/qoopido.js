/*
 * Qoopido jquery/plugin/shrinkimage
 *
 * jQuery plugin for Qoopido module /dom/element/shrinkimage
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../dom/element/shrinkimage
 * @external jQuery
 */
;(function(definition) {
	window.qoopido.register('jquery/plugins/shrinkimage', definition, [ '../../dom/element/shrinkimage', 'jquery' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var
	// variables
		jQuery = modules['jquery'] || window.jQuery,
		name   = namespace.pop(),

	// classes
		prototype,

	// events
		EVENT_QUEUED  = 'queued',
		EVENT_CACHED  = 'cached',
		EVENT_LOADED  = 'loaded',
		EVENT_FAILED  = 'failed',
		JQUERY_QUEUED = ''.concat(EVENT_QUEUED, '.', name),
		JQUERY_CACHED = ''.concat(EVENT_CACHED, '.', name),
		JQUERY_LOADED = ''.concat(EVENT_LOADED, '.', name),
		JQUERY_FAILED = ''.concat(EVENT_FAILED, '.', name);

	jQuery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	prototype = modules['dom/element/shrinkimage'].extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = jQuery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_QUEUED, function() { object.trigger(JQUERY_QUEUED); });
			self.on(EVENT_CACHED, function() { object.trigger(JQUERY_CACHED); });
			self.on(EVENT_LOADED, function() { object.trigger(JQUERY_LOADED); });
			self.on(EVENT_FAILED, function() { object.trigger(JQUERY_FAILED); });
		}
	});

	return prototype;
}));