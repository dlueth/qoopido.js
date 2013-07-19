;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/rgba', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support', '../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/rgba', function(deferred) {
		var sample = window.qoopido.shared.pool.dom.obtain('div');

		try {
			sample.style.backgroundColor = 'rgba(150,255,150,.5)';
		} catch(exception) { }

		((/rgba/).test(sample.style.backgroundColor)) ? deferred.resolve() : deferred.reject();

		sample.dispose();
	});
}, window));