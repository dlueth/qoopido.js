/*
 * Qoopido dom/element/lazyimage
 *
 * Lazy load images when entering, leaving or nearing the visible are of the browser window
 *
 * Source:  Qoopido Lazyimage
 * Author:  Dirk Lüth <info@qoopido.com>
 * Website: https://github.com/dlueth/qoopido.lazyimage
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Licensed under the MIT and GPL license.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @require ./emerge
 * @require ../function/merge
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('dom/element/lazyimage', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './emerge', '../../function/merge' ], definition);
	} else {
		definition();
	}
}(function(modules, merge) {
	'use strict';

	var
	// variables
		defaults = { interval: 50, threshold: 'auto', attribute: 'data-lazyimage' },
		queue    = 0,

	// methods / classes
		prototype,

	// events
		EVENT_REQUESTED = 'requested',
		EVENT_LOADED    = 'loaded',
		EVENT_FAILED    = 'failed',
		EVENT_EMERGED   = 'emerged',
		DOM_LOAD        = 'load',
		DOM_ERROR       = 'error',
		DOM_STATE       = ''.concat(DOM_LOAD, ' ', DOM_ERROR);

	function load() {
		var self      = this,
			attribute = self._settings.attribute;

		queue += 1;

		self
			.emit(EVENT_REQUESTED)
			.one(DOM_STATE, function(event) {
				if(event.type === DOM_LOAD) {
					self.emit(EVENT_LOADED);
				} else {
					self.emit(EVENT_FAILED);
				}

				queue -= 1;
			}, false)
			.setAttribute('src', self.getAttribute(attribute))
			.removeAttribute(attribute);
	}

	prototype = modules['dom/element/emerge'].extend({
		_constructor: function(element, settings) {
			var self = this;

			prototype._parent._constructor.call(self, element, modules['function/merge']({}, defaults, settings || {}));

			self.on(EVENT_EMERGED, function onEmerge(event) {
				if(queue === 0 || event.data === 1) {
					self.remove();
					self.off(EVENT_EMERGED, onEmerge);

					load.call(self);
				}
			});
		}
	});

	return prototype;
}, window));