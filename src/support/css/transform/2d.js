/*
 * Qoopido support/css/transform/2d
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../../support
 * @require ../transform
 */

;(function(definition, global) {
	global.qoopido.register('support/css/transform/2d', definition, [ '../../../support', '../transform' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.addTest('/css/transform/2d', function(deferred) {
		qoopido.module('support/css/transform')()
			.then(
				function() {
					var sample = Support.pool ? Support.pool.obtain('div') : document.createElement('div'),
						property = Support.getCssProperty('transform');

					try {
						sample.style[property] = 'rotate(30deg)';
					} catch(exception) { }

					((/rotate/).test(sample.style[property])) ? deferred.resolve() : deferred.reject();

					sample.dispose && sample.dispose();
				},
				function() {
					deferred.reject();
				}
			);
	});
}, this));