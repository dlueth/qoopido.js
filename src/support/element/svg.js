/*
 * Qoopido support/element/svg
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../support
 */

;(function(definition, global) {
	global.qoopido.register('support/element/svg', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var document = global.document;

	return qoopido.module('support').register('element/svg', function(deferred) {
		(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) ? deferred.resolve(true) : deferred.reject(false);
	});
}, this));