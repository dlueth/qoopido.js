/*
 * Function to calculate the proximity of two given coordinates
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
			return window.qoopido.shared.module.initialize('proximity', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(function(mPrototype, namespace, window, document, undefined) {
	'use strict';

	return mPrototype.extend({
		calculate: function calculate(source, target) {
			var proximity = false;

			source  = (typeof source === 'object' && source !== null) ? source : { x: undefined, y: undefined };
			target  = (typeof target === 'object' && target !== null) ? target : { x: undefined, y: undefined };

			if(source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
				source.x = parseFloat(source.x);
				source.y = parseFloat(source.y);
				target.x = parseFloat(target.x);
				target.y = parseFloat(target.y);

				proximity = {
					x:     parseFloat(Math.abs(target.x - source.x)),
					y:     parseFloat(Math.abs(target.y - source.y)),
					total: parseFloat(Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)))
				};
			}

			return proximity;
		}
	});
}, window));