;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/capability/datauri', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/capability/datauri', function(deferred) {
		var element = modules.support.getElement('image');

		element.onerror = function() {
			deferred.reject();
		};

		element.onload = function() {
			(element.width === 1 && element.height === 1) ? deferred.resolve() : deferred.reject();
		};

		element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	});
}, window));