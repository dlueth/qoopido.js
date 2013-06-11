;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/rem',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window.qoopido.support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/css/rem', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(element.style.fontSize)) ? deferred.resolve() : deferred.reject();
	});
}, window, document));