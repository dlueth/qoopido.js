;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/element/canvas/todataurl', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../canvas' ], definition);
	} else {
		definition(window.qoopido.support, window.qoopido.support.element.canvas);
	}
}(function(mSupport, mSupportElementCanvas, namespace, window, document, undefined) {
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
}, window));