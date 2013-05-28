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
 * @require jquery
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'jquery/functions/prefetch';

	function initialize() {
		[].push.apply(arguments, [ window, document, undefined ]);

		window[namespace] = window[namespace] || { };

		return (window[namespace][name] = definition.apply(null, arguments));
	}

	if(typeof define === 'function' && define.amd) {
		define([ 'jquery' ], initialize);
	} else {
		initialize(window.jQuery);
	}
}(function(mJquery, window, document, undefined) {
	'use strict';

	var $head   = mJquery('head'),
		lookup = [];

	mJquery.prefetch = function() {
		var urls = mJquery.unique(mJquery('a[rel="prefetch"]').removeAttr('rel').map(function() { return mJquery(this).attr('href'); }));

		urls.each(function(index, url) {
			if(mJquery.inArray(url, lookup) === -1) {
				mJquery('<link />', { rel: 'prefetch', href: url }).appendTo($head);
				mJquery('<link />', { rel: 'prerender', href: url }).appendTo($head);
			}
		});
	};

	return mJquery;
}, window, document));