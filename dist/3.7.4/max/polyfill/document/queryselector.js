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
        dependencies.push("./queryselectorall");
    }
    global.qoopido.register("polyfill/document/queryselector", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document;
    if (!document.querySelector) {
        document.querySelector = function(selector) {
            var elements = document.querySelectorAll(selector);
            return elements.length ? elements[0] : null;
        };
    }
    return document.querySelector;
}, this);