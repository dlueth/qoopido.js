;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/element/canvas/todataurl/jpeg', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/element/canvas/todataurl/jpeg', function(deferred) {
		modules.support.element.canvas.todataurl()
			.then(function() {
				(modules.support.getElement('canvas').toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));