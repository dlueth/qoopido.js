/*!
* Qoopido.js library
*
* version: 3.7.4
* date:    2015-08-14
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition, global) {
    global.qoopido.register("polyfill/array/indexof", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(element) {
            var array = this, i = 0;
            for (;array[i] !== undefined; ++i) {
                if (array[i] === element) {
                    return i;
                }
            }
            return -1;
        };
    }
    return Array.prototype.indexOf;
}, this);