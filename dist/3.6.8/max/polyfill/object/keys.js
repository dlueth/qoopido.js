/*!
* Qoopido.js library
*
* version: 3.6.8
* date:    2015-07-09
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("polyfill/object/keys", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!Object.keys) {
        Object.keys = function(obj) {
            if (obj !== Object(obj)) {
                throw new TypeError("Object.keys called on non-object");
            }
            var ret = [], p;
            for (p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    ret.push(p);
                }
            }
            return ret;
        };
    }
    return Object.keys;
});