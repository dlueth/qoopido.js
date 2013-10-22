/*
 * Qoopido support/capability/datauri
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
 * @require ../../dom/element
 * @require ../../pool/dom
 */

;(function(definition) {
	window.qoopido.register('support/capability/datauri', definition, [ '../../support', '../../dom/element', '../../pool/dom' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return modules['support'].addTest('/capability/datauri', function(deferred) {
		var sample = modules['dom/element'].create(shared.pool.dom.obtain('img'));

		sample
			.one('error load', function(event) {
				if(event.type === 'load' && sample.element.width === 1 && sample.element.height === 1) {
					deferred.resolve();
				} else {
					deferred.reject();
				}

				sample.element.dispose();
			}, false)
			.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
	});
}));