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
    global.qoopido.register("pool/array", definition, [ "../pool" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var prototype = modules["pool"].extend({
        _dispose: function(element) {
            element.length = 0;
            return element;
        },
        _obtain: function() {
            return [];
        }
    });
    shared.pool = shared.pool || {};
    shared.pool.array = prototype.create();
    return prototype;
}, this);