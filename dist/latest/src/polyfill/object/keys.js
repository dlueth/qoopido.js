/*
 * Qoopido polyfill/object/keys
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
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

	if(!Object.keys) {
		Object.keys = function(obj) {
			if(obj !== Object(obj)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var ret = [],
				p;

			for(p in obj) {
				if(Object.prototype.hasOwnProperty.call(obj, p)) {
					ret.push(p);
				}
			}

			return ret;
		};
	}
}));