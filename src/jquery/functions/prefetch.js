/*
 * jQuery function to prefetch resources
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
;(function(undefined) {
	'use strict';

	var $name = 'prefetch',
		getModule;

	getModule = function getModule($) {
		var $head   = $('head'),
			$lookup = [];

		$[$name] = function() {
			var urls = $.unique($('a[rel="prefetch"]').removeAttr('rel').map(function() { return $(this).attr('href'); }));

			urls.each(function(index, url) {
				if($.inArray(url, $lookup) === -1) {
					$('<link />', { rel: 'prefetch', href: url }).appendTo($head);
					$('<link />', { rel: 'prerender', href: url }).appendTo($head);
				}
			});
		};
	};

	if(typeof define === 'function' && define.amd) {
		define(
			[ 'jquery' ],
			function(jquery) {
				getModule(jquery);

				return true;
			}
		);
	} else {
		getModule(jQuery);
	}
}());