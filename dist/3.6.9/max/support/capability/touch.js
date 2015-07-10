/*!
* Qoopido.js library
*
* version: 3.6.9
* date:    2015-07-10
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("support/capability/touch", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["support"].addTest("/capability/touch", function(deferred) {
        "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? deferred.resolve() : deferred.reject();
    });
});