;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/rem', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/rem', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(element.style.fontSize)) ? deferred.resolve() : deferred.reject();
	});
}, window));