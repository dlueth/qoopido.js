/*
 * Qoopido renderer
 *
 * Provides a centralized rendering pipeline via requestAnimationFrame
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./emitter
 * @require ./support
 * @require ./dom/element
 */
;(function(definition, global) {
	global.qoopido.registerSingleton('renderer', definition, [ './emitter', './support', './dom/element' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	function requestAnimationFrameFallback(callback) {
		return global.setTimeout(callback, targetInterval);
	}

	var prototype,
		Support              = qoopido.module('support'),
		document              = global.document,
		qDocument             = qoopido.module('dom/element').create(document),
		requestAnimationFrame = global[Support.getMethod('requestAnimationFrame')] || requestAnimationFrameFallback,
		cancelAnimationFrame  = global[Support.getMethod('cancelAnimationFrame')] || clearTimeout,
		visibilityProperty    = Support.getProperty('hidden', document),
		targetFramerate       = 60,
		targetInterval        = 1000 / targetFramerate,
		pausedAt, pausedDuration, interval, timeStart, timeNow, timeLast, timeDelta, frames = 0;

	function onVisibilityChange() {
		var self = this;

		if(document[visibilityProperty]) {
			if(interval) {
				pausedAt    = new Date().getTime();
				self.paused = true;

				cancelAnimationFrame(interval);
				interval = null;

				self.emit('suspend');
			}
		} else {
			if(!interval) {
				self.paused = false;

				if(pausedAt) {
					pausedDuration = new Date().getTime() - pausedAt;
					timeLast       = timeLast + pausedDuration;
					timeStart      = timeStart + pausedDuration;

					self.emit('resume', pausedDuration);
				}

				self._tick();
			}
		}
	}

	prototype = qoopido.module('emitter').extend({
		framerate: 0,
		ratio:     1,
		paused:    false,
		_tick:     null,
		_constructor: function() {
			var self = prototype._parent._constructor.call(this);

			timeStart = timeLast = new Date().getTime();

			self._tick = function() {
				if(self.paused === false) {
					timeNow   = new Date().getTime();
					timeDelta = timeNow - timeStart;

					self.ratio     = (timeNow - timeLast) / targetInterval;
					self.framerate = targetFramerate / self.ratio;

					if(timeDelta >= 1000) {
						timeStart = timeNow;
						frames    = 0;
					}

					timeLast = timeNow;
					frames   = frames + 1;

					self.emit('tick', self.framerate, self.ratio);

					interval = requestAnimationFrame(self._tick);
				}
			};

			qDocument.on(''.concat('visibilitychange ', Support.getPrefix()[0], 'visibilitychange'), function() { onVisibilityChange.call(self); });

			onVisibilityChange.call(self);

			return self;
		}
	});

	return prototype;
}, this));