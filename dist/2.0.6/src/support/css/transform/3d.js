;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/transform/3d',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform' ], initialize);
	} else {
		initialize(window.qoopido.support, window.qoopido.support.css.transform);
	}
}(function(mSupport, mSupportCssTransform, window, document, undefined) {
	'use strict';

	return mSupport.addTest('/css/transform/3d', function(deferred) {
		mSupportCssTransform()
			.then(function() {
				var element = mSupport.getElement('div', true);

				element.style.property = 'translate3d(0,0,0)';

				((/translate3d/).test(element.style.property)) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window, document));