/*!
* Qoopido.js library
*
* version: 3.5.0
* date:    2014-7-29
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
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