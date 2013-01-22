;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas/todataurl',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'qoopido/support', 'qoopido/support/element/canvas' ], initialize);
	} else {
		initialize(window[namespace].support, window[namespace]['support/element/canvas']);
	}
}(function(mSupport, mSupportElementCanvas, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas/todataurl', function(deferred) {
		mSupportElementCanvas()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL !== undefined) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});

	return mSupport.test['/element/canvas/todataurl'];
}, window, document));