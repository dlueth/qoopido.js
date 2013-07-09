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
 * @require ../base
 * @require ../url
 * @require ../unique
 * @require ../element
 * @require q (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.shared.module.initialize('transport/jsonp', pDefinition, arguments, true);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../transport', '../function/merge', '../url', '../unique', 'q' ], definition);
	} else {
		definition(window.qoopido.transport, window.qoopido.function.merge, window.qoopido.url, window.qoopido.unique, window.Q);
	}
}(function(mPrototype, merge, mUrl, mUnique, mQ, namespace, window, document, undefined) {
	'use strict';

	var prototype,
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

		window[self.id] = function(data){
			dfd.resolve(data);

			try {
				delete window[self.id];
			} catch (exception) {
				window[self.id] = null;
			}
		};

		script.onprogress = function(event) { onProgress.call(self, event); };
		script.onload     = script.onreadystatechange = function() { onReadyStateChange.call(self, event); };
		script.onerror    = function() { onError.call(self); };

		script.setAttribute('src', url);

		head.appendChild(script);
	}

	function onProgress(event) {
		this.dfd.notify(event.readyState);
	}

	function onReadyStateChange(event) {
		var self   = this,
			script = self.script;

		if(event.readyState && (!event.readyState || event.readyState === 'loaded' || event.readyState === 'complete')) {
			script.off('progress error load readystatechange');

			script.parentNode.removeChild(script);
		}
	}

	function onError() {
		this.dfd.reject();
	}

	prototype = mPrototype.extend({
		_settings: {
			callback: 'callback',
			cache:    false
		},
		load: function(url, data, options) {
			var self = {};

			url = mUrl.resolve(url);

			self.id       = ''.concat('jsonp-', mUnique.string());
			self.dfd      = mQ.defer();
			self.script   = document.createElement('script');
			self.settings = merge({}, this._settings, options);

			self.script.setAttribute('async', true);

			sendRequest.call(self, url, data);

			return self.dfd.promise;
		}
	});

	return prototype;
}, window, document));