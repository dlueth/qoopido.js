/*
 * Qoopido support/css/boxshadow
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
	global.qoopido.register('support/css/boxshadow', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';
	
	var Support = qoopido.module('support');

	return Support.register('css/boxshadow', function(deferred) {
		(Support.supportsCssProperty('box-shadow')) ? deferred.resolve(Support.getCssProperty('box-shadow')) : deferred.reject(false);
	});
}, this));