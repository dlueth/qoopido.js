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
    global.qoopido.register("support/css/rgba", definition, [ "../../support" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/css/rgba", function(deferred) {
        var sample = support.pool ? support.pool.obtain("div") : document.createElement("div");
        try {
            sample.style.backgroundColor = "rgba(0,0,0,.5)";
        } catch (exception) {}
        /rgba/.test(sample.style.backgroundColor) ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
}, this);