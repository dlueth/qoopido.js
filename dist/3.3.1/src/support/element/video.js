/*!
* Qoopido.js library
*
* version: 3.3.1
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
    window.qoopido.register("support/element/video", definition, [ "../../support" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var support = modules["support"];
    return support.addTest("/element/video", function(deferred) {
        var sample = support.pool ? support.pool.obtain("video") : document.createElement("video");
        sample.canPlayType ? deferred.resolve() : deferred.reject();
        sample.dispose && sample.dispose();
    });
});