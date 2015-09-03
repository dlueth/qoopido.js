/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-09-03
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function() {
    "use strict";
    var storage = {}, regex = new RegExp("[xy]", "g");
    function generateUuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(regex, function(c) {
            var r = Math.random() * 16 | 0;
            return (c === "x" ? r : r & 3 | 8).toString(16);
        });
    }
    function definition() {
        return function uuid() {
            var result;
            do {
                result = generateUuid();
            } while (storage[result]);
            storage[result] = 1;
            return result;
        };
    }
    provide(definition);
})();