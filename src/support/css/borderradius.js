/*
 * Qoopido support/css/borderradius
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
	global.qoopido.register('support/css/borderradius', definition, [ '../../support' ]);
}(function(qoopido, global, undefined) {
	'use strict';
	
	var Support = qoopido.module('support');

	return Support.addTest('/css/borderradius', function(deferred) {
		(Support.supportsCssProperty('border-radius')) ? deferred.resolve(Support.getCssProperty('border-radius')) : deferred.reject();
	});
}, this));