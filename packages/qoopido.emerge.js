/*!
* Qoopido jQuery Plugin "emerge"
*
* Source:  Qoopido JS
* Version: 1.0.8
* Date:    2013-01-23
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/Qoopido-JS
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*/

;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'base',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define(initialize);
	} else {
		initialize();
	}
}(function(window, document, undefined) {
	'use strict';

	var supportsEs5 = !!(Object.getOwnPropertyNames && Array.prototype.forEach && Object.getOwnPropertyDescriptor);

	if(Object.create === undefined) {
		Object.create = function(prototype, properties) {
			var object;

			if (prototype === null) {
				object = { '__proto__': null };
			} else {
				if(typeof prototype !== 'object') {
					throw new TypeError('typeof prototype[' + (typeof prototype) + '] != "object"');
				}

				var Type = function () {};
				Type.prototype = prototype;

				object = new Type();
				object.__proto__ = prototype;
			}

			if(properties !== undefined) {
				Object.defineProperties(object, properties);
			}

			return object;
		};
	}

	if(Object.getOwnPropertyDescriptors === undefined) {
		Object.getOwnPropertyDescriptors = function(object) {
			var descriptors = {};

			Object.getOwnPropertyNames(object).forEach(function(property) {
				descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
			});

			return descriptors;
		};
	}

	return {
		create: function create() {
			var instance = Object.create(this);

			if(instance._constructor) {
				instance._constructor.apply(instance, arguments);
			}

			return instance;
		},
		extend: function extend(properties) {
			properties         = properties || {};
			properties._parent = this;

			if(supportsEs5 === true) { // Primary version for ECMAScript 5 compatible browsers
				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			} else { // Fallback version for non ECMAScript 5 compatible browsers
				var extended = Object.create(this),
					property;

				for(property in properties) {
					if(property !== '__proto__') {
						extended[property] = properties[property];
					}
				}

				return Object.create(extended);
			}
		}
	};
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'unique',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'qoopido/base' ], initialize);
	} else {
		initialize(window[namespace].base);
	}
}(function(mBase, window, document, undefined) {
	'use strict';

	var result, j, x, i,
		lookup     = { uuid: { }, string: { } },
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	function generateString(length) {
		length = parseInt(length, 10) || 12;
		result = '';

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return mBase.extend({
		uuid: function uuid() {
			do {
				result = generateUuid();
			} while(typeof lookup.uuid[result] !== 'undefined');

			lookup.uuid[result] = true;

			return result;
		},
		string: function string(length) {
			do {
				result = generateString(length);
			} while(typeof lookup.string[result] !== 'undefined');

			lookup.string[result] = true;

			return result;
		}
	});
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace = 'qoopido',
		name      = 'jquery/plugins/shrinkimage',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'jquery', 'qoopido/base', 'qoopido/unique', 'qoopido/support', 'qoopido/support/capability/datauri', 'qoopido/support/element/canvas/todataurl/png' ], initialize);
	} else {
		initialize(window.jQuery, window[namespace].base, window[namespace].unique, window[namespace].support, undefined, undefined);
	}
}(function(mJquery, mBase, mUnique, mSupport, mOptional1, mOptional2, window, document, undefined) {
	'use strict';

	var // properties
		name        = 'shrinkimage',
		defaults    = { attribute: 'data-' + name, quality: 80, debug: false },
		process     = false,
		lookup      = {},
		hostname    = window.location.hostname,
		expressions = {
			test:     new RegExp('^url(\\x28"{0,1}|)data:image/shrink,(.+?)("{0,1}\\x29|)$', 'i'),
			path:     new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', 'i'),
			hostname: new RegExp('^\\w+://([^/]+)', 'i')
		},
		$resolver    = mJquery('<a />'),

	// methods / classes
		getLoader,
		shrinkimage,

	// events
		EVENT_REQUESTED = 'requested.' + name,
		EVENT_QUEUED    = 'queued.' + name,
		EVENT_CACHED    = 'cached.' + name,
		EVENT_LOADED    = 'loaded.' + name,

	// listener
		LISTENER_LOAD   = 'load';

	mSupport.testMultiple('/capability/datauri', '/element/canvas/todataurl/png')
		.then(function() {
			process = true;
		});

	mJquery.fn[name] = function(settings) {
		settings = mJquery.extend({}, defaults, settings || {});

		return this.each(function() {
			var self       = mJquery(this),
				source     = self.attr(settings.attribute),
				background = self.css('background-image');

			if(this.tagName === 'IMG') {
				if(process === true && settings.debug === false) {
					shrinkimage.create(settings, self, source);
				} else {
					self.attr('src', source).removeAttr(settings.attribute);
				}
			}

			if(background !== 'none' && expressions.test.test(background) === true) {
				if(process === true && settings.debug === false) {
					shrinkimage.create(settings, self, background, true);
				} else {
					self.css('background-image', 'url(' + expressions.path.exec(background)[1] + ')');
				}
			}
		});
	};

	getLoader = function getLoader(attribute, source) {
		return mJquery('<img />').attr(attribute, source).on(LISTENER_LOAD, function(event) { event.stopPropagation(); });
	};

	shrinkimage = mBase.extend({
		_constructor: function(settings, target, url, background) {
			var self = this;

			self._loader     = null;
			self._settings   = mJquery.extend({}, defaults, settings || {});
			self._target     = target.css({ visibility: 'hidden', opacity: 0 });
			self._background = background || false;
			self._result     = null;
			self._url        = url || false;
			self._parameter  = {
				quality: self._getParameter('quality', self._url) || self._settings.quality,
				source:  (self._url !== false) ? expressions.path.exec(self._resolveUrl(self._url))[1].split('?')[0] : false,
				target:  self._getParameter('target', self._url) || false
			};

			if(self._url !== false) {
				if(self._parameter.target === false) {
					self._parameter.target = self._parameter.source.replace(/\.png$/i, '.q' + self._parameter.quality + '.shrunk');
				}

				self._target.removeAttr(self._settings.attribute);

				switch(typeof lookup[self._parameter.target]) {
					case 'object':
						lookup[self._parameter.target]._target.one(EVENT_CACHED, function(event) {
							if(event.namespace === name) {
								self._assign(true);
							}
						});

						self._target.trigger(EVENT_QUEUED, [ self._parameter.target]);

						break;
					case 'string':
						self._assign(true);
						break;
					default:
						self._loader = getLoader(settings.attribute, url);
						lookup[self._parameter.target] = self;
						self._load();

						self._target.trigger(EVENT_REQUESTED, [ self._parameter.target]);
						break;
				}
			}
		},
		_load: function() {
			var self   = this,
				remote = (hostname !== expressions.hostname.exec(self._parameter.target)[1]);

			mJquery.ajax({
				url:           (remote === true) ? self._parameter.target + '.jsonp' : self._parameter.target,
				context:       self,
				data:          { source: self._parameter.source, quality: self._parameter.quality },
				global:        false,
				cache:         true,
				crossDomain:   remote || null,
				dataType:      (remote === true) ? 'jsonp' : 'json',
				jsonpCallback: (remote === true) ? name + '-' + mUnique.string() : null
			})
				.fail(function(response, status, error) {
					self._fallback();
				})
				.done(function(data, status, response) {
					if(typeof data !== 'object' || data.width === undefined || data.height === undefined || data.size === undefined || data.main === undefined || data.alpha === undefined) {
						self._fallback();
					} else {
						self._result = {
							original:   parseInt(data.size, 10),
							compressed: parseInt(response.getResponseHeader('Content-Length'), 10)
						};

						self._process(data);
					}
				});
		},
		_fallback: function() {
			var self = this;

			lookup[self._parameter.target] = self._parameter.source;
			self._assign(false, true);
		},
		_process: function(data) {
			var self = this;

			self._loader.one(LISTENER_LOAD, function() {
				var canvas = document.createElement('canvas'),
					loader = self._loader.get(0),
					context;

				canvas.style.display = 'none';
				canvas.width         = data.width;
				canvas.height        = data.height;

				context = canvas.getContext('2d');
				context.clearRect(0, 0, data.width, data.height);
				context.drawImage(loader, 0, 0, data.width, data.height);

				self._loader.one(LISTENER_LOAD, function() {
					self._loader.remove();

					context.globalCompositeOperation = 'xor';
					context.drawImage(loader, 0, 0, data.width, data.height);

					lookup[self._parameter.target] = canvas.toDataURL('image/png');

					mJquery(canvas).remove();

					self._assign();
				}).attr('src', data.alpha);
			}).attr('src', data.main);
		},
		_assign: function(cached, fallback) {
			var self = this;

			if(self._background === false) {
				self._target.one(LISTENER_LOAD, function() {
					self._target.css({ visibility: '', opacity: '' }).trigger(EVENT_LOADED, [ self._parameter.target, cached || false, fallback || false]);
				}).attr('src', lookup[self._parameter.target]);
			} else {
				self._target.css({ 'background-image': 'url(' + lookup[self._parameter.target] + ')' }).trigger(EVENT_LOADED, [ self._parameter.target, cached || false, fallback || false]);
			}

			if(cached !== true && self._result !== null) {
				self._target.trigger(EVENT_CACHED, [ self._parameter.target, self._result.compressed, self._result.original ]);
			}
		},
		_resolveUrl: function(url) {
			return $resolver.attr('href', url).prop('href');
		},
		_getParameter: function(name, url) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || ['',''])[1].replace(/\+/g, '%20')) || null;
		}
	});

	return shrinkimage;
}, window, document));