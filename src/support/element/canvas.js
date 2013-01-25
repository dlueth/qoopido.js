;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window[namespace].support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas', function(deferred) {
		var element = mSupport.getElement('canvas');

		(element.getContext && element.getContext('2d')) ? deferred.resolve() : deferred.reject();
	});

	return mSupport.test['/element/canvas'];
}, window, document));