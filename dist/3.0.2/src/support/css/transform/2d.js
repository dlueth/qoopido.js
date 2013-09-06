;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/transform/2d', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform', '../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/transform/2d', function(deferred) {
		modules['support/css/transform']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('div');

				try {
					sample.style.property = 'rotate(30deg)';
				} catch(exception) { }

				((/rotate/).test(sample.style.property)) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));