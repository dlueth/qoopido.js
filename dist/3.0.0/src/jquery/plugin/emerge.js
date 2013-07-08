/*
 * Qoopido jquery plugin emerge
 *
 * jQuery plugin for Qoopido module emerge
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
		return window.qoopido.shared.module.initialize('jquery/plugins/emerge', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../element/emerge', 'jquery' ], definition);
	} else {
		definition(window.qoopido.element.emerge, window.jQuery);
	}
}(function(mPrototype, mJquery, namespace) {
	'use strict';

	var
	// variables
		name = namespace.pop(),

	// classes
		prototype,

	// events
		EVENT_EMERGED   = 'emerged',
		EVENT_DEMERGED  = 'demerged',
		JQUERY_EMERGED  = ''.concat(EVENT_EMERGED, '.', name),
		JQUERY_DEMERGED = ''.concat(EVENT_DEMERGED, '.', name);

	mJquery.fn[name] = function(settings) {
		return this.each(function() {
			prototype.create(this, settings);
		});
	};

	prototype = mPrototype.extend({
		_constructor: function(element, settings) {
			var self   = this,
				object = mJquery(element);

			prototype._parent._constructor.call(self, element, settings);

			self.on(EVENT_EMERGED, function(priority) { object.trigger(JQUERY_EMERGED, { priority: priority }); });
			self.on(EVENT_DEMERGED, function() { object.trigger(JQUERY_DEMERGED); });
		}
	});

	return prototype;
}, window));