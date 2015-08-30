/**
 * Qoopido component/iterator
 *
 * Provides UI independent iterator mechanics
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../emitter
 * @require ../function/merge
 * @require ../function/unique/uuid
 *
 * @polyfill Object.defineProperty
 */

;(function(undefined) {
	'use strict';

	var o_dp    = Object.defineProperty,
		gcd     = function(value, writable) { return { writable: !!writable, configurable: false, enumerable: false, value: value };},
		storage = {};

	function definition(Emitter, functionMerge, functionUniqueUuid) {
		var prototype;

		function Iterator(data, settings) {
			var self = this.super.call(this),
				uuid = self.uuid;

			!uuid && (uuid = functionUniqueUuid()) && o_dp(self, 'uuid', gcd(uuid));

			storage[uuid] = {
				settings: functionMerge({}, Iterator.settings, settings),
				length:   null,
				index:    null,
				current:  null,
				data:     null
			};

			data && self.setData(data);

			return self;
		}

		Iterator.prototype = {
			setData: function(data) {
				var self = this,
					uuid, properties, settings;

				if(typeof data === 'object' && data.length) {
					uuid       = self.uuid;
					properties = storage[uuid];
					settings   = properties.settings;

					properties.data   = data;
					properties.length = data.length;

					if(settings.initial !== null) {
						self.seek(settings.initial);
					}
				}

				return self;
			},
			getState: function() {
				return this.state;
			},
			getLength: function() {
				return this.state.length;
			},
			getIndex: function() {
				return this.state.index;
			},
			getCurrent: function() {
				return this.state.current;
			},
			getItem: function(index) {
				return this.state.data[index];
			},
			getData: function() {
				return this.state.data;
			},
			seek: function(index) {
				var self       = this,
					properties = storage[self.uuid];

				index = parseInt(index, 10);

				if(index !== properties.index && typeof properties.data[index] !== 'undefined') {
					properties.index   = index;
					properties.current = properties.data[index];
				}

				return self;
			},
			first: function() {
				return this.seek(0);
			},
			last: function() {
				var self       = this,
					properties = storage[self.uuid];

				return self.seek(properties.length - 1);
			},
			previous: function() {
				var self       = this,
					uuid       = self.uuid,
					properties = storage[uuid],
					settings   = properties.settings,
					index;

				index = (settings.loop === true) ? (properties.index - 1) % properties.length : properties.index - 1;
				index = (settings.loop === true && index < 0) ? properties.length + index : index;

				return self.seek(index);
			},
			next: function() {
				var self       = this,
					uuid       = self.uuid,
					properties = storage[uuid],
					settings   = properties.settings,
					index;

				index = (settings.loop === true) ? (properties.index + 1) % properties.length : properties.index + 1;

				return self.seek(index);
			}
		};

		prototype          = Emitter.extend(Iterator);
		prototype.settings = { loop: true, initial: 0 };

		return prototype;
	}

	provide(definition).when('../emitter', '../function/merge', '../function/unique/uuid');
}());