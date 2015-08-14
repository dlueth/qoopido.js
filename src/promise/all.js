/*
 * Qoopido promise/all
 *
 * Borrowed from:
 * https://github.com/jakearchibald/es6-promise
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ../polyfill/window/promise
 */
;(function(definition, global) {
	var dependencies = [];

	if(!global.Promise) {
		dependencies.push('../polyfill/window/promise');
	}

	global.qoopido.register('promise/all', definition, dependencies);
}(function(modules, shared, global, undefined) {
	'use strict';

	return function all(promises) {
		if(Object.prototype.toString.call(promises) !== '[object Array]') {
			throw new TypeError('You must pass an array to all.');
		}

		return new global.Promise(function(resolve, reject) {
			var results   = [],
				remaining = promises.length,
				i = 0, promise;

			if(remaining === 0) {
				resolve([]);
			}

			function resolver(index) {
				return function(value) {
					resolveAll(index, value);
				};
			}

			function resolveAll(index, value) {
				results[index] = value;

				if(--remaining === 0) {
					resolve(results);
				}
			}

			for(; (promise = promises[i]) !== undefined; i++) {
				if(promise && typeof promise.then === 'function') {
					promise.then(resolver(i), reject);
				} else {
					resolveAll(i, promise);
				}
			}
		});
	};
}, this));