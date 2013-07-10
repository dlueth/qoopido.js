;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/boxshadow', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/boxshadow', function(deferred) {
		(modules.support.supportsProperty('box-shadow')) ? deferred.resolve(modules.support.getProperty('box-shadow')) : deferred.reject();
	});
}, window));