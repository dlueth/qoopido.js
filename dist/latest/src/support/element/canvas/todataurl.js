/*
 * Qoopido support/element/canvas/todataurl
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../../support
 * @require ../canvas
 * @require ../../../pool/dom
 */

;(function(definition) {
	window.qoopido.register('support/element/canvas/todataurl', definition, [ '../../../support', '../canvas', '../../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl', function(deferred) {
		modules['support/element/canvas']()
			.then(function() {
				var sample = shared.pool.dom.obtain('canvas');

				(sample.toDataURL !== undefined) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));