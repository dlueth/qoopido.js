/*
 * Qoopido pool array
 *
 * Provides array pooling facilities
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../pool
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('pool/array', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define(['../pool'], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	var prototype;

	prototype = modules.pool.extend({
		_dispose: function(element) {
			element.length = 0;

			return element;
		},
		_obtain: function() {
			return [];
		}
	});

	return prototype;
}, window));