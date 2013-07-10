;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/borderradius', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/borderradius', function(deferred) {
		(modules.support.supportsProperty('border-radius')) ? deferred.resolve(modules.support.getProperty('border-radius')) : deferred.reject();
	});
}, window));