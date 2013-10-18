/*
 * Qoopido support/element/canvas/todataurl/png
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
 * @require ../../../../pool/dom
 */

;(function(definition) {
	window.qoopido.register('support/element/canvas/todataurl/png', definition, [ '../../../../support', '../todataurl', '../../../../pool/dom' ]);
}(function(modules, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl/png', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('canvas');

				(sample.toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));