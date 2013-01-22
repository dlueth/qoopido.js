/*
 * jQuery plugin to lazyload images
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require qoopido/base.js
 * @require qoopido/jquery/plugins/emerge.js
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace = 'qoopido',
		name      = 'jquery/plugins/lazyimage',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'jquery', 'qoopido/jquery/plugins/emerge' ], initialize);
	} else {
		initialize(window.jQuery, window[namespace].emerge);
	}
}(function(mJquery, mEmerge, window, document, undefined) {
	'use strict';

	var // properties
		name = 'lazyimage',
		defaults  = { interval: 50, threshold: 'auto', attribute: 'data-' + name },

		// methods / classes
		lazyimage,

		// events
		EVENT_REQUESTED = 'requested.' + name,
		EVENT_LOADED    = 'loaded.' + name,

		// listener
		LISTENER_LOAD    = 'load',
		LISTENER_ERROR   = 'error',
		LISTENER_EMERGED = 'emerged.emerge';

	mJquery.fn[name] = function(settings) {
		return this.each(function() {
			lazyimage.create(this, settings);
		});
	};

	lazyimage = mEmerge.extend({
		_priority: 0,
		_constructor: function(element, settings) {
			var self = this;

			settings = mJquery.extend(true, {}, defaults, settings || {});

			self._parent._constructor.call(self, element, settings);

			if(self._object.attr('src') === undefined) {
				self._object.one(LISTENER_LOAD, function(event) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}).attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
			}

			self._object.on(LISTENER_EMERGED, function(event) {
				if(lazyimage._priority > 0) {
					if(event.priority === 1) {
						self._load();
					}
				} else {
					self._load();
				}
			});
		},
		_load: function() {
			var self = this;

			lazyimage._priority += 1;

			self._object.trigger(EVENT_REQUESTED).one(LISTENER_LOAD, function(event) {
				lazyimage._priority -= 1;

				self._object.trigger(EVENT_LOADED).off(LISTENER_ERROR);
			}).one(LISTENER_ERROR, function() { lazyimage._priority -= 1; }).attr('src', self._object.attr(self._settings.attribute)).removeAttr(self._settings.attribute);

			self._remove();
		},
		_remove: function() {
			var self = this;

			self._parent._remove.call(self);

			self._object.off(LISTENER_EMERGED);
		}
	});

	return lazyimage;
}, window, document));