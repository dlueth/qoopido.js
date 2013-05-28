;(function(definition, window, document, undefined) {
	'use strict';

	var namespace = 'qoopido',
		name      = 'support/capability/datauri';

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

	return mSupport.addTest('/capability/datauri', function(deferred) {
		var element = mSupport.getElement('image');

		element.onerror = function() {
			deferred.reject();
		};

		element.onload = function() {
			(element.width === 1 && element.height === 1) ? deferred.resolve() : deferred.reject();
		};

		element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	});
}, window, document));