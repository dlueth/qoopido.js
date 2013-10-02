/*
 * Qoopido polyfill/object/defineproperties
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
 *
 * @polyfill ./defineproperty
 */
;(function(definition) {
	'use strict';

	if(typeof define === 'function' && define.amd) {
		var dependencies = [];

		if(!Object.defineProperty || !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (exception) { return false; } } ())) {
			dependencies.push('./defineproperty');
		}

		define(dependencies, definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!Object.defineProperties) {
		Object.defineProperties = function(obj, properties) {
			if(obj !== Object(obj)) {
				throw new TypeError('Object.defineProperties called on non-object');
			}

			var name;

			for(name in properties) {
				if(Object.prototype.hasOwnProperty.call(properties, name)) {
					Object.defineProperty(obj, name, properties[name]);
				}
			}

			return obj;
		};
	}
}));