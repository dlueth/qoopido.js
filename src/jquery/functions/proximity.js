/*
 * jQuery function to calculate the proximity of two given coordinates
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(undefined) {
	'use strict';

	var $name = 'proximity',
		getModule;

	getModule = function getModule($) {
		$[$name] = function(source, target) {
			var proximity = false;

			source  = $.extend({ x: undefined, y: undefined }, source);
			target = $.extend({ x: undefined, y: undefined }, target);

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
		};
	};

	if(typeof define === 'function' && define.amd) {
		define(
			[ 'jquery' ],
			function(jquery) {
				getModule(jquery);

				return true;
			}
		);
	} else {
		getModule(jQuery);
	}
}());