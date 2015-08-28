/**
 * Qoopido function/unique/uuid
 *
 * Provides globally unique uuids
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function() {
	'use strict';

	var storage = {},
		regex   = new RegExp('[xy]', 'g');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, function(c) {
			var r = Math.random() * 16 | 0;

			return ((c === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	function definition() {
		return function uuid() {
			var result;

			do {
				result = generateUuid();
			} while(storage[result]);

			storage[result] = 1;

			return result;
		};
	}

	provide(definition);
}());