/*!
* Qoopido.js library
*
* version: 3.7.1
* date:    2015-07-25
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("support/element/canvas/todataurl/webp", definition, [ "../../../../support", "../todataurl" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/canvas/todataurl/webp", function(deferred) {
        modules["support/element/canvas/todataurl"]().then(function() {
            var sample = support.pool ? support.pool.obtain("canvas") : document.createElement("canvas");
            sample.toDataURL("image/webp").indexOf("data:image/webp") === 0 ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
});