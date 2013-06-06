;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/element/canvas/todataurl',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../canvas' ], initialize);
	} else {
		initialize(window.qoopido.support, window.qoopido.support.element.canvas);
	}
}(function(mSupport, mSupportElementCanvas, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/element/canvas/todataurl', function(deferred) {
		mSupportElementCanvas()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL !== undefined) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window, document));