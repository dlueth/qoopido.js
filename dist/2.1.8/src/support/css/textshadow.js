;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/textshadow', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/textshadow', function(deferred) {
		(mSupport.supportsProperty('text-shadow')) ? deferred.resolve(mSupport.getProperty('text-shadow')) : deferred.reject();
	});
}, window));