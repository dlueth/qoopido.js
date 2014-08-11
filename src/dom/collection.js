/*
 * Qoopido dom/collection
 *
 * Provides additional methods for DOM element collections
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
 * @require ./element
 * @optional ../pool/module
 */
/* jshint loopfunc: true */
;(function(definition) {
	window.qoopido.register('dom/collection', definition, [ '../base', './element' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var stringObject = 'object',
		stringString = 'string',
		pool         = modules['pool/module'] && modules['pool/module'].create(modules['dom/element']) || null;

	return modules['base'].extend({
		elements: [],
		_constructor: function(elements, attributes, styles) {
			var self = this,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				self.elements.push((pool) ? pool.obtain(element) : modules['dom/element'].create(element));
			}

			if(typeof attributes === 'object' && attributes !== null) {
				self.setAttributes(attributes);
			}

			if(typeof styles === 'object' && styles !== null) {
				self.setStyles(styles);
			}
		},
		get: function(index) {
			return this.elements[index] || null;
		},
		setAttribute: function(attribute, value) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.setAttribute(attribute, value);
			}

			return self;
		},
		setAttributes: function(attributes) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.setAttributes(attributes);
			}

			return self;
		},
		removeAttribute: function(attribute) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.removeAttribute(attribute);
			}

			return self;
		},
		removeAttributes: function(attributes) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.removeAttributes(attributes);
			}

			return self;
		},
		setStyle: function(property, value) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.setStyle(property, value);
			}

			return self;
		},
		setStyles: function(properties) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.setStyles(properties);
			}

			return self;
		},
		prependTo: function(target) {
			var self     = this,
				elements = self.elements,
				i = elements.length - 1, element;

			for(; (element = elements[i]) !== undefined; i--) {
				element.prependTo(target);
			}

			return self;
		},
		appendTo: function(target) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.appendTo(target);
			}

			return self;
		},
		insertBefore: function(target) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				element.insertBefore(target);
			}

			return self;
		},
		insertAfter: function(target) {
			var self     = this,
				elements = self.elements,
				i = elements.length - 1, element;

			for(; (element = elements[i]) !== undefined; i--) {
				element.insertAfter(target);
			}

			return self;
		},
		replace: function(target) {
			var self     = this,
				elements = self.elements,
				i = 0, element;

			for(; (element = elements[i]) !== undefined; i++) {
				if(i === 0) {
					element.replace(target);
				} else {
					element.insertAfter(elements[0]);
				}
			}

			return self;
		},
		remove: function() {
			var self     = this,
				elements = self.elements,
				i = elements.length - 1, element;

			for(; (element = elements[i]) !== undefined; i--) {
				element.remove();
				element.dispose && element.dispose();

				elements.pop();
			}

			return self;
		}
	});

}));