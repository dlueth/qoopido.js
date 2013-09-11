/*
 * Qoopido polyfill/object/getownpropertydescriptor
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(definition) {
	'use strict';

	if(typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!Object.getOwnPropertyDescriptor|| !(function () { try { Object.getOwnPropertyDescriptor({ x: 0 }, 'x'); return true; } catch (exception) { return false; } } ())) {
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		Object.getOwnPropertyDescriptor = function(obj, property) {
			if(obj !== Object(obj)) {
				throw new TypeError();
			}

			try {
				return getOwnPropertyDescriptor.call(Object, obj, property);
			} catch (exception) {}

			if(Object.prototype.hasOwnProperty.call(obj, property)) {
				return {
					value:        obj[property],
					enumerable:   true,
					writable:     true,
					configurable: true
				};
			}
		};
	}
}));