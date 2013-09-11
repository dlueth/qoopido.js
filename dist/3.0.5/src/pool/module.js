/*
 * Qoopido pool/dom
 *
 * Provides module pooling facilities
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
		return window.qoopido.initialize('pool/module', pDefinition, arguments);
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
		_module:  null,
		_destroy: null,
		_constructor: function(module, options) {
			var self = this;

			self._module = module;

			if(typeof module._destroy === 'function') {
				self._destroy = function(element) {
					element._destroy();
				};
			}

			prototype._parent._constructor.call(self, options);
		},
		_dispose: function(element) {
			return element;
		},
		_obtain: function() {
			return this._module.create.apply(this._module, arguments);
		},
	});

	return prototype;
}, window));