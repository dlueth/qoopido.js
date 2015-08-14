/*
 * Qoopido polyfill/document/queryselectorall
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
 */
;(function(definition, global) {
	global.qoopido.register('polyfill/document/queryselectorall', definition);
}(function(modules, shared, global, undefined) {
	'use strict';

	var document = global.document;

	if(!document.querySelectorAll) {
		document.querySelectorAll = function(selector) {
			var target   = document.getElementsByTagName('script')[0],
				style    = document.createElement('style'),
				elements = [],
				element;

			target.parentNode.insertBefore(style, target);
			document._qsa = [];

			style.styleSheet.cssText = selector + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';

			global.scrollBy(0, 0);
			style.parentNode.removeChild(style);

			while(document._qsa.length) {
				element = document._qsa.shift();

				element.style.removeAttribute('x-qsa');
				elements.push(element);
			}

			try {
				delete document._qsa;
			} catch(exception) {
				document._qsa = null;
			}

			return elements;
		};
	}

	return document.querySelectorAll;
}, this));