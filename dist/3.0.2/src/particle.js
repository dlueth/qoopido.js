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
		define([ './emitter', './function/merge' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	var prototype,
		defaults = { gravity:  0.06, velocity: { x: 0, y: 0 } };

	prototype = modules['emitter'].extend({
		_settings: null,
		velocity:  null,
		position:  null,
		_constructor: function(x, y, settings) {
			var self = this;

			self._settings = modules['function/merge']({}, defaults, settings);
			self.position  = { current: { x: x || 0, y: y || 0 }, last: { x: x || 0, y: y || 0 } };
			self.velocity  = self._settings.velocity;

			prototype._parent._constructor.call(self);
		},
		_obtain: function(x, y, settings) {
			var self = this;

			self._settings = modules['function/merge'](self._settings, settings);
			self.velocity  = self._settings.velocity;

			self.position.current.x = x || 0;
			self.position.current.y = y || 0;
			self.position.last.x    = x || 0;
			self.position.last.y    = y || 0;
		},
		update: function() {
			var self = this;

			self.position.last       = self.position.current;
			self.velocity.y         += self._settings.gravity;
			self.position.current.x += self.velocity.x;
			self.position.current.y += self.velocity.y;
		}
	});

	return prototype;
}, window));