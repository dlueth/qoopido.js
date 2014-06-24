/*!
* Qoopido.js library
*
* version: 3.3.2
* date:    2014-5-24
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
    window.qoopido.register("support/css/transition", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    return modules["support"].addTest("/css/transition", function(deferred) {
        modules["support"].supportsCssProperty("transition") ? deferred.resolve(modules["support"].getCssProperty("transition")) : deferred.reject();
    });
});