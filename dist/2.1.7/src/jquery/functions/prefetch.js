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
;(function(pDefinition, window) {
	'use strict';

	var definition = function definition() {
			return window.qoopido.shared.module.initialize('jquery/functions/prefetch', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../base', 'jquery' ], definition);
	} else {
		definition(window.qoopido.base, window.jQuery);
	}
}(function(mBase, mJquery) {
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
}, window));