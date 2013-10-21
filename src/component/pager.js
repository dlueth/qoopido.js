/*
 * Qoopido component/pager
 *
 * Proves UI independent paging mechanics
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../emitter
 * @require ../function/merge
 */

;(function(definition) {
	window.qoopido.register('component/pager', definition, [ '../emitter', '../function/merge' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		defaultSettings = { loop: true, initial: 0 };

	prototype = modules['emitter'].extend({
		_settings: null,
		_state:    null,
		_constructor: function(data, settings) {
			var self = this;

			prototype._parent._constructor.call(self);

			self._settings = modules['function/merge']({}, defaultSettings, settings || {});
			self._state    = { length: null, index: null, item: null, data: null };

			if(data !== undefined && data !== null) {
				self.setData(data);
			}
		},
		getState: function() {
			var self = this;

			return self._state;
		},
		setData: function(data) {
			var self = this;

			if(typeof data === 'object') {
				self._state.data   = data;
				self._state.length = data.length;

				if(self._settings.initial !== null) {
					self.seek(self._settings.initial);
				}
			}

			return self;
		},
		getData: function() {
			var self = this;

			return self._state.data;
		},
		getLength: function() {
			var self = this;

			return self._state.length;
		},
		getIndex: function() {
			var self = this;

			return self._state.index;
		},
		getItem: function(index) {
			var self = this;

			if(self._state.data[index] !== undefined) {
				return self._state.data[index];
			}

			return null;
		},
		first: function() {
			var self = this;

			return self.seek(0);
		},
		last: function() {
			var self = this;

			return self.seek(self._state.length - 1);
		},
		previous: function() {
			var self = this, index;

			index = (self._settings.loop === true) ? (self._state.index - 1) % self._state.length : self._state.index - 1;
			index = (self._settings.loop === true && index < 0) ? self._state.length + index : index;

			return self.seek(index);
		},
		next: function() {
			var self = this, index;

			index = (self._settings.loop === true) ? (self._state.index + 1) % self._state.length : self._state.index + 1;

			return self.seek(index);
		},
		seek: function(index) {
			var self = this;

			index  = parseInt(index, 10);

			if(index !== self._state.index && self._state.data[index] !== undefined) {
				self._state.index = index;
				self._state.item  = self._state.data[index];
			}

			return self;
		}
	});

	return prototype;
}));