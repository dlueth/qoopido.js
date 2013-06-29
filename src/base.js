/*
 * Qoopido base class for object inheritance
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
;(function(pDefinition, pShim, window, document, undefined) {
	'use strict';

	pShim();

	var id         = 'qoopido',
		root       = window[id] = window[id] || {},
		modules    = root.modules = root.modules || {},
		definition = function definition() {
			return initialize('base', pDefinition, arguments);
		},
		initialize = function initialize(pNamespace, pDefinition, pArgs, pSingleton) {
			var namespace = pNamespace.split('/'),
				id        = namespace[namespace.length - 1],
				pointer   = root;

			if(modules[pNamespace]) {
				return modules[pNamespace];
			}

			for(var i = 0; namespace[i + 1] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			[].push.apply(pArgs, [ namespace, window, document, undefined ]);

			return (pSingleton === true) ? (pointer[id] = modules[pNamespace] = pDefinition.apply(null, pArgs).create()) : (pointer[id] = modules[pNamespace] = pDefinition.apply(null, pArgs));
		};

	initialize('shared/module/initialize',
		function(module, namespace) {
			if(typeof define === 'function' && define.amd) {
				define(namespace, module);
			}

			return module;
		},
		[initialize]);

	if(typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		definition();
	}
}(
	function(namespace, window, document, undefined) {
		'use strict';

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

				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			}
		};
	},
	function(undefined) {
		'use strict';

		var valueNull                       = null,
			stringFunction                  = 'function',
			stringObject                    = 'object',
			stringUndefined                 = 'undefined',
			stringProto                     = '__proto__',
			stringPrototype                 = 'prototype',
			stringHasOwnProperty            = 'hasOwnProperty',
			stringDefineProperty            = 'defineProperty',
			stringDefineProperties          = 'defineProperties',
			stringGetOwnPropertyDescriptor  = 'getOwnPropertyDescriptor',
			stringGetOwnPropertyDescriptors = 'getOwnPropertyDescriptors',
			stringGetOwnPropertyNames       = 'getOwnPropertyNames',
			pointerObjectPrototype          = Object[stringPrototype],
			supportsProto                   = (pointerObjectPrototype[stringProto] === valueNull),
			supportsAccessors               = pointerObjectPrototype[stringHasOwnProperty]('__defineGetter__'),
			fallbackDefineProperty, fallbackDefineProperties, fallbackGetOwnPropertyDescriptor;

		function Blueprint() {}
		function checkDefineProperty(object) { try { Object[stringDefineProperty](object, 'sentinel', {}); return ('sentinel' in object); } catch (exception) {}}
		function checkGetOwnPropertyDescriptor(object) { try { object.sentinel = 0; return (Object[stringGetOwnPropertyDescriptor](object, 'sentinel').value === 0); } catch (exception) {}}

		if(!Object.keys) {
			var buggy   = true,
				exclude = [	'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ],
				key;

			for(key in { 'toString': valueNull }) {
				buggy = false;
			}

			Object.keys = function keys(object) {
				var result = [],
					name;

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object.keys called on a non-object');
				}

				for(name in object) {
					if(object[stringHasOwnProperty](name)) {
						result.push(name);
					}
				}

				if(buggy === true) {
					var i;

					for(i = 0; (name = exclude[i]) !== undefined; i++) {
						if(object[stringHasOwnProperty](name)) {
							result.push(name);
						}
					}
				}

				return result;
			};
		}

		if(Object[stringDefineProperty]) {
			if(!(checkDefineProperty({})) || !(typeof document === stringUndefined || checkDefineProperty(document.createElement('div')))) {
				fallbackDefineProperty   = Object[stringDefineProperty];
				fallbackDefineProperties = Object[stringDefineProperties];
			}

			if(!(checkGetOwnPropertyDescriptor({})) || !(typeof document === stringUndefined || checkGetOwnPropertyDescriptor(document.createElement('div')))) {
				fallbackGetOwnPropertyDescriptor = Object[stringGetOwnPropertyDescriptor];
			}
		}

		if(!Object[stringDefineProperty] || fallbackDefineProperty !== valueNull) {
			Object[stringDefineProperty] = function defineProperty(object, property, descriptor) {
				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringDefineProperty] called on non-object: ' + object);
				}

				if((typeof descriptor !== stringObject && typeof descriptor !== stringFunction) || descriptor === valueNull) {
					throw new TypeError('Property description must be an object: ' + descriptor);
				}

				if(fallbackDefineProperty !== valueNull) {
					try {
						return fallbackDefineProperty.call(Object, object, property, descriptor);
					} catch (exception) {}
				}

				if(descriptor[stringHasOwnProperty]('value')) {
					if(supportsAccessors && (object.__lookupGetter__(property) || object.__lookupSetter__(property))) {
						var prototype = object[stringProto];

						object[stringProto] = pointerObjectPrototype;

						delete object[property];

						object[property] = descriptor.value;

						object[stringProto] = prototype;
					} else {
						object[property] = descriptor.value;
					}
				} else {
					if(supportsAccessors === false) {
						throw new TypeError('getters & setters can not be defined on this javascript engine');
					}

					if(descriptor[stringHasOwnProperty]('get')) {
						object.__defineGetter__(property, descriptor.get);
					}

					if(descriptor[stringHasOwnProperty]('set')) {
						object.__defineSetter__(property, descriptor.set);
					}
				}

				return object;
			};
		}

		if(!Object[stringDefineProperties] || fallbackDefineProperties !== valueNull) {
			Object[stringDefineProperties] = function defineProperties(object, properties) {
				var property;

				if(fallbackDefineProperties) {
					try {
						return fallbackDefineProperties.call(Object, object, properties);
					} catch (exception) {}
				}

				for(property in properties) {
					if(properties[stringHasOwnProperty](property) && property !== '__proto__') {
						Object[stringDefineProperty](object, property, properties[property]);
					}
				}

				return object;
			};
		}

		if(!Object[stringGetOwnPropertyDescriptor] || fallbackGetOwnPropertyDescriptor !== valueNull) {
			Object[stringGetOwnPropertyDescriptor] = function getOwnPropertyDescriptor(object, property) {
				var descriptor =  { enumerable: true, configurable: true };

				if((typeof object !== stringObject && typeof object !== stringFunction) || object === valueNull) {
					throw new TypeError('Object[stringGetOwnPropertyDescriptor] called on non-object: ' + object);
				}

				if(fallbackGetOwnPropertyDescriptor !== valueNull) {
					try {
						return fallbackGetOwnPropertyDescriptor.call(Object, object, property);
					} catch (exception) {}
				}

				if(!object[stringHasOwnProperty](property)) {
					return;
				}

				if(supportsAccessors === true) {
					var prototype = object[stringProto],
						getter, setter;

					object[stringProto] = pointerObjectPrototype;

					getter = object.__lookupGetter__(property);
					setter = object.__lookupSetter__(property);

					object[stringProto] = prototype;

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

		if(!Object[stringGetOwnPropertyDescriptors]) {
			Object[stringGetOwnPropertyDescriptors] = function(object) {
				var descriptors = {},
					propertiers = Object[stringGetOwnPropertyNames](object),
					i, property;

				for(i = 0; (property = propertiers[i]) !== undefined; i++) {
					descriptors[property] = Object[stringGetOwnPropertyDescriptor](object, property);
				}

				return descriptors;
			};
		}

		if(!Object[stringGetOwnPropertyNames]) {
			Object[stringGetOwnPropertyNames] = function getOwnPropertyNames(object) {
				return Object.keys(object);
			};
		}

		if(!Object.create) {
			var createEmpty;

			if(supportsProto || typeof document === stringUndefined) {
				createEmpty = function() { return { '__proto__': valueNull }; };
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
					empty[stringProto] = valueNull;

					parent.removeChild(iframe);
					iframe = valueNull;

					Blueprint[stringPrototype] = empty;

					createEmpty = function () {
						return new Blueprint();
					};

					return new Blueprint();
				};
			}

			Object.create = function create(prototype, properties) {
				var object;

				function Type() {}

				if(prototype === valueNull) {
					object = createEmpty();
				} else {
					if(typeof prototype !== stringObject && typeof prototype !== stringFunction) {
						throw new TypeError('Object prototype may only be an Object or null');
					}

					Type[stringPrototype] = prototype;

					object = new Type();
					object[stringProto] = prototype;
				}

				if(properties !== void 0) {
					Object[stringDefineProperties](object, properties);
				}

				return object;
			};
		}
	},
	window, document
));