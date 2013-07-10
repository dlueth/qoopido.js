;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('support/css/transform/3d', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules.support.addTest('/css/transform/3d', function(deferred) {
		modules.support.css.transform()
			.then(function() {
				var element = modules.support.getElement('div', true);

				element.style.property = 'translate3d(0,0,0)';

				((/translate3d/).test(element.style.property)) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));