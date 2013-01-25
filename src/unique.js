/*
 * Qoopido unique class
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'unique',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], initialize);
	} else {
		initialize(window[namespace].base);
	}
}(function(mBase, window, document, undefined) {
	'use strict';

	var result, j, x, i,
		lookup     = { uuid: { }, string: { } },
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	function generateString(length) {
		length = parseInt(length, 10) || 12;
		result = '';

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return mBase.extend({
		uuid: function uuid() {
			do {
				result = generateUuid();
			} while(typeof lookup.uuid[result] !== 'undefined');

			lookup.uuid[result] = true;

			return result;
		},
		string: function string(length) {
			do {
				result = generateString(length);
			} while(typeof lookup.string[result] !== 'undefined');

			lookup.string[result] = true;

			return result;
		}
	});
}, window, document));