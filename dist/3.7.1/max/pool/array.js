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
    window.qoopido.register("pool/array", definition, [ "../pool" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
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
});