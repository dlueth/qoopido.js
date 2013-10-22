/*
 * Qoopido jquery/function/prefetch
 *
 * jQuery function to prefetch resources
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../base
 * @external jQuery
 */
;(function(definition) {
	window.qoopido.register('jquery/function/prefetch', definition, [ '../../base', 'jquery' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var jQuery = modules['jquery'] || window.jQuery,
		$head  = jQuery('head'),
		lookup = [];

	jQuery.prefetch = function() {
		var urls = jQuery.unique(jQuery('a[rel="prefetch"]').removeAttr('rel').map(function() { return jQuery(this).attr('href'); }));

		urls.each(function(index, url) {
			if(jQuery.inArray(url, lookup) === -1) {
				jQuery('<link />', { rel: 'prefetch', href: url }).appendTo($head);
				jQuery('<link />', { rel: 'prerender', href: url }).appendTo($head);
			}
		});
	};

	return jQuery;
}));