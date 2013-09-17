;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/rem', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support', '../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window) {
	'use strict';

	return modules['support'].addTest('/css/rem', function(deferred) {
		var sample = window.qoopido.shared.pool.dom.obtain('div');

		try {
			sample.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(sample.style.fontSize)) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}, window));