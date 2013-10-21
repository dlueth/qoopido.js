/*
 * Qoopido component/remux
 *
 * Provides facilities for responsive layouts solely based on REM units and overall proportionally scaling
 *
 * Copyright (c) 2012 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../emitter
 */
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