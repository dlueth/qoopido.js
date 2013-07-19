;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/canvas/todataurl', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../canvas', '../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl', function(deferred) {
		modules['support/element/canvas']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('canvas');

				(sample.toDataURL !== undefined) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));