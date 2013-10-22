/*
 * Qoopido pool/dom
 *
 * Provides dom pooling facilities
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../pool
 */
;(function(definition) {
	window.qoopido.register('pool/dom', definition, [ '../pool' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype = modules['pool'].extend({
		_initPool: function() {
			return {};
		},
		_getPool: function(type) {
			var self = this;

			if(typeof type !== 'string') {
				type = type.tagName.toLowerCase();
			}

			return (self._pool[type] = self._pool[type] || []);
		},
		_dispose: function(element) {
			var property;

			if(element.parentNode) {
				element.parentNode.removeChild(element);
			}

			for(property in element) {
				if(Object.prototype.hasOwnProperty.call(element, property)) {
					try {
						element.removeAttribute(property);
					} catch(exception) {
						element.property = null;
					}
				}
			}

			return element;
		},
		_obtain: function(type) {
			return document.createElement(type);
		}
	});

	shared.pool     = shared.pool || {};
	shared.pool.dom = prototype.create();

	return prototype;
}));