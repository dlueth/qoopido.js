/*
 * Qoopido emitter
 *
 * Provides mechanism to emit events and register listeners
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('emitter', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition();
	}
}(function(modules, namespace, window, document, undefined) {
	'use strict';

	var excludeMethods = /^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;

	function map(context, method) {
		var event = method.charAt(0).toUpperCase() + method.slice(1);

		context._mapped[method] = context[method];

		return function() {
			var args = Array.prototype.slice.call(arguments),
				returnValue;

			context.emit.apply(context, ['pre' + event, args]);
			returnValue = context._mapped[method].apply(context, args);
			context.emit.apply(context, ['post' + event, returnValue, args]);

			return returnValue;
		};
	}

	return modules.base.extend({
		_mapped:   null,
		_listener: null,
		_constructor: function() {
			var self = this,
				method;

			self._listener = {};
			self._mapped = {};

			for(method in self) {
				if(typeof self[method] === 'function' && excludeMethods.test(method) === false) {
					self[method] = map(self, method);
				}
			}
		},
		on: function(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				(self._listener[event] = self._listener[event] || []).push(listener);
			}

			return self;
		},
		one: function(event, listener) {
			var self = this;

			if(event !== undefined && listener !== undefined) {
				listener.once = true;

				self.on(event, listener);
			}

			return self;
		},
		off: function(event, listener) {
			var self = this,
				i;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				if(listener) {
					while((i = self._listener[event].indexOf(listener)) !== -1) {
						self._listener[event].splice(i, 1);
					}
				} else {
					self._listener[event].length = 0;
				}
			}

			return self;
		},
		emit: function(event) {
			var self = this,
				args = Array.prototype.slice.call(arguments).splice(1),
				i, listener;

			if(event !== undefined) {
				self._listener[event] = self._listener[event] || [];

				for(i = 0; (listener = self._listener[event][i]) !== undefined; i++) {
					listener.apply(self, args);

					if(listener.once === true) {
						self._listener[event].splice(i, 1);
						i--;
					}
				}
			}

			return self;
		}
	});
}, window));