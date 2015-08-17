/*
 * Qoopido support/element/video
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
	global.qoopido.register('support/element/video', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.addTest('/element/video', function(deferred) {
		var sample = Support.pool ? Support.pool.obtain('video') : document.createElement('video');

		(sample.canPlayType) ? deferred.resolve() : deferred.reject();

		sample.dispose && sample.dispose();
	});
}, this));