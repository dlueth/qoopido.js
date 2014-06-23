/*!
* Qoopido.js library
*
* version: 3.2.8
* date:    2014-5-23
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
    window.qoopido.register("support/css/textshadow", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["support"].addTest("/css/textshadow", function(deferred) {
        modules["support"].supportsCssProperty("text-shadow") ? deferred.resolve(modules["support"].getCssProperty("text-shadow")) : deferred.reject();
    });
});