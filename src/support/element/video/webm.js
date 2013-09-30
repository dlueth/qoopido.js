;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/video/webm', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../video', '../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/video/webm', function(deferred) {
		modules['support/element/video']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('video');

				(sample.canPlayType('video/webm; codecs="vp8, vorbis"')) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));