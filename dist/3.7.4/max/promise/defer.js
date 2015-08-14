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
    var dependencies = [];
    if (!global.Promise) {
        dependencies.push("../polyfill/window/promise");
    }
    global.qoopido.register("promise/defer", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    return function defer() {
        var self = this;
        self.promise = new global.Promise(function(resolve, reject) {
            self.resolve = resolve;
            self.reject = reject;
        });
    };
}, this);