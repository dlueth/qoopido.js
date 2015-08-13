/*
 * Qoopido promise/race
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
;(function(definition) {
	var dependencies = [];

	if(!window.Promise) {
		dependencies.push('../polyfill/window/promise');
	}

	window.qoopido.register('promise/race', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return function race(promises) {
		if(Object.prototype.toString.call(promises) !== '[object Array]') {
			throw new TypeError('You must pass an array to all.');
		}

		return new window.Promise(function(resolve, reject) {
			var i = 0, promise;

			for(; (promise = promises[i]) !== undefined; i++) {
				if(promise && typeof promise.then === 'function') {
					promise.then(resolve, reject);
				} else {
					resolve(promise);
				}
			}
		});
	};
}));