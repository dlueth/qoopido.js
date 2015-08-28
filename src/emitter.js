/**
 * Qoopido emitter
 *
 * Provides mechanism to emit events and register listeners
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./base
 *
 * @polyfill Object.defineProperty
 * @polyfill Object.getOwnPropertyNames
 * @polyfill Object.getOwnPropertyDescriptor
 * @polyfill Object.getPrototypeOf
 */

;(function(undefined) {
	'use strict';

	var regexExclude = /^(extend$|_|get.+)/,
		o_dp         = Object.defineProperty,
		o_gopn       = Object.getOwnPropertyNames,
		o_gopd       = Object.getOwnPropertyDescriptor,
		o_gpo        = Object.getPrototypeOf,
		gcd          = function(value, writable) { return { writable: !!writable, configurable: false, enumerable: false, value: value };},
		storage      = {};

	function conceal() {
		var self       = this,
			prototype  = self.constructor.prototype,
			properties = o_gopn(prototype); // might have to be changed to Object.keys + further checks

		properties.forEach(function(property) {
			var event, descriptor;

			if(typeof self[property] === 'function' && regexExclude.test(property) === false && o_gopd(prototype, property).writable) {
				event      = property.charAt(0).toUpperCase() + property.slice(1);
				descriptor = o_gopd(prototype, property);

				descriptor.value = function() {
					var result;

					self.emit('pre' + event, arguments);

					result = prototype[property].apply(self, arguments);

					self.emit('post' + event, arguments, result);

					return result;
				};

				Object.defineProperty(self, property, descriptor);
			}
		});
	}

	function definition(base, functionUniqueUuid) {
		function Emitter() {
			var self = this,
				uuid = self.uuid;

			!uuid && (uuid = functionUniqueUuid()) && o_dp(self, 'uuid', gcd(uuid));

			storage[uuid] = {};

			if(o_gpo(self) !== Emitter.prototype) {
				conceal.call(self);
			}

			return self;
		}

		Emitter.prototype = {
			on: function(events, fn) {
				var self    = this,
					pointer = storage[self.uuid],
					i = 0, event;

				events = events.split(' ');

				for(; (event = events[i]) !== undefined; i++) {
					(pointer[event] = pointer[event] || []).push(fn);
				}

				return self;
			},
			one: function(events, fn, each) {
				var self = this;

				each = (each !== false);

				self.on(events, function listener(event) {
					self.off(((each === true) ? event : events), listener);

					fn.apply(this, arguments);
				});

				return self;
			},
			off: function(events, fn) {
				var self    = this,
					pointer = storage[self.uuid],
					i = 0, event, j, listener;

				if(events) {
					events = events.split(' ');

					for(; (event = events[i]) !== undefined; i++) {
						pointer[event] = pointer[event] || [];

						if(fn) {
							for(j = 0; (listener = pointer[event][j]) !== undefined; j++) {
								if(listener === fn) {
									pointer[event].splice(j, 1);

									j--;
								}
							}
						} else {
							pointer[event].length = 0;
						}
					}
				} else {
					for(event in self.listener) {
						pointer[event].length = 0;
					}
				}

				return self;
			},
			emit: function(event) {
				var self = this,
					pointer, temp, i = 0, listener;

				if(event) {
					pointer = storage[self.uuid];

					pointer[event] = pointer[event] || [];
					temp           = pointer[event].slice();

					for(; (listener = temp[i]) !== undefined; i++) {
						listener.apply(self, arguments);
					}
				}

				return self;
			}
		};

		return base.extend(Emitter);
	}

	provide(definition, 'base', 'function/unique/uuid');
}());