/*
 * Qoopido widget/image/adapt
 *
 * Responsive image solution embracing microdata capable of lazy-loading
 *
 * Copyright (c) 2014 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ../../dom/element
 * @require ../../dom/element/emerge
 * @require ../../component/sense
 */

;(function(definition) {
	window.qoopido.register('widget/image/adapt', definition, [ '../../dom/element', '../../dom/element/emerge', '../../component/sense' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype,
		regex           = new RegExp('(.+?).(jpg|jpeg|png|gif|webp)$'),
		mDomElement     = modules['dom/element'],
		mComponentSense = modules['component/sense'],
		storage         = [],
		timeout;

	function setRatio(ratio) {
		var self = this;

		self._container.setStyle('paddingBottom', (ratio * 100) + '%');

		return self;
	}

	function processMedia(pointer, media) {
		var self = this;

		pointer.mql = mComponentSense
			.create(media)
			.on('matched dematched', function() {
				checkCandidates.call(self);
			});
	}

	function checkCandidates() {
		var self = this,
			i = 0, candidate, image, boundingbox, width, height, url;

		for(; (candidate = self._candidates[i]) !== undefined; i++) {
			if(!candidate.mql || (candidate.mql.matches && candidate.mql.matches() === true)) {
				setRatio.call(self, candidate.ratio);

				if(self._visible === true) {
					image       = self._image || (self._image = mDomElement.create('<img />', { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', alt: self._caption }, { position: 'absolute', display: 'block', width: '100%', height: '100%', top: '0', left: '0', margin: '0', padding: '0' }).appendTo(self._container));
					boundingbox = image.element.getBoundingClientRect();
					width       = Math.round(boundingbox.width);
					height      = Math.round(boundingbox.width * candidate.ratio);
					url         = candidate.url.replace(regex, '$1.' + width + 'x' + height + '@' + (window.devicePixelRatio || 1) + '.$2');

					image.setAttribute('src', url);
				}

				break;
			}
		}
	}

	function delayedOnResize() {
		var i = 0, instance;

		for(; (instance = storage[i]) !== undefined; i++) {
			checkCandidates.call(instance);
		}
	}

	function delayOnResize() {
		window.clearTimeout(timeout);

		timeout = window.setTimeout(delayedOnResize, 200);
	}

	prototype = modules['dom/element/emerge'].extend({
		_visible:    false,
		_candidates: null,
		_container:  null,
		_image:      null,
		_caption:    null,
		_constructor: function(element, settings) {
			var self = prototype._parent._constructor.call(this, element, settings),
				defaultRatio, sources, i = 0, source, caption;

			defaultRatio = parseFloat(self.getAttribute('data-ratio') || 1);
			sources      = self.find('[itemprop="source"],[itemprop="contentUrl"]');

			self._candidates = [];
			self._container  = mDomElement.create('<div />').setStyles({ position: 'relative', display: 'block', width: '100%', height: 0, padding: 0 }).appendTo(self);
			self._caption    = (caption = self.find('[itemprop="caption"]')[0]) ? caption.getAttribute('content') : null;

			setRatio.call(self, defaultRatio);

			for(; (source = sources[i]) !== undefined; i++) {
				var ratio   = parseFloat(source.getAttribute('data-ratio') || defaultRatio),
					media   = source.getAttribute('data-media') || null;

				self._candidates.push({
					ratio: ratio,
					url:   source.getAttribute('content'),
					mql:   media
				});

				if(media) {
					processMedia.call(self, self._candidates[self._candidates.length - 1], media);
				}
			}

			self
				.on('emerged demerged', function(event) {
					self._visible = (event.type === 'emerged') ? true : false;

					checkCandidates.call(self);
				});

			storage.push(self);

			return self;
		}
	});

	mDomElement
		.create(window)
		.on('resize orientationchange', delayOnResize);

	return prototype;
}));