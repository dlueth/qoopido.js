/*
 * jQuery plugin that fires events when an element enters the visible area
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require qoopido/base.js
 * @require qoopido/unique.js
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'jquery/plugins/emerge',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'jquery', 'qoopido/base', 'qoopido/unique' ], initialize);
	} else {
		initialize(window.jQuery, window[namespace].base, window[namespace].unique);
	}
}(function(mJquery, mBase, mUnique, window, document, undefined) {
	'use strict';

	var // properties
		name     = 'emerge',
		defaults = { interval: 20, threshold: 'auto', recur: true, auto: 0.5, visibility: true },
		$window  = mJquery(window),

	// methods / classes
		tick, resize, emerge,

	// events
		EVENT_EMERGED  = 'emerged.' + name,
		EVENT_DEMERGED = 'demerged.' + name,

	// listener
		LISTENER_RESIZE = 'resize orientationchange';

	if(document.compatMode !== 'CSS1Compat') {
		throw('This plugin will not work correctly in quirks mode, please ensure your Browser is in standards mode.');
	}

	mJquery.fn[name] = function(settings) {
		return this.each(function() {
			emerge.create(this, settings);
		});
	};

	tick = function tick(interval) {
		var i;

		for(i in emerge._elements[interval]) {
			if(emerge._elements[interval][i]._checkState !== undefined) {
				emerge._elements[interval][i]._checkState();
			}
		}

		if(emerge._elements[interval].length === 0) {
			window.clearInterval(emerge._intervals[interval]);

			delete emerge._intervals[interval];
		}
	};

	resize = function() {
		emerge._viewport.left   = 0;
		emerge._viewport.top    = 0;
		emerge._viewport.right  = $window.width();
		emerge._viewport.bottom = $window.height();
	};

	emerge = mBase.extend({
		_viewport:  { left: 0, top: 0, right: $window.width(), bottom: $window.height() },
		_intervals: {},
		_elements:  {},
		_constructor: function(element, settings) {
			var self = this;

			settings = mJquery.extend(true, {}, defaults, settings || {});

			if(settings.threshold === 'auto') {
				delete settings.threshold;
			}

			if(emerge._intervals[settings.interval] === undefined) {
				emerge._elements[settings.interval]  = emerge._elements[settings.interval] || {};
				emerge._intervals[settings.interval] = window.setInterval(function() { tick(settings.interval); }, settings.interval);
			}

			self._element  = element;
			self._object   = mJquery(element);
			self._settings = settings;
			self._viewport = { left: 0, top: 0, right: 0, bottom: 0 };
			self._state    = false;
			self._priority = 2;
			self._uuid     = mUnique.uuid();

			emerge._elements[self._settings.interval][self._uuid] = self;

			$window.on(LISTENER_RESIZE, function() { self._onResize.call(self); });
			self._onResize();
		},
		_checkState: function() {
			var self     = this,
				state    = false,
				priority = 2,
				boundaries;

			if(self._object.is(':visible') && (self._element.style.visibility !== 'hidden' || self._settings.visibility === false)) {
				boundaries = self._element.getBoundingClientRect();

				if((boundaries.left >= self._viewport.left && boundaries.top >= self._viewport.top && boundaries.left <= self._viewport.right && boundaries.top <= self._viewport.bottom) || (boundaries.right >= self._viewport.left && boundaries.bottom >= self._viewport.top && boundaries.right <= self._viewport.right && boundaries.bottom <= self._viewport.bottom)) {
					if((boundaries.left >= emerge._viewport.left && boundaries.top >= emerge._viewport.top && boundaries.left <= emerge._viewport.right && boundaries.top <= emerge._viewport.bottom) || (boundaries.right >= emerge._viewport.left && boundaries.bottom >= emerge._viewport.top && boundaries.right <= emerge._viewport.right && boundaries.bottom <= emerge._viewport.bottom)) {
						priority = 1;
					}

					state = true;
				}
			}

			if(state !== self._state || priority !== self._priority) {
				self._state    = state;
				self._priority = priority;

				self._changeState();
			}
		},
		_changeState: function() {
			var self = this,
				event;

			if(self._settings.recur !== true) {
				self._remove();
			}

			if(self._state === true) {
				event = mJquery.Event(EVENT_EMERGED);

				event.priority = self._priority;
			} else {
				event = mJquery.Event(EVENT_DEMERGED);
			}

			self._object.trigger(event);
		},
		_remove: function() {
			var self = this;

			delete emerge._elements[self._settings.interval][self._uuid];
		},
		_onResize: function() {
			var self = this,
				x    = self._settings.threshold || $window.width() * self._settings.auto,
				y    = self._settings.threshold || $window.height() * self._settings.auto;

			self._viewport.left   = emerge._viewport.left - x;
			self._viewport.top    = emerge._viewport.top - y;
			self._viewport.right  = emerge._viewport.right + x;
			self._viewport.bottom = emerge._viewport.bottom + y;
		}
	});

	$window.on(LISTENER_RESIZE, resize);

	return emerge;
}, window, document));