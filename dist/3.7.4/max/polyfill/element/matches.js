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
    var dependencies = [];
    if (!document.querySelectorAll) {
        dependencies.push("../document/queryselectorall");
    }
    global.qoopido.register("polyfill/element/matches", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    if (!Element.prototype.matches) {
        var prototype = Element.prototype;
        prototype.matches = prototype.matchesSelector = prototype.matchesSelector || prototype.webkitMatchesSelector || prototype.mozMatchesSelector || prototype.msMatchesSelector || prototype.oMatchesSelector || function(selector) {
            var elements = this.parentElement.querySelectorAll(selector), element, i = 0;
            while (element = elements[i++]) {
                if (element === this) {
                    return true;
                }
            }
            return false;
        };
    }
    return Element.prototype.matches;
}, this);