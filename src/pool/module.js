/*
 * Qoopido pool/module
 *
 * Provides module pooling facilities
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
 * @require ../function/unique/uuid
 */
;(function(definition, global) {
	global.qoopido.register('pool/module', definition, [ '../pool', '../function/unique/uuid' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var uniqueUuid = qoopido.module('function/unique/uuid'),
		mPoolModule;

	var prototype = qoopido.module('pool').extend({
		_module:  null,
		_destroy: null,
		_constructor: function(module, options, useShared) {
			var self    = this,
				uuid    = module._puid || (module._puid = uniqueUuid()),
				pointer = useShared && mPoolModule;

			if(useShared === true && pointer[uuid]) {
				return pointer[uuid];
			} else {
				self = prototype._parent._constructor.call(this, options);

				self._module = module;

				if(typeof module._destroy === 'function') {
					self._destroy = function(element) {
						element._destroy();
					};
				}

				if(useShared === true) {
					pointer[uuid] = self;
				}
			}

			return self;
		},
		_dispose: function(element) {
			return element;
		},
		_obtain: function() {
			return this._module.create.apply(this._module, arguments);
		}
	});

	qoopido.shared()['pool/module'] = mPoolModule = {};

	return prototype;
}, this));