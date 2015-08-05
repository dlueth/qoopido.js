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
    window.qoopido.register("support/element/video/mp4", definition, [ "../../../support", "../video" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/video/mp4", function(deferred) {
        modules["support/element/video"]().then(function() {
            var sample = support.pool ? support.pool.obtain("video") : document.createElement("video");
            sample.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') ? deferred.resolve() : deferred.reject();
            sample.dispose && sample.dispose();
        }, function() {
            deferred.reject();
        });
    });
});