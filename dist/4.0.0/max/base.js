/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-08-28
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function() {
    "use strict";
    var o_c = Object.create, o_dp = Object.defineProperty, o_gopd = Object.getOwnPropertyDescriptor, o_gopn = Object.getOwnPropertyNames, gcd = function(value, writable) {
        return {
            writable: !!writable,
            configurable: false,
            enumerable: false,
            value: value
        };
    };
    function definition() {
        function base() {}
        base.extend = function(fn) {
            var parent = this, source = fn.prototype, properties = {};
            o_gopn(source).forEach(function(property) {
                properties[property] = o_gopd(source, property);
            });
            properties["constructor"] = gcd(fn);
            properties["super"] = gcd(parent);
            fn.prototype = o_c(parent.prototype || parent, properties);
            !fn.final && o_dp(fn, "extend", gcd(parent.extend, true));
            return fn;
        };
        return base;
    }
    provide(definition);
})();