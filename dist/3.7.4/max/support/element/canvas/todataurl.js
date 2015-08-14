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
    global.qoopido.register("support/element/canvas/todataurl", definition, [ "../../../support", "../canvas" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/canvas/todataurl", function(deferred) {
        modules["support/element/canvas"]().then(function() {
            var sample = support.pool ? support.pool.obtain("canvas") : document.createElement("canvas");
            sample.toDataURL !== undefined ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
}, this);