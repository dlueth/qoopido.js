/*
 * Qoopido proxy
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
 * @require ./function/unique/uuid
 */
;(function(definition, global) {
	global.qoopido.register('proxy', definition, [ './base', './function/unique/uuid' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var uniqueUuid = qoopido.module('function/unique/uuid');

	return qoopido.module('base').extend({
		_constructor: function(context, fn) {
			var args  = Array.prototype.splice.call(arguments, 2),
				proxy = function() {
					return fn.apply(context, Array.prototype.slice.call(arguments).concat(args));
				};

			proxy._quid = uniqueUuid();

			return proxy;
		}
	});
}, this));