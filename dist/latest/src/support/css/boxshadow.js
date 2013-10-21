/*
 * Qoopido support/css/boxshadow
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

;(function(definition) {
	window.qoopido.register('support/css/boxshadow', definition, [ '../../support' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/css/boxshadow', function(deferred) {
		(modules['support'].supportsCssProperty('box-shadow')) ? deferred.resolve(modules['support'].getCssProperty('box-shadow')) : deferred.reject();
	});
}));