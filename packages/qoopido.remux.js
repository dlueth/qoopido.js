/*!
* Qoopido remux, an REM-driven approach to RWD
*
* Source:  Qoopido JS
* Version: 1.1.4
* Date:    2013-01-29
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

	var lookup = {
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
				var element = lookup.element[pType] = lookup.element[pType] || document.createElement(pType);

				pClone = !!(pClone);

				return (pClone) ? element.cloneNode(false) : element;
			},
			getPrefix: function getPrefix() {
				var property,
					stored = lookup.prefix || null,
					styles = this.getElement('div').style,
					regex  = /^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])/;

				if(stored === null) {
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

					stored = lookup.prefix = (stored === false)? false : { method: stored, property: stored.toLowerCase() };
				}

				return stored;
			},
			getProperty: function getProperty(pProperty) {
				var stored = lookup.property[pProperty] || null;

				if(stored === null) {
					var element = this.getElement('div');

					stored = false;

					if(element.style[pProperty] !== undefined) {
						stored = pProperty;
					} else {
						var prefix;

						if((prefix = this.getPrefix()) !== false) {
							var prefixed = '-' + prefix.property + '-' + pProperty;

							if(element.style[prefixed] !== undefined) {
								stored = prefixed;
							}
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
					var prefix;

					stored = false;

					if(pElement[pMethod] !== undefined && (typeof pElement[pMethod] === 'function' || typeof pElement[pMethod] === 'object')) {
						stored = pMethod;
					}

					if((prefix = this.getPrefix()) !== false) {
						var prefixed = prefix.method + pMethod;

						if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
							stored = prefixed;
						} else {
							prefixed = prefix.property + pMethod;

							if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
								stored = prefixed;
							}
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

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base', './support' ], initialize);
	} else {
		initialize(window[namespace].base, window[namespace].support);
	}
}(function(mBase, mSupport, window, document, undefined) {
	'use strict';

	var width, candidate, type, event, detectZoom,
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
				zoomed:  null,
				last:    null
			},
			ratio: {
				device: window.devicePixelRatio || 1,
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
		temp.element   = document.createElement('div');
		temp.container = document.createElement('div');

		temp.element.innerHTML = '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0';
		temp.element.setAttribute('style', 'font: 100px/1em sans-serif !important; -webkit-text-size-adjust: none !important; height: auto !important; width: 1em !important; padding: 0 !important; overflow: visible !important;');
		temp.container.setAttribute('style', 'width: 0 !important; height: 0 !important; overflow: hidden !important; visibility: hidden !important; position: absolute; !important');
		temp.container.appendChild(temp.element);

		document.body.appendChild(temp.container);
	}

	function _getZoomByTextsize() {
		return Math.round((1000 / temp.element.clientHeight) * 100) / 100;
	}

	function _setupZoomByMatchmedia() {
		temp.method   = function() {
			return window[mSupport.getMethod('matchMedia')].apply(window, arguments);
		};

		switch(mSupport.getPrefix().property) {
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

	return mBase.extend({
		_constructor: function _constructor() {
			var self = this;

			if(!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
				// IE8+
				detectZoom = _getZoomByLogicaldpi;
			} else if(mSupport.supportsProperty('textSizeAdjust') !== false) {
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

			window.addEventListener('resize', self.updateState, false);
			window.addEventListener('orientationchange', self.updateState, false);

			self.updateState();
		},
		addLayout: function addLayout(pId, pLayout) {
			layouts[pId] = pLayout;

			return this;
		},
		getState: function getState() {
			return state;
		},
		updateState: function updateState() {
			var layout, i;

			state.ratio.device = window.devicePixelRatio || 1;
			state.ratio.zoom   = detectZoom() || 1;
			state.width        = element.offsetWidth * state.ratio.zoom;

			for(layout in layouts) {
				if(layouts[layout].breakpoint && state.width >= layouts[layout].breakpoint) {
					candidate = layout;
				}
			}

			if(candidate !== state.layout) {
				state.layout    = candidate;
				state.size.base = layouts[candidate].base;

				document.getElementsByTagName('html')[0].setAttribute('data-layout', candidate);
				events.push('layoutchange');
			}

			state.size.current = Math.max(layouts[state.layout].min, Math.min(layouts[state.layout].max, Math.floor(state.size.base * (state.width / layouts[state.layout].width))));
			state.size.zoomed  = Math.round(state.ratio.zoom * (state.size.current / state.size.base) * state.size.base);

			if(state.size.zoomed !== state.size.last) {
				html.style.fontSize = state.size.zoomed + 'px';

				state.size.last   = state.size.zoomed;
				state.ratio.size  = state.size.current / state.size.base;
				state.ratio.total = state.ratio.size * state.ratio.device;
				state.ratio.image = Math.round(Math.ceil(state.ratio.total / 0.25) * 25) / 100;

				events.push('ratiochange');
			}

			for(i = 0; (type = events[i]) !== undefined; i++) {
				event = document.createEvent('HTMLEvents');
				event.initEvent(type, true, true);
				event.state = state;

				window.dispatchEvent(event);
			}

			events.length = 0;

			return this;
		}
	});
}, window, document));