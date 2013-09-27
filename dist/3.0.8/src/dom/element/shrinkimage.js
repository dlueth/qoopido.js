/*
 * Qoopido dom/element/shrinkimage
 *
 * Provides mechanics to load, process and display shrunk-files (server side compression for alpha transparent PNGs)
 *
 * Source:  Qoopido Shrinkimage
 * Author:  Dirk Lüth <info@qoopido.com>
 * Website: https://github.com/dlueth/qoopido.shrinkimage
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Licensed under the MIT and GPL license.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @require ../element
 * @require ../../proxy
 * @require ../../function/merge
 * @require ../../url
 * @require ../../support
 * @require ../../support/capability/datauri
 * @require ../../support/element/canvas/todataurl/png
 * @require ../../transport/xhr
 * @require ../../pool/dom
 * @require json (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('dom/element/shrinkimage', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		if((!!window.JSON && !!JSON.parse)) {
			define('json', function() { return window.JSON; });
		}

		define([ '../element', '../../proxy', '../../function/merge', '../../url', '../../support', '../../support/capability/datauri', '../../support/element/canvas/todataurl/png', '../../transport/xhr', '../../pool/dom', 'json' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	var
	// properties
		name            = namespace.pop(),
		defaults        = { attribute: 'data-' + name, quality: 80, debug: false },
		lookup          = {},
		regexBackground = new RegExp('^url\\x28"{0,1}data:image/shrink,(.+?)"{0,1}\\x29$', 'i'),
		regexPath       = new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', 'i'),
		regexSuffix     = new RegExp('\\.png$', 'i'),

	// methods / classes
		prototype, loader,

	// events
		EVENT_REQUESTED = 'requested',
		EVENT_QUEUED    = 'queued',
		EVENT_CACHED    = 'cached',
		EVENT_LOADED    = 'loaded',
		EVENT_FAILED    = 'failed',
		EVENT_STATE     = ''.concat(EVENT_LOADED, ' ', EVENT_FAILED),
		DOM_LOAD        = 'load',
		DOM_ERROR       = 'error',
		DOM_STATE       = ''.concat(DOM_LOAD, ' ', DOM_ERROR);

	prototype = modules['dom/element'].extend({
		_constructor: function(element, settings) {
			var self = this,
				foreground, background;

			prototype._parent._constructor.call(self, element);

			self._settings = settings = modules['function/merge']({}, defaults, settings);

			foreground = self.getAttribute(settings.attribute);
			background = self.element.style.backgroundImage;

			if(self.type === 'IMG') {
				processMain.call(self, foreground);
			}

			if(background !== 'none' && regexBackground.test(background)) {
				processMain.call(self, background, true);
			}
		},
		hide: function() {
			this.setStyles({ visibility: 'hidden', opacity: 0 });
		},
		show: function() {
			this.setStyles({ visibility: '', opacity: '' });
		}
	});

	function processMain(url, isBackground) {
		url          = modules['url'].resolve(regexPath.exec(url)[1]);
		isBackground = (isBackground) ? true : false;

		var self     = this,
			settings = modules['function/merge']({}, self._settings, modules['url'].getParameter(url)),
			target   = settings.target || (url = url.split('?')[0]).replace(regexSuffix, ''.concat('.q', settings.quality, '.shrunk'));

		if(!isBackground) {
			self.removeAttribute(self._settings.attribute).hide();
		}

		modules['support'].testMultiple('/capability/datauri', '/element/canvas/todataurl/png')
			.then(settings.debug)
			.then(
				function() {
					switch(typeof lookup[target]) {
						case 'object':
							lookup[target].one(EVENT_LOADED, function(event) {
								assign.call(self, event.data, isBackground);
							});

							self.emit(EVENT_QUEUED);
							break;
						case 'string':
							assign.call(self, lookup[target], isBackground);
							break;
						default:
							lookup[target] = loader
								.create(target, (!isBackground) ? self._element : null)
								.one(EVENT_STATE, function(event) {
									if(event.type === EVENT_LOADED) {
										lookup[target] = event.data;

										self.emit(EVENT_CACHED);

										assign.call(self, event.data, isBackground);
									} else {
										lookup[target] = url;

										assign.call(self, url, isBackground);
									}
								}, false);

							break;
					}
				}
			)
			.fail(
				function() {
					lookup[target] = url;

					assign.call(self, url, isBackground);
				}
			)
			.done();
	}

	function assign(source, isBackground) {
		var self = this;

		if(isBackground) {
			self.element.style.backgroundImage = 'url(' + source + ')';
			self.emit(EVENT_LOADED);
			self.off();
		} else {
			self.one(DOM_LOAD, function() {
				self.show();
				self.emit(EVENT_LOADED);
				self.off();
			}).setAttribute('src', source);
		}
	}

	loader = modules['dom/element'].extend({
		_url:   null,
		_constructor: function(url, element) {
			var self = this;

			if(!element) {
				element = window.qoopido.shared.pool.dom.obtain('img');
			}

			prototype._parent._constructor.call(self, element);

			self._url = url;

			processTransport.call(self, modules['transport/xhr']);
		}
	});

	function processTransport(transport) {
		var self = this;

		transport.get(self._url)
			.done(
				function(response) {
					try {
						var data = JSON.parse(response.data);

						data.width  = parseInt(data.width, 10);
						data.height = parseInt(data.height, 10);

						processData.call(self, data);
					} catch(exception) {
						self.emit(EVENT_FAILED);
					}
				},
				function() {
					self.emit(EVENT_FAILED);
				}
			);
	}

	function processData(data) {
		var canvas, context,
			self = this,
			onLoadMain = function(event) {
				canvas = window.qoopido.shared.pool.dom.obtain('canvas');

				canvas.style.display = 'none';
				canvas.width         = data.width;
				canvas.height        = data.height;

				context = canvas.getContext('2d');
				context.clearRect(0, 0, data.width, data.height);
				context.drawImage(self.element, 0, 0, data.width, data.height);

				self.one(DOM_LOAD, onLoadAlpha).setAttribute('src', data.alpha);

				return suppressEvent(event);
			},
			onLoadAlpha = function(event) {
				var result;

				context.globalCompositeOperation = 'xor';
				context.drawImage(self.element, 0, 0, data.width, data.height);

				result = canvas.toDataURL('image/png');

				dispose();

				self.emit(EVENT_LOADED, result);

				return suppressEvent(event);
			},
			dispose = function() {
				if(canvas) {
					canvas.dispose();
				}

				if(self.element._quid && self.element.dispose) {
					self.element.dispose();
				}
			};

		self
			.one(DOM_STATE, function(event) {
				if(event.type === DOM_LOAD) {
					onLoadMain.call(this, event);
				} else {
					dispose();

					self.emit(EVENT_FAILED);
				}
			}, false)
			.setAttribute('src', data.main);
	}

	function suppressEvent(event) {
		event.preventDefault();
		event.stopPropagation();

		return false;
	}

	return prototype;
}, window));