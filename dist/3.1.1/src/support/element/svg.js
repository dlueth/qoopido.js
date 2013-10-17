/*
 * Qoopido support/element/svg
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../support
 */

;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support/element/svg', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document) {
	'use strict';

	return modules['support'].addTest('/element/svg', function(deferred) {
		(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) ? deferred.resolve() : deferred.reject();
	});
}, window));