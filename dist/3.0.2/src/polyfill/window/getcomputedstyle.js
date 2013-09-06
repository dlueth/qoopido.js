/*
 * Qoopido polyfill/window/getcomputedstyle
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
		define(definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!window.getComputedStyle) {
		var getComputedStyleRegex    = new RegExp('(\\-([a-z]){1})', 'g'),
			getComputedStyleCallback = function() {
				return arguments[2].toUpperCase();
			};

		window.getComputedStyle = function(element, pseudo) {
			var self = this;

			self.element = element;

			self.getPropertyValue = function(property) {
				if(property === 'float') {
					property = 'styleFloat';
				}

				if(getComputedStyleRegex.test(property)) {
					property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
				}

				return element.currentStyle[property] ? element.currentStyle[property] : null;
			};

			return self;
		};
	}
}));