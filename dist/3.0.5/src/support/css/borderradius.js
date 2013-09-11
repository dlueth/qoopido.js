;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/borderradius', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/borderradius', function(deferred) {
		(modules['support'].supportsCssProperty('border-radius')) ? deferred.resolve(modules['support'].getCssProperty('border-radius')) : deferred.reject();
	});
}, window));