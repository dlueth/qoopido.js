/*
 * Qoopido polyfill/window/promise
 *
 * Optimized from:
 * https://github.com/taylorhakes/promise-polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
;(function(definition) {
	window.qoopido.register('polyfill/window/promise', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var isObject   = function(value) { return typeof value === 'object'; },
		isFunction = function(value) { return typeof value === 'function';},
		asap       = (isFunction(window.setImmediate) && window.setImmediate) || function(fn) { setTimeout(fn, 1);};

	function bind(fn, context) {
		return function() {
			fn.apply(context, arguments);
		};
	}

	function handle(deferred) {
		var self = this;

		if(self._state === null) {
			self._deferreds.push(deferred);

			return;
		}

		asap(function() {
			var callback = self._state ? deferred.onFulfilled : deferred.onRejected,
				value;

			if(callback === null) {
				(self._state ? deferred.resolve : deferred.reject)(self._value);

				return;
			}

			try {
				value = callback(self._value);
			} catch(exception) {
				deferred.reject(exception);

				return;
			}

			deferred.resolve(value);
		});
	}

	function resolve(value) {
		var self = this,
			then;

		try {
			if(value === self) {
				throw new TypeError('A promise cannot be resolved with itself.');
			}

			if(value && (isObject(value) || isFunction(value))) {
				then = value.then;

				if(typeof then === 'function') {
					doResolve(bind(then, value), bind(resolve, self), bind(reject, self));

					return;
				}
			}

			self._state = true;
			self._value = value;

			finale.call(self);
		} catch (exception) {
			reject.call(self, exception);
		}
	}

	function reject(value) {
		var self = this;

		self._state = false;
		self._value = value;

		finale.call(self);
	}

	function finale() {
		var self = this,
			i = 0, deferred;

		for(; (deferred = self._deferreds[i]) !== undefined; i++) {
			handle.call(self, deferred);
		}

		this._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, resolve, reject) {
		var self = this;

		self.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		self.onRejected  = typeof onRejected  === 'function' ? onRejected  : null;
		self.resolve     = resolve;
		self.reject      = reject;
	}

	function doResolve(fn, onFulfilled, onRejected) {
		var done = false;

		try {
			fn(
				function (value) {
					if(done) {
						return;
					}

					done = true;

					onFulfilled(value);
				},
				function(reason) {
					if(done) {
						return;
					}

					done = true;

					onRejected(reason);
				});
		} catch(exception) {
			if(done) {
				return;
			}

			done = true;

			onRejected(exception);
		}
	}

	function Promise(fn) {
		var self = this;

		if(!isObject(self)) {
			throw new TypeError('Promises must be constructed via new');
		}

		if(!isFunction(fn)) {
			throw new TypeError('not a function');
		}

		self._state     = null;
		self._value     = null;
		self._deferreds = [];

		doResolve(fn, bind(resolve, self), bind(reject, self));
	}

	Promise.prototype['catch'] = function(onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype['then'] = function(onFulfilled, onRejected) {
		var self = this;

		return new Promise(function(resolve, reject) {
			handle.call(self, new Handler(onFulfilled, onRejected, resolve, reject));
		});
	};

	Promise.resolve = function(value) {
		if(value && isObject(value) && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function(value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	if(!window.Promise) {
		window.Promise = Promise;
	}

	return window.Promise;
}));