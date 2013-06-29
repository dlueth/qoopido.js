;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/transform', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/transform', function(deferred) {
		(mSupport.supportsProperty('transform')) ? deferred.resolve(mSupport.getProperty('transform')) : deferred.reject();
	});
}, window));