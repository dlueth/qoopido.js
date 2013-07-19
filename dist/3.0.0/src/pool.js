/*
 * Qoopido pool
 *
 * Provides global pooling facilities
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require ./function/unique/uuid
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('pool', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base', './function/unique/uuid' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace) {
	'use strict';

	var prototype,
		settings = {
			interval:    15,
			frameBudget: 0.5,
			maxPoolsize: 1000,
			queueFactor: 0.2
		};

	function processQueue() {
		var self        = this,
			metrics     = self.metrics,
			settings    = self._settings,
			queue       = self._queue,
			variables   = self._variables,
			spliceLimit = 1,
			spliceLength, elements, i, element, durationStart;

		if(queue.length > 0) {
			if(variables.durationAverage > 0) {
				spliceLimit = ~~(((spliceLimit = settings.frameBudget / variables.durationAverage) < 1) ? 1 : spliceLimit);
			}

			if((spliceLength = (elements = queue.splice(0, spliceLimit)).length) > 0) {
				if(metrics.inPool + spliceLength <= settings.maxPoolsize) {
					durationStart = new Date().getTime();

					for(i = 0, element = elements[i]; i < spliceLength; i++) {
						self._getPool.call(self, element).push(self._dispose(element));
					}

					metrics.inPool            += spliceLength;
					metrics.inQueue           -= spliceLength;
					variables.durationSamples += spliceLength;
					variables.durationTotal   += new Date().getTime() - durationStart;
					variables.durationAverage  = variables.durationTotal / variables.durationSamples;
				} else {
					elements           = queue.splice(0, ~~(queue.length * settings.queueFactor));
					metrics.inQueue   -= spliceLength + elements.length;
					metrics.destroyed += spliceLength + elements.length;
					elements.length    = 0;
				}
			}
		}
	}

	prototype = modules['base'].extend({
		metrics: {
			total:     0,
			inPool:    0,
			inUse:     0,
			inQueue:   0,
			recycled:  0,
			destroyed: 0
		},
		_settings: null,
		_pool:     null,
		_queue:    [],
		_variables: {
			durationSamples: 0,
			durationTotal:   0,
			durationAverage: 0
		},
		_constructor: function(options) {
			var self = this;

			self._settings    = modules['function/merge']({}, settings, options);
			self._pool        = self._initPool();

			setInterval(function() { processQueue.call(self); }, self._settings.interval);
		},
		_initPool: function() {
			return [];
		},
		_getPool: function() {
			return this._pool;
		},
		obtain: function() {
			var self    = this,
				element = self._getPool.apply(self, arguments).pop();

			if(element) {
				self.metrics.inPool--;
				self.metrics.recycled++;
			} else {
				element = self._obtain.apply(self, arguments);

				self.metrics.total++;
			}

			self.metrics.inUse++;

			element._quid = modules['function/unique/uuid']();

			return element;
		},
		dispose: function(element) {
			var self  = this,
				queue = self._queue;

			if(!element._quid) {
				element._quid = modules['function/unique/uuid']();

				self.metrics.total++;
				self.metrics.inUse++;
			}

			if(queue.length < self._settings.maxPoolsize) {
				queue.push(element);

				self.metrics.inUse--;
				self.metrics.inQueue++;
			} else {
				self.metrics.inUse--;
				self.metrics.destroyed++;
			}

			return null;
		}
	});

	return prototype;
}, window));