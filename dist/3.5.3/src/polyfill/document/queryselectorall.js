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
    window.qoopido.register("polyfill/document/queryselectorall", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!document.querySelectorAll) {
        document.querySelectorAll = function(selector) {
            var target = window.document.getElementsByTagName("script")[0], style = document.createElement("style"), elements = [], element;
            target.parentNode.insertBefore(style, target);
            document._qsa = [];
            style.styleSheet.cssText = selector + "{x-qsa:expression(document._qsa && document._qsa.push(this))}";
            window.scrollBy(0, 0);
            style.parentNode.removeChild(style);
            while (document._qsa.length) {
                element = document._qsa.shift();
                element.style.removeAttribute("x-qsa");
                elements.push(element);
            }
            try {
                delete document._qsa;
            } catch (exception) {
                document._qsa = null;
            }
            return elements;
        };
    }
    return document.querySelectorAll;
});