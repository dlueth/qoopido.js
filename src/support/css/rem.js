/*
 * Qoopido support/css/rem
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
	global.qoopido.register('support/css/rem', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.register('css/rem', function(deferred) {
		var sample = Support.pool ? Support.pool.obtain('div') : document.createElement('div');

		try {
			sample.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(sample.style.fontSize)) ? deferred.resolve(true) : deferred.reject(false);

		sample.dispose && sample.dispose();
	});
}, this));