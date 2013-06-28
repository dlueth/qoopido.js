/*
 * Qoopido data pager
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require ./emitter
 */

;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('pager', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './emitter', 'jquery' ], definition);
	} else {
		definition(window.qoopido.emitter, window.jQuery);
	}
}(function(mPrototype, mJquery, namespace, window, document, undefined) {
	'use strict';

	var defaultSettings = { loop: true, initial: 0 };

	return mPrototype.extend({
		_settings: null,
		_state:    null,
		_constructor: function _constructor(data, settings) {
			var self = this;

			self._parent._constructor.call(self);

			self._settings = mJquery.extend(true, {}, defaultSettings, settings || {});
			self._state    = { length: null, index: null, item: null, data: null };

			if(data !== undefined && data !== null) {
				self.setData(data);
			}
		},
		getState: function getState() {
			var self = this;

			return self._state;
		},
		setData: function setData(data) {
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
		getData: function getData(index) {
			var self = this;

			return self._state.data;
		},
		getLength: function getLength() {
			var self = this;

			return self._state.length;
		},
		getIndex: function getIndex() {
			var self = this;

			return self._state.index;
		},
		getItem: function getItem(index) {
			var self = this;

			if(self._state.data[index] !== undefined) {
				return self._state.data[index];
			}

			return null;
		},
		first: function first() {
			var self = this;

			return self.seek(0);
		},
		last: function last() {
			var self = this;

			return self.seek(self._state.length - 1);
		},
		previous: function previous() {
			var self = this, index;

			index = (self._settings.loop === true) ? (self._state.index - 1) % self._state.length : self._state.index - 1;
			index = (self._settings.loop === true && index < 0) ? self._state.length + index : index;

			return self.seek(index);
		},
		next: function next() {
			var self = this, index;

			index = (self._settings.loop === true) ? (self._state.index + 1) % self._state.length : self._state.index + 1;

			return self.seek(index);
		},
		seek: function seek(index) {
			var self = this;

			index  = parseInt(index, 10);

			if(index !== self._state.index && self._state.data[index] !== undefined) {
				self._state.index = index;
				self._state.item  = self._state.data[index];
			}

			return self;
		}
	});
}, window));