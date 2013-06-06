;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/support/element/canvas/todataurl',
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