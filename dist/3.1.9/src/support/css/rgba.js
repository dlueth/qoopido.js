/*
 * Qoopido support/css/rgba
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
	window.qoopido.register('support/css/rgba', definition, [ '../../support' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var support = modules['support'];

	return support.addTest('/css/rgba', function(deferred) {
		var sample = support.pool ? support.pool.obtain('div') : document.createElement('div');

		try {
			sample.style.backgroundColor = 'rgba(0,0,0,.5)';
		} catch(exception) { }

		((/rgba/).test(sample.style.backgroundColor)) ? deferred.resolve() : deferred.reject();

		sample.dispose && sample.dispose();
	});
}));