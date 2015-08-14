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
    global.qoopido.register("support/css/rem", definition, [ "../../support" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/css/rem", function(deferred) {
        var sample = support.pool ? support.pool.obtain("div") : document.createElement("div");
        try {
            sample.style.fontSize = "3rem";
        } catch (exception) {}
        /rem/.test(sample.style.fontSize) ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
}, this);