;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/rgba',
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

	return mSupport.addTest('/css/rgba', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.backgroundColor = 'rgba(150,255,150,.5)';
		} catch(exception) { }

		((/rgba/).test(element.style.backgroundColor)) ? deferred.resolve() : deferred.reject();
	});
}, window, document));