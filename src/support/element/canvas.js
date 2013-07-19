;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/canvas', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support', '../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/canvas', function(deferred) {
		var sample = window.qoopido.shared.pool.dom.obtain('canvas');

		(sample.getContext && sample.getContext('2d')) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}, window));