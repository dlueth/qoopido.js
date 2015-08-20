/*
 * Qoopido dom/element/shrinkimage
 *
 * Provides mechanics to load, process and display shrunk-files (server side compression for alpha transparent PNGs)
 *
 * Source:  Qoopido Shrinkimage
 * Author:  Dirk Lueth <info@qoopido.com>
 * Website: https://github.com/dLueth/qoopido.shrinkimage
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Licensed under the MIT and GPL license.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../element
 * @require ../../proxy
 * @require ../../function/merge
 * @require ../../url
 * @require ../../support
 * @require ../../support/capability/datauri
 * @require ../../support/element/canvas/todataurl/png
 * @require ../../transport/xhr
 * @optional ./pool/dom
 */
;(function(definition, global) {
	var dependencies = [ '../element', '../../proxy', '../../function/merge', '../../url', '../../support', '../../support/capability/datauri', '../../support/element/canvas/todataurl/png', '../../transport/xhr' ];

	global.qoopido.register('dom/element/shrinkimage', definition, dependencies);
}(function(qoopido, global, undefined) {
	'use strict';

	var
	// properties
		document        = global.document,
		JSON            = global.JSON,
		defaults        = qoopido.defaults('dom/element/shrinkimage', { attribute: 'data-shrinkimage', quality: 80, debug: false }),
		merge           = qoopido.module('function/merge'),
		Url             = qoopido.module('url'),
		DomElement      = qoopido.module('dom/element'),
		TransportXhr    = qoopido.module('transport/xhr'),
		pool            = qoopido.shared('pool/dom'),
		lookup          = {},
		regexBackground = new RegExp('^url\\x28"{0,1}data:image/shrink,(.+?)"{0,1}\\x29$', 'i'),
		regexPath       = new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', 'i'),
		regexSuffix     = new RegExp('\\.png$', 'i'),
		supported       = qoopido.module('support').test('capability/datauri', 'element/canvas/todataurl/png'),

	// methods / classes
		prototype, loader,

	// events
		EVENT_QUEUED    = 'queued',
		EVENT_CACHED    = 'cached',
		EVENT_LOADED    = 'loaded',
		EVENT_FAILED    = 'failed',
		EVENT_STATE     = ''.concat(EVENT_LOADED, ' ', EVENT_FAILED),
		DOM_LOAD        = 'load',
		DOM_ERROR       = 'error',
		DOM_STATE       = ''.concat(DOM_LOAD, ' ', DOM_ERROR);

	function processMain(url, isBackground) {
		url          = Url.resolve(regexPath.exec(url)[1]);
		isBackground = (isBackground === true);

		var self     = this,
			settings = merge({}, self._settings, qoopido.module('url').getParameter(url)),
			target   = settings.target || (url = url.split('?')[0]).replace(regexSuffix, ''.concat('.q', settings.quality, '.shrunk'));

		if(!isBackground) {
			self
				.removeAttribute(self._settings.attribute)
				.hide();
		}

		supported
			.then(
				function() {
					if(settings.debug === true) {
						throw new Error('[Qoopido.js] Debug enabled');
					}

					switch(typeof lookup[target]) {
						case 'object':
							lookup[target]
								.one(EVENT_LOADED, function(event) {
									assign.call(self, event.data, isBackground);
								});

							self.emit(EVENT_QUEUED);
							break;
						case 'string':
							assign.call(self, lookup[target], isBackground);
							break;
						default:
							lookup[target] = loader
								.create(target, (!isBackground) ? self.element : null)
								.one(EVENT_STATE, function(event, data) {
									if(event.type === EVENT_LOADED) {
										lookup[target] = data;

										self.emit(EVENT_CACHED);

										assign.call(self, data, isBackground);
									} else {
										lookup[target] = url;

										assign.call(self, url, isBackground);
									}
								}, false);
	
							break;
					}
				}
			)
			['catch'](
				function() {
					lookup[target] = url;

					assign.call(self, url, isBackground);
				}
			);
	}

	function assign(source, isBackground) {
		var self = this;

		if(isBackground) {
			self.setStyle('backgroundImage', 'url(' + source + ')');
			self.emit(EVENT_LOADED);
		} else {
			self
				.one(DOM_LOAD, function() {
					self.show();
					self.emit(EVENT_LOADED);
				})
				.setAttribute('src', source);
		}
	}

	function processTransport(transport) {
		var self = this;

		transport.get(self._url)
			.then(
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
				canvas = pool && pool.obtain('canvas') || document.createElement('canvas');

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
					canvas.dispose && canvas.dispose();
				}

				self.element.dispose && self.element.dispose();
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

	prototype = DomElement.extend({
		_constructor: function(element, settings) {
			var self = prototype._parent._constructor.call(this, element),
				foreground, background;

			self._settings = settings = merge({}, defaults, settings || {});

			foreground = self.getAttribute(settings.attribute);
			background = self.getStyle('backgroundImage');

			if(self.type === 'IMG') {
				processMain.call(self, foreground);
			}

			if(background !== 'none' && regexBackground.test(background)) {
				processMain.call(self, background, true);
			}

			return self;
		},
		hide: function() {
			this.setStyles({ visibility: 'hidden', opacity: 0 });
		},
		show: function() {
			this.setStyles({ visibility: '', opacity: '' });
		}
	});

	loader = DomElement.extend({
		_url:   null,
		_constructor: function(url, element) {
			var self;

			if(!element) {
				element = pool && pool.obtain('img') || document.createElement('img');
			}

			self      = loader._parent._constructor.call(this, element);
			self._url = url;

			processTransport.call(self, TransportXhr);

			return self;
		}
	});

	return prototype;
}, this));