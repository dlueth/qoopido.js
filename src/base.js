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

/* global module, define */

;(function(definition, global, undefined) {
	'use strict';

	var qoopido           = global.qoopido   || (global.qoopido   = {}),
		storage           = qoopido.storage  || (qoopido.storage  = {}),
		storageModules    = storage.modules  || (storage.modules  = {}),
		storageDefaults   = storage.defaults || (storage.defaults = {}),
		storageShared     = storage.shared   || (storage.shared   = {}),
		dependencies      = [],
		publicInterface   = {},
		isInternal        = new RegExp('^\\.+\\/'),
		regexCanonicalize = new RegExp('(?:\\/|)[^\\/]*\\/\\.\\.'),
		removeNeutral     = new RegExp('(^\\/)|\\.\\/', 'g');

	function MissingDependencyException(module, dependency) {
		this.module     = module;
		this.dependency = dependency;
		this.message    = 'could not be resolved';
		this.toString   = function() {
			return 'MissingDependencyException: module ' + dependency + ' requested by ' + module + ' ' + this.message;
		};
	}

	function register(id, definition, dependencies, callback) {
		var namespace = id.split('/'),
			initialize;

		if(storageModules[id]) {
			return storageModules[id];
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

					if(!storageModules[dependency] && arguments[i]) {
						storageModules[dependency] = arguments[i];
					}

					if(internal && !storageModules[dependency]) {
						throw new MissingDependencyException(id, dependency);
					}
				}
			}

			storageModules[id] = definition(publicInterface, global, undefined);

			if(callback) {
				callback(storageModules[id]);
			}

			return storageModules[id];
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
			storageModules[id] = module.create();
		});
	}

	function module(id) {
		return (id) ? storageModules[id] || null : storageModules;
	}

	function shared(id) {
		return (id) ? storageShared[id] || null : storageShared;
	}

	function defaults(id, options) {
		if(id && options) {
			storageDefaults[id] = options;
		}

		return (id) ? storageDefaults[id] || (storageDefaults[id] = {}) : storageDefaults;
	}

	function canonicalize(path) {
		var collapsed;

		while((collapsed = path.replace(regexCanonicalize, '')) !== path) {
			path = collapsed;
		}

		return path.replace(removeNeutral, '');
	}

	publicInterface.register          = qoopido.register          = register;
	publicInterface.registerSingleton = qoopido.registerSingleton = registerSingleton;
	publicInterface.module            = qoopido.module            = module;
	publicInterface.shared            = qoopido.shared            = shared;
	publicInterface.defaults          = qoopido.defaults          = defaults;

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