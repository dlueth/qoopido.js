/*
 * Qoopido polyfill/window/event
 *
 * Borrowed from:
 * https://github.com/jonathantneal/polyfill
 *
 * Copyright (c) 2014 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
/* global Window */
;(function(definition) {
	window.qoopido.register('polyfill/window/event', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!window.Event) {
		var createEvent = (document.createEvent) ?
			function(type, eventInitDict) {
				var event      = document.createEvent('Event'),
					bubbles    = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false,
					cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;

				event.initEvent(type, bubbles, cancelable);

				return event;
			}
			:
			function(type, eventInitDict) {
				var event = document.createEventObject();

				event.type       = type;
				event.bubbles    = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
				event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;

				return event;
			};

		window.Event =  Window.prototype.Event = function Event(type, eventInitDict) {
			if(!type) {
				throw new Error('Not enough arguments');
			}

			return createEvent(type, eventInitDict);
		};
	}

	return window.Event;
}));