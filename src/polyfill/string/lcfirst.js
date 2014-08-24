/*
 * Qoopido polyfill/string/lcfirst
 *
 * Copyright (c) 2014 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
;(function(definition) {
	window.qoopido.register('polyfill/string/lcfirst', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!String.prototype.lcfirst) {
		String.prototype.lcfirst = function() {
			var self = this;

			return self.charAt(0).toLowerCase() + self.slice(1);
		};
	}

	return String.prototype.lcfirst;
}));