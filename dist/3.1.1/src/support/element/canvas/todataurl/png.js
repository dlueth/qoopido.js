/*
 * Qoopido support/element/canvas/todataurl/png
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../../../support
 * @require ../todataurl
 * @require ../../../../pool/dom
 */

;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/canvas/todataurl/png', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl', '../../../../pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/element/canvas/todataurl/png', function(deferred) {
		modules['support/element/canvas/todataurl']()
			.then(function() {
				var sample = window.qoopido.shared.pool.dom.obtain('canvas');

				(sample.toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();

				sample.dispose();
			})
			.fail(function() {
				deferred.reject();
			});
	});
}, window));