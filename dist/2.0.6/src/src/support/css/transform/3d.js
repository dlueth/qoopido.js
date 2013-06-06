;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/css/transform/3d',
		initialize = function initialize() {
			var id      = (namespace = namespace.split('/')).splice(namespace.length - 1, 1),
				pointer = window;

			for(var i = 0; namespace[i] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			[].push.apply(arguments, [ window, document, undefined ]);

			return (pointer[id] = definition.apply(null, arguments));
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