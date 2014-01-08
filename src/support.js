/*
 * Qoopido support
 *
 * Provides basic mechanism to do browser feature detection
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./base
 * @require ./polyfill/string/ucfirst
 * @external Q
 */
;(function(definition) {
	var dependencies = [ './base', 'q' ];

	if(!String.prototype.ucfirst) {
		dependencies.push('./polyfill/string/ucfirst');
	}

	window.qoopido.registerSingleton('support', definition, dependencies);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var Q               = modules['q'] || window.Q,
		regexPrefix     = new RegExp('^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])'),
		regexProperty   = new RegExp('-([a-z])', 'gi'),
		regexCss        = new RegExp('([A-Z])', 'g'),
		callbackUcfirst = function() {
			return arguments[1].ucfirst();
		},
		lookup = {
			prefix:   null,
			method:   { },
			property: { },
			css:      { },
			element:  { },
			promises: {
				prefix:   null,
				method:   { },
				property: { },
				css:      { },
				test:     { }
			}
		};

	return modules['base'].extend({
		test: { },
		pool: shared.pool && shared.pool.dom,
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
			var self   = this,
				stored = lookup.prefix || null,
				property;

			if(stored === null) {
				var sample = self.pool ? self.pool.obtain('div') : document.createElement('div'),
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

				stored = lookup.prefix = (stored === false)? false : [ stored.toLowerCase(), stored.toLowerCase().ucfirst(), stored ];

				sample.dispose && sample.dispose();
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
					candidates = (pMethod + ' ' + prefixes.join(uMethod + ' ') + uMethod).split(' ');
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
		getProperty: function(pProperty, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.property[type] = lookup.property[type] || { },
				stored  = pointer[pProperty] = lookup.property[type][pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidates, candidate,
					i         = 0,
					uProperty = pProperty.ucfirst(),
					prefixes  = this.getPrefix();

				if(prefixes !== false) {
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' ');
				} else {
					candidates = [ pProperty ];
				}

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(pElement[candidate] !== undefined) {
						stored = candidate;
						break;
					}
				}

				lookup.property[type][pProperty] = stored;
			}

			return stored;
		},
		getCssProperty: function(pProperty) {
			pProperty = pProperty.replace(regexProperty, callbackUcfirst);

			var self   = this,
				stored = lookup.css[pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidate,
					i          = 0,
					sample     = self.pool ? self.pool.obtain('div') : document.createElement('div'),
					uProperty  = pProperty.ucfirst(),
					prefixes   = this.getPrefix() || [],
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' '),
					prefix     = '';

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(sample.style[candidate] !== undefined) {
						stored = candidate;

						if(i > 0) {
							prefix = '-';
						}

						break;
					}
				}

				lookup.css[pProperty] = stored !== false ? [prefix + stored.replace(regexCss, '-$1').toLowerCase(), stored] : false;

				sample.dispose && sample.dispose();
			}

			return stored;
		},
		supportsPrefix: function() {
			return !!this.getPrefix();
		},
		supportsMethod: function(pMethod, pElement) {
			return !!this.getMethod(pMethod, pElement);
		},
		supportsProperty: function(pProperty, pElement) {
			return !!this.getProperty(pProperty, pElement);
		},
		supportsCssProperty: function(pProperty) {
			return !!this.getCssProperty(pProperty);
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
		testProperty: function(pProperty, pElement) {
			pElement = pElement || window;

			var type    = pElement.tagName,
				pointer = lookup.promises.property[type] = lookup.promises.property[type] || { },
				stored  = pointer[pProperty] = lookup.promises.property[type][pProperty] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					property = this.getProperty(pProperty, pElement);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.property[type][pProperty] = deferred.promise;
			}

			return stored;
		},
		testCssProperty: function(pProperty) {
			var stored = lookup.promises.css[pProperty] || null;

			if(stored === null) {
				var deferred = Q.defer(),
					property = this.getCssProperty(pProperty);

				(!!property) ? deferred.resolve(property) : deferred.reject();

				stored = lookup.promises.css[pProperty] =  deferred.promise;
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
}));