/*
 * Qoopido jquery plugin lazyimage
 *
 * jQuery plugin for Qoopido module lazyimage
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../../element/emerge
 * @require jquery (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('jquery/plugins/lazyimage', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../element/lazyimage', 'jquery' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace) {
	'use strict';

	var
	// variables
		jQuery = window.jQuery || dependencies[1],
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

	prototype = modules.element.lazyimage.extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = jQuery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_REQUESTED, function() { object.trigger(JQUERY_REQUESTED); });
			self.on(EVENT_LOADED, function() { object.trigger(JQUERY_LOADED); });
		}
	});

	return prototype;
}, window));