;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support/css/transform/2d', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform' ], definition);
	} else {
		definition(window.qoopido.support, window.qoopido.support.css.transform);
	}
}(function(mSupport, mSupportCssTransform) {
	'use strict';

	return mSupport.addTest('/css/transform/2d', function(deferred) {
		mSupportCssTransform()
			.then(function() {
				var element = mSupport.getElement('div', true);

				element.style.property = 'rotate(30deg)';

				((/rotate/).test(element.style.property)) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));