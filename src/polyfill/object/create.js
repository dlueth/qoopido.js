/*
 * Qoopido polyfill/object/create
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./defineproperties
 *
 * @browsers Chrome < 5, Firefox < 4, Internet Explorer < 9, Opera < 11.60, Safari < 5
 */
;(function(definition, qoopido) {
	if(qoopido.register) {
		var dependencies = [];

		if(!Object.defineProperties) {
			dependencies.push('./defineproperties');
		}

		qoopido.register('polyfill/object/create', definition, dependencies);
	} else {
		(qoopido.modules = qoopido.modules || {})['polyfill/object/create'] = definition();
	}
}(function(modules, shared, global, undefined) {
		'use strict';

		if(!Object.create) {
			Object.create = function(prototype, properties) {
				if(typeof prototype !== 'object') {
					throw new TypeError();
				}

				function Constructor() {}
				Constructor.prototype = prototype;

				var obj = new Constructor();

				if(prototype) {
					obj.constructor = Constructor;
				}

				if(arguments.length > 1) {
					if(properties !== Object(properties)) {
						throw new TypeError();
					}

					Object.defineProperties(obj, properties);
				}

				return obj;
			};
		}

		return Object.create;
	},
	this.qoopido = this.qoopido || {}
));