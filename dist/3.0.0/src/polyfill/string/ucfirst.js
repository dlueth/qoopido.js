/*
 * Qoopido function/unique/string
 *
 * Provides globally unique strings
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
		define( definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	if(!String.prototype.ucfirst) {
		String.prototype.ucfirst = function() {
			var self = this;

			return self.charAt(0).toUpperCase() + self.slice(1);
		};
	}
}));