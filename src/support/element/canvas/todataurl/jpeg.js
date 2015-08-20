/*
 * Qoopido support/element/canvas/todataurl/jpeg
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../../../support
 * @require ../todataurl
 */

;(function(definition, global) {
	global.qoopido.register('support/element/canvas/todataurl/jpeg', definition, [ '../../../../support', '../todataurl' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.register('element/canvas/todataurl/jpeg', function(deferred) {
		qoopido.module('support/element/canvas/todataurl')()
			.then(
				function() {
					var sample = Support.pool ? Support.pool.obtain('canvas') : document.createElement('canvas');

					(sample.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0) ? deferred.resolve(true) : deferred.reject(false);

					sample.dispose && sample.dispose();
				},
				function() {
					deferred.reject(false);
				}
			);
	});
}, this));