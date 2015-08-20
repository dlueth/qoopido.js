/*
 * Qoopido support/element/canvas
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../support
 */

;(function(definition, global) {
	global.qoopido.register('support/element/canvas', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.register('element/canvas', function(deferred) {
		var sample = Support.pool ? Support.pool.obtain('canvas') : document.createElement('canvas');

		(sample.getContext && sample.getContext('2d')) ? deferred.resolve(true) : deferred.reject(false);

		sample.dispose && sample.dispose();
	});
}, this));