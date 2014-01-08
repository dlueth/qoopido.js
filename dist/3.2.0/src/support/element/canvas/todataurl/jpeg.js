/*
 * Qoopido support/element/canvas/todataurl/jpeg
 *
 * Copyright (c) 2013 Dirk Lueth
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

;(function(definition) {
	window.qoopido.register('support/element/canvas/todataurl/jpeg', definition, [ '../../../../support', '../todataurl' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var support = modules['support'];

	return support.addTest('/element/canvas/todataurl/jpeg', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(
				function() {
					var sample = support.pool ? support.pool.obtain('canvas') : document.createElement('canvas');

					(sample.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0) ? deferred.resolve() : deferred.reject();

					sample.dispose && sample.dispose();
				},
				function() {
					deferred.reject();
				}
			)
			.done();
	});
}));