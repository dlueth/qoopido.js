/*!
* Qoopido.js library
*
* version: 3.5.4
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
(function(definition) {
    window.qoopido.register("polyfill/array/indexof", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
});