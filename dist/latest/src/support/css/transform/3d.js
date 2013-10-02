/*
 * Qoopido support/css/transform/3d
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../../support
 * @require ../transform
 * @require ../../../pool/dom
 */

;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/css/transform/3d', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../transform', '../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/transform/3d', function(deferred) {
		modules['support/css/transform']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('div');

				try {
					sample.style.property = 'translate3d(0,0,0)';
				} catch(exception) { }

				((/translate3d/).test(sample.style.property)) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));