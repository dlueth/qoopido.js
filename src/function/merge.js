/*
 * Qoopido function merge
 *
 * Function to deep merge any number of data structures. First argument is the target and will be modified!
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../base
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('function/merge', pDefinition);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../base' ], definition);
	} else {
		definition();
	}
}(function(modules, namespace, window, document, undefined) {
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
}, window));