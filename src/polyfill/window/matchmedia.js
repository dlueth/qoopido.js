/*
 * Qoopido polyfill/window/matchmedia
 *
 * Borrowed from:
 * https://github.com/weblinc/media-match
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./getcomputedstyle
 * @polyfill ../array/indexof
 * 
 * @browsers Chrome < 9, Firefox < 6, Internet Explorer < 10, Opera < 12.1, Safari < 5.1
 */
;(function(definition, global) {
	var dependencies = [  ];

	if(!global.getComputedStyle) {
		dependencies.push('polyfill/window/getcomputedstyle');
	}

	if(!Array.prototype.indexOf) {
		dependencies.push('../array/indexof');
	}

	global.qoopido.register('polyfill/window/matchmedia', definition, dependencies);
}(function(qoopido, global, undefined) {
	'use strict';

	var identifier = 'qoopidoPolyfillWindowMatchmedia',
		document   = global.document,
		viewport   = document.documentElement,
		queries    = [],
		lookup     = {},
		features   = {},
		regex      = {
			type:  /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,
			media: /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/
		},
		timeout;

	function detectFeatures() {
		var ww = global.innerWidth || viewport.clientWidth,
			wh = global.innerHeight || viewport.clientHeight,
			dw = global.screen.width,
			dh = global.screen.height,
			cd = global.screen.colorDepth,
			pr = global.devicePixelRatio;

		features['width']               = ww;
		features['height']              = wh;
		features['aspect-ratio']        = (ww / wh).toFixed(2);
		features['color']               = cd;
		features['color-index']         = Math.pow(2, cd);
		features['device-aspect-ratio'] = (dw / dh).toFixed(2);
		features['device-height']       = dh;
		features['device-width']        = dw;
		features['device-pixel-ratio']  = pr || 1;
		features['resolution']          = (pr && pr * 96) || global.screen.deviceXDPI || 96;
		features['orientation']         = (wh >= ww ? 'portrait' : 'landscape');
	}

	function createQuery(query) {
		var mql = {
				matches:        false,
				media:          query,
				addListener:    function addListener(listener) {
					listener && listeners.push(listener);
				},
				removeListener: function removeListener(listener) {
					var i       = 0,
						pointer;

					for(; (pointer = listeners[i]) !== undefined; i++) {
						if(pointer === listener) {
							listeners.splice(i, 1);
						}
					}
				}
			},
			index, listeners;

		if(query === '') {
			mql.matches = true;
		} else {
			mql.matches = checkQueryMatch(query);
		}

		queries.push({ mql: mql, listeners : [] });

		index         = queries.length - 1;
		lookup[query] = index;
		listeners     = queries[index].listeners;

		return mql;
	}

	function checkQueryMatch(query) {
		var mql             = (query.indexOf(',') !== -1 && query.split(',')) || [ query ],
			mqIndex         = mql.length - 1,
			mqLength        = mqIndex,
			mq              = null,
			negateType      = null,
			negateTypeFound = '',
			negateTypeIndex = 0,
			negate          = false,
			type            = '',
			exprListStr     = '',
			exprList        = null,
			exprIndex       = 0,
			exprLength      = 0,
			expr            = null,
			prefix          = '',
			length          = '',
			unit            = '',
			value           = '',
			feature         = '',
			match           = false;

		if(query === '') {
			return true;
		}

		do {
			mq          = mql[mqLength - mqIndex];
			negate      = false;
			negateType  = mq.match(regex.type);

			if(negateType) {
				negateTypeFound = negateType[0];
				negateTypeIndex = negateType.index;
			}

			if(!negateType || ((mq.substring(0, negateTypeIndex).indexOf('(') === -1) && (negateTypeIndex || (!negateType[3] && negateTypeFound !== negateType.input)))) {
				match = false;

				continue;
			}

			exprListStr = mq;
			negate      = negateType[1] === 'not';

			if(!negateTypeIndex) {
				type        =  negateType[2];
				exprListStr = mq.substring(negateTypeFound.length);
			}

			match       = type === features.type || type === 'all' || type === '';
			exprList    = (exprListStr.indexOf(' and ') !== -1 && exprListStr.split(' and ')) || [ exprListStr ];
			exprIndex   = exprList.length - 1;
			exprLength  = exprIndex;

			if(match && exprIndex >= 0 && exprListStr !== '') {
				do {
					expr = exprList[exprIndex].match(regex.media);

					if (!expr || !features[expr[3]]) {
						match = false;
						break;
					}

					prefix  = expr[2];
					length  = expr[5];
					value   = length;
					unit    = expr[7];
					feature = features[expr[3]];

					if(unit) {
						if(unit === 'px') {
							value = Number(length);
						} else if(unit === 'em' || unit === 'rem') {
							value = 16 * length;
						} else if(expr[8]) {
							value = (length / expr[8]).toFixed(2);
						} else if(unit === 'dppx') {
							value = length * 96;
						} else if(unit === 'dpcm') {
							value = length * 0.3937;
						} else {
							value = Number(length);
						}
					}

					if(prefix === 'min-' && value) {
						match = feature >= value;
					} else if(prefix === 'max-' && value) {
						match = feature <= value;
					} else if(value) {
						match = feature === value;
					} else {
						match = !!feature;
					}

					if(!match) {
						break;
					}
				} while (exprIndex--);
			}

			if (match) {
				break;
			}
		} while (mqIndex--);

		return negate ? !match : match;
	}

	function delayedOnResize() {
		var match = false,
			i     = 0,
			j     = 0,
			query, listener;

		if(queries.length > 0) {
			detectFeatures();

			for(; (query = queries[i]) !== undefined; i++) {
				match = checkQueryMatch(query.mql.media);

				if((match && !query.mql.matches) || (!match && query.mql.matches)) {
					query.mql.matches = match;

					if(query.listeners) {
						for(; (listener = query.listeners[j]) !== undefined; j++) {
							listener.call(global, query.mql);
						}
					}
				}
			}
		}
	}

	function delayOnResize() {
		global.clearTimeout(timeout);

		timeout = global.setTimeout(delayedOnResize, 10);
	}

	function initialize() {
		var target      = document.getElementsByTagName('script')[0],
			style       = document.createElement('style'),
			types       = ['screen', 'print', 'speech', 'projection', 'handheld', 'tv', 'braille', 'embossed', 'tty'],
			cssText     = '#' + identifier + ' { position: relative; z-index: 0; }',
			prefix      = '',
			addListener = global.addEventListener || (prefix = 'on') && global.attachEvent,
			i           = 0,
			pointer;

		style.type  = 'text/css';
		style.id    = identifier;

		target.parentNode.insertBefore(style, target);

		for(; (pointer = types[i]) !== undefined; i++) {
			cssText += '@media ' + pointer + ' { #' + identifier + ' { position: relative; z-index: ' + i + ' } }';
		}

		if(style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.textContent = cssText;
		}

		features.type = types[((global.getComputedStyle || qoopido.module('polyfill/window/getcomputedstyle'))(style).zIndex * 1) || 0];

		style.parentNode.removeChild(style);

		addListener(prefix + 'resize', delayOnResize);
		addListener(prefix + 'orientationchange', delayOnResize);
	}

	if(!global.matchMedia) {
		initialize();
		detectFeatures();

		global.matchMedia = function(query) {
			var index = lookup[query] || false;

			if(index === false) {
				return createQuery(query);
			} else {
				return queries[index].mql;
			}
		};
	}

	return global.matchMedia;
}, this));