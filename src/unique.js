/*
 * Qoopido unique class
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

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('unique', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	var result, x, i,
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

	return mPrototype.extend({
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
}, window));