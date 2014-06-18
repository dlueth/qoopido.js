/*!
* Qoopido.js library
*
* version: 3.2.5
* date:    2014-5-18
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
    window.qoopido.register("pool/module", definition, [ "../pool" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype = modules["pool"].extend({
        _module: null,
        _destroy: null,
        _constructor: function(module, options) {
            var self = this;
            self._module = module;
            if (typeof module._destroy === "function") {
                self._destroy = function(element) {
                    element._destroy();
                };
            }
            prototype._parent._constructor.call(self, options);
        },
        _dispose: function(element) {
            return element;
        },
        _obtain: function() {
            return this._module.create.apply(this._module, arguments);
        }
    });
    return prototype;
});