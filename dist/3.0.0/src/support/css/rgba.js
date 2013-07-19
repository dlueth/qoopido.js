;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/rgba', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/rgba', function(deferred) {
		var element = modules['support'].getElement('div');

		try {
			element.style.backgroundColor = 'rgba(150,255,150,.5)';
		} catch(exception) { }

		((/rgba/).test(element.style.backgroundColor)) ? deferred.resolve() : deferred.reject();
	});
}, window));