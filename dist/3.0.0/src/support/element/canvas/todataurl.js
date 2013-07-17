;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/element/canvas/todataurl', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../canvas' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	return modules.support.addTest('/element/canvas/todataurl', function(deferred) {
		modules.support.element.canvas()
			.then(function() {
				(modules.support.getElement('canvas').toDataURL !== undefined) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));