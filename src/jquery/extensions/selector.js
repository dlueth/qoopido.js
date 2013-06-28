/*
 * jQuery extension adding custom selectors
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
			return window.qoopido.shared.module.initialize('jquery/extensions/selector', pDefinition, arguments);
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../base', 'jquery' ], definition);
	} else {
		definition(window.qoopido.base, window.jQuery);
	}
}(function(mBase, mJquery, namespace, window, document, undefined) {
	'use strict';
	
	var $window   = mJquery(window),
		$document = mJquery(document);

	mJquery.extend(mJquery.expr[':'], {
		loaded: function(el) {
			return mJquery(el).data('loaded');
		},
		scrollable: function(el, i, m) {
			return mJquery(el).css('overflow') === 'auto';
		},
		width: function(el, i, m) {
			if(!m[3] || !(/^(<|>)\d+$/).test(m[3])) {
				return false;
			}

			return m[3].substr(0,1) === '>' ? mJquery(el).width() > m[3].substr(1) : mJquery(el).width() < m[3].substr(1);
		},
		height: function(el, i, m) {
			if(!m[3]||!(/^(<|>)\d+$/).test(m[3])) {
				return false;
			}

			return m[3].substr(0,1) === '>' ? mJquery(el).height() > m[3].substr(1) : mJquery(el).height() < m[3].substr(1);
		},
		leftOf: function(el, i, m) {
			if(!m[3]) {
				return false;
			}

			el = mJquery(el);
			m  = mJquery(m[3]);

			return el.offset().left + el.width() < m.offset().left;
		},
		rightOf: function(el, i, m) {
			if(!m[3]) {
				return false;
			}

			el = mJquery(el);
			m  = mJquery(m[3]);

			return el.offset().left > m.offset().left + m.width();
		},
		external: function(el) {
			if(!el.href) {
				return false;
			}

			return el.hostname && el.hostname !== window.location.hostname;
		},
		inView: function(el) {
			el = mJquery(el);

			var w = $window,
				d = $document,
				eO = el.offset(),
				dS = { top: d.scrollTop(), height: d.scrollLeft() };

			return !(
				(eO.top > w.height() + dS.top) ||
					(eO.top + el.height() < dS.top) ||
					(eO.left > w.width() + dS.left) ||
					(eO.left + el.width() < dS.left)
				);
		},
		largerThan: function(el, i, m) {
			if(!m[3]) {
				return false;
			}

			el = mJquery(el);
			m  = mJquery(m[3]);

			return el.width() * el.height() > m.width() * m.height();
		},
		isBold: function(el) {
			return mJquery(el).css('fontWeight') === '700';
		},
		color: function(el, i, m) {
			if(!m[3]) {
				return false;
			}

			return mJquery(el).css('color') === m[3];
		},
		hasId: function(el) {
			el = mJquery(el);

			return el.attr('id') !== undefined && el.attr('id') !== '';
		}
	});

	return mJquery;
}, window));