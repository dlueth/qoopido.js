;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/rem', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/rem', function(deferred) {
		var element = modules.support.getElement('div');

		try {
			element.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(element.style.fontSize)) ? deferred.resolve() : deferred.reject();
	});
}, window));