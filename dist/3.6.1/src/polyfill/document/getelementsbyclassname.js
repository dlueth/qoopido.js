/*!
* Qoopido.js library
*
* version: 3.6.1
* date:    2015-2-5
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition) {
    var dependencies = [];
    if (!Object.defineProperty) {
        dependencies.push("./queryselectorall");
    }
    window.qoopido.register("polyfill/document/getelementsbyclassname", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!document.getElementsByClassName) {
        var regex = new RegExp("^|\\s+", "g");
        document.getElementsByClassName = function(classname) {
            classname = String(classname).replace(regex, ".");
            return document.querySelectorAll(classname);
        };
    }
    return document.getElementsByClassName;
});