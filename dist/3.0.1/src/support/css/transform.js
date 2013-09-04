;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/transform', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/transform', function(deferred) {
		(modules['support'].supportsProperty('transform')) ? deferred.resolve(modules['support'].getProperty('transform')) : deferred.reject();
	});
}, window));