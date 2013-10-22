/*
 * Qoopido function/unique/uuid
 *
 * Provides globally unique uuids
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../base
 */
;(function(definition) {
	window.qoopido.register('function/unique/uuid', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var lookup     = {},
		regex      = new RegExp('[xy]', 'g');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	return function() {
		var result;

		do {
			result = generateUuid();
		} while(typeof lookup[result] !== 'undefined');

		lookup[result] = true;

		return result;
	};
}));