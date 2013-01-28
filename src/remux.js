/*
 * Qoopido remux class to build responsive layouts fully based on rem
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 */
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
			width              = element.offsetWidth * state.ratio.zoom;

			for(layout in layouts) {
				if(layouts[layout].breakpoint && width >= layouts[layout].breakpoint) {
					candidate = layout;
				}
			}

			if(candidate !== state.layout) {
				state.layout    = candidate;
				state.size.base = layouts[candidate].base;

				document.getElementsByTagName('html')[0].setAttribute('data-layout', candidate);
				events.push('layoutchange');
			}

			state.size.current = Math.max(layouts[state.layout].min, Math.min(layouts[state.layout].max, Math.floor(state.size.base * (width / layouts[state.layout].width))));
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