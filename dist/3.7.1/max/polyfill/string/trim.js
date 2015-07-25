/*!
* Qoopido.js library
*
* version: 3.7.1
* date:    2015-07-25
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("polyfill/string/trim", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!String.prototype.trim) {
        var regex = new RegExp("^[\\s\\uFEFF\\xA0]+|[\\s\\uFEFF\\xA0]+$", "g");
        String.prototype.trim = function() {
            return this.replace(regex, "");
        };
    }
    return String.prototype.trim;
});