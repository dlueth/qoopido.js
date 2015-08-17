/*
 * Qoopido polyfill/string/ucfirst
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
	global.qoopido.register('polyfill/string/ucfirst', definition);
}(function(qoopido, global, undefined) {
	'use strict';

	if(!String.prototype.ucfirst) {
		String.prototype.ucfirst = function() {
			var self = this;

			return self.charAt(0).toUpperCase() + self.slice(1);
		};
	}

	return String.prototype.ucfirst;
}, this));