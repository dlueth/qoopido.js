/*!
* Qoopido.js library
*
* version: 3.7.3
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition, navigator, global, document, undefined) {
    "use strict";
    function register(id, definition, dependencies, callback) {
        var namespace = id.split("/"), initialize;
        if (modules[id]) {
            return modules[id];
        }
        initialize = function() {
            if (dependencies) {
                var path = namespace.slice(0, -1).join("/"), i = 0, dependency, internal;
                for (;(dependency = dependencies[i]) !== undefined; i++) {
                    internal = isInternal.test(dependency);
                    if (internal) {
                        dependency = canonicalize(path + "/" + dependency);
                    }
                    if (!modules[dependency] && arguments[i]) {
                        modules[dependency] = arguments[i];
                    }
                    if (internal && !modules[dependency] && typeof console !== "undefined") {
                        console.error("".concat("[Qoopido.js] ", id, ": Could not load dependency ", dependency));
                    }
                }
            }
            modules[id] = definition(modules, shared, namespace, navigator, global, document, undefined);
            if (callback) {
                callback(modules[id]);
            }
            return modules[id];
        };
        if (typeof module !== "undefined" && module.exports) {
            module.exports = define(initialize);
        } else if (typeof define === "function" && define.amd) {
            dependencies ? define(dependencies, initialize) : define(initialize);
        } else {
            initialize();
        }
    }
    function registerSingleton(id, definition, dependencies) {
        register(id, definition, dependencies, function(module) {
            modules[id] = module.create();
        });
    }
    var qoopido = global.qoopido || (global.qoopido = {}), shared = qoopido.shared || (qoopido.shared = {}), modules = qoopido.modules || (qoopido.modules = {}), dependencies = [], isInternal = new RegExp("^\\.+\\/"), regexCanonicalize = new RegExp("(?:\\/|)[^\\/]*\\/\\.\\."), removeNeutral = new RegExp("(^\\/)|\\.\\/", "g");
    qoopido.register = register;
    qoopido.registerSingleton = registerSingleton;
    function canonicalize(path) {
        var collapsed;
        while ((collapsed = path.replace(regexCanonicalize, "")) !== path) {
            path = collapsed;
        }
        return path.replace(removeNeutral, "");
    }
    if (!Object.create) {
        dependencies.push("./polyfill/object/create");
    }
    if (!Object.getOwnPropertyNames) {
        dependencies.push("./polyfill/object/getownpropertynames");
    }
    if (!Object.getOwnPropertyDescriptor || !function() {
        try {
            Object.getOwnPropertyDescriptor({
                x: 0
            }, "x");
            return true;
        } catch (exception) {
            return false;
        }
    }()) {
        dependencies.push("./polyfill/object/getownpropertydescriptor");
    }
    register("base", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    function getOwnPropertyDescriptors(object) {
        var descriptors = {}, properties = Object.getOwnPropertyNames(object), i = 0, property;
        for (;(property = properties[i]) !== undefined; i++) {
            descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
        }
        return descriptors;
    }
    function prohibitCall() {
        throw new Error("[Qoopido.js] Operation prohibited");
    }
    return {
        create: function() {
            var instance = Object.create(this, getOwnPropertyDescriptors(this)), result;
            if (instance._constructor) {
                result = instance._constructor.apply(instance, arguments);
            }
            instance.create = instance.extend = prohibitCall;
            return result || instance;
        },
        extend: function(properties, final) {
            var instance;
            properties = properties || {};
            final = final === true;
            properties._parent = this;
            instance = Object.create(this, getOwnPropertyDescriptors(properties));
            if (final === true) {
                instance.extend = prohibitCall;
            }
            return instance;
        }
    };
}, navigator, this, document);