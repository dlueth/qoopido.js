;(function(definition, window, document, undefined) {
	'use strict';

	var namespace = 'qoopido',
		name      = 'support/css/textshadow';

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

	return mSupport.addTest('/css/textshadow', function(deferred) {
		(mSupport.supportsProperty('text-shadow')) ? deferred.resolve(mSupport.getProperty('text-shadow')) : deferred.reject();
	});
}, window, document));