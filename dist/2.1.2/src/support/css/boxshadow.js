;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/boxshadow',
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

	return mSupport.addTest('/css/boxshadow', function(deferred) {
		(mSupport.supportsProperty('box-shadow')) ? deferred.resolve(mSupport.getProperty('box-shadow')) : deferred.reject();
	});
}, window, document));