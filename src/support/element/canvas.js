;(function(definition, window, document, undefined) {
	'use strict';

	var namespace = 'qoopido',
		name      = 'support/element/canvas';

	function initialize() {
		[].push.apply(arguments, [ window, document, undefined ]);

		window[namespace] = window[namespace] || { };

		return (window[namespace][name] = definition.apply(null, arguments));
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window[namespace].support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/element/canvas', function(deferred) {
		var element = mSupport.getElement('canvas');

		(element.getContext && element.getContext('2d')) ? deferred.resolve() : deferred.reject();
	});
}, window, document));