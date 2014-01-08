/*!
* Qoopido.js library package
*
* version: 3.1.8
* date:    2014-01-08
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
		qoopido.register('polyfill/object/getownpropertynames', definition);
	} else {
		(window.qoopido.modules = window.qoopido.modules || {})['polyfill/object/getownpropertynames'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!Object.getOwnPropertyNames) {
		Object.getOwnPropertyNames = function(obj) {
			if(obj !== Object(obj)) {
				throw new TypeError('Object.getOwnPropertyNames called on non-object');
			}

			var props = [],
				p;

			for(p in obj) {
				if(Object.prototype.hasOwnProperty.call(obj, p)) {
					props.push(p);
				}
			}

			return props;
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
/* global define, require, console */

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
	navigator, window, document
));
;(function(definition) {
	window.qoopido.register('polyfill/window/getcomputedstyle', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!window.getComputedStyle) {
		var getComputedStyleRegex    = new RegExp('(\\-([a-z]){1})', 'g'),
			getComputedStyleCallback = function() {
				return arguments[2].toUpperCase();
			};

		window.getComputedStyle = function(element, pseudo) {
			var self = this;

			self.element = element;

			self.getPropertyValue = function(property) {
				if(property === 'float') {
					property = 'styleFloat';
				}

				if(getComputedStyleRegex.test(property)) {
					property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
				}

				return element.currentStyle[property] ? element.currentStyle[property] : null;
			};

			return self;
		};
	}

	return true;
}));
;(function(definition) {
	window.qoopido.register('function/unique/uuid', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var lookup     = {},
		regex      = new RegExp('[xy]', 'g');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	return function() {
		var result;

		do {
			result = generateUuid();
		} while(typeof lookup[result] !== 'undefined');

		lookup[result] = true;

		return result;
	};
}));
;(function(definition) {
	window.qoopido.register('proxy', definition, [ './function/unique/uuid' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['base'].extend({
		_constructor: function(context, fn) {
			var args  = Array.prototype.splice.call(arguments, 2),
				proxy = function() {
					return fn.apply(context, Array.prototype.slice.call(arguments, 0).concat(args));
				};

			proxy._quid = modules['function/unique/uuid']();

			return proxy;
		}
	});
}));
;(function(definition) {
	var dependencies = [ '../proxy' ];

	if(!window.getComputedStyle) {
		dependencies.push('../polyfill/window/getcomputedstyle');
	}

	window.qoopido.register('dom/element', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var attachListener, detachListener, emitEvent,
		stringObject = 'object',
		stringString = 'string';

	function normalizeEvent(event) {
		if(!event.target) {
			event.target = event.srcElement || document;
		}

		if(event.target.nodeType === 3) {
			event.target = event.target.parentNode;
		}

		if(!event.relatedTarget && event.fromElement ) {
			event.relatedTarget = (event.fromElement === event.target) ? event.toElement : event.fromElement;
		}

		return event;
	}

	attachListener = (window.addEventListener) ?
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element[luid] = function(event) { fn.call(this, normalizeEvent(event)); };

			element.addEventListener(name, element[luid], false);
		}
		:
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element[luid] = function() { fn.call(this, normalizeEvent(window.event)); };

			if(element['on' + name] !== undefined) {
				element.attachEvent('on' + name, element[luid]);
			} else {
				name = ''.concat('fake[', name, ']');

				element[name] = null;
				element.attachEvent('onpropertychange', function(event) {
					if(event.propertyName === name) {
						fn.call(this, normalizeEvent(element[name]));
					}
				});
			}
		};

	detachListener = (window.removeEventListener) ?
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element.removeEventListener(name, element[luid], false);
			delete element[luid];
		}
		:
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element.detachEvent('on' + name, element[luid]);
			delete element[luid];
		};

	emitEvent = (document.createEvent) ?
		function(type, data) {
			var self    = this,
				element = self.element,
				event   = document.createEvent('HTMLEvents');

			event.initEvent(type, true, true);
			event.data = data;
			element.dispatchEvent(event);
		}
		:
		function(type, data) {
			var self    = this,
				element = self.element,
				event   = document.createEventObject();

			event.type = event.eventType = type;
			event.data = data;

			try{
				element.fireEvent('on' + event.eventType, event);
			} catch(exception) {
				var name = ''.concat('fake[', type, ']');

				if(element[name] !== undefined) {
					element[name] = event;
				}
			}
		};

	return modules['base'].extend({
		type:     null,
		element:  null,
		listener: null,
		_constructor: function(element) {
			var self = this;

			if(!element) {
				throw new Error('Missing element argument');
			}

			self.type     = element.tagName;
			self.element  = element;
			self.listener = {};
		},
		getAttribute: function(attribute) {
			if(attribute && typeof attribute === stringString) {
				var self = this;

				attribute = attribute.split(' ');

				if(attribute.length === 1) {
					return self.element.getAttribute(attribute[0]);
				} else {
					return self.getAttributes(attribute);
				}
			}
		},
		getAttributes: function(attributes) {
			var self   = this,
				result = {};

			if(attributes) {
				attributes = (typeof attributes === stringString) ? attributes.split(' ') : attributes;

				if(typeof attributes === stringObject && attributes.length) {
					var i, attribute;

					for(i = 0; (attribute = attributes[i]) !== undefined; i++) {
						result[attribute] = self.element.getAttributes(attribute);
					}
				}
			}

			return result;
		},
		setAttribute: function(attribute, value) {
			var self = this;

			if(attribute && typeof attribute === stringString) {
				self.element.setAttribute(attribute, value);
			}

			return self;
		},
		setAttributes: function(attributes) {
			var self = this;

			if(attributes && typeof attributes === stringObject && !attributes.length) {
				var attribute;

				for(attribute in attributes) {
					self.element.setAttribute(attribute, attributes[attribute]);
				}
			}

			return self;
		},
		removeAttribute: function(attribute) {
			var self = this;

			if(attribute && typeof attribute === stringString) {
				attribute = attribute.split(' ');

				if(attribute.length === 1) {
					self.element.removeAttribute(attribute[0]);
				} else {
					self.removeAttributes(attribute);
				}
			}

			return self;
		},
		removeAttributes: function(attributes) {
			var self = this;

			if(attributes) {
				attributes = (typeof attributes === stringString) ? attributes.split(' ') : attributes;

				if(typeof attributes === stringObject && attributes.length) {
					var i, attribute;

					for(i = 0; (attribute = attributes[i]) !== undefined; i++) {
						self.element.removeAttribute(attribute);
					}
				}
			}

			return self;
		},
		getStyle: function(property) {
			if(property && typeof property === stringString) {
				var self = this;

				property = property.split(' ');

				if(property.length === 1) {
					return window.getComputedStyle(self.element, null).getPropertyValue(property[0]);
				} else {
					return self.getStyles(property);
				}
			}
		},
		getStyles: function(properties) {
			var self   = this,
				result = {};

			if(properties) {
				properties = (typeof properties === stringString) ? properties.split(' ') : properties;

				if(typeof properties === stringObject && properties.length) {
					var i, property;

					for(i = 0; (property = properties[i]) !== undefined; i++) {
						result[property] = window.getComputedStyle(self.element, null).getPropertyValue(property);
					}
				}
			}

			return result;
		},
		setStyle: function(property, value) {
			var self = this;

			if(property && typeof property === stringString) {
				self.element.style[property] = value;
			}

			return self;
		},
		setStyles: function(properties) {
			var self = this;

			if(properties && typeof properties === stringObject && !properties.length) {
				var property;

				for(property in properties) {
					self.element.style[property] = properties[property];
				}
			}

			return self;
		},
		isVisible: function() {
			var element = this.element;

			return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
		},
		on: function(events, fn) {
			var self = this,
				i, listener;

			events = events.split(' ');

			for(i = 0; (listener = events[i]) !== undefined; i++) {
				(self.listener[listener] = self.listener[listener] || []).push(fn);

				attachListener.call(self, listener, fn);
			}

			return self;
		},
		one: function(events, fn, each) {
			each = (each !== false);

			var self     = this,
				listener = modules['proxy'].create(self, function(event) {
					self.off(((each === true) ? event.type : events), listener);

					fn.call(self, event);
				});

			self.on(events, listener);

			return self;
		},
		off: function(events, fn) {
			var self = this,
				i, event, j, listener;

			if(events) {
				events = events.split(' ');

				for(i = 0; (event = events[i]) !== undefined; i++) {
					self.listener[event] = self.listener[event] || [];

					if(fn) {
						for(j = 0; (listener = self.listener[event][j]) !== undefined; j++) {
							if(listener === fn) {
								self.listener[event].splice(j, 1);
								detachListener.call(self, event, listener);

								j--;
							}
						}
					} else {
						while(self.listener[event].length > 0) {
							detachListener.call(self, event, self.listener[event].pop());
						}
					}
				}
			} else {
				for(event in self.listener) {
					while(self.listener[event].length > 0) {
						detachListener.call(self, event, self.listener[event].pop());
					}
				}
			}

			return self;
		},
		emit: function(event, data) {
			var self = this;

			emitEvent.call(self, event, data);

			return self;
		}
	});
}));
;(function(definition) {
	window.qoopido.register('function/merge', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return function merge() {
		var target = arguments[0],
			i, properties, property, tgt, src;

		for(i = 1; (properties = arguments[i]) !== undefined; i++) {
			for(property in properties) {
				tgt = target[property];
				src = properties[property];

				if(src !== undefined) {
					if(src !== null && typeof src === 'object') {
						if(src.length !== undefined) {
							tgt = (tgt && typeof tgt === 'object' && tgt.length !== undefined) ? tgt : [];
						} else {
							tgt = (tgt && typeof tgt === 'object' && tgt.length === undefined) ? tgt : {};
						}

						target[property] = merge(tgt, src);
					} else {
						target[property] = src;
					}
				}
			}
		}

		return target;
	};
}));
;(function(definition) {
	window.qoopido.register('function/unique/string', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var lookup     = {},
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateString(length) {
		var result = '',
			i;

		length = parseInt(length, 10) || 12;

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return function(length) {
		var result;

		do {
			result = generateString(length);
		} while(typeof lookup[result] !== 'undefined');

		lookup[result] = true;

		return result;
	};
}));
;(function(definition) {
	window.qoopido.registerSingleton('url', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var urlCurrent, regexLocal,
		regexParameter = new RegExp('[?&]?([^=]+)=([^&]*)', 'g');

	try {
		urlCurrent = location;
	} catch(exception) {
		urlCurrent = getResolver();
	}

	regexLocal = new RegExp(''.concat('^', urlCurrent.protocol, '//', urlCurrent.hostname), 'i');

	function getResolver(url) {
		var resolver = document.createElement('a');

		resolver.href = url || '';

		return resolver;
	}

	return modules['base'].extend({
		resolve: function(url) {
			return getResolver(url).href;
		},
		redirect: function redirect(url, target) {
			target = target || window;

			target.location.href = this.resolve(url);
		},
		getParameter: function(url) {
			var params      = {},
				querystring = getResolver(url).search.split('+').join(' '),
				tokens;

			while(tokens = regexParameter.exec(querystring)) {
				params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			}

			return params;
		},
		isLocal: function(url) {
			return regexLocal.test(this.resolve(url));
		}
	});
}));
;(function(definition) {
	window.qoopido.register('pool', definition, [ './function/merge', './function/unique/uuid' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		settings = {
			interval:    1000 / 60,
			frameBudget: 0.5,
			maxPoolsize: 1000
		};

	function processQueue() {
		var self        = this,
			metrics     = self.metrics,
			settings    = self._settings,
			queue       = self._queue,
			variables   = self._variables,
			spliceLimit = 1,
			spliceLength, elements, durationStart;

		if(queue.length > 0) {
			if(variables.durationAverage > 0) {
				spliceLimit = ~~(((spliceLimit = settings.frameBudget / variables.durationAverage) < 1) ? 1 : spliceLimit);
			}

			if((spliceLength = Math.min(queue.length, (elements = queue.splice(0, spliceLimit)).length)) > 0) {
				if(metrics.inPool + spliceLength <= settings.maxPoolsize) {
					durationStart = new Date().getTime();

					for(var i = 0; i < spliceLength; i++) {
						var element = elements[i],
							quid    = element._quid,
							dispose = element.dispose;

						element         = self._dispose(element);
						element._quid   = quid;
						element.dispose = dispose;

						self._getPool.call(self, element).push(element);
					}

					metrics.inPool            += spliceLength;
					metrics.inQueue           -= spliceLength;
					variables.durationSamples += spliceLength;
					variables.durationTotal   += new Date().getTime() - durationStart;
					variables.durationAverage  = variables.durationTotal / variables.durationSamples;
				} else {
					if(typeof self._destroy === 'function') {
						for(var j = 0; j < spliceLength; j++) {
							self._destroy(elements[j]);
						}
					}

					elements.length    = 0;
					metrics.inQueue   -= spliceLength;
					metrics.destroyed += spliceLength;
				}
			}
		}
	}

	prototype = modules['base'].extend({
		metrics:    null,
		_settings:  null,
		_pool:      null,
		_queue:     null,
		_variables: null,
		_constructor: function(options) {
			var self = this;

			self.metrics      = { total: 0, inPool: 0, inUse: 0, inQueue: 0, recycled: 0, destroyed: 0 };
			self._settings    = modules['function/merge']({}, settings, options);
			self._pool        = self._initPool();
			self._queue       = [];
			self._variables   = { durationSamples: 0, durationTotal: 0, durationAverage: 0 };

			setInterval(function() { processQueue.call(self); }, self._settings.interval);
		},
		_initPool: function() {
			return [];
		},
		_initElement: function(element) {
			var self = this;

			element._quid   = modules['function/unique/uuid']();
			element.dispose = function() { self.dispose(element); };

			self.metrics.total++;

			return element;
		},
		_getPool: function() {
			return this._pool;
		},
		obtain: function() {
			var self    = this,
				element = self._getPool.apply(self, arguments).pop();

			if(element) {
				self.metrics.inPool--;
				self.metrics.recycled++;
			} else {
				element = self._initElement(self._obtain.apply(self, arguments));
			}

			if(typeof element._obtain === 'function') {
				element._obtain.apply(element, arguments);
			}

			self.metrics.inUse++;

			return element;
		},
		dispose: function(element) {
			var self  = this,
				queue = self._queue;

			if(!element._quid) {
				element = self._initElement(element);

				self.metrics.inUse++;
			}

			if(typeof element._dispose === 'function') {
				element._dispose();
			}

			queue.push(element);

			self.metrics.inUse--;
			self.metrics.inQueue++;

			return null;
		}
	});

	return prototype;
}));
;(function(definition) {
	window.qoopido.register('pool/dom', definition, [ '../pool' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype = modules['pool'].extend({
		_initPool: function() {
			return {};
		},
		_getPool: function(type) {
			var self = this;

			if(typeof type !== 'string') {
				type = type.tagName.toLowerCase();
			}

			return (self._pool[type] = self._pool[type] || []);
		},
		_dispose: function(element) {
			var property;

			if(element.parentNode) {
				element.parentNode.removeChild(element);
			}

			for(property in element) {
				if(Object.prototype.hasOwnProperty.call(element, property)) {
					try {
						element.removeAttribute(property);
					} catch(exception) {
						element.property = null;
					}
				}
			}

			return element;
		},
		_obtain: function(type) {
			return document.createElement(type);
		}
	});

	shared.pool     = shared.pool || {};
	shared.pool.dom = prototype.create();

	return prototype;
}));
;(function(definition) {
	window.qoopido.register('transport', definition, [ './function/merge' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype;

	prototype = modules['base'].extend({
		setup: function(options) {
			var self = this;

			self._settings = modules['function/merge']({}, self._settings, options);

			return self;
		},
		serialize: function(obj, prefix) {
			var parameter = [], id, key, value;

			for(id in obj) {
				key   = prefix ? ''.concat(prefix, '[', id, ']') : id;
				value = obj[id];

				parameter.push((typeof value === 'object') ? this.serialize(value, key) : ''.concat(encodeURIComponent(key), '=', encodeURIComponent(value)));
			}

			return parameter.join('&');
		}
	});

	return prototype;
}, window, document));
/*global ActiveXObject*/

;(function(definition) {
	window.qoopido.registerSingleton('transport/xhr', definition, [ '../transport', '../function/merge', '../function/unique/string', '../url', 'q' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		Q      = modules['q'] || window.Q,
		getXhr = (typeof window.XMLHttpRequest !== 'undefined') ?
			function(url) {
				if(modules['url'].isLocal(url)) {
					return new window.XMLHttpRequest();
				} else {
					return window.XDomainRequest ? new window.XDomainRequest() : new window.XMLHttpRequest();
				}
			}
			: function() {
				try {
					return new ActiveXObject('MSXML2.XMLHTTP.3.0');
				} catch(exception) {
					return null;
				}
			};

	function sendRequest(method, url, content) {
		var self     = this,
			xhr      = self.xhr,
			settings = self.settings,
			id;

		content = (typeof content === 'object') ? self.serialize(content) : content;
		url     = (settings.cache === false) ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', '_=' + new Date().getTime()) : url;
		url     = (content && method === 'GET') ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', content) : url;

		for(id in settings.xhrOptions) {
			xhr[id] = settings.xhrOptions[id];
		}

		xhr.open(method, url, settings.async, settings.username, settings.password);

		if(xhr.setRequestHeader) {
			xhr.setRequestHeader('Accept', settings.accept);
			if(content && method !== 'GET') {
				xhr.setRequestHeader('Content-Type', settings.contentType);
			}
			for(id in settings.header) {
				xhr.setRequestHeader(id, settings.header[id]);
			}
		}

		xhr.timeout            = settings.timeout;
		xhr.onprogress         = function(event) { onProgress.call(self, event); };
		xhr.onreadystatechange = xhr.onload = function() { onReadyStateChange.call(self); };
		xhr.onerror            = function() { onError.call(self); };
		xhr.send(content || null);

		self.timeout = setTimeout(function() { onTimeout.call(self); }, settings.timeout);
	}

	function onProgress(event) {
		var self = this;

		if(self.timeout) {
			clearTimeout(self.timeout);
		}

		self.timeout = setTimeout(function() { onTimeout.call(self); }, self.settings.timeout);

		self.dfd.notify(event);
	}

	function onReadyStateChange() {
		var self = this,
			xhr  = self.xhr,
			dfd  = self.dfd;

		if(xhr.readyState === undefined || xhr.readyState === 4) {
			clear.call(self);

			if(xhr.status === undefined || xhr.status === 200) {
				dfd.resolve({ data: xhr.responseText, xhr: xhr });
			} else {
				dfd.reject({ status: xhr.status, xhr: xhr });
			}
		}
	}

	function onError() {
		var self = this;

		clear.call(self);
		self.dfd.reject();
	}

	function onTimeout() {
		var self = this;

		self.xhr.abort();
		clear.call(self);
		self.dfd.reject();
	}

	function clear() {
		var self = this,
			xhr  = self.xhr;

		if(self.timeout) {
			clearTimeout(self.timeout);
		}

		xhr.onprogress = xhr.onreadystatechange = xhr.onerror = null;
	}

	prototype = modules['transport'].extend({
		_settings: {
			accept:      '*/*',
			timeout:     5000,
			async:       true,
			cache:       false,
			header:      {},
			username:    null,
			password:    null,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8 ',
			xhrOptions:  {}
		},
		load: function(method, url, data, options) {
			var context = {};

			url = modules['url'].resolve(url);

			context.url      = url;
			context.id       = ''.concat('xhr-', modules['function/unique/string']());
			context.dfd      = Q.defer();
			context.xhr      = getXhr(url);
			context.settings = modules['function/merge']({}, this._settings, options);
			context.timeout  = null;

			sendRequest.call(context, method.toUpperCase(), url, data);

			return context.dfd.promise;
		},
		get: function(url, data, options) {
			return this.load('GET', url, data, options);
		},
		post: function(url, data, options) {
			return this.load('POST', url, data, options);
		},
		put: function(url, data, options) {
			return this.load('PUT', url, data, options);
		},
		'delete': function(url, data, options) {
			return this.load('DELETE', url, data, options);
		},
		head: function(url, data, options) {
			return this.load('HEAD', url, data, options);
		}
	});

	return prototype;
}, window, document));
;(function(definition) {
	window.qoopido.register('polyfill/string/ucfirst', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!String.prototype.ucfirst) {
		String.prototype.ucfirst = function() {
			var self = this;

			return self.charAt(0).toUpperCase() + self.slice(1);
		};
	}

	return true;
}));
;(function(definition) {
	var dependencies = [ './base', './pool/dom', 'q' ];

	if(!String.prototype.ucfirst) {
		dependencies.push('./polyfill/string/ucfirst');
	}

	window.qoopido.registerSingleton('support', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var Q               = modules['q'] || window.Q,
		regexPrefix     = new RegExp('^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])'),
		regexProperty   = new RegExp('-([a-z])', 'gi'),
		regexCss        = new RegExp('([A-Z])', 'g'),
		callbackUcfirst = function() {
			return arguments[1].ucfirst();
		},
		lookup = {
			prefix:   null,
			method:   { },
			property: { },
			css:      { },
			element:  { },
			promises: {
				prefix:   null,
				method:   { },
				property: { },
				css:      { },
				test:     { }
			}
		};

	return modules['base'].extend({
		test: { },
		testMultiple: function() {
			var test, tests = [], i = 0;

			for(i; (test = arguments[i]) !== undefined; i++) {
				switch(typeof test) {
					case 'string':
						tests.push(this.test[test]());
						break;
					case 'boolean':
						var deferred = Q.defer();

						!!(test) ? deferred.resolve() : deferred.reject();

						tests.push(deferred.promise);
						break;
					default:
						tests.push(test);
						break;
				}
			}

			return Q.all(tests);
		},
		getPrefix: function() {
			var property,
				stored = lookup.prefix || null;

			if(stored === null) {
				var sample = shared.pool.dom.obtain('div'),
					styles = sample.style;

				stored = false;

				for(property in styles) {
					if(regexPrefix.test(property)) {
						stored = property.match(regexPrefix)[0];
					}
				}

				if(stored === false && 'WebkitOpacity' in styles) {
					stored = 'WebKit';
				}

				if(stored === false && 'KhtmlOpacity' in styles) {
					stored =  'Khtml';
				}

				stored = lookup.prefix = (stored === false)? false : [ stored.toLowerCase(), stored.toLowerCase().ucfirst(), stored ];

				sample.dispose();
			}

			return stored;
		},
		getMethod: function(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.method[type] = lookup.method[type] || { },
				stored  = pointer[pMethod] = lookup.method[type][pMethod] || null;

			if(stored === null) {
				stored = false;

				var candidates, candidate,
					i          = 0,
					uMethod    = pMethod.ucfirst(),
					prefixes   = this.getPrefix();

				if(prefixes !== false) {
					candidates = (pMethod + ' ' + prefixes.join(uMethod + ' ') + uMethod).split(' ');
				} else {
					candidates = [ pMethod ];
				}

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(pElement[candidate] !== undefined && (typeof pElement[candidate] === 'function' || typeof pElement[candidate] === 'object')) {
						stored = candidate;
						break;
					}
				}

				lookup.method[type][pMethod] = stored;
			}

			return stored;
		},
		getProperty: function(pProperty, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.property[type] = lookup.property[type] || { },
				stored  = pointer[pProperty] = lookup.property[type][pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidates, candidate,
					i         = 0,
					uProperty = pProperty.ucfirst(),
					prefixes  = this.getPrefix();

				if(prefixes !== false) {
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' ');
				} else {
					candidates = [ pProperty ];
				}

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(pElement[candidate] !== undefined) {
						stored = candidate;
						break;
					}
				}

				lookup.property[type][pProperty] = stored;
			}

			return stored;
		},
		getCssProperty: function(pProperty) {
			pProperty = pProperty.replace(regexProperty, callbackUcfirst);

			var stored = lookup.css[pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidate,
					i          = 0,
					sample     = shared.pool.dom.obtain('div'),
					uProperty  = pProperty.ucfirst(),
					prefixes   = this.getPrefix() || [],
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' '),
					prefix     = '';

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(sample.style[candidate] !== undefined) {
						stored = candidate;

						if(i > 0) {
							prefix = '-';
						}

						break;
					}
				}

				lookup.css[pProperty] = stored !== false ? [prefix + stored.replace(regexCss, '-$1').toLowerCase(), stored] : false;

				sample.dispose();
			}

			return stored;
		},
		supportsPrefix: function() {
			return !!this.getPrefix();
		},
		supportsMethod: function(pMethod, pElement) {
			return !!this.getMethod(pMethod, pElement);
		},
		supportsProperty: function(pProperty, pElement) {
			return !!this.getProperty(pProperty, pElement);
		},
		supportsCssProperty: function(pProperty) {
			return !!this.getCssProperty(pProperty);
		},
		testPrefix: function() {
			var stored = lookup.promises.prefix;

			if(stored === null) {
				var deferred = Q.defer(),
					prefix   = this.getPrefix();

				(!!prefix) ? deferred.resolve(prefix) : deferred.reject();

				stored = lookup.promises.prefix = deferred.promise;
			}

			return stored;
		},
		testMethod: function(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.promises.method[type] = lookup.promises.method[type] || { },
				stored  = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					method   = this.getMethod(pMethod, pElement);

				(!!method) ? deferred.resolve(method) : deferred.reject();

				stored = lookup.promises.method[type][pMethod] = deferred.promise;
			}

			return stored;
		},
		testProperty: function(pProperty, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.promises.property[type] = lookup.promises.property[type] || { },
				stored  = pointer[pProperty] = lookup.promises.property[type][pProperty] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					property = this.getProperty(pProperty, pElement);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.property[type][pProperty] = deferred.promise;
			}

			return stored;
		},
		testCssProperty: function(pProperty) {
			var stored = lookup.promises.css[pProperty] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					property = this.getCssProperty(pProperty);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.css[pProperty] =  deferred.promise;
			}

			return stored;
		},
		addTest: function(pId, pTest) {
			return this.test[pId] = function() {
				var stored = lookup.promises.test[pId] || null;

				if(stored === null) {
					var deferred  = Q.defer(),
						parameter = Array.prototype.slice.call(arguments);

					parameter.splice(0, 0, deferred);

					pTest.apply(null, parameter);

					stored = lookup.promises.test[pId] = deferred.promise;
				}

				return stored;
			};
		}
	});
}));
;(function(definition) {
	window.qoopido.register('support/capability/datauri', definition, [ '../../support', '../../dom/element', '../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/capability/datauri', function(deferred) {
		var sample = modules['dom/element'].create(shared.pool.dom.obtain('img'));

		sample
			.one('error load', function(event) {
				if(event.type === 'load' && sample.element.width === 1 && sample.element.height === 1) {
					deferred.resolve();
				} else {
					deferred.reject();
				}

				sample.element.dispose();
			}, false)
			.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
	});
}));
;(function(definition) {
	window.qoopido.register('support/element/canvas', definition, [ '../../support', '../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas', function(deferred) {
		var sample = shared.pool.dom.obtain('canvas');

		(sample.getContext && sample.getContext('2d')) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}));
;(function(definition) {
	window.qoopido.register('support/element/canvas/todataurl', definition, [ '../../../support', '../canvas', '../../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl', function(deferred) {
		modules['support/element/canvas']()
			.then(function() {
				var sample = shared.pool.dom.obtain('canvas');

				(sample.toDataURL !== undefined) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));
;(function(definition) {
	window.qoopido.register('support/element/canvas/todataurl/png', definition, [ '../../../../support', '../todataurl', '../../../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl/png', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(function() {
				var sample = shared.pool.dom.obtain('canvas');

				(sample.toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));
;(function(definition) {
	var dependencies = [ '../element', '../../proxy', '../../function/merge', '../../url', '../../support', '../../support/capability/datauri', '../../support/element/canvas/todataurl/png', '../../transport/xhr' ];

	if(!window.JSON || !window.JSON.parse) {
		dependencies.push('json');
	}

	window.qoopido.register('dom/element/shrinkimage', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var
	// properties
		JSON            = modules['json'] || window.JSON,
		name            = namespace.pop(),
		defaults        = { attribute: 'data-' + name, quality: 80, debug: false },
		lookup          = {},
		regexBackground = new RegExp('^url\\x28"{0,1}data:image/shrink,(.+?)"{0,1}\\x29$', 'i'),
		regexPath       = new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', 'i'),
		regexSuffix     = new RegExp('\\.png$', 'i'),

	// methods / classes
		prototype, loader,

	// events
		EVENT_REQUESTED = 'requested',
		EVENT_QUEUED    = 'queued',
		EVENT_CACHED    = 'cached',
		EVENT_LOADED    = 'loaded',
		EVENT_FAILED    = 'failed',
		EVENT_STATE     = ''.concat(EVENT_LOADED, ' ', EVENT_FAILED),
		DOM_LOAD        = 'load',
		DOM_ERROR       = 'error',
		DOM_STATE       = ''.concat(DOM_LOAD, ' ', DOM_ERROR);

	function processMain(url, isBackground) {
		url          = modules['url'].resolve(regexPath.exec(url)[1]);
		isBackground = (isBackground) ? true : false;

		var self     = this,
			settings = modules['function/merge']({}, self._settings, modules['url'].getParameter(url)),
			target   = settings.target || (url = url.split('?')[0]).replace(regexSuffix, ''.concat('.q', settings.quality, '.shrunk'));

		if(!isBackground) {
			self.removeAttribute(self._settings.attribute).hide();
		}

		modules['support'].testMultiple('/capability/datauri', '/element/canvas/todataurl/png')
			.then(settings.debug)
			.then(
				function() {
					switch(typeof lookup[target]) {
						case 'object':
							lookup[target].one(EVENT_LOADED, function(event) {
								assign.call(self, event.data, isBackground);
							});

							self.emit(EVENT_QUEUED);
							break;
						case 'string':
							assign.call(self, lookup[target], isBackground);
							break;
						default:
							lookup[target] = loader
								.create(target, (!isBackground) ? self._element : null)
								.one(EVENT_STATE, function(event) {
									if(event.type === EVENT_LOADED) {
										lookup[target] = event.data;

										self.emit(EVENT_CACHED);

										assign.call(self, event.data, isBackground);
									} else {
										lookup[target] = url;

										assign.call(self, url, isBackground);
									}
								}, false);

							break;
					}
				}
			)
			.fail(
				function() {
					lookup[target] = url;

					assign.call(self, url, isBackground);
				}
			)
			.done();
	}

	function assign(source, isBackground) {
		var self = this;

		if(isBackground) {
			self.element.style.backgroundImage = 'url(' + source + ')';
			self.emit(EVENT_LOADED);
			self.off();
		} else {
			self.one(DOM_LOAD, function() {
				self.show();
				self.emit(EVENT_LOADED);
				self.off();
			}).setAttribute('src', source);
		}
	}

	function processTransport(transport) {
		var self = this;

		transport.get(self._url)
			.done(
				function(response) {
					try {
						var data = JSON.parse(response.data);

						data.width  = parseInt(data.width, 10);
						data.height = parseInt(data.height, 10);

						processData.call(self, data);
					} catch(exception) {
						self.emit(EVENT_FAILED);
					}
				},
				function() {
					self.emit(EVENT_FAILED);
				}
			);
	}

	function processData(data) {
		var canvas, context,
			self = this,
			onLoadMain = function(event) {
				canvas = shared.pool.dom.obtain('canvas');

				canvas.style.display = 'none';
				canvas.width         = data.width;
				canvas.height        = data.height;

				context = canvas.getContext('2d');
				context.clearRect(0, 0, data.width, data.height);
				context.drawImage(self.element, 0, 0, data.width, data.height);

				self.one(DOM_LOAD, onLoadAlpha).setAttribute('src', data.alpha);

				return suppressEvent(event);
			},
			onLoadAlpha = function(event) {
				var result;

				context.globalCompositeOperation = 'xor';
				context.drawImage(self.element, 0, 0, data.width, data.height);

				result = canvas.toDataURL('image/png');

				dispose();

				self.emit(EVENT_LOADED, result);

				return suppressEvent(event);
			},
			dispose = function() {
				if(canvas) {
					canvas.dispose();
				}

				if(self.element._quid && self.element.dispose) {
					self.element.dispose();
				}
			};

		self
			.one(DOM_STATE, function(event) {
				if(event.type === DOM_LOAD) {
					onLoadMain.call(this, event);
				} else {
					dispose();

					self.emit(EVENT_FAILED);
				}
			}, false)
			.setAttribute('src', data.main);
	}

	function suppressEvent(event) {
		event.preventDefault();
		event.stopPropagation();

		return false;
	}

	prototype = modules['dom/element'].extend({
		_constructor: function(element, settings) {
			var self = this,
				foreground, background;

			prototype._parent._constructor.call(self, element);

			self._settings = settings = modules['function/merge']({}, defaults, settings);

			foreground = self.getAttribute(settings.attribute);
			background = self.element.style.backgroundImage;

			if(self.type === 'IMG') {
				processMain.call(self, foreground);
			}

			if(background !== 'none' && regexBackground.test(background)) {
				processMain.call(self, background, true);
			}
		},
		hide: function() {
			this.setStyles({ visibility: 'hidden', opacity: 0 });
		},
		show: function() {
			this.setStyles({ visibility: '', opacity: '' });
		}
	});

	loader = modules['dom/element'].extend({
		_url:   null,
		_constructor: function(url, element) {
			var self = this;

			if(!element) {
				element = shared.pool.dom.obtain('img');
			}

			prototype._parent._constructor.call(self, element);

			self._url = url;

			processTransport.call(self, modules['transport/xhr']);
		}
	});

	return prototype;
}, window));