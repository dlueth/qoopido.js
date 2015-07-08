/*!
* Qoopido.js library
*
* version: 3.6.7
* date:    2015-07-08
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("pool/module", definition, [ "../pool", "../function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var generateUuid = modules["function/unique/uuid"];
    var prototype = modules["pool"].extend({
        _module: null,
        _destroy: null,
        _constructor: function(module, options, useShared) {
            var self = this, uuid = module._quid || (module._quid = generateUuid()), pointer = useShared && (shared.pool || (shared.pool = {})) && (shared.pool.module || (shared.pool.module = {}));
            if (useShared === true && pointer[uuid]) {
                return pointer[uuid];
            } else {
                prototype._parent._constructor.call(self, options);
                self._module = module;
                if (typeof module._destroy === "function") {
                    self._destroy = function(element) {
                        element._destroy();
                    };
                }
                if (useShared === true) {
                    pointer[uuid] = self;
                }
            }
        },
        _dispose: function(element) {
            return element;
        },
        _obtain: function() {
            return this._module.create.apply(this._module, arguments);
        }
    });
    return prototype;
});