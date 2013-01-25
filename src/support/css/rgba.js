;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/css/rgba',
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

	mSupport.addTest('/css/rgba', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.backgroundColor = 'rgba(150,255,150,.5)';
		} catch(exception) { }

		((/rgba/).test(element.style.backgroundColor)) ? deferred.resolve() : deferred.reject();
	});

	return mSupport.test['/css/rgba'];
}, window, document));