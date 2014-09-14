/*!
* Qoopido.js library
*
* version: 3.5.3
* date:    2014-8-14
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
    window.qoopido.register("support/css/rgba", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/css/rgba", function(deferred) {
        var sample = support.pool ? support.pool.obtain("div") : document.createElement("div");
        try {
            sample.style.backgroundColor = "rgba(0,0,0,.5)";
        } catch (exception) {}
        /rgba/.test(sample.style.backgroundColor) ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
});