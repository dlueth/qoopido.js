/*
 * Qoopido support/element/video/mp4
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
 * @require ../video
 * @require ../../../pool/dom
 */

;(function(definition) {
	window.qoopido.register('support/element/video/mp4', definition, [ '../../../support', '../video', '../../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/video/mp4', function(deferred) {
		modules['support/element/video']()
			.then(function() {
				var sample = shared.pool.dom.obtain('video');

				(sample.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));