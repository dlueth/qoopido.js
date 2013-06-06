;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/transform',
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

	return mSupport.addTest('/css/transform', function(deferred) {
		(mSupport.supportsProperty('transform')) ? deferred.resolve(mSupport.getProperty('transform')) : deferred.reject();
	});
}, window, document));