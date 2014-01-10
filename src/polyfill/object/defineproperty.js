/*
 * Qoopido polyfill/object/defineproperty
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
;(function(definition, qoopido) {
	if(qoopido.register) {
		qoopido.register('polyfill/object/defineproperty', definition);
	} else {
		(qoopido.modules = qoopido.modules || {})['polyfill/object/defineproperty'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
		'use strict';

		if(!Object.defineProperty || !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (exception) { return false; } } ())) {
			var defineProperty = Object.defineProperty,
				defineGetter   = Object.prototype.__defineGetter__,
				defineSetter   = Object.prototype.__defineSetter__;

			Object.defineProperty = function(obj, prop, desc) {
				// In IE8 try built-in implementation for defining properties on DOM prototypes.
				if(defineProperty) { try { return defineProperty(obj, prop, desc); } catch (exception) {} }

				if(obj !== Object(obj)) {
					throw new TypeError('Object.defineProperty called on non-object');
				}

				if(defineGetter && ('get' in desc)) {
					defineGetter.call(obj, prop, desc.get);
				}

				if(defineSetter && ('set' in desc)) {
					defineSetter.call(obj, prop, desc.set);
				}

				if('value' in desc) {
					obj[prop] = desc.value;
				}

				return obj;
			};
		}

		return true;
	},
	window.qoopido = window.qoopido || {}
));