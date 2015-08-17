/*
 * Qoopido support/css/transform
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
	global.qoopido.register('support/css/transform', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.addTest('/css/transform', function(deferred) {
		(Support.supportsCssProperty('transform')) ? deferred.resolve(Support.getCssProperty('transform')) : deferred.reject();
	});
}, this));