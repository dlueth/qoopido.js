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
		define([ './base' ], initialize);
	} else {
		initialize(window[namespace].base);
	}
}(function(mBase, window, document, undefined) {
	'use strict';

	var width, candidate, type, event,
		html    = document.getElementsByTagName('html')[0],
		element = document.documentElement,
		layouts = { },
		events  = [],
		state   = {
			layout: null,
			size: {
				base:    null,
				current: null,
				last:    null
			},
			ratio: {
				device: window.devicePixelRatio || 1,
				size:  null,
				total: null,
				image: null
			}
		};

	return mBase.extend({
		_constructor: function _constructor() {
			var self = this;

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

			width = element.offsetWidth;

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

			if(state.size.current !== state.size.last) {
				html.style.fontSize = state.size.current + 'px';

				state.size.last   = state.size.current;
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