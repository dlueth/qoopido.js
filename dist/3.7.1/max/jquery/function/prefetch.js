/*!
* Qoopido.js library
*
* version: 3.7.1
* date:    2015-07-25
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("jquery/function/prefetch", definition, [ "jquery" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var jQuery = modules["jquery"] || window.jQuery, $head = jQuery("head"), lookup = [];
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
});