/*
 * Qoopido support class to detect browser features
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require q
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base', 'q' ], initialize);
	} else {
		initialize(window[namespace].base, window.Q);
	}
}(function(mBase, mQ, window, document, undefined) {
	'use strict';

	var lookup = {
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

	return mBase.extend({
			test: { },
			testMultiple: function testMultiple() {
				var test, tests = [], i = 0;

				for(i; (test = arguments[i]) !== undefined; i++) {
					switch(typeof test) {
						case 'string':
							tests.push(this.test[test]());
							break;
						case 'boolean':
							var deferred = mQ.defer();

							!!(test) ? deferred.resolve() : deferred.reject();

							tests.push(deferred.promise);
							break;
						default:
							tests.push(test);
							break;
					}
				}

				return mQ.all(tests);
			},
			getElement: function getElement(pType, pClone) {
				var element = lookup.element[pType] = lookup.element[pType] || document.createElement(pType);

				pClone = !!(pClone);

				return (pClone) ? element.cloneNode(false) : element;
			},
			getPrefix: function getPrefix() {
				var property,
					stored = lookup.prefix || null,
					styles = this.getElement('div').style,
					regex  = /^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])/;

				if(stored === null) {
					stored = false;

					for(property in styles) {
						if(regex.test(property)) {
							stored = property.match(regex)[0];
						}
					}

					if(stored === false && 'WebkitOpacity' in styles) {
						stored = 'WebKit';
					}

					if(stored === false && 'KhtmlOpacity' in styles) {
						stored =  'Khtml';
					}

					stored = lookup.prefix = (stored === false)? false : { method: stored, property: stored.toLowerCase() };
				}

				return stored;
			},
			getProperty: function getProperty(pProperty) {
				var stored = lookup.property[pProperty] || null;

				if(stored === null) {
					var element = this.getElement('div');

					stored = false;

					if(element.style[pProperty] !== undefined) {
						stored = pProperty;
					} else {
						var prefix;

						if((prefix = this.getPrefix()) !== false) {
							var prefixed = '-' + prefix.property + '-' + pProperty;

							if(element.style[prefixed] !== undefined) {
								stored = prefixed;
							}
						}
					}

					lookup.property[pProperty] = stored;
				}

				return stored;
			},
			getMethod: function getMethod(pMethod, pElement) {
				pElement = pElement || window;

				var type    = pElement.tagName,
					pointer = lookup.method[type] = lookup.method[type] || { },
					stored  = pointer[pMethod] = lookup.method[type][pMethod] || null;

				if(stored === null) {
					var prefix;

					stored = false;

					if(pElement[pMethod] !== undefined && (typeof pElement[pMethod] === 'function' || typeof pElement[pMethod] === 'object')) {
						stored = pMethod;
					}

					if((prefix = this.getPrefix()) !== false) {
						var prefixed = prefix.method + pMethod;

						if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
							stored = prefixed;
						} else {
							prefixed = prefix.property + pMethod;

							if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
								stored = prefixed;
							}
						}
					}

					lookup.method[type][pMethod] = stored;
				}

				return stored;
			},
			supportsPrefix: function supportsPrefix() {
				return !!this.getPrefix();
			},
			supportsProperty: function supportsProperty(pProperty) {
				return !!this.getProperty(pProperty);
			},
			supportsMethod: function supportsMethod(pMethod, pElement) {
				return !!this.getMethod(pMethod, pElement);
			},
			testPrefix: function testPrefix() {
				var stored = lookup.promises.prefix;

				if(stored === null) {
					var deferred = mQ.defer(),
						prefix   = this.getPrefix();

					(!!prefix) ? deferred.resolve(prefix) : deferred.reject();

					stored = lookup.promises.prefix =  deferred.promise;
				}

				return stored;
			},
			testProperty: function testProperty(pProperty) {
				var stored = lookup.promises.property[pProperty] || null;

				if(stored === null) {
					var deferred = mQ.defer(),
						property = this.getProperty(pProperty);

					(!!property) ? deferred.resolve(property) : deferred.reject();

					stored = lookup.promises.property[pProperty] =  deferred.promise;
				}

				return stored;
			},
			testMethod: function testMethod(pMethod, pElement) {
				pElement = pElement || window;

				var type    = pElement.tagName,
					pointer = lookup.promises.method[type] = lookup.promises.method[type] || { },
					stored  = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;

				if(stored === null) {
					var deferred = mQ.defer(),
						method   = this.getMethod(pMethod, pElement);

					(!!method) ? deferred.resolve(method) : deferred.reject();

					stored = lookup.promises.method[type][pMethod] = deferred.promise;
				}

				return stored;
			},
			addTest: function addTest(pId, pTest) {
				return this.test[pId] = function() {
					var stored = lookup.promises.test[pId] || null;

					if(stored === null) {
						var deferred  = mQ.defer(),
							parameter = Array.prototype.slice.call(arguments);

						parameter.splice(0, 0, deferred);

						pTest.apply(null, parameter);

						stored = lookup.promises.test[pId] =  deferred.promise;
					}

					return stored;
				};
			}
		});
}, window, document));