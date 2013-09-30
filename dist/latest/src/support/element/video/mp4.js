;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/video/mp4', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../video', '../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/video/mp4', function(deferred) {
		modules['support/element/video']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('video');

				(sample.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));