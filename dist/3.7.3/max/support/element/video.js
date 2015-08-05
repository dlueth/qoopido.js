/*!
* Qoopido.js library
*
* version: 3.7.3
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("support/element/video", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/video", function(deferred) {
        var sample = support.pool ? support.pool.obtain("video") : document.createElement("video");
        sample.canPlayType ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
});