;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/video', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support', '../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window) {
	'use strict';

	return modules['support'].addTest('/element/video', function(deferred) {
		var sample = window.qoopido.shared.pool.dom.obtain('video');

		(sample.canPlayType) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}, window));