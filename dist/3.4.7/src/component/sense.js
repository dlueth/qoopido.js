/*!
* Qoopido.js library
*
* version: 3.4.7
* date:    2014-7-17
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
    var dependencies = [ "../emitter" ];
    if (!window.matchMedia) {
        dependencies.push("../polyfill/window/matchmedia");
    }
    window.qoopido.register("component/sense", definition, dependencies);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, queries = {};
    function onQueryStateChange(mql) {
        var self = this;
        if (mql.matches === true) {
            self.emit("matched");
        } else {
            self.emit("dematched");
        }
    }
    prototype = modules["emitter"].extend({
        _constructor: function(query) {
            var self = this;
            prototype._parent._constructor.call(self);
            (queries[query] || (queries[query] = window.matchMedia(query))).addListener(function(mql) {
                onQueryStateChange.call(self, mql);
            });
            window.setTimeout(function() {
                onQueryStateChange.call(self, queries[query]);
            }, 0);
        }
    });
    return prototype;
});