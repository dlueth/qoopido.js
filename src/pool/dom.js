/*
 * Qoopido pool/dom
 *
 * Provides dom pooling facilities
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../pool
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		var module = window.qoopido.initialize('pool/dom', pDefinition, arguments);

		window.qoopido.shared.pool     = window.qoopido.shared.pool || {};
		window.qoopido.shared.pool.dom = module.create();

		return module;
	}

	if(typeof define === 'function' && define.amd) {
		define(['../pool'], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document) {
	'use strict';

	var prototype;

	prototype = modules['pool'].extend({
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
				if(element.hasOwnProperty(property)) {
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

	return prototype;
}, window));