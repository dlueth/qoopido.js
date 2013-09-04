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
 * @require ./base
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('function/unique/string', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../base' ], definition);
	} else {
		definition();
	}
}(function() {
	'use strict';

	var lookup     = {},
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateString(length) {
		var result = '',
			i;

		length = parseInt(length, 10) || 12;

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return function(length) {
		var result;

		do {
			result = generateString(length);
		} while(typeof lookup[result] !== 'undefined');

		lookup[result] = true;

		return result;
	};
}, window));