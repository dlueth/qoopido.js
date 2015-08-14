/*
 * Qoopido polyfill/object/getprototypeof
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */
;(function(definition, qoopido) {
	if(qoopido.register) {
		qoopido.register('polyfill/object/getprototypeof', definition);
	} else {
		(qoopido.modules = qoopido.modules || {})['polyfill/object/getprototypeof'] = definition();
	}
}(function(modules, shared, global, undefined) {
		'use strict';

		if(!Object.getPrototypeOf) {
			if(({}).__proto__ === Object.prototype && ([]).__proto__ === Array.prototype) {
				Object.getPrototypeOf = function getPrototypeOf(object) {
					return object.__proto__;
				};
			} else {
				Object.getPrototypeOf = function getPrototypeOf(object) {
					return object.constructor ? object.constructor.prototype : null;
				};
			}
		}

		return Object.getPrototypeOf;
	},
	this.qoopido = this.qoopido || {}
));