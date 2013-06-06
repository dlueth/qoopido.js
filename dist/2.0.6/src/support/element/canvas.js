;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/element/canvas',
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

	return mSupport.addTest('/element/canvas', function(deferred) {
		var element = mSupport.getElement('canvas');

		(element.getContext && element.getContext('2d')) ? deferred.resolve() : deferred.reject();
	});
}, window, document));