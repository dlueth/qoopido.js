/*
 * Qoopido particle
 *
 * Provides unified particle base
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./emitter
 * @require ./function/merge
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('particle', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './emitter', 'pool/module', './vector/2d' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	var prototype,
		poolVector = modules['pool/module'].create(modules['vector/2d']);

	prototype = modules['emitter'].extend({
		position:     null,
		velocity:     null,
		acceleration: null,
		_constructor: function(x, y) {
			this.position     = poolVector.obtain(x, y);
			this.velocity     = poolVector.obtain(0, 0);
			this.acceleration = [];

			prototype._parent._constructor.call(this);
		},
		_obtain: function(x, y) {
			this.position.x          = x || 0;
			this.position.y          = y || 0;
			this.velocity.x          = 0;
			this.velocity.y          = 0;
			this.acceleration.length = 0;
		},
		_destroy: function() {
			this.position = this.position.dispose();
			this.velocity = this.velocity.dispose();
		},
		update: function(factor) {
			factor = (typeof factor !== 'undefined') ? parseFloat(factor) : 1;

			var i, acceleration;

			if(factor !== 1) {
				var velocity = poolVector.obtain(this.velocity.x, this.velocity.y).multiply(factor);

				for(i = 0; (acceleration = this.acceleration[i]) !== undefined; i++) {
					acceleration = poolVector.obtain(acceleration.x, acceleration.y).multiply(factor);

					velocity.add(acceleration);

					acceleration = acceleration.dispose();
				}

				this.position.add(velocity);

				velocity = velocity.dispose();
			} else {
				for(i = 0; (acceleration = this.acceleration[i]) !== undefined; i++) {
					this.velocity.add(acceleration);
				}

				this.position.add(this.velocity);
			}
		}
	});

	return prototype;
}, window));