/*
 * Qoopido jquery/plugin/lazyimage
 *
 * jQuery plugin for Qoopido module /dom/element/lazyimage
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../dom/element/lazyimage
 * @external jQuery
 */
;(function(definition, global) {
	global.qoopido.register('jquery/plugins/lazyimage', definition, [ '../../dom/element/lazyimage', 'jquery' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var
	// variables
		jQuery = qoopido.module('jquery') || global.jQuery,
		name   = 'lazyimage',

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

	prototype = qoopido.module('dom/element/lazyimage').extend({
		_constructor: function(element, settings) {
			var self   = prototype._parent._constructor.call(this, element, settings),
				object = jQuery(element);

			self.on(EVENT_REQUESTED, function() { object.trigger(JQUERY_REQUESTED); });
			self.on(EVENT_LOADED, function() { object.trigger(JQUERY_LOADED); });

			return self;
		}
	});

	return prototype;
}, this));