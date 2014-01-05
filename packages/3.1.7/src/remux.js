/*!
* Qoopido.js library package
*
* version: 3.1.7
* date:    2014-01-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/
;(function(definition) {
	var qoopido = window.qoopido = window.qoopido || {};

	if(qoopido.register) {
		qoopido.register('polyfill/object/defineproperty', definition);
	} else {
		(window.qoopido.modules = window.qoopido.modules || {})['polyfill/object/defineproperty'] = definition();
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
}));
;(function(definition) {
	var qoopido = window.qoopido = window.qoopido || {};

	if(qoopido.register) {
		var dependencies = [];

		if(!Object.defineProperty || !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (exception) { return false; } } ())) {
			dependencies.push('./defineproperty');
		}

		qoopido.register('polyfill/object/defineproperties', definition, dependencies);
	} else {
		(window.qoopido.modules = window.qoopido.modules || {})['polyfill/object/defineproperties'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
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

	return true;
}));
;(function(definition) {
	var qoopido = window.qoopido = window.qoopido || {};

	if(qoopido.register) {
		var dependencies = [];

		if(!Object.defineProperties) {
			dependencies.push('./defineproperties');
		}

		qoopido.register('polyfill/object/create', definition, dependencies);
	} else {
		(window.qoopido.modules = window.qoopido.modules || {})['polyfill/object/create'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!Object.create) {
		Object.create = function(prototype, properties) {
			if(typeof prototype !== 'object') {
				throw new TypeError();
			}

			function Constructor() {}
			Constructor.prototype = prototype;

			var obj = new Constructor();

			if(prototype) {
				obj.constructor = Constructor;
			}

			if(arguments.length > 1) {
				if(properties !== Object(properties)) {
					throw new TypeError();
				}

				Object.defineProperties(obj, properties);
			}

			return obj;
		};
	}

	return true;
}));
;(function(definition) {
	var qoopido = window.qoopido = window.qoopido || {};

	if(qoopido.register) {
		qoopido.register('polyfill/object/getownpropertydescriptor', definition);
	} else {
		(window.qoopido.modules = window.qoopido.modules || {})['polyfill/object/getownpropertydescriptor'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!Object.getOwnPropertyDescriptor|| !(function () { try { Object.getOwnPropertyDescriptor({ x: 0 }, 'x'); return true; } catch (exception) { return false; } } ())) {
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		Object.getOwnPropertyDescriptor = function(obj, property) {
			if(obj !== Object(obj)) {
				throw new TypeError();
			}

			try {
				return getOwnPropertyDescriptor.call(Object, obj, property);
			} catch (exception) {}

			if(Object.prototype.hasOwnProperty.call(obj, property)) {
				return {
					value:        obj[property],
					enumerable:   true,
					writable:     true,
					configurable: true
				};
			}
		};
	}

	return true;
}));
;(function(definition, navigator, window, document, undefined) {
	'use strict';

	function register(id, definition, dependencies, callback) {
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
	}

	function registerSingleton(id, definition, dependencies) {
		register(id, definition, dependencies, function(module) {
			modules[id] = module.create();
		});
	}

	function canonicalize(path) {
		var collapsed;

		while((collapsed = path.replace(regexCanonicalize, '')) !== path) {
			path = collapsed;
		}

		return path.replace(removeNeutral, '');
	}

	var id                = 'qoopido',
		root              = window[id] = window[id] || {},
		shared            = root.shared  = root.shared || {},
		modules           = root.modules = root.modules || {},
		dependencies      = [],
		isInternal        = new RegExp('^\\.+\\/'),
		regexCanonicalize = new RegExp('(?:\\/|)[^\\/]*\\/\\.\\.'),
		removeNeutral     = new RegExp('(^\\/)|\\.\\/', 'g');

	root.register          = register;
	root.registerSingleton = registerSingleton;

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
	navigator, window, document
));
;(function(definition) {
	window.qoopido.register('emitter', definition, [ './base' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var excludeMethods = /^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;

	function map(context, method) {
		var event = method.charAt(0).toUpperCase() + method.slice(1);

		context._mapped[method] = context[method];

		return function() {
			var args = Array.prototype.slice.call(arguments),
				returnValue;

			context.emit.apply(context, ['pre' + event, args]);
			returnValue = context._mapped[method].apply(context, args);
			context.emit.apply(context, ['post' + event, args, returnValue]);

			return returnValue;
		};
	}

	return modules['base'].extend({
		_mapped:   null,
		_listener: {},
		_constructor: function() {
			var self = this,
				method;

			self._mapped = {};

			for(method in self) {
				if(typeof self[method] === 'function' && excludeMethods.test(method) === false) {
					self[method] = map(self, method);
				}
			}
		},
		on: function(events, fn) {
			var self = this,
				i, event;

			events = events.split(' ');

			for(i = 0; (event = events[i]) !== undefined; i++) {
				(self._listener[event] = self._listener[event] || []).push(fn);
			}

			return self;
		},
		one: function(events, fn, each) {
			each = (each !== false);

			var self = this;

			self.on(events, function listener(event) {
				self.off(((each === true) ? event : events), listener);

				fn.apply(this, arguments);
			});

			return self;
		},
		off: function(events, fn) {
			var self = this,
				i, event, j, listener;

			if(events) {
				events = events.split(' ');

				for(i = 0; (event = events[i]) !== undefined; i++) {
					self._listener[event] = self._listener[event] || [];

					if(fn) {
						for(j = 0; (listener = self._listener[event][j]) !== undefined; j++) {
							if(listener === fn) {
								self._listener[event].splice(j, 1);

								j--;
							}
						}
					} else {
						self._listener[event].length = 0;
					}
				}
			} else {
				for(event in self._listener) {
					self._listener[event].length = 0;
				}
			}

			return self;
		},
		emit: function(event) {
			var self = this,
				i, listener;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				for(i = 0; (listener = self._listener[event][i]) !== undefined; i++) {
					listener.apply(self, arguments);
				}
			}

			return self;
		}
	});
}));
;(function(definition) {
	window.qoopido.registerSingleton('component/remux', definition, [ '../emitter' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype, style,
		html        = document.getElementsByTagName('html')[0],
		base        = 16,
		state       = { fontsize: null, layout: null, ratio: { } },
		current     = { fontsize: null, layout: null },
		delay       = null;

	function updateState() {
		var self = this;

		state.fontsize = parseInt(window.getComputedStyle(html).getPropertyValue('font-size'), 10);
		state.layout   = window.getComputedStyle(html, ':after').getPropertyValue('content') || null;

		if(state.fontsize !== current.fontsize || state.layout !== current.layout) {
			current.fontsize     = state.fontsize;
			current.layout       = state.layout;

			state.ratio.device   = (window.devicePixelRatio || 1);
			state.ratio.fontsize = state.fontsize / base;
			state.ratio.total    = state.ratio.device * state.ratio.fontsize;

			self.emit('statechange', state);
		}

		return self;
	}

	prototype = modules['emitter'].extend({
		_constructor: function() {
			var self          = this,
				pBase         = parseInt(html.getAttribute('data-base'), 10),
				delayedUpdate = function delayedUpdate() {
					if(delay !== null) {
						window.clearTimeout(delay);
					}

					delay = window.setTimeout(function() {
						updateState.call(self);
					}, 20);
				};

			prototype._parent._constructor.call(self);

			if(isNaN(pBase) === false) {
				base = pBase;
			}

			style      = document.createElement('style');
			style.type = 'text/css';

			document.getElementsByTagName('head')[0].appendChild(style);

			window.addEventListener('resize', delayedUpdate, false);
			window.addEventListener('orientationchange', delayedUpdate, false);

			updateState.call(self);
		},
		getState: function() {
			return state;
		},
		addLayout: function(pId, pLayout) {
			var parameter, id, layout, size, breakpoint, query,
				self = this;

			if(arguments.length > 1) {
				parameter      = { };
				parameter[pId] = pLayout;
			} else {
				parameter = arguments[0];
			}

			for(id in parameter) {
				layout = parameter[id];

				for(size = layout.min; size <= layout.max; size++) {
					breakpoint = Math.round(layout.width * (size / base));
					query      = '@media screen and (min-width: ' + breakpoint + 'px) { html { font-size: ' + size + 'px; } html:after { content: "' + id + '"; display: none; } }';

					if(style.styleSheet){
						style.styleSheet.cssText += query;
					} else {
						style.appendChild(document.createTextNode(query));
					}
				}
			}

			updateState.call(self);

			return self;
		}
	});

	return prototype;
}));