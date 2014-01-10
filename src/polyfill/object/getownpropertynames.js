/*
 * Qoopido polyfill/object/getownpropertynames
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
;(function(definition, qoopido) {
	if(qoopido.register) {
		qoopido.register('polyfill/object/getownpropertynames', definition);
	} else {
		(qoopido.modules = qoopido.modules || {})['polyfill/object/getownpropertynames'] = definition();
	}
}(function(modules, shared, namespace, navigator, window, document, undefined) {
		'use strict';

		if(!Object.getOwnPropertyNames) {
			Object.getOwnPropertyNames = function(obj) {
				if(obj !== Object(obj)) {
					throw new TypeError('Object.getOwnPropertyNames called on non-object');
				}

				var props = [],
					p;

				for(p in obj) {
					if(Object.prototype.hasOwnProperty.call(obj, p)) {
						props.push(p);
					}
				}

				return props;
			};
		}

		return true;
	},
	window.qoopido = window.qoopido || {}
));