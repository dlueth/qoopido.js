;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/borderradius',
		initialize = function initialize() {
			var id      = (namespace = namespace.split('/')).splice(namespace.length - 1, 1),
				pointer = window;

			for(var i = 0; namespace[i] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			[].push.apply(arguments, [ window, document, undefined ]);

			return (pointer[id] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window.qoopido.support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/css/borderradius', function(deferred) {
		(mSupport.supportsProperty('border-radius')) ? deferred.resolve(mSupport.getProperty('border-radius')) : deferred.reject();
	});
}, window, document));