/*
 * Qoopido vector/2d
 *
 * Provides 2d vector abstraction
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('vector/2d', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../base' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	var prototype,
		TO_DEGREES = 180 / Math.PI,
		TO_RADIANS = Math.PI / 180,
		temp       = { x: 0, y: 0 };

	prototype = modules['base'].extend({
		x: null,
		y: null,
		_constructor: function(x, y) {
			this.x = x || 0;
			this.y = y || 0;
		},
		_obtain: function(x, y) {
			this.x = x || 0;
			this.y = y || 0;
		},
		getAngle: function(useRadians) {
			return useRadians ? Math.atan2(this.y, this.x) : (Math.atan2(this.y, this.x) * TO_DEGREES) % 360;
		},
		getLength: function(squared) {
			return squared ? (this.x * this.x) + (this.y * this.y) : Math.sqrt((this.x * this.x) + (this.y * this.y));
		},
		rotate: function(angle, useRadians) {
			var cosRY = Math.cos(angle * (useRadians ? 1 : TO_RADIANS)),
				sinRY = Math.sin(angle * (useRadians ? 1 : TO_RADIANS));

			temp.x = this.x;
			temp.y = this.y;

			this.x = (temp.x * cosRY) - (temp.y * sinRY);
			this.y = (temp.x * sinRY) + (temp.y * cosRY);

			return this;
		},
		invert: function() {
			this.x = -this.x;
			this.y = -this.y;

			return this;
		},
		add: function(vector) {
			this.x += (typeof vector === 'object') ? vector.x : vector;
			this.y += (typeof vector === 'object') ? vector.y : vector;

			return this;
		},
		subtract: function(vector) {
			this.x -= (typeof vector === 'object') ? vector.x : vector;
			this.y -= (typeof vector === 'object') ? vector.y : vector;

			return this;
		},
		multiply: function(vector) {
			this.x *= (typeof vector === 'object') ? vector.x : vector;
			this.y *= (typeof vector === 'object') ? vector.y : vector;

			return this;
		},
		divide: function(vector) {
			this.x /= (typeof vector === 'object') ? vector.x : vector;
			this.y /= (typeof vector === 'object') ? vector.y : vector;

			return this;
		}
	});

	return prototype;
}, window));