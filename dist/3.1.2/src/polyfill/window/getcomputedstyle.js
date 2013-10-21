/*
 * Qoopido polyfill/window/getcomputedstyle
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
	window.qoopido.register('polyfill/window/getcomputedstyle', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
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

	return true;
}));