/*
 * Qoopido polyfill/object/defineproperties
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

		if(!document.querySelectorAll) {
			dependencies.push('../document/queryselectorall');
		}

		define(dependencies, definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!HTMLElement.prototype.matches) {
		var prototype = HTMLElement.prototype;

		prototype.matches = prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || prototype.oMatchesSelector || function (selector) {
			var elements = this.parentElement.querySelectorAll(selector),
				element,
				i = 0;

				while(element = elements[i++]) {
					if(element === this) {
						return true;
					}
				}

				return false;
			};
	}
}));