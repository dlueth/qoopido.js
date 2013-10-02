/*
 * Qoopido jquery/plugin/emerge
 *
 * jQuery plugin for Qoopido module emerge
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
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('jquery/plugins/emerge', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../dom/element/emerge', 'jquery' ], definition);
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
		EVENT_EMERGED   = 'emerged',
		EVENT_DEMERGED  = 'demerged',
		JQUERY_EMERGED  = ''.concat(EVENT_EMERGED, '.', name),
		JQUERY_DEMERGED = ''.concat(EVENT_DEMERGED, '.', name);

	jQuery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	prototype = modules['element/emerge'].extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = jQuery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_EMERGED, function(event) { object.trigger(JQUERY_EMERGED, { priority: event.data }); });
			self.on(EVENT_DEMERGED, function() { object.trigger(JQUERY_DEMERGED); });
		}
	});

	return prototype;
}, window));