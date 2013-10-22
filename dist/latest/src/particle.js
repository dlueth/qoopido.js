/*
 * Qoopido particle
 *
 * Provides unified particle base
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./emitter
 * @require ./pool/module
 * @require ./vector/2d
 */
;(function(definition) {
	window.qoopido.register('particle', definition, [ './emitter', 'pool/module', './vector/2d' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		poolVector = modules['pool/module'].create(modules['vector/2d']);

	prototype = modules['emitter'].extend({
		_velocity:     null,
		_acceleration: null,
		position:      null,
		velocity:      null,
		acceleration:  null,
		_constructor: function(x, y) {
			this._velocity     = poolVector.obtain(0, 0);
			this._acceleration = poolVector.obtain(0, 0);
			this.position      = poolVector.obtain(x, y);
			this.velocity      = poolVector.obtain(0, 0);
			this.acceleration  = [];

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
			this._velocity     = this._velocity.dispose();
			this._acceleration = this._acceleration.dispose();
			this.position      = this.position.dispose();
			this.velocity      = this.velocity.dispose();
		},
		update: function(factor) {
			factor = (typeof factor !== 'undefined') ? parseFloat(factor) : 1;

			var i, acceleration;

			if(factor !== 1) {
				this._velocity.x = this.velocity.x;
				this._velocity.y = this.velocity.y;
				this._velocity   = this._velocity.multiply(factor);

				for(i = 0; (acceleration = this.acceleration[i]) !== undefined; i++) {
					this._acceleration.x = acceleration.x;
					this._acceleration.y = acceleration.y;
					this._acceleration   = this._acceleration.multiply(factor);

					this._velocity.add(this._acceleration);
				}

				this.position.add(this._velocity);
			} else {
				for(i = 0; (acceleration = this.acceleration[i]) !== undefined; i++) {
					this.velocity.add(acceleration);
				}

				this.position.add(this.velocity);
			}
		}
	});

	return prototype;
}));