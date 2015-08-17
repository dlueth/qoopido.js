/*
 * Qoopido pool/array
 *
 * Provides array pooling facilities
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../pool
 */
;(function(definition, global) {
	global.qoopido.register('pool/array', definition, [ '../pool' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var prototype = qoopido.module('pool').extend({
		_dispose: function(element) {
			element.length = 0;

			return element;
		},
		_obtain: function() {
			return [];
		}
	});

	qoopido.shared()['pool/array'] = prototype.create();

	return prototype;
}, this));