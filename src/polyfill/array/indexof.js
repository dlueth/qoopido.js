/*
 * Qoopido polyfill/array/indexof
 *
 * Borrowed from:
 * https://github.com/jonathantneal/polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @browsers Firefox < 1.5, Internet Explorer < 9
 */
/* global Window, HTMLDocument, Element */
;(function(definition, global) {
	global.qoopido.register('polyfill/array/indexof', definition);
}(function(modules, shared, global, undefined) {
	'use strict';

	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function indexOf(element) {
			var array = this,
				i = 0;

			for(; array[i] !== undefined; ++i) {
				if(array[i] === element) {
					return i;
				}
			}

			return -1;
		};
	}

	return Array.prototype.indexOf;
}, this));