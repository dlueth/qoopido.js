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
 *
 * @polyfill ./event.js
 */
/* global Window */
;(function(definition) {
	var dependencies = [];

	if(!window.Event) {
		dependencies.push('./event');
	}

	window.qoopido.register('polyfill/window/customevent', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	if(!window.CustomEvent) {
		window.CustomEvent = Window.prototype.CustomEvent = function CustomEvent(type, eventInitDict) {
			var event = new window.Event(type, eventInitDict);

			event.detail = eventInitDict && eventInitDict.detail;

			return event;
		};
	}

	return window.CustomEvent;
}));