/*!
* Qoopido.js library
*
* version: 3.7.4
* date:    2015-08-14
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition, global) {
    var dependencies = [ "../emitter" ];
    if (!global.matchMedia) {
        dependencies.push("../polyfill/window/matchmedia");
    }
    global.qoopido.register("component/sense", definition, dependencies);
})(function(modules, shared, global, undefined) {
    "use strict";
    var prototype, queries = {};
    function onQueryStateChange() {
        var self = this, mql = self.mql;
        if (mql.matches === true) {
            self.emit("matched");
        } else {
            self.emit("dematched");
        }
    }
    prototype = modules["emitter"].extend({
        mql: null,
        _constructor: function(query) {
            var self = prototype._parent._constructor.call(this), mql = self.mql = queries[query] || (queries[query] = global.matchMedia(query)), listener = function() {
                onQueryStateChange.call(self);
            };
            mql.addListener(listener);
            global.setTimeout(listener, 0);
            return self;
        },
        matches: function() {
            return this.mql.matches;
        }
    });
    return prototype;
}, this);