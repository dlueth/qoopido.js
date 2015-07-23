/*!
* Qoopido.js library
*
* version: 3.7.0
* date:    2015-07-23
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("function/load/css", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var storage = {};
    return function load(url, media) {
        media = media || "all";
        var id = url + ":" + media, link = storage[id], target;
        if (!link) {
            link = storage[id] = document.createElement("link");
            target = document.getElementsByTagName("script")[0];
            link.rel = "stylesheet";
            link.media = "only x";
            link.href = url;
            target.parentNode.insertBefore(link, target);
            window.setTimeout(function() {
                link.media = media;
            });
        }
        return link;
    };
}, window, document);