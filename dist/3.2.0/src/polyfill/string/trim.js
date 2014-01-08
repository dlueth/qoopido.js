/*
 * Qoopido polyfill/string/trim
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
;(function(definition) {
	window.qoopido.register('polyfill/string/trim', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!String.prototype.trim) {
		var regex = new RegExp('^\\s+|\\s+$', 'g');

		String.prototype.trim = function () {
			return this.replace(regex, '');
		};
	}

	return true;
}));