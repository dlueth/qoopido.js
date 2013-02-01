/*!
* Qoopido remux, an REM-driven approach to RWD
*
* Source:  Qoopido JS
* Version: 1.1.7
* Date:    2013-02-01
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/Qoopido-JS
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
		name       = 'support',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base', 'q' ], initialize);
	} else {
		initialize(window[namespace].base, window.Q);
	}
}(function(mBase, mQ, window, document, undefined) {
	'use strict';

	var regexProperty = /-([a-z])/gi,
		lookup = {
			prefix:   null,
			property: { },
			method:   { },
			element:  { },
			promises: {
				prefix: null,
				property: { },
				method: { },
				test: { }
			}
		};

	function _ucfirst() {
		if(arguments.length > 1) {
			return arguments[1].toUpperCase();
		} else {
			return arguments[0].charAt(0).toUpperCase() + arguments[0].slice(1);
		}
	}

	return mBase.extend({
		test: { },
		testMultiple: function testMultiple() {
			var test, tests = [], i = 0;

			for(i; (test = arguments[i]) !== undefined; i++) {
				switch(typeof test) {
					case 'string':
						tests.push(this.test[test]());
						break;
					case 'boolean':
						var deferred = mQ.defer();

						!!(test) ? deferred.resolve() : deferred.reject();

						tests.push(deferred.promise);
						break;
					default:
						tests.push(test);
						break;
				}
			}

			return mQ.all(tests);
		},
		getElement: function getElement(pType, pClone) {
			var element = lookup.element[pType] = lookup.element[pType] || (pType !== 'image') ? document.createElement(pType) : new Image();

			pClone = !!(pClone);

			return (pClone) ? element.cloneNode(false) : element;
		},
		getPrefix: function getPrefix() {
			var property,
				stored = lookup.prefix || null;

			if(stored === null) {
				var styles = this.getElement('div').style,
					regex  = /^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])/;

				stored = false;

				for(property in styles) {
					if(regex.test(property)) {
						stored = property.match(regex)[0];
					}
				}

				if(stored === false && 'WebkitOpacity' in styles) {
					stored = 'WebKit';
				}

				if(stored === false && 'KhtmlOpacity' in styles) {
					stored =  'Khtml';
				}

				stored = lookup.prefix = (stored === false)? false : { method: stored, properties: [ stored.toLowerCase(), _ucfirst(stored.toLowerCase()) ] };
			}

			return stored;
		},
		getProperty: function getProperty(pProperty) {
			pProperty = pProperty.replace(regexProperty, _ucfirst);

			var stored = lookup.property[pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidate,
					i          = 0,
					element    = this.getElement('div'),
					uProperty  = _ucfirst(pProperty),
					prefixes   = (this.getPrefix() || { properties: [] }).properties,
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' ');

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(element.style[candidate] !== undefined) {
						stored = candidate;
						break;
					}
				}

				lookup.property[pProperty] = stored;
			}

			return stored;
		},
		getMethod: function getMethod(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.method[type] = lookup.method[type] || { },
				stored  = pointer[pMethod] = lookup.method[type][pMethod] || null;

			if(stored === null) {
				stored = false;

				var candidates, candidate,
					i          = 0,
					uMethod    = _ucfirst(pMethod),
					prefixes   = this.getPrefix();

				if(prefixes !== false) {
					candidates = (pMethod + ' ' + prefixes.method + uMethod + ' ' + prefixes.properties.join(uMethod + ' ') + uMethod).split(' ');
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
		supportsPrefix: function supportsPrefix() {
			return !!this.getPrefix();
		},
		supportsProperty: function supportsProperty(pProperty) {
			return !!this.getProperty(pProperty);
		},
		supportsMethod: function supportsMethod(pMethod, pElement) {
			return !!this.getMethod(pMethod, pElement);
		},
		testPrefix: function testPrefix() {
			var stored = lookup.promises.prefix;

			if(stored === null) {
				var deferred = mQ.defer(),
					prefix   = this.getPrefix();

				(!!prefix) ? deferred.resolve(prefix) : deferred.reject();

				stored = lookup.promises.prefix =  deferred.promise;
			}

			return stored;
		},
		testProperty: function testProperty(pProperty) {
			var stored = lookup.promises.property[pProperty] || null;

			if(stored === null) {
				var deferred = mQ.defer(),
					property = this.getProperty(pProperty);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.property[pProperty] =  deferred.promise;
			}

			return stored;
		},
		testMethod: function testMethod(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.promises.method[type] = lookup.promises.method[type] || { },
				stored  = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;

			if(stored === null) {
				var deferred = mQ.defer(),
					method   = this.getMethod(pMethod, pElement);

				(!!method) ? deferred.resolve(method) : deferred.reject();

				stored = lookup.promises.method[type][pMethod] = deferred.promise;
			}

			return stored;
		},
		addTest: function addTest(pId, pTest) {
			return this.test[pId] = function() {
				var stored = lookup.promises.test[pId] || null;

				if(stored === null) {
					var deferred  = mQ.defer(),
						parameter = Array.prototype.slice.call(arguments);

					parameter.splice(0, 0, deferred);

					pTest.apply(null, parameter);

					stored = lookup.promises.test[pId] =  deferred.promise;
				}

				return stored;
			};
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

			// .create() makes this a singleton effectively
			return (window[namespace][name] = definition.apply(null, arguments).create());
		};

	if(typeof define === 'function' && define.amd) {
		define([ './emitter', './support' ], initialize);
	} else {
		initialize(window[namespace].emitter, window[namespace].support);
	}
}(function(mEmitter, mSupport, window, document, undefined) {
	'use strict';

	var timeout, candidate, zoomed, type, event, detectZoom,
		html    = document.getElementsByTagName('html')[0],
		element = document.documentElement,
		layouts = { },
		events  = [],
		state   = {
			layout: null,
			width:  null,
			size: {
				base:    null,
				current: null,
				zoomed:  null
			},
			ratio: {
				device: window.devicePixelRatio || 1,
				zoom:   null,
				size:   null,
				total:  null,
				image:  null
			}
		},
		temp = { };

	function _getZoomByLogicaldpi() {
		return Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
	}

	function _setupZoomByTextsize() {
		temp.body      = document.body;
		temp.element   = document.createElement('div');
		temp.container = document.createElement('div');

		temp.element.innerHTML = '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0';
		temp.element.setAttribute('style', 'font: 100px/1em sans-serif !important; -webkit-text-size-adjust: none !important; height: auto !important; width: 1em !important; padding: 0 !important; overflow: visible !important;');
		temp.container.setAttribute('style', 'width: 0 !important; height: 0 !important; overflow: hidden !important; visibility: hidden !important; position: absolute; !important');
		temp.container.appendChild(temp.element);
	}

	function _getZoomByTextsize() {
		var zoom;

		if(temp.body) {
			temp.body.appendChild(temp.container);

			zoom = Math.round((1000 / temp.element.clientHeight) * 100) / 100;

			temp.body.removeChild(temp.container);
		}

		return zoom;
	}

	function _setupZoomByMatchmedia() {
		temp.method = function() {
			return window[mSupport.getMethod('matchMedia')].apply(window, arguments);
		};

		switch(mSupport.getPrefix().properties[0]) {
			case 'webkit':
				temp.property = '-webkit-min-device-pixel-ratio';
				break;
			case 'o':
				temp.property = '-o-min-device-pixel-ratio';
				break;
			default:
				temp.property = 'min--moz-device-pixel-ratio';
				break;
		}
	}

	function _processZoomByMatchmedia(a, b, iterations, epsilon) {
		var mid   = (a + b) / 2,
			query = '(' + temp.property + ':' + mid + ')';

		if(iterations <= 0 || b - a < epsilon) {
			return mid;
		}

		if(temp.method(query).matches) {
			return _processZoomByMatchmedia(mid, b, iterations - 1, epsilon);
		} else {
			return _processZoomByMatchmedia(a, mid, iterations - 1, epsilon);
		}
	}

	function _getZoomByMatchmedia() {
		var result = Math.round(_processZoomByMatchmedia(0, 10, 20, 0.0001) * 100) / 100,
			ratio  = Math.round(state.ratio.device * 100) / 100;

		// Fix for FF18+ where zoom level is part of window.devicePixelRatio
		if(result === ratio) {
			state.ratio.device = 1;
		}

		return result;
	}

	return mEmitter.extend({
		_constructor: function _constructor() {
			var self        = this,
				timedUpdate = function _updateState() {
					if(timeout !== null) {
						window.clearTimeout(timeout);
					}

					timeout = window.setTimeout(function() {
						self.updateState();
					}, 20);
				};

			self._parent._constructor.call(self);

			if(!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
				// IE8+
				detectZoom = _getZoomByLogicaldpi;
			} else if(mSupport.supportsProperty('webkitTextSizeAdjust') !== false) {
				// Webkit
				_setupZoomByTextsize();
				detectZoom = _getZoomByTextsize;
			} else if(mSupport.supportsMethod('matchMedia') !== false) {
				// Firefox 4+ / IE10(?)
				_setupZoomByMatchmedia();
				detectZoom = _getZoomByMatchmedia;
			} else {
				detectZoom = function() {
					return 1;
				};
			}

			window.addEventListener('resize', timedUpdate, false);
			window.addEventListener('orientationchange', timedUpdate, false);

			self.updateState();
		},
		addLayout: function addLayout(pId, pLayout) {
			var self = this;

			if(arguments.length === 1) {
				var id;

				for(id in arguments[0]) {
					layouts[id] = arguments[0][id];
				}
			} else {
				layouts[arguments[0]] = arguments[1];
			}

			self.updateState();

			return self;
		},
		getState: function getState() {
			return state;
		},
		updateState: function updateState() {
			var self   = this,
				layout = null,
				i;

			state.ratio.device = window.devicePixelRatio || 1;
			state.ratio.zoom   = detectZoom() || 1;
			state.width        = element.offsetWidth * state.ratio.zoom;

			for(i in layouts) {
				candidate = layouts[i];

				if(candidate.breakpoint && state.width >= candidate.breakpoint) {
					layout = i;
				}
			}

			if(layout === null) {
				return self;
			}

			if(layout !== state.layout) {
				state.layout    = layout;
				state.size.base = candidate.base;

				html.setAttribute('data-layout', layout);
				events.push('layoutchange');
			}

			layout = layouts[layout];

			state.size.current = Math.max(layout.min, Math.min(layout.max, Math.floor(layout.base * (state.width / layout.width))));
			zoomed             = Math.round(state.ratio.zoom * (state.size.current / layout.base) * layout.base);

			if(zoomed !== state.size.zoomed) {
				html.style.fontSize = zoomed + 'px';

				state.size.zoomed = zoomed;
				state.ratio.size  = state.size.current / layout.base;
				state.ratio.total = state.ratio.size * state.ratio.device;
				state.ratio.image = Math.round(Math.ceil(state.ratio.total / 0.25) * 25) / 100;

				events.push('ratiochange');
			}

			for(i = 0; (type = events[i]) !== undefined; i++) {
				self.emit(type, state);
			}

			events.length = 0;

			return self;
		}
	});
}, window, document));