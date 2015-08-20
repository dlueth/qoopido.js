/*
 * Qoopido support/capability/touch
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

/* global DocumentTouch */

;(function(definition, global) {
	global.qoopido.register('support/capability/touch', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var navigator = global.navigator;

	return qoopido.module('support').register('capability/touch', function(deferred) {
		(('ontouchstart' in global) || (global.DocumentTouch && document instanceof DocumentTouch) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) ? deferred.resolve(true) : deferred.reject(false);
	});
}, this));