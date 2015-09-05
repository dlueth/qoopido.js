/**
 * Qoopido base
 *
 * Provides the basic object inheritance and extension mechanism
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @requires Array.forEach, Object.create, Object.getOwnPropertyNames, Object.getOwnPropertyDescriptor, Object.defineProperty
 */

;(function() {
	'use strict';

	var objectCreate                   = Object.create,
		objectDefineProperty           = Object.defineProperty,
		objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
		objectGetOwnPropertyNames      = Object.getOwnPropertyNames,
		generateCustomDescriptor       = function(value, writable) { return { writable: !!writable, configurable: false, enumerable: false, value: value }; };

	function definition() {
		function base() {}

		base.extend = function(fn) {
			var parent     = this,
				source     = fn.prototype,
				properties = {};

			objectGetOwnPropertyNames(source).forEach(function(property) {
				properties[property] = objectGetOwnPropertyDescriptor(source, property);
			});

			properties['constructor'] = generateCustomDescriptor(fn);
			properties['super']       = generateCustomDescriptor(parent);

			fn.prototype = objectCreate(parent.prototype || parent, properties);

			!fn.final && (objectDefineProperty(fn, 'extend', generateCustomDescriptor(parent.extend, true)));

			return fn;
		};

		return base;
	}

	provide(definition);
}());