;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/rem',
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

	return mSupport.addTest('/css/rem', function(deferred) {
		var element = mSupport.getElement('div');

		try {
			element.style.fontSize = '3rem';
		} catch(exception) { }


		((/rem/).test(element.style.fontSize)) ? deferred.resolve() : deferred.reject();
	});
}, window, document));