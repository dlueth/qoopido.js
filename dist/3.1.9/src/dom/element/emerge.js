/*
 * Qoopido dom/element/emerge
 *
 * React on elements entering, leaving or nearing the visible are of the browser window
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../element
 * @require ../../function/merge
 * @require ../../function/unique/uuid
  */
;(function(definition) {
	window.qoopido.register('dom/element/emerge', definition, [ '../element', '../../function/merge', '../../function/unique/uuid' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var
	// variables
		defaults        = { interval: 50, threshold: 'auto', recur: true, auto: 0.5, visibility: true },
		documentElement = window.document.documentElement,
		viewport        = {},
		intervals       = {},
		elements        = {},

	// classes
		prototype,

	// events
		EVENT_EMERGED  = 'emerged',
		EVENT_DEMERGED = 'demerged',
		DOM_RESIZE     = 'resize orientationchange';

	window = modules['dom/element'].create(window);

	if(document.compatMode !== 'CSS1Compat') {
		throw('This script requires your browser to work in standards mode');
	}

	function tick(interval) {
		var index,
			pointer = elements[interval];

		for(index in pointer) {
			if(index !== 'length') {
				checkState.call(pointer[index]);
			}
		}

		if(pointer.length === 0) {
			window.element.clearInterval(intervals[interval]);

			delete intervals[interval];
		}
	}

	function globalOnResize() {
		viewport.left   = 0;
		viewport.top    = 0;
		viewport.right  = documentElement.clientWidth;
		viewport.bottom = documentElement.clientHeight;
	}

	function instanceOnResize() {
		var self = this,
			x    = self._settings.threshold || documentElement.clientWidth * self._settings.auto,
			y    = self._settings.threshold || documentElement.clientHeight * self._settings.auto;

		self._viewport.left   = viewport.left - x;
		self._viewport.top    = viewport.top - y;
		self._viewport.right  = viewport.right + x;
		self._viewport.bottom = viewport.bottom + y;
	}

	function checkState() {
		var self     = this,
			state    = false,
			priority = 2,
			boundaries;

		if(self.isVisible() && (self.getStyle('visibility') !== 'hidden' || self._settings.visibility === false)) {
			boundaries = self.element.getBoundingClientRect();

			if((boundaries.left >= self._viewport.left && boundaries.top >= self._viewport.top && boundaries.left <= self._viewport.right && boundaries.top <= self._viewport.bottom) || (boundaries.right >= self._viewport.left && boundaries.bottom >= self._viewport.top && boundaries.right <= self._viewport.right && boundaries.bottom <= self._viewport.bottom)) {
				if((boundaries.left >= viewport.left && boundaries.top >= viewport.top && boundaries.left <= viewport.right && boundaries.top <= viewport.bottom) || (boundaries.right >= viewport.left && boundaries.bottom >= viewport.top && boundaries.right <= viewport.right && boundaries.bottom <= viewport.bottom)) {
					priority = 1;
				}

				state = true;
			}
		}

		if(state !== self._state || (state === true && priority !== self._priority)) {
			setState.call(self, state, priority);
		}
	}

	function setState(state, priority) {
		var self = this;

		self._state    = state;
		self._priority = priority;

		if(self._settings.recur !== true) {
			self.remove();
		}

		if(state === true) {
			self.emit(EVENT_EMERGED, priority);
		} else {
			self.emit(EVENT_DEMERGED);
		}
	}

	prototype = modules['dom/element'].extend({
		_quid:     null,
		_viewport: null,
		_element:  null,
		_settings: null,
		_state:    null,
		_priority: null,
		_constructor: function(element, settings) {
			var self = this;

			prototype._parent._constructor.call(self, element);

			settings = modules['function/merge']({}, defaults, settings || {});

			if(settings.threshold === 'auto') {
				delete settings.threshold;
			}

			if(intervals[settings.interval] === undefined) {
				elements[settings.interval]  = elements[settings.interval] || { length: 0 };
				intervals[settings.interval] = window.element.setInterval(function() { tick(settings.interval); }, settings.interval);
			}

			self._quid     = modules['function/unique/uuid']();
			self._viewport = {};
			self._settings = settings;
			self._state    = false;
			self._priority = 2;

			elements[settings.interval][self._quid] = self;
			elements[settings.interval].length++;

			window.on(DOM_RESIZE, function() { instanceOnResize.call(self); });
			instanceOnResize.call(self);
		},
		remove: function() {
			var self = this;

			delete elements[self._settings.interval][self._quid];
			elements[self._settings.interval].length--;
		}
	});

	window.on(DOM_RESIZE, globalOnResize);
	globalOnResize();

	return prototype;
}));