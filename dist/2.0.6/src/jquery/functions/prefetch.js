/*
 * jQuery function to prefetch resources
 *
 * Copyright (c) 2013 Dirk Lüth
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

	var namespace  = 'qoopido/jquery/functions/prefetch',
		initialize = function initialize() {
			return window.qoopido.shared.prepareModule(namespace, definition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../base', 'jquery' ], initialize);
	} else {
		initialize(window.qoopido.base, window.jQuery);
	}
}(function(mBase, mJquery, window, document, undefined) {
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