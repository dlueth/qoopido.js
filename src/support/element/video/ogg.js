/*
 * Qoopido support/element/video/ogg
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
 * @require ../video
 */

;(function(definition, global) {
	global.qoopido.register('support/element/video/ogg', definition, [ '../../../support', '../video' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.register('element/video/ogg', function(deferred) {
		qoopido.module('support/element/video')()
			.then(
				function() {
					var sample = Support.pool ? Support.pool.obtain('video') : document.createElement('video');

					(sample.canPlayType('video/ogg; codecs="theora, vorbis"')) ? deferred.resolve(true) : deferred.reject(false);

					sample.dispose && sample.dispose();
				},
				function() {
					deferred.reject(false);
				}
			);
	});
}, this));