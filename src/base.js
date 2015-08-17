/*
 * qoopido base
 *
 * Provides the basic object inheritance and extension mechanism
 *
 * Loosely based on proto-js by Axel Rauschmayer
 * https://github.com/rauschma/proto-js
 *
 * Shims borrowed from es5-shim by Kris Kowal
 * https://github.com/kriskowal/es5-shim
 *
 * Copyright (c) 2015 Dirk Lueth
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

/* global console, module, define */

;(function(definition, global, undefined) {
	'use strict';

	var qoopido           = global.qoopido  || (global.qoopido = {}),
		shared            = qoopido.shared  || (qoopido.shared = {}),
		modules           = qoopido.modules || (qoopido.modules = {}),
		dependencies      = [],
		isInternal        = new RegExp('^\\.+\\/'),
		regexCanonicalize = new RegExp('(?:\\/|)[^\\/]*\\/\\.\\.'),
		removeNeutral     = new RegExp('(^\\/)|\\.\\/', 'g');

	function register(id, definition, dependencies, callback) {
		var namespace = id.split('/'),
			initialize;

		if(modules[id]) {
			return modules[id];
		}

		initialize = function() {
			if(dependencies) {
				var path = namespace.slice(0, -1).join('/'),
					i = 0, dependency, internal;

				for(; (dependency = dependencies[i]) !== undefined; i++) {
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

			modules[id] = definition(qoopido, global, undefined);

			if(callback) {
				callback(modules[id]);
			}

			return modules[id];
		};

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = define(initialize);
		} else if(typeof define === 'function' && define.amd) {
			dependencies ? define(dependencies, initialize) : define(initialize);
		} else {
			initialize();
		}
	}

	function registerSingleton(id, definition, dependencies) {
		register(id, definition, dependencies, function(module) {
			modules[id] = module.create();
		});
	}

	function getModule(id) {
		return (id) ? modules[id] || null : modules;
	}

	function getShared(id) {
		return (id) ? shared[id] || null : shared;
	}

	function canonicalize(path) {
		var collapsed;

		while((collapsed = path.replace(regexCanonicalize, '')) !== path) {
			path = collapsed;
		}

		return path.replace(removeNeutral, '');
	}

	qoopido.register          = register;
	qoopido.registerSingleton = registerSingleton;
	qoopido.module            = getModule;
	qoopido.shared            = getShared;

	if(!Object.create) {
		dependencies.push('./polyfill/object/create');
	}

	if(!Object.getOwnPropertyNames) {
		dependencies.push('./polyfill/object/getownpropertynames');
	}

	if(!Object.getOwnPropertyDescriptor || !(function () { try { Object.getOwnPropertyDescriptor({ x: 0 }, 'x'); return true; } catch (exception) { return false; } } ())) {
		dependencies.push('./polyfill/object/getownpropertydescriptor');
	}

	register('base', definition, dependencies);
}(function(qoopido, global, undefined) {
		'use strict';

		function getOwnPropertyDescriptors(object) {
			var descriptors = {},
				properties  = Object.getOwnPropertyNames(object),
				i = 0, property;

			for(; (property = properties[i]) !== undefined; i++) {
				descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
			}

			return descriptors;
		}

		function prohibitCall() {
			throw new Error('[Qoopido.js] Operation prohibited');
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
			extend: function(properties, final) {
				var instance;

				properties         = properties || {};
				final              = (final === true);
				properties._parent = this;
				instance           = Object.create(this, getOwnPropertyDescriptors(properties));

				if(final === true) {
					instance.extend = prohibitCall;
				}

				return instance;
			}
		};
	},
	this
));