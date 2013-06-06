;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/element/canvas/todataurl/jpeg',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], initialize);
	} else {
		initialize(window.qoopido.support, window.qoopido.support.element.canvas.todataurl);
	}
}(function(mSupport, mSupportElementCanvasTodataurl, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/element/canvas/todataurl/jpeg', function(deferred) {
		mSupportElementCanvasTodataurl()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window, document));