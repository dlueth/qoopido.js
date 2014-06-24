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
    window.qoopido.registerSingleton("url", definition, [ "./base" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var urlCurrent, regexLocal, regexParameter = new RegExp("[?&]?([^=]+)=([^&]*)", "g");
    try {
        urlCurrent = location;
    } catch (exception) {
        urlCurrent = getResolver();
    }
    regexLocal = new RegExp("".concat("^", urlCurrent.protocol, "//", urlCurrent.hostname), "i");
    function getResolver(url) {
        var resolver = document.createElement("a");
        resolver.href = url || "";
        return resolver;
    }
    return modules["base"].extend({
        resolve: function(url) {
            return getResolver(url).href;
        },
        redirect: function redirect(url, target) {
            target = target || window;
            target.location.href = this.resolve(url);
        },
        getParameter: function(url) {
            var params = {}, querystring = getResolver(url).search.split("+").join(" "), tokens;
            while (tokens = regexParameter.exec(querystring)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }
            return params;
        },
        isLocal: function(url) {
            return regexLocal.test(this.resolve(url));
        }
    });
});