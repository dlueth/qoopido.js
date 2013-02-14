/*!
* Qoopido remux, an REM-driven approach to RWD
*
* Source:  Qoopido JS
* Version: 2.0.0
* Date:    2013-02-14
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/

;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'base',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
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
			var instance = Object.create(this);

			if(instance._constructor) {
				instance._constructor.apply(instance, arguments);
			}

			instance.create = instance.extend = undefined;

			return instance;
		},
		extend: function extend(properties) {
			properties         = properties || {};
			properties._parent = this;

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
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'emitter',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], initialize);
	} else {
		initialize(window[namespace].base);
	}
}(function(mBase, window, document, undefined) {
	'use strict';

	var excludeMethods = /^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;

	return mBase.extend({
		_mapped:   null,
		_listener: null,
		_constructor: function _constructor() {
			var self = this,
				method;

			self._listener = {};
			self._mapped = {};

			for(method in self) {
				if(typeof self[method] === 'function' && excludeMethods.test(method) === false) {
					self[method] = self._map(method);
				}
			}
		},
		_map: function _map(method) {
			var self  = this,
				event = method.charAt(0).toUpperCase() + method.slice(1);

			self._mapped[method] = self[method];

			return function() {
				var args = Array.prototype.slice.call(arguments),
					returnValue;

				self.emit.apply(self, ['pre' + event, args]);
				returnValue = self._mapped[method].apply(self, args);
				self.emit.apply(self, ['post' + event, returnValue, args]);

				return returnValue;
			};
		},
		on: function on(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				(self._listener[event] = self._listener[event] || []).push(listener);
			}

			return self;
		},
		one: function one(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				listener.once = true;

				self.on(event, listener);
			}

			return self;
		},
		off: function off(event, listener) {
			var self = this,
				i;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				if(listener) {
					while((i = self._listener[event].indexOf(listener)) !== -1) {
						self._listener[event].splice(i, 1);
					}
				} else {
					self._listener[event].length = 0;
				}
			}

			return self;
		},
		emit: function emit(event) {
			var self = this,
				args = Array.prototype.slice.call(arguments).splice(1),
				i, listener;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				for(i = 0; (listener = self._listener[event][i]) !== undefined; i++) {
					listener.apply(self, args);

					if(listener.once === true) {
						self._listener[event].splice(i, 1);
						i--;
					}
				}
			}

			return self;
		}
	});
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'remux',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments).create());
		};

	if(typeof define === 'function' && define.amd) {
		define([ './emitter' ], initialize);
	} else {
		initialize(window[namespace].emitter);
	}
}(function(mEmitter, window, document, undefined) {
	'use strict';

	var prototype, style,
		html        = document.getElementsByTagName('html')[0],
		base        = 16,
		state       = { fontsize: null, layout: null, ratio: { } },
		current     = { fontsize: null, layout: null },
		delay       = null;

	prototype = mEmitter.extend({
		_constructor: function _constructor() {
			var self  = this,
				pBase = parseInt(html.getAttribute('data-base'), 10),
				delayedUpdate = function delayedUpdate() {
					if(delay !== null) {
						window.clearTimeout(delay);
					}

					delay = window.setTimeout(function() {
						self.updateState();
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

			self.updateState();
		},
		getState: function getState() {
			return state;
		},
		updateState: function updateState() {
			var self = this;

			state.fontsize = parseInt(window.getComputedStyle(html).getPropertyValue('font-size'), 10);
			state.layout   = window.getComputedStyle(html, ':after').getPropertyValue('content') || null;

			if(state.fontsize !== current.fontsize || state.layout !== current.layout) {
				current.fontsize     = state.fontsize;
				current.layout       = state.layout;

				state.ratio.device   = (window.devicePixelRatio || 1);
				state.ratio.fontsize = state.fontsize / base;
				state.ratio.total    = state.ratio.device * state.ratio.fontsize;
				state.ratio.rounded  = (Math.ceil(state.ratio.total / 0.25) * 25) / 100;

				self.emit('statechange', state);
			}

			return self;
		},
		addLayout: function addLayout(pId, pLayout) {
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

			self.updateState();

			return self;
		}
	});

	return prototype;
}, window, document));