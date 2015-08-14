/*
 * Qoopido url
 *
 * Provides methods to centrally deal with URLs
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./base
 */
;(function(definition, global) {
	global.qoopido.registerSingleton('url', definition, [ './base' ]);
}(function(modules, shared, global, undefined) {
	'use strict';

	var regexParameter = new RegExp('[?&]?([^=]+)=([^&]*)', 'g'),
		urlCurrent, regexLocal;

	try {
		urlCurrent = location;
	} catch(exception) {
		urlCurrent = getResolver();
	}

	regexLocal = new RegExp(''.concat('^', urlCurrent.protocol, '//', urlCurrent.hostname), 'i');

	function getResolver(url) {
		var resolver = document.createElement('a');

		resolver.href = url || '';

		return resolver;
	}

	return modules['base'].extend({
		resolve: function(url) {
			return getResolver(url).href;
		},
		redirect: function redirect(url, target) {
			target = target || global;

			target.location.href = this.resolve(url);
		},
		getParameter: function(url) {
			var params      = {},
				querystring = getResolver(url).search.split('+').join(' '),
				tokens;

			while(tokens = regexParameter.exec(querystring)) {
				params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			}

			return params;
		},
		isLocal: function(url) {
			return regexLocal.test(this.resolve(url));
		}
	});
}, this));