/*
 * Qoopido transport xhr
 *
 * Provides basic XHR (AJAX) functionality
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../base
 * @require ../url
 * @require ../unique
 * @require q (external)
 * @require json2 (external, for legacy support only)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('transport', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../base', '../function/merge' ], definition);
	} else {
		definition(window.qoopido.base, window.qoopido.function.merge);
	}
}(function(mPrototype, merge) {
	'use strict';

	var prototype;

	prototype = mPrototype.extend({
		setup: function(options) {
			var self = this;

			self._settings = merge({}, self._settings, options);

			return self;
		},
		serialize: function(obj, prefix) {
			var parameter = [], id, key, value;

			for(id in obj) {
				key   = prefix ? ''.concat(prefix, '[', id, ']') : id;
				value = obj[id];

				parameter.push((typeof value === 'object') ? this.serialize(value, key) : ''.concat(encodeURIComponent(key), '=', encodeURIComponent(value)));
			}

			return parameter.join('&');
		}
	});

	return prototype;
}, window, document));