/*
 * Qoopido proxy
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./base
 * @require ./function/unique/uuid
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('proxy', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base', './function/unique/uuid' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['base'].extend({
		_constructor: function(context, fn) {
			var args  = Array.prototype.splice.call(arguments, 2),
				proxy = function() {
					return fn.apply(context, Array.prototype.slice.call(arguments, 0).concat(args));
				};

			proxy._quid = modules['function/unique/uuid']();

			return proxy;
		}
	});
}, window));