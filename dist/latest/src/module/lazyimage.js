/*
 * Qoopido module lazyimage
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
 */
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
		return window.qoopido.shared.module.initialize('module/lazyimage', pDefinition, arguments);
	};

	if(typeof define === 'function' && define.amd) {
		define([ './emerge', '../function/merge' ], definition);
	} else {
		definition(window.qoopido.module.emerge, window.qoopido.function.merge);
	}
}(function(mPrototype, merge) {
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

	// listener
		LISTENER_LOAD    = 'load',
		LISTENER_ERROR   = 'error',
		LISTENER_EMERGED = 'emerged';

	function load() {
		var self    = this,
			element = self._element;

		queue += 1;

		self.emit(EVENT_REQUESTED);

		function onLoad() {
			queue -= 1;

			element.off(LISTENER_ERROR, onError);
			self.emit(EVENT_LOADED);
		}

		function onError() {
			queue -= 1;

			element.off(LISTENER_LOAD, onLoad);
		}

		element
			.one(LISTENER_LOAD, onLoad)
			.one(LISTENER_ERROR, onError);

		element.setAttribute('src', element.getAttribute(self._settings.attribute));
		element.removeAttribute(self._settings.attribute);
	}

	prototype = mPrototype.extend({
		_constructor: function(element, settings) {
			var self = this;

			settings = merge({}, defaults, settings || {});

			prototype._parent._constructor.call(self, element, settings);

			element = self._element;

			function onLoad() {
				self.off(onError);
			}

			function onError() {
				self.off(onLoad);
			}

			if(!element.getAttribute('src')) {
				element
					.one(LISTENER_LOAD, onLoad)
					.one(LISTENER_ERROR, onError)
					.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
			}

			function onEmerge(priority) {
				if(queue === 0 || priority === 1) {
					self.remove();
					self.off(LISTENER_EMERGED, onEmerge);

					load.call(self);
				}
			}

			self.on(LISTENER_EMERGED, onEmerge);
		},
		remove: function remove() {
			prototype._parent.remove.call(this);
		}
	});

	return prototype;
}, window));