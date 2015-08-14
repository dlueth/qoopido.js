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
    global.qoopido.register("jquery/function/prefetch", definition, [ "jquery" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || global.jQuery, $head = jQuery("head"), lookup = [];
    jQuery.prefetch = function() {
        var urls = jQuery.unique(jQuery('a[rel="prefetch"]').removeAttr("rel").map(function() {
            return jQuery(this).attr("href");
        }));
        urls.each(function(index, url) {
            if (jQuery.inArray(url, lookup) === -1) {
                jQuery("<link />", {
                    rel: "prefetch",
                    href: url
                }).appendTo($head);
                jQuery("<link />", {
                    rel: "prerender",
                    href: url
                }).appendTo($head);
            }
        });
    };
    return jQuery;
}, this);