/*
 * Qoopido polyfill/document/queryselector
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./queryselectorall
 */
;(function(definition) {
	var dependencies = [];

	if(!Object.defineProperty) {
		dependencies.push('./queryselectorall');
	}

	window.qoopido.register('polyfill/document/queryselector', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!document.querySelector) {
		document.querySelector = function(selector) {
			var elements = document.querySelectorAll(selector);

			return (elements.length) ? elements[0] : null;
		};
	}

	return true;
}));