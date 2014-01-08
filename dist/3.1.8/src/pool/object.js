/*
 * Qoopido pool/object
 *
 * Provides object pooling facilities
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
	window.qoopido.register('pool/object', definition, [ '../pool' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		supportsProto   = (Object.prototype.__proto__ === null),
		objectPrototype = (supportsProto) ? '__proto__' : 'prototype',
		model           = (supportsProto) ? null : (function() {
			var iframe = document.createElement('iframe'),
				parent = document.body || document.documentElement;

			iframe.style.display = 'none';
			parent.appendChild(iframe);
			iframe.src = 'javascript:';
			var empty = iframe.contentWindow.Object.prototype;
			parent.removeChild(iframe);
			iframe = null;
			delete empty.constructor;
			delete empty.hasOwnProperty;
			delete empty.propertyIsEnumerable;
			delete empty.isPrototypeOf;
			delete empty.toLocaleString;
			delete empty.toString;
			delete empty.valueOf;
			empty.__proto__ = null;

			return empty;
		}());

	prototype = modules['pool'].extend({
		getModel: function() {
			return model;
		},
		_dispose: function(element) {
			var property;

			element[objectPrototype] = model;

			for(property in element) {
				delete element[property];
			}

			/*
			This code does work but seems suboptimal
			for(property in element) {
				if(element.hasOwnProperty(property)) {
					delete element[property];
				}
			}

			element[objectPrototype] = model;
			*/

			return element;
		},
		_obtain: function() {
			return {};
		}
	});

	shared.pool        = shared.pool || {};
	shared.pool.object = prototype.create();

	return prototype;
}));