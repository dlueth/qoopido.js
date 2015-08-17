/*
 * Qoopido polyfill/object/defineproperties
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./defineproperty
 *
 * @browsers Chrome < 5, Firefox < 4, Internet Explorer < 9, Opera < 11.60, Safari < 5
 */
;(function(definition, qoopido) {
	if(qoopido.register) {
		var dependencies = [];

		if(!Object.defineProperty || !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (exception) { return false; } } ())) {
			dependencies.push('./defineproperty');
		}

		qoopido.register('polyfill/object/defineproperties', definition, dependencies);
	} else {
		(qoopido.modules = qoopido.modules || {})['polyfill/object/defineproperties'] = definition();
	}
}(function(qoopido, global, undefined) {
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

		return Object.defineProperties;
	},
	this.qoopido = this.qoopido || {}
));