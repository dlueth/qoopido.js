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
    global.qoopido.register("support/capability/datauri", definition, [ "../../support", "../../dom/element" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/capability/datauri", function(deferred) {
        var sample = modules["dom/element"].create(support.pool ? support.pool.obtain("img") : document.createElement("img"));
        sample.one("error load", function(event) {
            if (event.type === "load" && sample.element.width === 1 && sample.element.height === 1) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
            sample.element.dispose && sample.element.dispose();
        }, false).setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
    });
}, this);