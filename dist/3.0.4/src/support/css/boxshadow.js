;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/boxshadow', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/boxshadow', function(deferred) {
		(modules['support'].supportsCssProperty('box-shadow')) ? deferred.resolve(modules['support'].getCssProperty('box-shadow')) : deferred.reject();
	});
}, window));