/*
 * Qoopido support/css/transform
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
		return window.qoopido.initialize('support/css/transform', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], definition);
	} else {
		definition();
	}
}(function(modules) {
	'use strict';

	return modules['support'].addTest('/css/transform', function(deferred) {
		(modules['support'].supportsCssProperty('transform')) ? deferred.resolve(modules['support'].getCssProperty('transform')) : deferred.reject();
	});
}, window));