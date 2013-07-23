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

		return modules[pNamespace]  = (function() {
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
	/*
	function(undefined) {
		'use strict';

		var pointerObjectPrototype = Object.prototype,
			supportsProto          = (pointerObjectPrototype.hasOwnProperty === null),
			supportsAccessors      = pointerObjectPrototype.hasOwnProperty('__defineGetter__'),
			fallbackDefineProperty, fallbackDefineProperties, fallbackGetOwnPropertyDescriptor;

		function Blueprint() {}
		function checkDefineProperty(object) { try { Object.defineProperty(object, 'sentinel', {}); return ('sentinel' in object); } catch (exception) {}}
		function checkGetOwnPropertyDescriptor(object) { try { object.sentinel = 0; return (Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0); } catch (exception) {}}

		if(!Object.keys) {
			var buggy   = true,
				exclude = [	'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
				key;

			for(key in { 'toString': null }) {
				buggy = false;
			}

			Object.keys = function(object) {
				var result = [],
					name;

				if((typeof object !== 'object' && typeof object !== 'function') || object === null) {
					throw new TypeError('Object.keys called on a non-object');
				}

				for(name in object) {
					if(object.hasOwnProperty(name)) {
						result.push(name);
					}
				}

				if(buggy === true) {
					var i;

					for(i = 0; (name = exclude[i]) !== undefined; i++) {
						if(object.hasOwnProperty(name)) {
							result.push(name);
						}
					}
				}

				return result;
			};
		}

		if(Object.defineProperty) {
			if(!(checkDefineProperty({})) || !(typeof document === 'undefined' || checkDefineProperty(document.createElement('div')))) {
				fallbackDefineProperty   = Object.defineProperty;
				fallbackDefineProperties = Object.defineProperties;
			}

			if(!(checkGetOwnPropertyDescriptor({})) || !(typeof document === 'undefined' || checkGetOwnPropertyDescriptor(document.createElement('div')))) {
				fallbackGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
			}
		}

		if(!Object.defineProperty || fallbackDefineProperty !== null) {
			Object.defineProperty = function(object, property, descriptor) {
				if((typeof object !== 'object' && typeof object !== 'function') || object === null) {
					throw new TypeError('Object.defineProperty called on non-object: ' + object);
				}

				if((typeof descriptor !== 'object' && typeof descriptor !== 'function') || descriptor === null) {
					throw new TypeError('Property description must be an object: ' + descriptor);
				}

				if(fallbackDefineProperty !== null) {
					try {
						return fallbackDefineProperty.call(Object, object, property, descriptor);
					} catch (exception) {}
				}

				if(descriptor.hasOwnProperty('value')) {
					if(supportsAccessors && (object.__lookupGetter__(property) || object.__lookupSetter__(property))) {
						var prototype = object.__proto__;

						object.__proto__ = pointerObjectPrototype;

						delete object[property];

						object[property] = descriptor.value;

						object.__proto__ = prototype;
					} else {
						object[property] = descriptor.value;
					}
				} else {
					if(supportsAccessors === false) {
						throw new TypeError('getters & setters can not be defined on this javascript engine');
					}

					if(descriptor.hasOwnProperty('get')) {
						object.__defineGetter__(property, descriptor.get);
					}

					if(descriptor.hasOwnProperty('set')) {
						object.__defineSetter__(property, descriptor.set);
					}
				}

				return object;
			};
		}

		if(!Object.defineProperties || fallbackDefineProperties !== null) {
			Object.defineProperties = function(object, properties) {
				var property;

				if(fallbackDefineProperties) {
					try {
						return fallbackDefineProperties.call(Object, object, properties);
					} catch (exception) {}
				}

				for(property in properties) {
					if(properties.hasOwnProperty(property) && property !== '__proto__') {
						Object.defineProperty(object, property, properties[property]);
					}
				}

				return object;
			};
		}

		if(!Object.getOwnPropertyDescriptor || fallbackGetOwnPropertyDescriptor !== null) {
			Object.getOwnPropertyDescriptor = function(object, property) {
				var descriptor =  { enumerable: true, configurable: true };

				if((typeof object !== 'object' && typeof object !== 'function') || object === null) {
					throw new TypeError('Object.getOwnPropertyDescriptor called on non-object: ' + object);
				}

				if(fallbackGetOwnPropertyDescriptor !== null) {
					try {
						return fallbackGetOwnPropertyDescriptor.call(Object, object, property);
					} catch (exception) {}
				}

				if(!object.hasOwnProperty(property)) {
					return;
				}

				if(supportsAccessors === true) {
					var prototype = object.__proto__,
						getter, setter;

					object.__proto__ = pointerObjectPrototype;

					getter = object.__lookupGetter__(property);
					setter = object.__lookupSetter__(property);

					object.__proto__ = prototype;

					if(getter || setter) {
						if(getter) {
							descriptor.get = getter;
						}

						if(setter) {
							descriptor.set = setter;
						}

						return descriptor;
					}
				}

				descriptor.value    = object[property];
				descriptor.writable = true;

				return descriptor;
			};
		}

		if(!Object.getOwnPropertyDescriptors) {
			Object.getOwnPropertyDescriptors = function(object) {
				var descriptors = {},
					propertiers = Object.getOwnPropertyNames(object),
					i, property;

				for(i = 0; (property = propertiers[i]) !== undefined; i++) {
					descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
				}

				return descriptors;
			};
		}

		if(!Object.getOwnPropertyNames) {
			Object.getOwnPropertyNames = function(object) {
				return Object.keys(object);
			};
		}

		if(!Object.create) {
			var createEmpty;

			if(supportsProto || typeof document === 'undefined') {
				createEmpty = function() { return { '__proto__': null }; };
			} else {
				createEmpty = function() {
					var iframe = document.createElement('iframe'),
						parent = document.body || document.documentElement,
						empty;

					iframe.style.display = 'none';
					parent.appendChild(iframe);
					iframe.src = 'javascript:';

					empty = iframe.contentWindow.pointerObjectPrototype;

					delete empty.constructor;
					delete empty.hasOwnProperty;
					delete empty.propertyIsEnumerable;
					delete empty.isPrototypeOf;
					delete empty.toLocaleString;
					delete empty.toString;
					delete empty.valueOf;
					empty.__proto__ = null;

					parent.removeChild(iframe);
					iframe = null;

					Blueprint.prototype = empty;

					createEmpty = function() {
						return new Blueprint();
					};

					return new Blueprint();
				};
			}

			Object.create = function(prototype, properties) {
				var object;

				function Type() {}

				if(prototype === null) {
					object = createEmpty();
				} else {
					if(typeof prototype !== 'object' && typeof prototype !== 'function') {
						throw new TypeError('Object prototype may only be an Object or null');
					}

					Type.prototype = prototype;

					object = new Type();
					object.__proto__ = prototype;
				}

				if(properties !== void 0) {
					Object.defineProperties(object, properties);
				}

				return object;
			};
		}
	},
	*/
	window, document
));