/*
 * Qoopido promise/defer
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

	global.qoopido.register('promise/defer', definition, dependencies);
}(function(modules, shared, global, undefined) {
	'use strict';

	return function defer() {
		var self = this;

		self.promise = new global.Promise(function(resolve, reject) {
			self.resolve = resolve;
			self.reject  = reject;
		});
	};
}, this));