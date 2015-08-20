/*
 * Qoopido support/capability/datauri
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
 * @require ../../dom/element
 */

;(function(definition, global) {
	global.qoopido.register('support/capability/datauri', definition, [ '../../support', '../../dom/element' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var Support = qoopido.module('support');

	return Support.register('capability/datauri', function(deferred) {
		var sample = qoopido.module('dom/element').create(Support.pool ? Support.pool.obtain('img') : document.createElement('img'));

		sample
			.one('error load', function(event) {
				if(event.type === 'load' && sample.element.width === 1 && sample.element.height === 1) {
					deferred.resolve(true);
				} else {
					deferred.reject(false);
				}

				sample.element.dispose && sample.element.dispose();
			}, false)
			.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
	});
}, this));