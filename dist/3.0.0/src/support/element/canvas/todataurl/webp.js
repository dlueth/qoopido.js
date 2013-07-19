;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/canvas/todataurl/webp', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl/webp', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(function() {
				(modules['support'].getElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));