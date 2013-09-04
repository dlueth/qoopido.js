;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/svg', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document) {
	'use strict';

	return modules['support'].addTest('/element/svg', function(deferred) {
		(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) ? deferred.resolve() : deferred.reject();
	});
}, window));