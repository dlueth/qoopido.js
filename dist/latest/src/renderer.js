/*
 * Qoopido renderer
 *
 * Provides a centralized rendering pipeline via requestAnimationFrame
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
 * @require ./support
 * @require ./dom/element
 */
;(function(definition) {
	window.qoopido.registerSingleton('renderer', definition, [ './emitter', './support', './dom/element' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	function requestAnimationFrameFallback(callback) {
		return window.setTimeout(callback, targetInterval);
	}

	var prototype,
		mSupport              = modules['support'],
		qDocument             = modules['dom/element'].create(document),
		requestAnimationFrame = window[mSupport.getMethod('requestAnimationFrame')] || requestAnimationFrameFallback,
		cancelAnimationFrame  = window[mSupport.getMethod('cancelAnimationFrame')] || clearTimeout,
		visibilityProperty    = mSupport.getProperty('hidden', document),
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

					self.emit('resume', new Date().getTime() - pausedDuration);
				}

				self._tick();
			}
		}
	}

	prototype = modules['emitter'].extend({
		framerate: 0,
		ratio:     1,
		paused:    false,
		_tick:     null,
		_constructor: function() {
			var self = this;

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

			qDocument.on(''.concat('visibilitychange ', mSupport.getPrefix()[0], 'visibilitychange'), function() { onVisibilityChange.call(self); });

			onVisibilityChange.call(self);
		}
	});

	return prototype;
}));