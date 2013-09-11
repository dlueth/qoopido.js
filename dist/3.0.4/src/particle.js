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
		lifetime:     null,
		velocity:     null,
		acceleration: null,
		_constructor: function(x, y, lifetime) {
			this.position     = poolVector.obtain(x, y);
			this.lifetime     = lifetime || 0;
			this.velocity     = poolVector.obtain(0, 0);
			this.acceleration = [];

			prototype._parent._constructor.call(this);
		},
		_obtain: function(x, y, lifetime) {
			this.position.x          = x || 0;
			this.position.y          = y || 0;
			this.lifetime            = lifetime || 0;
			this.velocity.x          = 0;
			this.velocity.y          = 0;
			this.acceleration.length = 0;
		},
		_destroy: function() {
			this.position.dispose();
			this.velocity.dispose();

			this.position = null;
			this.velocity = null;
		},
		update: function() {
			var i, acceleration;

			for(i = 0; (acceleration = this.acceleration[i]) !== undefined; i++) {
				this.velocity.add(acceleration);
			}

			this.position.add(this.velocity);
		}
	});

	return prototype;
}, window));