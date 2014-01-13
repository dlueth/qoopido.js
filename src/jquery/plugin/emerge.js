/*
 * Qoopido jquery/plugin/emerge
 *
 * jQuery plugin for Qoopido module /dom/element/emerge
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
	window.qoopido.register('jquery/plugins/emerge', definition, [ '../../dom/element/emerge', 'jquery' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var
	// variables
		jQuery = modules['jquery'] || window.jQuery,
		name   = namespace.pop(),

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

	prototype = modules['dom/element/emerge'].extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = jQuery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_EMERGED, function(event) { object.trigger(JQUERY_EMERGED, { priority: event.data }); });
			self.on(EVENT_DEMERGED, function() { object.trigger(JQUERY_DEMERGED); });
		}
	});

	return prototype;
}));