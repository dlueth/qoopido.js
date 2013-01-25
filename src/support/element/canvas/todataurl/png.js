;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas/todataurl/png',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], initialize);
	} else {
		initialize(window[namespace].support, window[namespace]['support/element/canvas/todataurl']);
	}
}(function(mSupport, mSupportElementCanvasTodataurl, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas/todataurl/png', function(deferred) {
		mSupportElementCanvasTodataurl()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});

	return mSupport.test['/element/canvas/todataurl/png'];
}, window, document));