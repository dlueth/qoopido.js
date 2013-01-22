;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/css/borderradius',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'qoopido/support' ], initialize);
	} else {
		initialize(window[namespace].support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	mSupport.addTest('/css/borderradius', function(deferred) {
		(mSupport.supportsProperty('border-radius')) ? deferred.resolve(mSupport.getProperty('border-radius')) : deferred.reject();
	});

	return mSupport.test['/css/borderradius'];
}, window, document));