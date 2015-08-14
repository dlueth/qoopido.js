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
    global.qoopido.register("support/css/transform/2d", definition, [ "../../../support", "../transform" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/css/transform/2d", function(deferred) {
        modules["support/css/transform"]().then(function() {
            var sample = support.pool ? support.pool.obtain("div") : document.createElement("div"), property = modules["support"].getCssProperty("transform");
            try {
                sample.style[property] = "rotate(30deg)";
            } catch (exception) {}
            /rotate/.test(sample.style[property]) ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
}, this);