/*
 * Qoopido jquery/function/prefetch
 *
 * jQuery function to prefetch resources
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ../../base
 * @require jquery (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('jquery/function/prefetch', pDefinition, arguments);
	}

	if(typeof define === 'function' && define.amd) {
		define([ '../../base', 'jquery' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies) {
	'use strict';

	var jQuery = window.jQuery || dependencies[1],
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
}, window));