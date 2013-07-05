/*
 * Qoopido dom element
 *
 * Provides additional methods for DOM elements
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../base
 */
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
		return window.qoopido.shared.module.initialize('dom/element', pDefinition, arguments);
	};

	if(typeof define === 'function' && define.amd) {
		define([ '../base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	var ignoreProperties = new RegExp('^(parent|top|frameElement|webkitStorageInfo)$'),
		onMethod, offMethod, emitMethod;

	function map(context, method) {
		return function() {
			return context[method].apply(context, arguments);
		};
	}

	onMethod = (window.addEventListener) ?
		function(element, name, fn) {
			element.addEventListener(name, fn, false);
		}
		: function(element, name, fn) {
			element['e' + name + fn] = fn;
			element[name + fn] = function() { element['e' + name + fn](window.event); };
			element.attachEvent('on' + name, element[name + fn]);
		};

	offMethod = (window.removeEventListener) ?
		function(element, name, fn) {
			element.removeEventListener(name, fn, false);
		}
		: function(element, name, fn) {
			element.detachEvent('on' + name, element[name + fn]);
			element[name + fn] = element['e' + name + fn] = null;
		};

	emitMethod = (document.createEvent) ?
		function(element, type, data) {
			var event = document.createEvent('HTMLEvents');
			event.initEvent(type, true, true);
			event.data = data;
			element.dispatchEvent(event);
		}
		: function(element, type, data) {
			var event = document.createEventObject();
			event.eventType = type;
			event.data      = data;
			element.fireEvent('on' + event.eventType, event);
		};

	return mPrototype.extend({
		_element: null,
		_constructor: function _constructor(element) {
			var self = this,
				property;

			self._element = element;

			for(property in element) {
				if(!self[property] && !ignoreProperties.test(property)) {
					try {
						if(typeof element[property] === 'function') {
							self[property] = map(self._element, property);
						} else {
							self[property] = element[property];
						}

					} catch(exception) {}
				}
			}
		},
		isVisible: function isVisible() {
			var element = this._element;

			return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
		},
		on: function on(event, listener) {
			var self    = this,
				element = this._element,
				i, name;

			event = event.split(' ');

			for(i = 0; (name = event[i]) !== undefined; i++) {
				onMethod(element, name, listener);
			}

			return self;
		},
		one: function one(event, listener) {
			var self = this;

			self.on(event, function() {
				self.off(event, listener);

				listener.apply(null, arguments);
			});

			return self;
		},
		off: function off(event, listener) {
			var self    = this,
				element = this._element,
				i, name;

			event = event.split(' ');

			for(i = 0; (name = event[i]) !== undefined; i++) {
				offMethod(element, name, listener);
			}

			return self;
		},
		emit: function emit(event, data) {
			var self = this;

			emitMethod(self._element, event, data);

			return self;
		}
	});
}, window));