;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/boxshadow', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/boxshadow', function(deferred) {
		(mSupport.supportsProperty('box-shadow')) ? deferred.resolve(mSupport.getProperty('box-shadow')) : deferred.reject();
	});
}, window));