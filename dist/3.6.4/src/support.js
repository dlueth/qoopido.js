/*!
* Qoopido.js library
*
* version: 3.6.4
* date:    2015-4-29
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition) {
    var dependencies = [ "./base", "./promise/all", "./promise/defer" ];
    if (!String.prototype.ucfirst) {
        dependencies.push("./polyfill/string/ucfirst");
    }
    if (!String.prototype.lcfirst) {
        dependencies.push("./polyfill/string/lcfirst");
    }
    window.qoopido.registerSingleton("support", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var CombinedPromise = modules["promise/all"], DeferredPromise = modules["promise/defer"], matchPrefix = new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"), removeJsPrefix = new RegExp("^(?:webkit|khtml|icab|moz|ms|o)([A-Z])"), removeCssPrefix = new RegExp("^-(?:webkit|khtml|icab|moz|ms|o)-"), convertToCamelCase = new RegExp("-([a-z])", "gi"), convertToHyphens = new RegExp("([A-Z])", "g"), callbackUcfirst = function() {
        return arguments[1].ucfirst();
    }, lookup = {
        prefix: null,
        method: {},
        property: {},
        css: {},
        promises: {
            prefix: null,
            method: {},
            property: {},
            css: {},
            test: {}
        }
    };
    function normalize(value) {
        return value.replace(removeJsPrefix, "$1").lcfirst().replace(removeCssPrefix, "").replace(convertToCamelCase, callbackUcfirst);
    }
    return modules["base"].extend({
        test: {},
        pool: shared.pool && shared.pool.dom,
        testMultiple: function() {
            var test, tests = [], i = 0;
            for (;(test = arguments[i]) !== undefined; i++) {
                switch (typeof test) {
                  case "string":
                    tests.push(this.test[test]());
                    break;

                  case "boolean":
                    var deferred = new DeferredPromise();
                    !!test ? deferred.resolve() : deferred.reject();
                    tests.push(deferred.promise);
                    break;

                  default:
                    tests.push(test);
                    break;
                }
            }
            return new CombinedPromise(tests);
        },
        getPrefix: function() {
            var self = this, stored = lookup.prefix || null, property;
            if (stored === null) {
                var sample = self.pool ? self.pool.obtain("div") : document.createElement("div"), styles = sample.style;
                stored = false;
                for (property in styles) {
                    if (matchPrefix.test(property)) {
                        stored = property.match(matchPrefix)[0];
                    }
                }
                if (stored === false && "WebkitOpacity" in styles) {
                    stored = "WebKit";
                }
                if (stored === false && "KhtmlOpacity" in styles) {
                    stored = "Khtml";
                }
                stored = lookup.prefix = stored === false ? false : [ stored.toLowerCase(), stored.toLowerCase().ucfirst(), stored ];
                sample.dispose && sample.dispose();
            }
            return stored;
        },
        getMethod: function(pMethod, pElement) {
            pMethod = normalize(pMethod);
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.method[type] = lookup.method[type] || {}, stored = pointer[pMethod] = lookup.method[type][pMethod] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uMethod = pMethod.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pMethod + " " + uMethod + " " + prefixes.join(uMethod + " ") + uMethod).split(" ");
                } else {
                    candidates = [ pMethod ];
                }
                for (;(candidate = candidates[i]) !== undefined; i++) {
                    if (pElement[candidate] !== undefined && (typeof pElement[candidate] === "function" || typeof pElement[candidate] === "object")) {
                        stored = candidate;
                        break;
                    }
                }
                lookup.method[type][pMethod] = stored;
            }
            return stored;
        },
        getProperty: function(pProperty, pElement) {
            pProperty = normalize(pProperty);
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.property[type] = lookup.property[type] || {}, stored = pointer[pProperty] = lookup.property[type][pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidates, candidate, i = 0, uProperty = pProperty.ucfirst(), prefixes = this.getPrefix();
                if (prefixes !== false) {
                    candidates = (pProperty + " " + uProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" ");
                } else {
                    candidates = [ pProperty ];
                }
                for (i; (candidate = candidates[i]) !== undefined; i++) {
                    if (pElement[candidate] !== undefined) {
                        stored = candidate;
                        break;
                    }
                }
                lookup.property[type][pProperty] = stored;
            }
            return stored;
        },
        getCssProperty: function(pProperty) {
            pProperty = normalize(pProperty);
            var self = this, stored = lookup.css[pProperty] || null;
            if (stored === null) {
                stored = false;
                var candidate, i = 0, sample = self.pool ? self.pool.obtain("div") : document.createElement("div"), uProperty = pProperty.ucfirst(), prefixes = this.getPrefix() || [], candidates = (pProperty + " " + uProperty + " " + prefixes.join(uProperty + " ") + uProperty).split(" "), prefix = "";
                for (i; (candidate = candidates[i]) !== undefined; i++) {
                    if (sample.style[candidate] !== undefined) {
                        stored = candidate;
                        if (i > 0) {
                            prefix = "-";
                        }
                        break;
                    }
                }
                stored = lookup.css[pProperty] = stored !== false ? [ prefix + stored.replace(convertToHyphens, "-$1").toLowerCase(), stored ] : false;
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
            if (stored === null) {
                var deferred = new DeferredPromise(), prefix = this.getPrefix();
                !!prefix ? deferred.resolve(prefix) : deferred.reject();
                stored = lookup.promises.prefix = deferred.promise;
            }
            return stored;
        },
        testMethod: function(pMethod, pElement) {
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.promises.method[type] = lookup.promises.method[type] || {}, stored = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), method = this.getMethod(pMethod, pElement);
                !!method ? deferred.resolve(method) : deferred.reject();
                stored = lookup.promises.method[type][pMethod] = deferred.promise;
            }
            return stored;
        },
        testProperty: function(pProperty, pElement) {
            pElement = pElement || window;
            var type = pElement.tagName, pointer = lookup.promises.property[type] = lookup.promises.property[type] || {}, stored = pointer[pProperty] = lookup.promises.property[type][pProperty] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), property = this.getProperty(pProperty, pElement);
                !!property ? deferred.resolve(property) : deferred.reject();
                stored = lookup.promises.property[type][pProperty] = deferred.promise;
            }
            return stored;
        },
        testCssProperty: function(pProperty) {
            var stored = lookup.promises.css[pProperty] || null;
            if (stored === null) {
                var deferred = new DeferredPromise(), property = this.getCssProperty(pProperty);
                !!property ? deferred.resolve(property) : deferred.reject();
                stored = lookup.promises.css[pProperty] = deferred.promise;
            }
            return stored;
        },
        addTest: function(pId, pTest) {
            return this.test[pId] = function() {
                var stored = lookup.promises.test[pId] || null;
                if (stored === null) {
                    var deferred = new DeferredPromise(), parameter = Array.prototype.slice.call(arguments);
                    parameter.splice(0, 0, deferred);
                    pTest.apply(null, parameter);
                    stored = lookup.promises.test[pId] = deferred.promise;
                }
                return stored;
            };
        }
    });
});