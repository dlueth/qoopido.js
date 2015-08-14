/*
 * Qoopido polyfill/window/getcomputedstyle
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @browsers Internet Explorer < 9
 */
;(function(definition, global) {
	global.qoopido.register('polyfill/window/getcomputedstyle', definition);
}(function(modules, shared, global, undefined) {
	'use strict';

	if(!global.getComputedStyle) {
		var getComputedStyleRegex    = new RegExp('(\\-([a-z]){1})', 'g'),
			getComputedStyleCallback = function() {
				return arguments[2].toUpperCase();
			};

		return function(element, pseudo) {
			var self = this;

			self.getPropertyValue = function(property) {
				if(property === 'float') {
					property = 'styleFloat';
				}

				if(getComputedStyleRegex.test(property)) {
					property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
				}

				return element.currentStyle[property] || null;
			};

			return self;
		};
	} else {
		return global.getComputedStyle;
	}
}, this));