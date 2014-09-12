/*!
* Qoopido.js library
*
* version: 3.5.2
* date:    2014-8-12
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
    var dependencies = [];
    if (!document.querySelectorAll) {
        dependencies.push("./queryselectorall");
    }
    window.qoopido.register("polyfill/document/queryselector", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!document.querySelector) {
        document.querySelector = function(selector) {
            var elements = document.querySelectorAll(selector);
            return elements.length ? elements[0] : null;
        };
    }
    return document.querySelector;
});