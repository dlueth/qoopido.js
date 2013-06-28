;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/borderradius', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/borderradius', function(deferred) {
		(mSupport.supportsProperty('border-radius')) ? deferred.resolve(mSupport.getProperty('border-radius')) : deferred.reject();
	});
}, window));