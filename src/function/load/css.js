/*
 * Qoopido function/load/css
 *
 * Function to deep merge any number of data structures. First argument is the target and will be modified!
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
	global.qoopido.register('function/load/css', definition);
}(function(modules, shared, global, undefined) {
	'use strict';

	var document = global.document,
		storage  = {};

	return function load(url, media) {
		media = media || 'all';

		var id   = url + ':' + media,
			link = storage[id],
			target;

		if(!link) {
			link   = storage[id] = document.createElement('link');
			target = document.getElementsByTagName('script')[0];

			link.rel   = 'stylesheet';
			link.media = 'only x';
			link.href  = url;

			target.parentNode.insertBefore(link, target);

			global.setTimeout(function() {
				link.media = media;
			});
		}

		return link;
	};
}, this));