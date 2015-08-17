/*
 * Qoopido support/css/rgba
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
	global.qoopido.register('support/css/rgba', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.addTest('/css/rgba', function(deferred) {
		var sample = Support.pool ? Support.pool.obtain('div') : document.createElement('div');

		try {
			sample.style.backgroundColor = 'rgba(0,0,0,.5)';
		} catch(exception) { }

		((/rgba/).test(sample.style.backgroundColor)) ? deferred.resolve() : deferred.reject();

		sample.dispose && sample.dispose();
	});
}, this));