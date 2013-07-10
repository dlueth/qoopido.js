/*
 * Qoopido transport jsonp
 *
 * Provides basic JSONP functionality
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../transport
 * @require ../function/merge
 * @require ../url
 * @require ../unique
 * @require q (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('transport/jsonp', pDefinition, true);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../transport', '../function/merge', '../url', '../unique', 'q' ], definition);
	} else {
		definition();
	}
}(function(modules, namespace, window, document) {
	'use strict';

	var prototype,
		Q    = window.Q,
		head = document.getElementsByTagName('head')[0];

	function sendRequest(url, content) {
		var self     = this,
			dfd      = self.dfd,
			script   = self.script,
			settings = self.settings;

		content = (typeof content === 'object') ? self.serialize(content) : content;
		url     = ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', ''.concat(settings.callback, '=', self.id));
		url     = (settings.cache === false) ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', ''.concat('_=', new Date().getTime().toString())) : url;
		url     = (content) ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', content) : url;

		window[self.id] = function(data) {
			if(dfd.promise.isPending()) {
				dfd.resolve(data);
			}

			try {
				delete window[self.id];
			} catch (exception) {
				window[self.id] = null;
			}
		};

		script.onload  = script.onreadystatechange = function(event) { onReadyStateChange.call(self, event); };
		script.onerror = function() { onError.call(self); };

		script.setAttribute('src', url);

		head.appendChild(script);
	}

	function onReadyStateChange(event) {
		var self = this,
			dfd  = self.dfd;

		if(!event.readyState || event.readyState === 'loaded' || event.readyState === 'complete') {
			clear.call(self);

			self.timeout = setTimeout(function() { onTimeout.call(self); }, self.settings.timeout);
		}

		dfd.notify(event);
	}

	function onError() {
		var self = this;

		clear.call(self);

		self.dfd.reject();
	}

	function onTimeout() {
		var dfd = this.dfd;

		if(dfd.promise.isPending()) {
			this.dfd.reject();
		}
	}

	function clear() {
		var script = this.script;

		script.onload = script.onreadystatechange = script.onerror = null;
		script.parentNode.removeChild(script);
	}

	prototype = modules.transport.extend({
		_settings: {
			callback: 'callback',
			cache:    false,
			timeout:  200
		},
		load: function(url, data, options) {
			var self = {};

			url = modules.url.resolve(url);

			self.id       = ''.concat('jsonp-', modules.unique.string());
			self.dfd      = Q.defer();
			self.script   = document.createElement('script');
			self.settings = modules.function.merge({}, this._settings, options);
			self.timeout  = null;

			self.script.setAttribute('async', true);

			sendRequest.call(self, url, data);

			return self.dfd.promise;
		}
	});

	return prototype;
}, window, document));