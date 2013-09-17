/*
 * Qoopido polyfill/document/queryselector
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(definition) {
	'use strict';

	if(typeof define === 'function' && define.amd) {
		var dependencies = [];

		if(!Object.defineProperty) {
			dependencies.push('./queryselectorall');
		}

		define(dependencies, definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!document.querySelector) {
		document.querySelector = function(selector) {
			var elements = document.querySelectorAll(selector);

			return (elements.length) ? elements[0] : null;
		};
	}
}));