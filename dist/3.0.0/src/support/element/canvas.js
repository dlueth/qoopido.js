;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/element/canvas', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/element/canvas', function(deferred) {
		var element = modules.support.getElement('canvas');

		(element.getContext && element.getContext('2d')) ? deferred.resolve() : deferred.reject();
	});
}, window));