/*
 * Qoopido transport/xhr
 *
 * Provides basic XHR (AJAX) functionality
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../url
 * @require ../transport
 * @require ../function/merge
 * @require ../function/unique/string
 * @external Q
 */

;(function(definition) {
	window.qoopido.registerSingleton('transport/xhr', definition, [ '../transport', '../function/merge', '../function/unique/string', '../url', 'q' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		Q      = modules['q'] || window.Q,
		getXhr = (typeof window.XMLHttpRequest !== 'undefined') ?
			function(url) {
				if(modules['url'].isLocal(url)) {
					return new window.XMLHttpRequest();
				} else {
					return window.XDomainRequest ? new window.XDomainRequest() : new window.XMLHttpRequest();
				}
			}
			: function() {
				try {
					return new ActiveXObject('MSXML2.XMLHTTP.3.0');
				} catch(exception) {
					return null;
				}
			};

	function sendRequest(method, url, content) {
		var self     = this,
			xhr      = self.xhr,
			settings = self.settings,
			id;

		content = (typeof content === 'object') ? self.serialize(content) : content;
		url     = (settings.cache === false) ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', '_=' + new Date().getTime()) : url;
		url     = (content && method === 'GET') ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', content) : url;

		for(id in settings.xhrOptions) {
			xhr[id] = settings.xhrOptions[id];
		}

		xhr.open(method, url, settings.async, settings.username, settings.password);

		if(xhr.setRequestHeader) {
			xhr.setRequestHeader('Accept', settings.accept);
			if(content && method !== 'GET') {
				xhr.setRequestHeader('Content-Type', settings.contentType);
			}
			for(id in settings.header) {
				xhr.setRequestHeader(id, settings.header[id]);
			}
		}

		xhr.timeout            = settings.timeout;
		xhr.onprogress         = function(event) { onProgress.call(self, event); };
		xhr.onreadystatechange = xhr.onload = function() { onReadyStateChange.call(self); };
		xhr.onerror            = function() { onError.call(self); };
		xhr.send(content || null);

		self.timeout = setTimeout(function() { onTimeout.call(self); }, settings.timeout);
	}

	function onProgress(event) {
		var self = this;

		if(self.timeout) {
			clearTimeout(self.timeout);
		}

		self.timeout = setTimeout(function() { onTimeout.call(self); }, self.settings.timeout);

		self.dfd.notify(event);
	}

	function onReadyStateChange() {
		var self = this,
			xhr  = self.xhr,
			dfd  = self.dfd;

		if(xhr.readyState === undefined || xhr.readyState === 4) {
			clear.call(self);

			if(xhr.status === undefined || xhr.status === 200) {
				dfd.resolve({ data: xhr.responseText, xhr: xhr });
			} else {
				dfd.reject({ status: xhr.status, xhr: xhr });
			}
		}
	}

	function onError() {
		var self = this;

		clear.call(self);
		self.dfd.reject();
	}

	function onTimeout() {
		var self = this;

		self.xhr.abort();
		clear.call(self);
		self.dfd.reject();
	}

	function clear() {
		var self = this,
			xhr  = self.xhr;

		if(self.timeout) {
			clearTimeout(self.timeout);
		}

		xhr.onprogress = xhr.onreadystatechange = xhr.onerror = null;
	}

	prototype = modules['transport'].extend({
		_settings: {
			accept:      '*/*',
			timeout:     5000,
			async:       true,
			cache:       false,
			header:      {},
			username:    null,
			password:    null,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8 ',
			xhrOptions:  {}
		},
		load: function(method, url, data, options) {
			var context = {};

			url = modules['url'].resolve(url);

			context.url      = url;
			context.id       = ''.concat('xhr-', modules['function/unique/string']());
			context.dfd      = Q.defer();
			context.xhr      = getXhr(url);
			context.settings = modules['function/merge']({}, this._settings, options);
			context.timeout  = null;

			sendRequest.call(context, method.toUpperCase(), url, data);

			return context.dfd.promise;
		},
		get: function(url, data, options) {
			return this.load('GET', url, data, options);
		},
		post: function(url, data, options) {
			return this.load('POST', url, data, options);
		},
		put: function(url, data, options) {
			return this.load('PUT', url, data, options);
		},
		'delete': function(url, data, options) {
			return this.load('DELETE', url, data, options);
		},
		head: function(url, data, options) {
			return this.load('HEAD', url, data, options);
		}
	});

	return prototype;
}, window, document));