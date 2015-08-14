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
    global.qoopido.register("support/capability/touch", definition, [ "../../support" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var navigator = global.navigator;
    return modules["support"].addTest("/capability/touch", function(deferred) {
        "ontouchstart" in global || global.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? deferred.resolve() : deferred.reject();
    });
}, this);