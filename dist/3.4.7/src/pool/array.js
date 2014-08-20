/*!
* Qoopido.js library
*
* version: 3.4.7
* date:    2014-7-20
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
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