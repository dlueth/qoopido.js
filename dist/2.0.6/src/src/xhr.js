/*
 * Qoopido class for XHR requests (ajax)
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require ./unique
 * @require q
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido/xhr',
		initialize = function initialize() {
			var id      = (namespace = namespace.split('/')).splice(namespace.length - 1, 1),
				pointer = window;

			for(var i = 0; namespace[i] !== undefined; i++) {
				pointer[namespace[i]] = pointer[namespace[i]] || {};

				pointer = pointer[namespace[i]];
			}

			[].push.apply(arguments, [ window, document, undefined ]);

			return (pointer[id] = definition.apply(null, arguments).create());
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'qoopido/base', 'qoopido/unique', 'q' ], initialize);
	} else {
		initialize(window.qoopido.base, window.qoopido.unique, window.Q);
	}
}(function(mPrototype, mUnique, mQ, window, document, undefined) {
	'use strict';

	var prototype;

	function getXhr() {
		if(window.XMLHttpRequest) {
			return new window.XMLHttpRequest();
		} else {
			try {
				return new ActiveXObject('MSXML2.XMLHTTP.3.0');
			} catch(e) {
				return null;
			}
		}
	}

	function sendRequest(method, url, content) {
		var self = this,
			xhr  = self.xhr;

		content = (typeof content === 'object') ? serialize(content) : content;
		url     = (content && method === 'GET') ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', content) : url;

		xhr.open(method, url, true, null, null);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if(content && method !== 'GET') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8 ');
		}
		xhr.setRequestHeader('Accepts', 'application/json');
		xhr.timeout            = 5200;
		xhr.onprogress         = function() { onProgress.apply(self); };
		xhr.onreadystatechange = function() { onReadyStateChange.apply(self); };
		xhr.send(content || null);

		self.timeout = setTimeout(timeout, 5000);
	}

	function timeout(xhr) {
		xhr.abort();
	}

	function onProgress() {
		this.dfd.notify();
	}

	function onReadyStateChange() {
		var self = this,
			xhr  = self.xhr,
			dfd  = self.dfd;

		if(xhr.readyState === 4) {
			clearTimeout(self.timeout);

			if(xhr.status === 200) {
				dfd.resolve(xhr.responseText, xhr);
			} else {
				dfd.reject(xhr.status, xhr);
			}
		}
	}

	function serialize(obj, prefix) {
		var result = '', parameter = [], id, key, value;

		for(id in obj) {
			key   = prefix ? ''.concat(prefix, '[', id, ']') : id;
			value = obj[id];

			parameter.push((typeof v === 'object') ? serialize(value, key) : ''.concat(encodeURIComponent(key), '=', encodeURIComponent(value)));
		}

		return result.concat.apply(result, parameter);
	}

	prototype = mPrototype.extend({
		load: function(method, url, data, unique) {
			var self = {};

			unique = unique || true;
			url    = (unique === true) ? ''.concat(url, (url.indexOf('?') > -1) ? '&' : '?', '_=' + new Date().getTime()) : url;

			self.id      = mUnique.string();
			self.dfd     = mQ.defer();
			self.xhr     = getXhr();
			self.timeout = null;

			sendRequest.apply(self, [ method.toUpperCase(), url, data ]);

			return self.dfd.promise;
		},
		get: function(url, data, unique) {
			return this.load('GET', url, data, unique);
		},
		post: function(url, data, unique) {
			return this.load('POST', url, data, unique);
		},
		put: function(url, data, unique) {
			return this.load('PUT', url, data, unique);
		},
		'delete': function(url, data, unique) {
			return this.load('DELETE', url, data, unique);
		},
		head: function(url, data, unique) {
			return this.load('HEAD', url, data, unique);
		}
	});

	return prototype;
}, window, document));