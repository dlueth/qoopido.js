/*!
* Qoopido.js library
*
* version: 3.7.2
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("function/unique/string", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var lookup = {}, characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    function generateString(length) {
        var result = "", i = 0;
        length = parseInt(length, 10) || 12;
        for (;i < length; i++) {
            result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
        }
        return result;
    }
    return function(length) {
        var result;
        do {
            result = generateString(length);
        } while (typeof lookup[result] !== "undefined");
        lookup[result] = true;
        return result;
    };
});