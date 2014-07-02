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
 * @require ../dom/element
 * @polyfill ../polyfill/window/getcomputedstyle
 */
;(function(definition) {
	var dependencies = [ '../emitter', '../dom/element' ];

	if(!window.getComputedStyle) {
		dependencies.push('../polyfill/window/getcomputedstyle');
	}

	window.qoopido.registerSingleton('component/remux', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype, style, property,
		html             = document.getElementsByTagName('html')[0],
		base             = 16,
		state            = { fontsize: null, layout: null, ratio: { } },
		current          = { fontsize: null, layout: null },
		delay            = null,
		regex            = new RegExp('["\']', 'g'),
		getComputedStyle = window.getComputedStyle || modules['polyfill/window/getcomputedstyle'];

	function insertRule (rule) {
		if(style.styleSheet && style.styleSheet.insertRule) {
			style.styleSheet.insertRule(rule, style.styleSheet.cssRules.length);
		} else if(style.sheet) {
			style.appendChild(document.createTextNode(rule));
		}
	}

	function updateState(fontsize, layout) {
		var self = this;

		state.fontsize = fontsize || parseInt(getComputedStyle(html).getPropertyValue('font-size'), 10);
		state.layout   = layout || (property === 'font-size') ? getComputedStyle(html).getPropertyValue(property) : getComputedStyle(html, ':after').getPropertyValue(property) || null;

		if(state.layout !== null) {
			state.layout = state.layout.replace(regex, '');
		}

		if(state.layout !== null && (state.fontsize !== current.fontsize || state.layout !== current.layout)) {
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
				},
				temp;

			prototype._parent._constructor.call(self);

			if(isNaN(pBase) === false) {
				base = pBase;
			}

			style      = document.createElement('style');
			style.type = 'text/css';

			if(typeof style.sheet !== 'undefined') {
				style.appendChild(document.createTextNode(''));
			}

			document.getElementsByTagName('head')[0].appendChild(style);

			insertRule('html:before { content: "remux"; display: none; }');

			temp = getComputedStyle(html, ':before').getPropertyValue('content');

			if(temp !== null) {
				temp = temp.replace(regex, '');
			}

			property = (temp === 'remux') ? 'content' : 'font-family';

			modules['dom/element']
				.create(window)
				.on('resize orientationchange', delayedUpdate);

			updateState.call(self);
		},
		getState: function() {
			return state;
		},
		getLayout: function() {
			return state.layout;
		},
		forceLayout: function(fontsize, layout) {
			var self = this;

			updateState.call(self, fontsize, layout);

			return self;
		},
		addLayout: function(pId, pLayout) {
			var self = this,
				parameter, id, layout, size, breakpoint;

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

					switch(property) {
						case 'font-family':
							insertRule('@media screen and (min-width: ' + breakpoint + 'px) { html { font-size: ' + size + 'px; ' + property + ': "' + id + '"; }');
							break;
						default:
							insertRule('@media screen and (min-width: ' + breakpoint + 'px) { html { font-size: ' + size + 'px; } html:after { ' + property + ': "' + id + '"; display: none; } }');

							break;
					}
				}
			}

			updateState.call(self);

			return self;
		}
	});

	return prototype;
}));