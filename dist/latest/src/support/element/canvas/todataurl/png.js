;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/canvas/todataurl/png', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl/png', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(function() {
				(modules['support'].getElement('canvas').toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));