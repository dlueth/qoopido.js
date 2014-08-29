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
    window.qoopido.register("polyfill/string/trim", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!String.prototype.trim) {
        var regex = new RegExp("^\\s+|\\s+$", "g");
        String.prototype.trim = function() {
            return this.replace(regex, "");
        };
    }
    return String.prototype.trim;
});