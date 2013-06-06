;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/textshadow',
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

	return mSupport.addTest('/css/textshadow', function(deferred) {
		(mSupport.supportsProperty('text-shadow')) ? deferred.resolve(mSupport.getProperty('text-shadow')) : deferred.reject();
	});
}, window, document));