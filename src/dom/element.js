/*
 * Qoopido dom/element
 *
 * Provides additional methods for DOM elements
 *
 * Copyright (c) 2014 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../base
 * @require ../function/unique/uuid
 * @require ./event
 * @polyfill ../polyfill/window/customevent
 * @polyfill ../polyfill/window/addeventlistener
 * @polyfill ../polyfill/window/removeeventlistener
 * @polyfill ../polyfill/window/dispatchevent
 * @polyfill ../polyfill/window/getcomputedstyle
 * @polyfill ../polyfill/element/matches
 * @polyfill ../polyfill/document/queryselector
 * @polyfill ../polyfill/document/queryselectorall
 * @optional ../pool/module
 * @optional ../pool/dom
 */
/* jshint loopfunc: true */
;(function(definition) {
	var dependencies = [ '../base', '../function/unique/uuid', './event' ];

	if(!window.CustomEvent) {
		dependencies.push('../polyfill/window/customevent');
	}

	if(!window.addEventListener) {
		dependencies.push('../polyfill/window/addeventlistener');
	}

	if(!window.removeEventListener) {
		dependencies.push('../polyfill/window/removeeventlistener');
	}

	if(!window.dispatchEvent) {
		dependencies.push('../polyfill/window/dispatchevent');
	}

	if(!window.getComputedStyle) {
		dependencies.push('../polyfill/window/getcomputedstyle');
	}

	if(!Element.prototype.matches) {
		dependencies.push('../polyfill/element/matches');
	}

	if(!document.querySelector) {
		dependencies.push('../polyfill/document/queryselector');
	}

	if(!document.querySelectorAll) {
		dependencies.push('../polyfill/document/queryselectorall');
	}

	window.qoopido.register('dom/element', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var stringObject     = 'object',
		stringString     = 'string',
		getComputedStyle = window.getComputedStyle || modules['polyfill/window/getcomputedstyle'],
		generateUuid     = modules['function/unique/uuid'],
		contentAttribute = ('textContent' in document.createElement('a')) ? 'textContent' : 'innerText',
		isTag            = new RegExp('^<(\\w+)\\s*/>$'),
		pool             = {
			module: modules['pool/module'] && modules['pool/module'].create(modules['dom/event']) || null,
			dom:    (shared.pool && shared.pool.dom) ? shared.pool.dom : null
		},
		storage          = {
			elements: {},
			events:   {}
		};

	function resolveElement(element) {
		var tag;

		if(typeof element === 'string') {
			try {
				if(isTag.test(element) === true) {
					tag = element.replace(isTag, '$1').toLowerCase();

					element = pool.dom && pool.dom.obtain(tag) || document.createElement(tag);
				} else {
					element = document.querySelector(element);
				}
			} catch(exception) {
				element = null;
			}
		}

		if(!element) {
			throw new Error('Element could not be resolved');
		}

		return element;
	}

	function emitEvent(event, detail, uuid) {
		var self = this;

		event = new window.CustomEvent(event, { bubbles: (event === 'load') ? false : true, cancelable: true, detail: detail });

		if(uuid) {
			event._quid      = uuid;
			event.isDelegate = true;
		}

		self.element.dispatchEvent(event);
	}

	return modules['base'].extend({
		type:      null,
		element:   null,
		_listener: null,
		_constructor: function(element, attributes, styles) {
			var self = this,
				uuid = element._quid || null;

			self._listener = {};

			element = resolveElement(element);

			if(uuid && storage.elements[uuid]) {
				return storage.elements[uuid];
			} else {
				self.type      = element.tagName;
				self.element   = element;
				uuid           = generateUuid();
				element._quid  = uuid;
				storage.elements[uuid] = self;
			}

			if(typeof attributes === 'object' && attributes !== null) {
				self.setAttributes(attributes);
			}

			if(typeof styles === 'object' && styles !== null) {
				self.setStyles(styles);
			}
		},
		_obtain: function(element, attributes, styles) {
			this._constructor(element, attributes, styles);
		},
		_dispose: function() {
			var self    = this,
				element = self.element,
				uuid    = element._quid || null,
				pointer = self._listener,
				listener;

			self.type = null;

			for(listener in pointer) {
				listener = pointer[listener];

				element.removeEventListener(listener.type, listener);

				delete pointer[listener];
			}

			element.dispose && element.dispose();

			if(uuid && storage.elements[uuid]) {
				delete storage.elements[uuid];
			}
		},
		getContent: function(html) {
			var element = this.element;

			return (html && html !== false) ? element.innerHTML : element[contentAttribute];
		},
		setContent: function(content, html) {
			var self    = this,
				element = self.element;

			if(html && html !== false) {
				element.innerHTML = content;
			} else {
				element[contentAttribute] = content;
			}

			return self;
		},
		getAttribute: function(attribute) {
			var self = this;

			if(attribute && typeof attribute === stringString) {
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
					var i = 0, attribute;

					for(; (attribute = attributes[i]) !== undefined; i++) {
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
			var self = this,
				attribute;

			if(attributes && typeof attributes === stringObject && !attributes.length) {
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
			var self = this,
				i = 0, attribute;

			if(attributes) {
				attributes = (typeof attributes === stringString) ? attributes.split(' ') : attributes;

				if(typeof attributes === stringObject && attributes.length) {
					for(; (attribute = attributes[i]) !== undefined; i++) {
						self.element.removeAttribute(attribute);
					}
				}
			}

			return self;
		},
		getStyle: function(property) {
			var self = this;

			if(property && typeof property === stringString) {
				property = property.split(' ');

				if(property.length === 1) {
					return getComputedStyle(self.element, null).getPropertyValue(property[0]);
				} else {
					return self.getStyles(property);
				}
			}
		},
		getStyles: function(properties) {
			var self   = this,
				result = {},
				i = 0, property;

			if(properties) {
				properties = (typeof properties === stringString) ? properties.split(' ') : properties;

				if(typeof properties === stringObject && properties.length) {
					for(; (property = properties[i]) !== undefined; i++) {
						result[property] = getComputedStyle(self.element, null).getPropertyValue(property);
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
			var self = this,
				property;

			if(properties && typeof properties === stringObject && !properties.length) {
				for(property in properties) {
					self.element.style[property] = properties[property];
				}
			}

			return self;
		},
		siblings: function(selector) {
			var element  = this.element,
				pointer  = element.parentNode.firstChild,
				siblings = [];

			for(; pointer; pointer = pointer.nextSibling) {
				if(pointer.nodeType === 1 && pointer !== element) {
					if(!selector || pointer.matches(selector)) {
						siblings.push(pointer);
					}
				}
			}

			return siblings;
		},
		siblingsBefore: function(selector) {
			var pointer  = this.element.previousSibling,
				siblings = [];

			for(; pointer; pointer = pointer.previousSibling) {
				if(pointer.nodeType === 1) {
					if(!selector || pointer.matches(selector)) {
						siblings.push(pointer);
					}
				}
			}

			return siblings;
		},
		siblingsAfter: function(selector) {
			var pointer  = this.element.nextSibling,
				siblings = [];

			for(; pointer; pointer = pointer.nextSibling) {
				if(pointer.nodeType === 1) {
					if(!selector || pointer.matches(selector)) {
						siblings.push(pointer);
					}
				}
			}

			return siblings;
		},
		previous: function(selector) {
			var pointer;

			if(!selector) {
				return this.element.previousSibling;
			} else {
				pointer = this.element.previousSibling;

				for(; pointer; pointer = pointer.previousSibling) {
					if(pointer.nodeType === 1 && pointer.matches(selector)) {
						return pointer;
					}
				}
			}
		},
		next: function(selector) {
			var pointer;

			if(!selector) {
				return this.element.nextSibling;
			} else {
				pointer = this.element.nextSibling;

				for(; pointer; pointer = pointer.nextSibling) {
					if(pointer.nodeType === 1 && pointer.matches(selector)) {
						return pointer;
					}
				}
			}
		},
		find: function(selector) {
			return this.element.querySelectorAll(selector);
		},
		parent: function(selector) {
			var pointer;

			if(!selector) {
				return this.element.parentNode;
			} else {
				pointer = this.element;

				for(; pointer; pointer = pointer.parentNode) {
					if(pointer.matches(selector)) {
						return pointer;
					}
				}
			}
		},
		parents: function(selector) {
			var pointer = this.element.parentNode,
				parents = [];

			for(; pointer; pointer = pointer.parentNode) {
				if(pointer.nodeType === 9) {
					return parents;
				} else if (pointer.nodeType === 1) {
					if(!selector || pointer.matches(selector)) {
						parents.push(pointer);
					}
				}
			}
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
				self.element.className = self.element.className.replace(new RegExp('(?:^|\\s)' + name + '(?!\\S)'));
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

			element = element.element || resolveElement(element);

			target.firstChild ? target.insertBefore(element, target.firstChild) : self.append(element);

			return self;
		},
		append: function(element) {
			var self = this;

			self.element.appendChild(element.element || resolveElement(element));

			return self;
		},
		replaceWith: function(element) {
			var self    = this,
				target = self.element;

			element = element.element || resolveElement(element);

			target.parentNode.replaceChild(element, target);

			return self;
		},
		prependTo: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || resolveElement(target)).firstChild ? target.insertBefore(element, target.firstChild) : self.appendTo(target);

			return self;
		},
		appendTo: function(target) {
			var self = this;

			(target.element || resolveElement(target)).appendChild(self.element);

			return self;
		},
		insertBefore: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || resolveElement(target)).parentNode.insertBefore(element, target);

			return self;
		},
		insertAfter: function(target) {
			var self    = this,
				element = self.element;

			(target = target.element || resolveElement(target)).nextSibling ? target.parentNode.insertBefore(element, target.nextSibling) : self.appendTo(target.parentNode);

			return self;
		},
		replace: function(target) {
			var self    = this,
				element = self.element;

			(target  = target.element || resolveElement(target)).parentNode.replaceChild(element, target);

			return self;
		},
		remove: function() {
			var self    = this,
				element = self.element;

			element.parentNode.removeChild(element);

			return self;
		},
		on: function(events) {
			var self     = this,
				element  = self.element,
				delegate = (arguments.length > 2) ? arguments[1] : null,
				fn       = (arguments.length > 2) ? arguments[2] : arguments[1],
				uuid     = fn._quid || (fn._quid = generateUuid()),
				i = 0, event;

			events  = events.split(' ');

			for(; (event = events[i]) !== undefined; i++) {
				var id       = event + '-' + uuid,
					listener = function(event) {
						var uuid = event._quid || (event._quid = generateUuid()),
							delegateTo;

						if(!storage.events[uuid]) {
							storage.events[uuid] = pool.module && pool.module.obtain(event) || modules['dom/event'].create(event);
						}

						event      = storage.events[uuid];
						delegateTo = event.delegate;

						window.clearTimeout(event._timeout);

						if(!delegate || event.target.matches(delegate)) {
							fn.call(self, event);
						}

						if(delegateTo) {
							delete event.delegate;

							emitEvent.call(self, delegateTo, null, event._quid);
						}

						event._timeout = window.setTimeout(function() {
							delete storage.events[uuid];
							delete event._timeout;

							event.dispose && event.dispose();
						}, 5000);
					};

				listener.type      = event;
				self._listener[id] = listener;

				element.addEventListener(event, listener);
			}

			return self;
		},
		one: function(events) {
			var self     = this,
				delegate = (arguments.length > 2) ? arguments[1] : null,
				fn       = (arguments.length > 2) ? arguments[2] : arguments[1],
				each     = ((arguments.length > 2) ? arguments[3] : arguments[2]) !== false,
				listener = function(event) {
					self.off(((each === true) ? event.type : events), listener);

					fn.call(self, event);
				};

			fn._quid = listener._quid = generateUuid();

			if(delegate) {
				self.on(events, delegate, listener);
			} else {
				self.on(events, listener);
			}

			return self;
		},
		off: function(events, fn) {
			var self    = this,
				element = self.element,
				i = 0, event, id, listener;

			events = events.split(' ');

			for(; (event = events[i]) !== undefined; i++) {
				id       = fn._quid && event + '-' + fn._quid || null;
				listener = id && self._listener[id] || null;

				if(listener) {
					element.removeEventListener(event, listener);
					delete self._listener[id];
				} else {
					element.removeEventListener(event, fn);
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