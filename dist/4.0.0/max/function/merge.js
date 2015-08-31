/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-08-31
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(undefined) {
    "use strict";
    function definition() {
        return function merge() {
            var target = arguments[0], i, properties, property, tgt, tgt_io, src;
            for (i = 1; (properties = arguments[i]) !== undefined; i++) {
                for (property in properties) {
                    tgt = target[property];
                    src = properties[property];
                    if (src !== undefined) {
                        if (src !== null && typeof src === "object") {
                            tgt_io = tgt && typeof tgt === "object";
                            if (src.length !== undefined) {
                                tgt = tgt_io && tgt.length !== undefined ? tgt : [];
                            } else {
                                tgt = tgt_io && tgt.length === undefined ? tgt : {};
                            }
                            target[property] = merge(tgt, src);
                        } else {
                            target[property] = src;
                        }
                    }
                }
            }
            return target;
        };
    }
    provide(definition);
})();