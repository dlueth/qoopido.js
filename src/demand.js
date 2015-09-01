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
		a_p_c              = Array.prototype.concat,
		target             = d.getElementsByTagName('head')[0],
		resolver           = d.createElement('a'),
		regexIsAbsolute    = /^\//i,
		regexMatchHandler  = /^([-\w]+\/[-\w]+)!/,
		regexMatchSpecial  = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
		regexMatchCssUrl   = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,
		regexMatchProtocol = /^http(s?):/,
		BOND_PENDING       = 'pending',
		BOND_RESOLVED      = 'resolved',
		BOND_REJECTED      = 'rejected',
		defaults           = { version: '1.0.0', base: '/' },
		main               = global.demand.main,
		settings           = global.demand.settings,
		host               = global.location.host,
		base               = {},
		pattern            = {},
		handler            = {},
		modules            = {},
		version, queue, resolve, storage, JavascriptHandler, CssHandler;

	// main public methods
		// demand
			function demand() {
				var self         = this || {},
					module       = self instanceof Module ? self : null,
					dependencies = a_p_s.call(arguments),
					bond;

				dependencies.forEach(
					function(dependency, index) {
						var resolved = resolve.path(dependency, module),
							handler  = resolved.handler,
							path     = resolved.path,
							pointer  = modules[handler] || (modules[handler] = {});

						this[index] = pointer[path] || (pointer[path] = (new Loader(dependency, module)).bond);
					},
					dependencies);

				bond = Bond.all(dependencies);

				return {
					then: function(onResolve, onReject) {
						bond.then(onResolve, onReject);
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
							module, bond, defered;

						if(!loader && pointer[resolved.path]) {
							throw new Error('duplicate found for module', path);
						} else {
							module = new Module(path, factory, dependencies || []);
							bond   = modules[module.handler][module.path] = module.bond;

							if(loader) {
								!loader.cached && loader.store();

								defered = loader.defered;

								bond
									.then(
										function() {
											defered.resolve.apply(null, arguments);
										},
										function() {
											defered.reject(new Error('unable to resolve module', path, arguments));
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

				return true;
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

		// removeProtocol
			function removeProtocol(url) {
				return url.replace(regexMatchProtocol, '');
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

						if(self instanceof Loader) {
							self.url = removeProtocol(resolve.url((match ? match.process(aPath) : (absolute ? '//' + host : base.url) + aPath)).href);
						}
					} else {
						return { handler: pointer, path: aPath };
					}
				}
			};

		// storage
			storage = {
				get: function(aPath, aUrl) {
					var data = JSON.parse(ls.getItem(aPath));

					if(data && data.version === version && data.url === aUrl) {
						return data;
					}
				},
				set: function(aPath, aValue, aUrl) {
					ls.setItem(aPath, JSON.stringify({ version: version, url: aUrl, source: aValue }));
				},
				clear: function(aPath) {
					(aPath && ls.removeItem(aPath)) || ls.clear();
				}
			};

	// modules
		// Bond
			function Bond(executor) {
				var self = this;

				self.listener = { resolved: [], rejected: [] };

				function resolve() {
					handle(BOND_RESOLVED, arguments);
				}

				function reject() {
					handle(BOND_REJECTED, arguments);
				}

				function handle(aState, aParameter) {
					if(self.state === BOND_PENDING) {
						self.state = aState;
						self.value = aParameter;

						self.listener[aState].forEach(function(aHandler) {
							aHandler.apply(null, self.value);
						});
					}
				}

				executor(resolve, reject);
			}

			Bond.prototype = {
				constructor: Bond,
				state:       BOND_PENDING,
				value:       null,
				listener:    null,
				then: function(aResolved, aRejected) {
					var self = this,
						listener;

					if(self.state === BOND_PENDING) {
						listener = self.listener;

						aResolved && listener[BOND_RESOLVED].push(aResolved);
						aRejected && listener[BOND_REJECTED].push(aRejected);
					} else {
						switch(self.state) {
							case BOND_RESOLVED:
								aResolved.apply(null, self.value);

								break;
							case BOND_REJECTED:
								aRejected.apply(null, self.value);

								break;
						}
					}
				}
			};

			Bond.defer = function() {
				var self = {};

				self.bond = new Bond(function(aResolve, aReject) {
					self.resolve = aResolve;
					self.reject  = aReject;
				});

				return self;
			};

			Bond.all = function(aBonds) {
				var defered  = Bond.defer(),
					bond     = defered.bond,
					resolved = [],
					total    = aBonds.length,
					current  = 0;

				aBonds.forEach(function(aBond, aIndex) {
					aBond.then(
						function() {
							if(bond.state === BOND_PENDING) {
								resolved[aIndex] = a_p_s.call(arguments);

								current++;

								current === total && defered.resolve.apply(null, a_p_c.apply([], resolved));
							}
						},
						function() { defered.reject.apply(null, arguments); }
					);
				});

				return bond;
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
					defered = Bond.defer(),
					xhr     = new XMLHttpRequest(),
					pointer, cached;

				resolve.path.call(self, aPath, aParent);

				self.defered = defered;
				self.bond    = defered.bond;
				self.cached  = false;
				pointer      = handler[self.handler];

				if(!parent) {
					self.bond.then(null, log);
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

					storage.set(self.path, self.source, self.url);
				},
				retrieve: function() {
					var self   = this,
						cache  = storage.get(self.path, self.url),
						cached = self.cached = !!(cache);

					cached && (self.source = cache.source);

					return cached;
				}
			};

		// Module
			function Module(aPath, aFactory, aDependencies) {
				var self    = this,
					defered = Bond.defer();

				resolve.path.call(self, aPath);

				self.bond = defered.bond;

				self.bond.then(null, function(error) {
					log(new Error('unable to resolve module', self.path, error));
				});

				if(aDependencies.length > 0) {
					demand
						.apply(self, aDependencies)
						.then(
							function() { defered.resolve(aFactory.apply(null, arguments)); },
							function(error) { defered.reject(new Error('unable to resolve dependencies for', self.path, error)); }
						);
				} else {
					defered.resolve(aFactory());
				}

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
						provide(function() { return style; });
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
			queue = new Queue();

		// add default handler
			addHandler('application/javascript', '.js', JavascriptHandler);
			addHandler('text/css', '.css', CssHandler);

		// configure
			configure(defaults) && settings && configure(settings);

		// register in global scope
			demand.configure  = configure;
			demand.addHandler = addHandler;
			demand.clear      = storage.clear;
			global.demand     = demand;
			global.provide    = provide;

		// register modules
			provide('/demand', function() { return demand; });
			provide('/provide', function() { return provide; });

		// load main script
			if(main) {
				demand(main);
			}
}(this));