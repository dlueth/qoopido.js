;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/rgba', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition(window.qoopido.support);
	}
}(function(mSupport) {
	'use strict';

	return mSupport.addTest('/css/rgba', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.backgroundColor = 'rgba(150,255,150,.5)';
		} catch(exception) { }

		((/rgba/).test(element.style.backgroundColor)) ? deferred.resolve() : deferred.reject();
	});
}, window));