;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/textshadow', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/textshadow', function(deferred) {
		(modules.support.supportsProperty('text-shadow')) ? deferred.resolve(modules.support.getProperty('text-shadow')) : deferred.reject();
	});
}, window));