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
    global.qoopido.register("polyfill/string/lcfirst", definition);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!String.prototype.lcfirst) {
        String.prototype.lcfirst = function() {
            var self = this;
            return self.charAt(0).toLowerCase() + self.slice(1);
        };
    }
    return String.prototype.lcfirst;
}, this);