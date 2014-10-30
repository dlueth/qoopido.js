/*!
* Qoopido.js library
*
* version: 3.5.5
* date:    2014-9-30
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition, qoopido) {
    if (qoopido.register) {
        var dependencies = [];
        if (!Object.defineProperties) {
            dependencies.push("./defineproperties");
        }
        qoopido.register("polyfill/object/create", definition, dependencies);
    } else {
        (qoopido.modules = qoopido.modules || {})["polyfill/object/create"] = definition();
    }
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.create) {
        Object.create = function(prototype, properties) {
            if (typeof prototype !== "object") {
                throw new TypeError();
            }
            function Constructor() {}
            Constructor.prototype = prototype;
            var obj = new Constructor();
            if (prototype) {
                obj.constructor = Constructor;
            }
            if (arguments.length > 1) {
                if (properties !== Object(properties)) {
                    throw new TypeError();
                }
                Object.defineProperties(obj, properties);
            }
            return obj;
        };
    }
    return Object.create;
}, window.qoopido = window.qoopido || {});