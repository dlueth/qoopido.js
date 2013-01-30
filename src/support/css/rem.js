;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/css/rem',
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

	return mSupport.addTest('/css/rem', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(element.style.fontSize)) ? deferred.resolve() : deferred.reject();
	});
}, window, document));