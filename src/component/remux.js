/*
 * Qoopido component/remux
 *
 * Provides facilities for responsive layouts solely based on REM units and overall proportionally scaling
 *
 * Copyright (c) 2014 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../emitter
 * @polyfill ../polyfill/window/matchmedia
 */
;(function(definition) {
	var dependencies = [ '../emitter' ];

	if(!window.matchMedia) {
		dependencies.push('../polyfill/window/matchmedia');
	}

	window.qoopido.registerSingleton('component/remux', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		html             = document.getElementsByTagName('html')[0],
		base             = 16,
		state            = { fontsize: null, layout: null, ratio: { } },
		current          = { fontsize: null, layout: null },
		queries          = [];

	function updateState(layout, fontsize) {
		var self = this;

		if(layout && fontsize) {
			html.className      = layout;
			html.style.fontSize = fontsize + 'px';

			state.layout   = layout;
			state.fontsize = fontsize;

			if(current.fontsize !== state.fontsize || current.layout !== state.layout) {
				state.ratio.device   = (window.devicePixelRatio || 1);
				state.ratio.fontsize = state.fontsize / base;
				state.ratio.total    = state.ratio.device * state.ratio.fontsize;

				if(current.layout !== state.layout) {
					self.emit('layoutchanged', state);
				}

				if(current.fontsize !== state.fontsize) {
					self.emit('fontsizechanged', state);
				}

				self.emit('statechanged', state);

				current.fontsize = state.fontsize;
				current.layout   = state.layout;
			}
		}

		return self;
	}

	function addQuery(query, layout, fontsize, min, max) {
		var self = this,
			mql  = window.matchMedia(query);

		mql.layout   = layout;
		mql.fontsize = fontsize;
		mql.min      = min;
		mql.max      = max;

		queries.push(mql);

		mql.addListener(function(mql) {
			if(mql.matches === true) {
				updateState.call(self, mql.layout, mql.fontsize);
			}
		});
	}

	prototype = modules['emitter'].extend({
		_constructor: function() {
			var self          = this,
				pBase         = parseInt(html.getAttribute('data-base'), 10);

			prototype._parent._constructor.call(self);

			if(isNaN(pBase) === false) {
				base = pBase;
			}
		},
		getState: function() {
			return state;
		},
		getLayout: function() {
			return state.layout;
		},
		getFontsize: function() {
			return state.fontsize;
		},
		setLayout: function(layout, fontsize) {
			var self = this;

			updateState.call(self, layout, fontsize);

			return self;
		},
		addLayout: function(pId, pLayout) {
			var self = this,
				parameter, id, layout, size, min, max, lMin, lMax, mq, mql;

			if(arguments.length > 1) {
				parameter      = { };
				parameter[pId] = pLayout;
			} else {
				parameter = arguments[0];
			}

			for(id in parameter) {
				layout = parameter[id];

				for(size = layout.min; size <= layout.max; size++) {
					lMin = Math.round(layout.width * (size / base));
					lMax = Math.round(layout.width * ((size + 1) / base)) - 1;

					mq  = 'screen and (min-width: ' + lMin + 'px) and (max-width: ' + lMax + 'px )';

					addQuery.call(self, mq, id, size, lMin, lMax);

					min = (!min || lMin <= min.min) ? queries[queries.length - 1] : min;
					max = (!max || lMax >= max.max) ? queries[queries.length - 1] : max;
				}
			}

			addQuery.call(self, 'screen and (max-width: ' + (min.min - 1) + 'px)', min.layout, min.fontsize, min.min, min.max);
			addQuery.call(self, 'screen and (min-width: ' + (max.max + 1) + 'px)', max.layout, max.fontsize, max.min, max.max);

			for(var index in queries) {
				mql = queries[index];

				if(mql.matches === true) {
					updateState.call(self, mql.layout, mql.fontsize);
				}
			}

			return self;
		}
	});

	return prototype;
}));