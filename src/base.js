/*
 * Qoopido base class for object inheritance
 *
 * Loosely base on proto-js by Axel Rauschmayer
 * https://github.com/rauschma/proto-js
 *
 * Object.create shim borrowed from es5-shim by Kris Kowal
 * https://github.com/kriskowal/es5-shim
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/base',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	window.qoopido                      = window.qoopido || {};
	window.qoopido.shared               = window.qoopido.shared || {};
	window.qoopido.shared.prepareModule = function prepareModule(namespace, definition, args, singleton) {
		var id      = (namespace = namespace.split('/')).splice(namespace.length - 1, 1)[0],
			pointer = window;

		for(var i = 0; namespace[i] !== undefined; i++) {
			pointer[namespace[i]] = pointer[namespace[i]] || {};

			pointer = pointer[namespace[i]];
		}

		[].push.apply(args, [ window, document, undefined ]);

		return (singleton === true) ? (pointer[id] = definition.apply(null, args).create()) : (pointer[id] = definition.apply(null, args));
	};

	if(typeof define === 'function' && define.amd) {
		define(initialize);
	} else {
		initialize();
	}
}(function(window, document, undefined) {
	'use strict';

	var supportsEs5 = !!(Object.getOwnPropertyNames && Array.prototype.forEach && Object.getOwnPropertyDescriptor);

	if(Object.create === undefined) {
		Object.create = function(prototype, properties) {
			var object;

			if (prototype === null) {
				object = { '__proto__': null };
			} else {
				if(typeof prototype !== 'object') {
					throw new TypeError('typeof prototype[' + (typeof prototype) + '] != "object"');
				}

				var Type = function () {};
				Type.prototype = prototype;

				object = new Type();
				object.__proto__ = prototype;
			}

			if(properties !== undefined) {
				Object.defineProperties(object, properties);
			}

			return object;
		};
	}

	if(Object.getOwnPropertyDescriptors === undefined) {
		Object.getOwnPropertyDescriptors = function(object) {
			var descriptors = {};

			Object.getOwnPropertyNames(object).forEach(function(property) {
				descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
			});

			return descriptors;
		};
	}

	return {
		create: function create() {
			var instance = Object.create(this, Object.getOwnPropertyDescriptors(this));

			if(instance._constructor) {
				instance._constructor.apply(instance, arguments);
			}

			instance.create = instance.extend = undefined;

			return instance;
		},
		extend: function extend(properties) {
			properties         = properties || {};
			properties._parent = Object.create(this, Object.getOwnPropertyDescriptors(this));

			if(supportsEs5 === true) { // Primary version for ECMAScript 5 compatible browsers
				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			} else { // Fallback version for non ECMAScript 5 compatible browsers
				var extended = Object.create(this),
					property;

				for(property in properties) {
					if(property !== '__proto__') {
						extended[property] = properties[property];
					}
				}

				return Object.create(extended);
			}
		}
	};
}, window, document));