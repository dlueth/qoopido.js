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
    global.qoopido.register("support/element/svg", definition, [ "../../support" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var document = global.document;
    return modules["support"].addTest("/element/svg", function(deferred) {
        document.createElementNS && document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect ? deferred.resolve() : deferred.reject();
    });
}, this);