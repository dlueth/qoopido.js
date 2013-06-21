;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/borderradius',
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

	return mSupport.addTest('/css/borderradius', function(deferred) {
		(mSupport.supportsProperty('border-radius')) ? deferred.resolve(mSupport.getProperty('border-radius')) : deferred.reject();
	});
}, window, document));