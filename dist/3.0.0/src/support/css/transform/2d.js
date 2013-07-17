;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/transform/2d', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/transform/2d', function(deferred) {
		modules.support.css.transform()
			.then(function() {
				var element = modules.support.getElement('div', true);

				element.style.property = 'rotate(30deg)';

				((/rotate/).test(element.style.property)) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));