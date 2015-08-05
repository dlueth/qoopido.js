/*!
* Qoopido.js library
*
* version: 3.7.2
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("support/css/transform", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["support"].addTest("/css/transform", function(deferred) {
        modules["support"].supportsCssProperty("transform") ? deferred.resolve(modules["support"].getCssProperty("transform")) : deferred.reject();
    });
});