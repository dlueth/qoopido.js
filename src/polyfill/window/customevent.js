/*
 * Qoopido polyfill/window/customevent
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
	window.qoopido.register('polyfill/window/customevent', definition);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!window.CustomEvent) {
		var createEvent = (document.createEvent) ?
			function(type, eventInitDict, detail) {
				var event      = document.createEvent('Event'),
					bubbles    = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false,
					cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;

				event.initEvent(type, bubbles, cancelable);
				event.detail = detail;

				return event;
			}
			:
			function(type, eventInitDict, detail) {
				var event = document.createEventObject();

				event.type       = type;
				event.bubbles    = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
				event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : true;
				event.detail     = detail;

				return event;
			};

		window.CustomEvent =  Window.prototype.CustomEvent = function CustomEvent(type, eventInitDict, detail) {
			if(!type) {
				throw new Error('Not enough arguments');
			}

			return createEvent(type, eventInitDict, detail);
		};
	}

	return window.CustomEvent;
}));