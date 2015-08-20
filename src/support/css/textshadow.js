/*
 * Qoopido support/css/textshadow
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
	global.qoopido.register('support/css/textshadow', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';
	
	var Support = qoopido.module('support');
	
	return Support.register('css/textshadow', function(deferred) {
		(Support.supportsCssProperty('text-shadow')) ? deferred.resolve(Support.getCssProperty('text-shadow')) : deferred.reject(false);
	});
}, this));