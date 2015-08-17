/*
 * Qoopido polyfill/element/matches
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ../document/queryselectorall
 */
;(function(definition, global) {
	var dependencies = [];

	if(!document.querySelectorAll) {
		dependencies.push('../document/queryselectorall');
	}

	global.qoopido.register('polyfill/element/matches', definition, dependencies);
}(function(qoopido, global, undefined) {
	'use strict';

	if(!Element.prototype.matches) {
		var prototype = Element.prototype;

		prototype.matches = prototype.matchesSelector = prototype.matchesSelector || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || prototype.oMatchesSelector || function (selector) {
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

	return Element.prototype.matches;
}, this));