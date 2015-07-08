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
    window.qoopido.register("support/css/transition", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["support"].addTest("/css/transition", function(deferred) {
        modules["support"].supportsCssProperty("transition") ? deferred.resolve(modules["support"].getCssProperty("transition")) : deferred.reject();
    });
});