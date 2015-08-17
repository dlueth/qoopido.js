/*
 * Qoopido pool/object
 *
 * Provides object pooling facilities
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../pool
 */
;(function(definition, global) {
	global.qoopido.register('pool/object', definition, [ '../pool' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var prototype,
		document        = global.document,
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

	prototype = qoopido.module('pool').extend({
		getModel: function() {
			return model;
		},
		_dispose: function(element) {
			var property;

			element[objectPrototype] = model;

			for(property in element) {
				delete element[property];
			}

			return element;
		},
		_obtain: function() {
			return {};
		}
	});

	qoopido.shared()['pool/object'] = prototype.create();

	return prototype;
}, this));