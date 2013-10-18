/*
 * Qoopido support/element/video
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../support
 * @require ../../pool/dom
 */

;(function(definition) {
	window.qoopido.register('support/element/video', definition, [ '../../support', '../../pool/dom' ]);
}(function(modules, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/video', function(deferred) {
		var sample = window.qoopido.shared.pool.dom.obtain('video');

		(sample.canPlayType) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}));