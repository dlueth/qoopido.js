/*
 * Qoopido jquery/plugin/emerge
 *
 * jQuery plugin for Qoopido module /dom/element/emerge
 *
 * Copyright (c) 2015 Dirk Lueth
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
;(function(definition, global) {
	global.qoopido.register('jquery/plugins/emerge', definition, [ '../../dom/element/emerge', 'jquery' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var
	// variables
		jQuery = qoopido.module('jquery') || global.jQuery,
		name   = 'emerge',

	// classes
		prototype,

	// events
		EVENT_EMERGED   = 'emerged',
		EVENT_DEMERGED  = 'demerged',
		JQUERY_EMERGED  = ''.concat(EVENT_EMERGED, '.', name),
		JQUERY_DEMERGED = ''.concat(EVENT_DEMERGED, '.', name);

	jQuery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	prototype = qoopido.module('dom/element/emerge').extend({
		_constructor: function(element, settings) {
			var self   = prototype._parent._constructor.call(this, element, settings),
				object = jQuery(element);

			self.on(EVENT_EMERGED, function(event) { object.trigger(JQUERY_EMERGED, { priority: event.data }); });
			self.on(EVENT_DEMERGED, function() { object.trigger(JQUERY_DEMERGED); });

			return self;
		}
	});

	return prototype;
}, this));