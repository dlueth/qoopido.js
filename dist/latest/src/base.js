/*
 * Qoopido base
 *
 * Provides the basic object inheritance and extension mechanism
 *
 * Loosely base on proto-js by Axel Rauschmayer
 * https://github.com/rauschma/proto-js
 *
 * Shims borrowed from es5-shim by Kris Kowal
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
;(function(pDefinition, window, document, undefined) {
	'use strict';

	function initialize(pNamespace, pDefinition, pArguments, pSingleton) {
		var namespace = pNamespace.split('/');

		if(modules[pNamespace]) {
			return modules[pNamespace];
		}

		pArguments = (pArguments) ? [].slice.call(pArguments, 0) : [];

		return modules[pNamespace] = (function() {
			return ((pSingleton === true) ? pDefinition.call(null, modules, pArguments, namespace, window, document, undefined).create() : pDefinition.call(null, modules, pArguments, namespace, window, document, undefined));
		})();
	}

	var id      = 'qoopido',
		root    = window[id] = window[id] || { initialize: initialize },
		shared  = root.shared  = {},
		modules = root.modules = {};

	function definition() {
		return initialize('base', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		var dependencies = [];

		if(!Object.create) {
			dependencies.push('../polyfill/object/create');
		}

		if(!Object.getOwnPropertyNames) {
			dependencies.push('../polyfill/object/getownpropertynames');
		}

		if(!Object.getOwnPropertyDescriptor|| !(function () { try { Object.getOwnPropertyDescriptor({ x: 0 }, 'x'); return true; } catch (exception) { return false; } } ())) {
			dependencies.push('../polyfill/object/getownpropertydescriptor');
		}

		define(dependencies, definition);
	} else {
		definition();
	}
}(
	function(modules, dependencies, namespace, window, document, undefined) {
		'use strict';

		function getOwnPropertyDescriptors(object) {
			var descriptors = {},
				properties  = Object.getOwnPropertyNames(object),
				i, property;

			for(i = 0; (property = properties[i]) !== undefined; i++) {
				descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
			}

			return descriptors;
		}

		return {
			create: function() {
				var instance = Object.create(this, getOwnPropertyDescriptors(this)),
					result;

				if(instance._constructor) {
					result = instance._constructor.apply(instance, arguments);
				}

				instance.create = instance.extend = undefined;

				return result || instance;
			},
			extend: function(properties) {
				properties         = properties || {};
				properties._parent = this;

				return Object.create(this, getOwnPropertyDescriptors(properties));
			}
		};
	},
	window, document
));