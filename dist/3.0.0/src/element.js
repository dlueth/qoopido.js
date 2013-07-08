/*
 * Qoopido dom element
 *
 * Provides additional methods for DOM elements
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../base
 */
;(function(pDefinition, pPolyfill, window) {
	'use strict';

	pPolyfill();

	function definition() {
		return window.qoopido.shared.module.initialize('element', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], definition);
	} else {
		definition(window.qoopido.base);
	}
}(
	function(mPrototype, namespace, window, document, undefined) {
		'use strict';

		var onMethod, offMethod, emitMethod,
			stringObject = 'object',
			stringString = 'string';

		onMethod = (window.addEventListener) ?
			function(name, fn) {
				var self    = this,
					element = self.element;

				element.addEventListener(name, fn, false);
			}
			: function(name, fn) {
				var self    = this,
					element = self.element;

				element['e' + name + fn] = fn;
				element[name + fn] = function() { element['e' + name + fn](window.event); };
				element.attachEvent('on' + name, element[name + fn]);
			};

		offMethod = (window.removeEventListener) ?
			function(name, fn) {
				var self    = this,
					element = self.element;

				element.removeEventListener(name, fn, false);
			}
			: function(name, fn) {
				var self    = this,
					element = self.element;

				element.detachEvent('on' + name, element[name + fn]);
				element[name + fn] = element['e' + name + fn] = null;
			};

		emitMethod = (document.createEvent) ?
			function(type, data) {
				var self    = this,
					element = self.element,
					event   = document.createEvent('HTMLEvents');

				event.initEvent(type, true, true);
				event.data = data;
				element.dispatchEvent(event);
			}
			: function(type, data) {
				var self    = this,
					element = self.element,
					event   = document.createEventObject();

				event.eventType = type;
				event.data      = data;
				element.fireEvent('on' + event.eventType, event);
			};

		return mPrototype.extend({
			type:     null,
			element:  null,
			listener: null,
			_constructor: function(element) {
				var self = this;

				self.type     = element.tagName;
				self.element  = element;
				self.listener = {};
			},
			getAttribute: function(attribute) {
				if(attribute && typeof attribute === stringString) {
					var self = this;

					attribute = attribute.split(' ');

					if(attribute.length === 1) {
						return self.element.getAttribute(attribute[0]);
					} else {
						return self.getAttributes(attribute);
					}
				}
			},
			getAttributes: function(attributes) {
				var self   = this,
					result = {};

				if(attributes) {
					attributes = (typeof attributes === stringString) ? attributes.split(' ') : attributes;

					if(typeof attributes === stringObject && attributes.length) {
						var i, attribute;

						for(i = 0; (attribute = attributes[i]) !== undefined; i++) {
							result[attribute] = self.element.getAttributes(attribute);
						}
					}
				}

				return result;
			},
			setAttribute: function(attribute, value) {
				var self = this;

				if(attribute && typeof attribute === stringString) {
					self.element.setAttribute(attribute, value);
				}

				return self;
			},
			setAttributes: function(attributes) {
				var self = this;

				if(attributes && typeof attributes === stringObject && !attributes.length) {
					var attribute;

					for(attribute in attributes) {
						self.element.setAttribute(attribute, attributes[attribute]);
					}
				}

				return self;
			},
			removeAttribute: function(attribute) {
				var self = this;

				if(attribute && typeof attribute === stringString) {
					attribute = attribute.split(' ');

					if(attribute.length === 1) {
						self.element.removeAttribute(attribute[0]);
					} else {
						self.removeAttributes(attribute);
					}
				}

				return self;
			},
			removeAttributes: function(attributes) {
				var self = this;

				if(attributes) {
					attributes = (typeof attributes === stringString) ? attributes.split(' ') : attributes;

					if(typeof attributes === stringObject && attributes.length) {
						var i, attribute;

						for(i = 0; (attribute = attributes[i]) !== undefined; i++) {
							self.element.removeAttribute(attribute);
						}
					}
				}

				return self;
			},
			getStyle: function(property) {
				if(property && typeof property === stringString) {
					var self = this;

					property = property.split(' ');

					if(property.length === 1) {
						return window.getComputedStyle(self.element, null).getPropertyValue(property[0]);
					} else {
						return self.getStyles(property);
					}
				}
			},
			getStyles: function(properties) {
				var self   = this,
					result = {};

				if(properties) {
					properties = (typeof properties === stringString) ? properties.split(' ') : properties;

					if(typeof properties === stringObject && properties.length) {
						var i, property;

						for(i = 0; (property = properties[i]) !== undefined; i++) {
							result[property] = window.getComputedStyle(self.element, null).getPropertyValue(property);
						}
					}
				}

				return result;
			},
			setStyle: function(property, value) {
				var self = this;

				if(property && typeof property === stringString) {
					self.element.style[property] = value;
				}

				return self;
			},
			setStyles: function(properties) {
				var self = this;

				if(properties && typeof properties === stringObject && !properties.length) {
					var property;

					for(property in properties) {
						self.element.style[property] = properties[property];
					}
				}

				return self;
			},
			isVisible: function() {
				var element = this.element;

				return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
			},
			on: function(events, fn) {
				var self = this,
					i, listener;

				events = events.split(' ');

				for(i = 0; (listener = events[i]) !== undefined; i++) {
					(self.listener[listener] = self.listener[listener] || []).push(fn);

					onMethod.call(self, listener, fn);
				}

				return self;
			},
			one: function(events, fn, each) {
				each = (each === false) ? false : true;

				var self = this;

				self.on(events, function listener(event) {
					self.off(((each === true) ? event.type : events), listener);

					fn.call(this, event);
				});

				return self;
			},
			off: function(events, fn) {
				var self = this,
					i, name, j, listener;

				if(events) {
					events = events.split(' ');

					for(i = 0; (name = events[i]) !== undefined; i++) {
						self.listener[name] = self.listener[name] || [];

						if(fn) {
							for(j = 0; (listener = self.listener[name][j]) !== undefined; j++) {
								if(listener === fn) {
									self.listener[name].splice(j, 1);
									offMethod.call(self, name, listener);

									j--;
								}
							}
						} else {
							while(self.listener[name].length > 0) {
								offMethod.call(self, name, self.listener[name].pop());
							}
						}
					}
				} else {
					for(name in self.listener) {
						while(self.listener[name].length > 0) {
							offMethod.call(self, name, self.listener[name].pop());
						}
					}
				}

				return self;
			},
			emit: function(event, data) {
				var self = this;

				emitMethod.call(self, event, data);

				return self;
			}
		});
	},
	function() {
		if(!window.getComputedStyle) {
			var getComputedStyleRegex    = new RegExp('(\\-([a-z]){1})', 'g'),
				getComputedStyleCallback = function() {
					return arguments[2].toUpperCase();
				};

			window.getComputedStyle = function(element, pseudo) {
				this.element = element;

				this.getPropertyValue = function(property) {
					if(property === 'float') {
						property = 'styleFloat';
					}

					if(getComputedStyleRegex.test(property)) {
						property = property.replace(getComputedStyleRegex, getComputedStyleCallback);
					}

					return element.currentStyle[property] ? element.currentStyle[property] : null;
				};

				return this;
			};
		}
	},
	window)
);