/*!
* Qoopido.js library
*
* version: 3.6.9
* date:    2015-07-10
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("polyfill/string/ucfirst", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!String.prototype.ucfirst) {
        String.prototype.ucfirst = function() {
            var self = this;
            return self.charAt(0).toUpperCase() + self.slice(1);
        };
    }
    return String.prototype.ucfirst;
});