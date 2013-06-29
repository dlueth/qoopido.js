/*
 * Qoopido support class to detect browser features
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require q
 */
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('support', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base', 'q' ], definition);
	} else {
		definition(window.qoopido.base, window.Q);
	}
}(function(mPrototype, mQ, namespace, window, document, undefined) {
	'use strict';

	var regexProperty = /-([a-z])/gi,
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

	function _ucfirst() {
		if(arguments.length > 1) {
			return arguments[1].toUpperCase();
		} else {
			return arguments[0].charAt(0).toUpperCase() + arguments[0].slice(1);
		}
	}

	return mPrototype.extend({
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
			var element = lookup.element[pType] = lookup.element[pType] || (pType !== 'image') ? document.createElement(pType) : new Image();

			pClone = !!(pClone);

			return (pClone) ? element.cloneNode(false) : element;
		},
		getPrefix: function getPrefix() {
			var property,
				stored = lookup.prefix || null;

			if(stored === null) {
				var styles = this.getElement('div').style,
					regex  = /^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])/;

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

				stored = lookup.prefix = (stored === false)? false : { method: stored, properties: [ stored.toLowerCase(), _ucfirst(stored.toLowerCase()) ] };
			}

			return stored;
		},
		getProperty: function getProperty(pProperty) {
			pProperty = pProperty.replace(regexProperty, _ucfirst);

			var stored = lookup.property[pProperty] || null;

			if(stored === null) {
				stored = false;

				var candidate,
					i          = 0,
					element    = this.getElement('div'),
					uProperty  = _ucfirst(pProperty),
					prefixes   = (this.getPrefix() || { properties: [] }).properties,
					candidates = (pProperty + ' ' + prefixes.join(uProperty + ' ') + uProperty).split(' ');

				for(i; (candidate = candidates[i]) !== undefined; i++) {
					if(element.style[candidate] !== undefined) {
						stored = candidate;
						break;
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
				stored = false;

				var candidates, candidate,
					i          = 0,
					uMethod    = _ucfirst(pMethod),
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
}, window));