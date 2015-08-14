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
    if (!Object.defineProperty) {
        dependencies.push("./queryselectorall");
    }
    global.qoopido.register("polyfill/document/getelementsbyclassname", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = window.document;
    if (!document.getElementsByClassName) {
        var regex = new RegExp("^|\\s+", "g");
        document.getElementsByClassName = function(classname) {
            classname = String(classname).replace(regex, ".");
            return document.querySelectorAll(classname);
        };
    }
    return document.getElementsByClassName;
}, this);