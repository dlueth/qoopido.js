;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/capability/datauri', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/capability/datauri', function(deferred) {
		var element = mSupport.getElement('image');

		element.onerror = function() {
			deferred.reject();
		};

		element.onload = function() {
			(element.width === 1 && element.height === 1) ? deferred.resolve() : deferred.reject();
		};

		element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	});
}, window));