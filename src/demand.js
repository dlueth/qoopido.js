/**
 * Qoopido demand
 *
 * Promise based module loader.
 *
 * I highly recommend this Promise polyfill:
 * https://github.com/getify/native-promise-only
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill Promise
 * @polyfill XMLHttpRequest
 */

/* global Promise, console */
;(function(global) {
	'use strict';

	var d                  = document,
		ls                 = localStorage,
		st                 = setTimeout,
		a_p_s              = Array.prototype.slice,
		target             = d.getElementsByTagName('head')[0],
		resolver           = d.createElement('a'),
		regexIsAbsolute    = /^\//i,
		regexMatchHandler  = /^([-\w]+\/[-\w]+)!/,
		regexMatchSpecial  = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
		regexMatchCssUrl   = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,
		defaults           = { version: '1.0.0', base: '/' },
		main               = global.demand.main,
		settings           = global.demand.settings,
		host               = global.location.host,
		base               = {},
		pattern            = {},
		handler            = {},
		modules            = {},
		version, resolve, storage, queue, JavascriptHandler, CssHandler;

	// main public methods
		// demand
			function demand() {
				var self         = this || {},
					module       = self instanceof Module ? self : null,
					dependencies = a_p_s.call(arguments),
					resolveHandler, rejectHandler;

				dependencies.forEach(
					function(dependency, index) {
						var resolved = resolve.path(dependency, module),
							handler  = resolved.handler,
							path     = resolved.path,
							pointer  = modules[handler] || (modules[handler] = {});

						this[index] = pointer[path] || (pointer[path] = (new Loader(dependency, module)).promise);
					},
					dependencies);

				Promise
					.all(dependencies)
					.then(
						function() {
							typeof resolveHandler === 'function' && resolveHandler.apply(null, arguments[0]);
						},
						function(error) {
							(typeof rejectHandler === 'function' && rejectHandler(error));
						}
					);

				return {
					then: function(onResolve, onReject) {
						resolveHandler = onResolve;
						rejectHandler  = onReject;
					}
				};
			}

		// provide
			function provide() {
				var path         = (arguments[0] && typeof arguments[0] === 'string' && arguments[0]) || null,
					factory      = (!path && arguments[0]) || arguments[1],
					dependencies, loader;

				if(!path && queue.current) {
					loader = queue.current;
					path   = loader.handler + '!' + loader.path;
				}

				if(path) {
					st(function() {
						var resolved = resolve.path(path),
							pointer  = modules[resolved.handler],
							module, promise, defered;

						if(!loader && pointer[resolved.path]) {
							throw new Error('duplicate found for module', path);
						} else {
							module  = new Module(path, factory, dependencies || []);
							promise = modules[module.handler][module.path] = module.promise;

							if(loader) {
								!loader.cached && loader.store();

								defered = loader.defered;

								promise
									.then(
										function(value) {
											defered.resolve(value);
										},
										function(error) {
											defered.reject(new Error('unable to resolve module', path, error));
										}
									);

								queue.length > 0 && queue.next();
							}
						}
					});
				} else {
					throw new Error('unspecified anonymous provide');
				}

				return { when: function() { dependencies = a_p_s.call(arguments); } };
			}

	// additional static methods
		// configure
			function configure(aConfig) {
				var pointerVersion = aConfig.version,
					pointerBase    = aConfig.base,
					pointerPattern = aConfig.pattern,
					key;

				if(pointerVersion) {
					version = pointerVersion;
				}

				if(pointerBase) {
					base = new Pattern(pointerBase, resolve.url(pointerBase).href);
				}

				if(pointerPattern) {
					for(key in pointerPattern) {
						pattern[key] = new Pattern(key, pointerPattern[key]);
					}
				}
			}

		// addHandler
			function addHandler(aType, aSuffix, aHandler) {
				if(!handler[aType]) {
					handler[aType] = { suffix: aSuffix, resolve: aHandler.resolve, modify: aHandler.modify };
					modules[aType] = {};

					return true;
				}

				return false;
			}

	// helper
		// log
			function log(aMessage) {
				var type = (aMessage instanceof Error) ? 'error' : 'info';

				if(typeof console !== 'undefined') {
					console[type](aMessage.toString());
				}
			}

		// escape
			function escape(aValue) {
				return aValue.replace(regexMatchSpecial, '\\$&');
			}

		// isAbsolute
			function isAbsolute(aPath) {
				return regexIsAbsolute.test(aPath);
			}

		// resolve
			resolve = {
				url: function(aUrl) {
					resolver.href = aUrl;

					return resolver;
				},
				path: function(aPath, aParent) {
					var self    = this,
						pointer = aPath.match(regexMatchHandler) || 'application/javascript',
						absolute, key, match;

					if(typeof pointer !== 'string') {
						aPath   = aPath.replace(new RegExp('^' + escape(pointer[0])), '');
						pointer = pointer[1];
					}

					if((absolute = isAbsolute(aPath))) {
						aPath = base.remove(resolve.url(base.url + aPath).href);
					} else {
						aPath = resolve.url(((aParent && aParent.path + '/../') || '/') + aPath).pathname;
					}

					for(key in pattern) {
						if(pattern[key].matches(aPath)) {
							match = pattern[key];
						}
					}

					if(self instanceof Module || self instanceof Loader) {
						self.handler = pointer;
						self.path    = aPath;
						self.version = version;

						if(self instanceof Loader) {
							self.url = resolve.url((match ? match.process(aPath) : (absolute ? '//' + host : base.url) + aPath)).href;
						}
					} else {
						return { handler: pointer, path: aPath, version: version };
					}
				}
			};

	// modules
		// Storage
			function Storage() {

			}

			Storage.prototype = {
				get: function(aPath, aVersion) {
					var data = JSON.parse(ls.getItem(aPath));

					if(!aVersion || (data && aVersion === data.version)) {
						return data;
					}
				},
				set: function(aPath, aValue, aVersion) {
					ls.setItem(aPath, JSON.stringify({ version: aVersion || version, source: aValue }));
				},
				clear: function(aPath) {
					(aPath && ls.removeItem(aPath)) || ls.clear();
				}
			};

		// Error
			function Error(aMessage, aModule, aStack) {
				var self = this;

				self.message = aMessage;
				self.module  = aModule;

				if(aStack) {
					self.stack = aStack;
				}

				return self;
			}

			Error.prototype = {
				toString: function() {
					var self    = this,
						result  = '[demand] ' + self.message + ' ' + self.module;

					if(self.stack) {
						while(self = self.stack) {
							result += '\n    > ' + self.message + ' ' + self.module;
						}
					}

					return result;
				}
			};

		// Pattern
			function Pattern(aPattern, aUrl) {
				var self = this;

				self.url          = resolve.url(aUrl).href;
				self.regexPattern = new RegExp('^' + escape(aPattern));
				self.regexUrl     = new RegExp('^' + escape(aUrl));
			}

			Pattern.prototype = {
				matches: function(aPath) {
					return this.regexPattern.test(aPath);
				},
				remove: function(aUrl) {
					return aUrl.replace(this.regexUrl, '');
				},
				process: function(aPath) {
					var self = this;

					return aPath.replace(self.regexPattern, self.url);
				}
			};

		// Queue
			function Queue() {
				var self = this;

				self.queue   = [];
				self.current = null;
			}

			Queue.prototype = {
				length: 0,
				add: function(aItem) {
					var self  = this,
						queue = self.queue;

					queue.push(aItem);

					self.length++;

					queue.length === 1 && self.next();
				},
				next: function() {
					var self    = this,
						current = self.current,
						queue   = self.queue,
						pointer;

					if(current) {
						self.current = null;

						queue.shift();
						self.length--;
					}

					if(queue.length) {
						current = self.current = self.queue[0];
						pointer = handler[current.handler];

						!current.cached && pointer.modify && (current.source = pointer.modify(current.url, current.source));
						pointer.resolve(current.path, current.source);
					}
				}
			};

		// Loader
			function Loader(aPath, aParent) {
				var self    = this,
					defered = Promise.defer(),
					xhr     = new XMLHttpRequest(),
					pointer, cached;

				resolve.path.call(self, aPath, aParent);

				self.defered = defered;
				self.promise = defered.promise;
				self.cached  = false;
				pointer      = handler[self.handler];

				if(!parent) {
					self.promise.then(null, log);
				}

				if(pointer) {
					cached = self.retrieve();

					if(cached) {
						queue.add(self);
					} else {
						xhr.onreadystatechange = function() {
							if(xhr.readyState === 4) {
								if(xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
									self.source = xhr.responseText;

									queue.add(self);
								} else {
									defered.reject(new Error('unable to load module', self.path));
								}
							}
						};

						xhr.open('GET', self.url + pointer.suffix, true);
						xhr.send();

						st(function() { if(xhr.readyState < 4) { xhr.abort(); } }, 5000);
					}
				} else {
					defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
				}

				return self;
			}

			Loader.prototype = {
				store: function() {
					var self = this;

					storage.set(self.path, self.source, self.version);
				},
				retrieve: function() {
					var self   = this,
						cache  = storage.get(self.path, self.version),
						cached = self.cached = !!(cache);

					cached && (self.source = cache.source);

					return cached;
				}
			};

		// Module
			function Module(aPath, aFactory, aDependencies) {
				var self    = this,
					defered = Promise.defer();

				resolve.path.call(self, aPath);

				(self.promise = defered.promise).then(null, function(error) {
					log(new Error('unable to resolve module', self.path, error));
				});

				demand
					.apply(self, aDependencies)
					.then(
						function() { defered.resolve(aFactory.apply(null, arguments)); },
						function(error) { defered.reject(new Error('unable to resolve dependencies for', self.path, error)); }
					);

				return self;
			}

	// handler
		// JavaScript
			JavascriptHandler = {
				resolve: function(aPath, aValue) {
					var script = d.createElement('script');

					script.type  = 'application/javascript';
					script.defer = script.async = true;
					script.text  = aValue;

					script.setAttribute('demand-path', aPath);

					target.appendChild(script);
				}
			};

		// CSS
			CssHandler = {
				resolve: function(aPath, aValue) {
					var style = d.createElement('style'),
						sheet = style.styleSheet;

					style.type  = 'text/css';
					style.media = 'only x';
					(sheet && (sheet.cssText = aValue)) || (style.innerHTML = aValue);

					style.setAttribute('demand-path', aPath);

					target.appendChild(style);

					st(function() {
						style.media = 'all';

						provide(function() { return true; });
					});
				},
				modify: function(aUrl, aValue) {
					var base = resolve.url(aUrl + '/..').href,
						match;

					while((match = regexMatchCssUrl.exec(aValue))) {
						aValue = aValue.replace(match[0], 'url(' + resolve.url(base + match[1]).pathname + ')');
					}

					return aValue;
				}
			};

	// initialization
		// create queue
			storage = new Storage();
			queue   = new Queue();

		// add default handler
			addHandler('application/javascript', '.js', JavascriptHandler);
			addHandler('text/css', '.css', CssHandler);

		// configure
			configure(defaults) && settings && configure(settings);

		// register in global scope
			demand.configure  = configure;
			demand.addHandler = addHandler;
			global.demand     = demand;
			global.provide    = provide;

		// load main script
			if(main) {
				var script = d.createElement('script');

				script.defer = script.async = true;
				script.src   = main;

				target.appendChild(script);
			}
}(this));