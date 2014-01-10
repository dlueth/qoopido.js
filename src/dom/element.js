/*
 * Qoopido dom/element
 *
 * Provides additional methods for DOM elements
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../base
 * @require ../proxy
 * @polyfill ./polyfill/window/getcomputedstyle
 */
;(function(definition) {
	var dependencies = [ '../proxy' ];

	if(!window.getComputedStyle) {
		dependencies.push('../polyfill/window/getcomputedstyle');
	}

	window.qoopido.register('dom/element', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var attachListener, detachListener, emitEvent,
		stringObject = 'object',
		stringString = 'string';

	function normalizeEvent(event) {
		if(!event.target) {
			event.target = event.srcElement || document;
		}

		if(event.target.nodeType === 3) {
			event.target = event.target.parentNode;
		}

		if(!event.relatedTarget && event.fromElement ) {
			event.relatedTarget = (event.fromElement === event.target) ? event.toElement : event.fromElement;
		}

		return event;
	}

	attachListener = (window.addEventListener) ?
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element[luid] = function(event) { fn.call(this, normalizeEvent(event)); };

			element.addEventListener(name, element[luid], false);
		}
		:
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid;

			if(element['on' + name] !== undefined) {
				luid          = ''.concat('listener[', name, '][', fn._quid || fn, ']');
				element[luid] = function() { fn.call(this, normalizeEvent(window.event)); };

				element.attachEvent('on' + name, element[luid]);
			} else {
				name = ''.concat('fake[', name, ']');

				element[name] = null;

				element.attachEvent('onpropertychange', function(event) {
					if(event.propertyName === name) {
						fn.call(this, normalizeEvent(element[name]));
					}
				});
			}
		};

	detachListener = (window.removeEventListener) ?
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element.removeEventListener(name, element[luid], false);
			delete element[luid];
		}
		:
		function(name, fn) {
			var self    = this,
				element = self.element,
				luid    = ''.concat('listener[', name, '][', fn._quid || fn, ']');

			element.detachEvent('on' + name, element[luid]);
			delete element[luid];
		};

	emitEvent = (document.createEvent) ?
		function(type, data) {
			var self    = this,
				element = self.element,
				event   = document.createEvent('HTMLEvents');

			event.initEvent(type, true, true);
			event.data = data;
			element.dispatchEvent(event);
		}
		:
		function(type, data) {
			var self    = this,
				element = self.element,
				event   = document.createEventObject();

			event.type = event.eventType = type;
			event.data = data;

			try{
				element.fireEvent('on' + event.eventType, event);
			} catch(exception) {
				var name = ''.concat('fake[', type, ']');

				if(element[name] !== undefined) {
					element[name] = event;
				}
			}
		};

	return modules['base'].extend({
		type:     null,
		element:  null,
		listener: null,
		_constructor: function(element) {
			var self = this;

			if(!element) {
				throw new Error('Missing element argument');
			}

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
		hasClass: function(name) {
			return (new RegExp('(?:^|\\s)' + name + '(?:\\s|$)')).test(this.element.className);
		},
		addClass: function(name) {
			var self = this,
				temp;

			if(!self.hasClass(name)) {
				temp = self.element.className.split(' ');

				temp.push(name);

				self.element.className = temp.join(' ');
			}

			return self;
		},
		removeClass: function(name) {
			var self = this;

			if(self.hasClass(name)) {
				self.element.className = self.element.className.replace(new RegExp('(?:^|\\s)' + name + '(?!\\S)'), '');
			}

			return self;
		},
		toggleClass: function(name) {
			var self = this;

			self.hasClass(name) ? self.removeClass(name) : self.addClass(name);

			return self;
		},
		prepend: function(element) {
			var self    = this,
				target = self.element;

			element = element.element || element;

			target.firstChild ? target.insertBefore(element, target.firstChild) : self.append(element);

			return self;
		},
		append: function(element) {
			var self = this;

			self.element.appendChild(element.element || element);

			return self;
		},
		replaceWith: function(element) {
			var self    = this,
				target = self.element;

			element = element.element || element;

			target.parentNode.replaceChild(element, target);

			return self;
		},
		prependTo: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || target).firstChild ? target.insertBefore(element, target.firstChild) : self.appendTo(target);

			return self;
		},
		appendTo: function(target) {
			var self = this;

			(target.element || target).appendChild(self.element);

			return self;
		},
		insertBefore: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || target).parentNode.insertBefore(element, target);

			return self;
		},
		insertAfter: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || target).nextSibling ? target.parentNode.insertBefore(element, target.nextSibling) : self.appendTo(target.parentNode);

			return self;
		},
		replace: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || target).parentNode.replaceChild(element, target);

			return self;
		},
		remove: function() {
			var self    = this,
				element = self.element;

			element.parentNode.removeChild(element);

			return self;
		},
		on: function(events, fn) {
			var self = this,
				i, listener;

			events = events.split(' ');

			for(i = 0; (listener = events[i]) !== undefined; i++) {
				(self.listener[listener] = self.listener[listener] || []).push(fn);

				attachListener.call(self, listener, fn);
			}

			return self;
		},
		one: function(events, fn, each) {
			each = (each !== false);

			var self     = this,
				listener = modules['proxy'].create(self, function(event) {
					self.off(((each === true) ? event.type : events), listener);

					fn.call(self, event);
				});

			self.on(events, listener);

			return self;
		},
		off: function(events, fn) {
			var self = this,
				i, event, j, listener;

			if(events) {
				events = events.split(' ');

				for(i = 0; (event = events[i]) !== undefined; i++) {
					self.listener[event] = self.listener[event] || [];

					if(fn) {
						for(j = 0; (listener = self.listener[event][j]) !== undefined; j++) {
							if(listener === fn) {
								self.listener[event].splice(j, 1);
								detachListener.call(self, event, listener);

								j--;
							}
						}
					} else {
						while(self.listener[event].length > 0) {
							detachListener.call(self, event, self.listener[event].pop());
						}
					}
				}
			} else {
				for(event in self.listener) {
					while(self.listener[event].length > 0) {
						detachListener.call(self, event, self.listener[event].pop());
					}
				}
			}

			return self;
		},
		emit: function(event, data) {
			var self = this;

			emitEvent.call(self, event, data);

			return self;
		}
	});
}));