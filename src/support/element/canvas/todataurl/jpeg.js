;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/element/canvas/todataurl/jpeg', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], definition);
	} else {
		definition(window.qoopido.support, window.qoopido.support.element.canvas.todataurl);
	}
}(function(mSupport, mSupportElementCanvasTodataurl) {
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
}, window));