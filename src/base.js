/*
 * qoopido base
 *
 * Provides the basic object inheritance and extension mechanism
 *
 * Loosely base on proto-js by Axel Rauschmayer
 * https://github.com/rauschma/proto-js
 *
 * Shims borrowed from es5-shim by Kris Kowal
 * https://github.com/kriskowal/es5-shim
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./polyfill/object/create
 * @polyfill ./polyfill/object/getownpropertynames
 * @polyfill ./polyfill/object/getownpropertydescriptor
 */

;(function(definition, qoopido, navigator, window, document, undefined) {
	'use strict';

	var shared            = qoopido.shared  = qoopido.shared || {},
		modules           = qoopido.modules = qoopido.modules || {},
		dependencies      = [],
		isInternal        = new RegExp('^\\.+\\/'),
		regexCanonicalize = new RegExp('(?:\\/|)[^\\/]*\\/\\.\\.'),
		removeNeutral     = new RegExp('(^\\/)|\\.\\/', 'g'),
		register, registerSingleton;

	register = qoopido.register = function register(id, definition, dependencies, callback) {
		var namespace = id.split('/'),
			initialize;

		if(modules[id]) {
			return modules[id];
		}

		initialize = function() {
			if(dependencies) {
				var path = namespace.slice(0, -1).join('/'),
					i, dependency, internal;

				for(i = 0; (dependency = dependencies[i]) !== undefined; i++) {
					internal = isInternal.test(dependency);

					if(internal) {
						dependency = canonicalize(path + '/' + dependency);
					}

					if(!modules[dependency] && arguments[i]) {
						modules[dependency] = arguments[i];
					}

					if(internal && !modules[dependency] && typeof console !== 'undefined') {
						console.error(''.concat('[Qoopido.js] ', id, ': Could not load dependency ', dependency));
					}
				}
			}

			modules[id] = definition(modules, shared, namespace, navigator, window, document, undefined);

			if(callback) {
				callback(modules[id]);
			}

			return modules[id];
		};

		if(typeof define === 'function' && define.amd) {
			dependencies ? define(dependencies, initialize) : define(initialize);
		} else {
			initialize();
		}
	};

	registerSingleton = qoopido.registerSingleton = function registerSingleton(id, definition, dependencies) {
		register(id, definition, dependencies, function(module) {
			modules[id] = module.create();
		});
	};

	function canonicalize(path) {
		var collapsed;

		while((collapsed = path.replace(regexCanonicalize, '')) !== path) {
			path = collapsed;
		}

		return path.replace(removeNeutral, '');
	}

	if(!Object.create) {
		dependencies.push('./polyfill/object/create');
	}

	if(!Object.getOwnPropertyNames) {
		dependencies.push('./polyfill/object/getownpropertynames');
	}

	if(!Object.getOwnPropertyDescriptor|| !(function () { try { Object.getOwnPropertyDescriptor({ x: 0 }, 'x'); return true; } catch (exception) { return false; } } ())) {
		dependencies.push('./polyfill/object/getownpropertydescriptor');
	}

	register('base', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
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

		function prohibitCall() {
			if(typeof console !== 'undefined') {
				console.error('[Qoopido.js] Operation prohibited on an actual instance');
			}
		}


		return {
			create: function() {
				var instance = Object.create(this, getOwnPropertyDescriptors(this)),
					result;

				if(instance._constructor) {
					result = instance._constructor.apply(instance, arguments);
				}

				instance.create = instance.extend = prohibitCall;

				return result || instance;
			},
			extend: function(properties) {
				properties         = properties || {};
				properties._parent = this;

				return Object.create(this, getOwnPropertyDescriptors(properties));
			}
		};
	},
	window.qoopido = window.qoopido || {}, navigator, window, document
));