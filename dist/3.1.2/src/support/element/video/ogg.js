/*
 * Qoopido support/element/video/ogg
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
	window.qoopido.register('support/element/video/ogg', definition, [ '../../../support', '../video', '../../../pool/dom' ]);
}(function(modules, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/video/ogg', function(deferred) {
		modules['support/element/video']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('video');

				(sample.canPlayType('video/ogg; codecs="theora, vorbis"')) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}));