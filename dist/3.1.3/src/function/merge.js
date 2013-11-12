/*
 * Qoopido function/merge
 *
 * Function to deep merge any number of data structures. First argument is the target and will be modified!
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../base
 */
;(function(definition) {
	window.qoopido.register('function/merge', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	return function merge() {
		var target = arguments[0],
			i, properties, property, tgt, src;

		for(i = 1; (properties = arguments[i]) !== undefined; i++) {
			for(property in properties) {
				tgt = target[property];
				src = properties[property];

				if(src !== undefined) {
					if(src !== null && typeof src === 'object') {
						if(src.length !== undefined) {
							tgt = (tgt && typeof tgt === 'object' && tgt.length !== undefined) ? tgt : [];
						} else {
							tgt = (tgt && typeof tgt === 'object' && tgt.length === undefined) ? tgt : {};
						}

						target[property] = merge(tgt, src);
					} else {
						target[property] = src;
					}
				}
			}
		}

		return target;
	};
}));