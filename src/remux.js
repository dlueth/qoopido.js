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

	var timeout, candidate, layout, zoomed, type, event, detectZoom,
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
		temp.element   = document.createElement('div');
		temp.container = document.createElement('div');

		temp.element.innerHTML = '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0';
		temp.element.setAttribute('style', 'font: 100px/1em sans-serif !important; -webkit-text-size-adjust: none !important; height: auto !important; width: 1em !important; padding: 0 !important; overflow: visible !important;');
		temp.container.setAttribute('style', 'width: 0 !important; height: 0 !important; overflow: hidden !important; visibility: hidden !important; position: absolute; !important');
		temp.container.appendChild(temp.element);
	}

	function _getZoomByTextsize() {
		var zoom;

		document.body.appendChild(temp.container);

		zoom = Math.round((1000 / temp.element.clientHeight) * 100) / 100;

		document.body.removeChild(temp.container);

		return zoom;
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
			var self        = this,
				timedUpdate = function _updateState() {
					if(timeout !== null) {
						window.clearTimeout(timeout);
					}

					timeout = window.setTimeout(function() {
						self.updateState();
					}, 20);
				};

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

			window.addEventListener('resize', timedUpdate, false);
			window.addEventListener('orientationchange', timedUpdate, false);

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
			var i;

			state.ratio.device = window.devicePixelRatio || 1;
			state.ratio.zoom   = detectZoom() || 1;
			state.width        = element.offsetWidth * state.ratio.zoom;

			for(i in layouts) {
				candidate = layouts[i];

				if(candidate.breakpoint && state.width >= candidate.breakpoint) {
					layout = i;
				}
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