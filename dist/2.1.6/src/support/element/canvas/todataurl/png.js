;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/element/canvas/todataurl/png', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], definition);
	} else {
		definition(window.qoopido.support, window.qoopido.support.element.canvas.todataurl);
	}
}(function(mSupport, mSupportElementCanvasTodataurl) {
	'use strict';

	return mSupport.addTest('/element/canvas/todataurl/png', function(deferred) {
		mSupportElementCanvasTodataurl()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));