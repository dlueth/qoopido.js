/*
 * Qoopido support
 *
 * Provides basic mechanism to do browser feature detection
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require ./polyfill/string/ucfirst
 * @require q (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('support', pDefinition, arguments, true);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base', './polyfill/string/ucfirst', 'q', './pool/dom' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies, namespace, window, document, undefined) {
	'use strict';

	var Q               = window.Q || dependencies[2],
		regexProperty   = new RegExp('-([a-z])', 'gi'),
		regexPrefix     = new RegExp('^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])'),
		callbackUcfirst = function(value) {
			return value.ucfirst();
		},
		lookup = {
			prefix:   null,
			property: { },
			method:   { },
			element:  { },
			promises: {
				prefix: null,
				property: { },
				method: { },
				test: { }
			}
		};

	return modules['base'].extend({
		test: { },
		testMultiple: function() {
			var test, tests = [], i = 0;

			for(i; (test = arguments[i]) !== undefined; i++) {
				switch(typeof test) {
					case 'string':
						tests.push(this.test[test]());
						break;
					case 'boolean':
						var deferred = Q.defer();

						!!(test) ? deferred.resolve() : deferred.reject();

						tests.push(deferred.promise);
						break;
					default:
						tests.push(test);
						break;
				}
			}

			return Q.all(tests);
		},
		getPrefix: function() {
			var property,
				stored = lookup.prefix || null;

			if(stored === null) {
				var sample = window.qoopido.shared.pool.dom.obtain('div'),
					styles = sample.style;

				stored = false;

				for(property in styles) {
					if(regexPrefix.test(property)) {
						stored = property.match(regexPrefix)[0];
					}
				}

				if(stored === false && 'WebkitOpacity' in styles) {
					stored = 'WebKit';
				}

				if(stored === false && 'KhtmlOpacity' in styles) {
					stored =  'Khtml';
				}

				stored = lookup.prefix = (stored === false)? false : { method: stored, properties: [ stored.toLowerCase(), stored.toLowerCase().ucfirst() ] };

				sample.dispose();
			}

			return stored;
		},
		getProperty: function(pProperty) {
			pProperty = pProperty.replace(regexProperty, callbackUcfirst);

			var stored = lookup.property[pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidate,
					i          = 0,
					sample     = window.qoopido.shared.pool.dom.obtain('div'),
					uProperty  = pProperty.ucfirst(),
					prefixes   = (this.getPrefix() || { properties: [] }).properties,
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' ');

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(sample.style[candidate] !== undefined) {
						stored = candidate;
						break;
					}
				}

				lookup.property[pProperty] = stored;

				sample.dispose();
			}

			return stored;
		},
		getMethod: function(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.method[type] = lookup.method[type] || { },
				stored  = pointer[pMethod] = lookup.method[type][pMethod] || null;

			if(stored === null) {
				stored = false;

				var candidates, candidate,
					i          = 0,
					uMethod    = pMethod.ucfirst(),
					prefixes   = this.getPrefix();

				if(prefixes !== false) {
					candidates = (pMethod + ' ' + prefixes.method + uMethod + ' ' + prefixes.properties.join(uMethod + ' ') + uMethod).split(' ');
				} else {
					candidates = [ pMethod ];
				}

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(pElement[candidate] !== undefined && (typeof pElement[candidate] === 'function' || typeof pElement[candidate] === 'object')) {
						stored = candidate;
						break;
					}
				}

				lookup.method[type][pMethod] = stored;
			}

			return stored;
		},
		supportsPrefix: function() {
			return !!this.getPrefix();
		},
		supportsProperty: function(pProperty) {
			return !!this.getProperty(pProperty);
		},
		supportsMethod: function(pMethod, pElement) {
			return !!this.getMethod(pMethod, pElement);
		},
		testPrefix: function() {
			var stored = lookup.promises.prefix;

			if(stored === null) {
				var deferred = Q.defer(),
					prefix   = this.getPrefix();

				(!!prefix) ? deferred.resolve(prefix) : deferred.reject();

				stored = lookup.promises.prefix = deferred.promise;
			}

			return stored;
		},
		testProperty: function(pProperty) {
			var stored = lookup.promises.property[pProperty] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					property = this.getProperty(pProperty);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.property[pProperty] =  deferred.promise;
			}

			return stored;
		},
		testMethod: function(pMethod, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.promises.method[type] = lookup.promises.method[type] || { },
				stored  = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					method   = this.getMethod(pMethod, pElement);

				(!!method) ? deferred.resolve(method) : deferred.reject();

				stored = lookup.promises.method[type][pMethod] = deferred.promise;
			}

			return stored;
		},
		addTest: function(pId, pTest) {
			return this.test[pId] = function() {
				var stored = lookup.promises.test[pId] || null;

				if(stored === null) {
					var deferred  = Q.defer(),
						parameter = Array.prototype.slice.call(arguments);

					parameter.splice(0, 0, deferred);

					pTest.apply(null, parameter);

					stored = lookup.promises.test[pId] = deferred.promise;
				}

				return stored;
			};
		}
	});
}, window));