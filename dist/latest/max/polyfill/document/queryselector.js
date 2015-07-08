/*!
* Qoopido.js library
*
* version: 3.6.7
* date:    2015-07-08
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
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