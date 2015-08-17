/*
 * Qoopido polyfill/document/queryselector
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./queryselectorall
 */
;(function(definition, global) {
	var dependencies = [];

	if(!document.querySelectorAll) {
		dependencies.push('./queryselectorall');
	}

	global.qoopido.register('polyfill/document/queryselector', definition, dependencies);
}(function(qoopido, global, undefined) {
	'use strict';

	var document = global.document;

	if(!document.querySelector) {
		document.querySelector = function(selector) {
			var elements = document.querySelectorAll(selector);

			return (elements.length) ? elements[0] : null;
		};
	}

	return document.querySelector;
}, this));