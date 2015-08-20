/*
 * Qoopido asset
 *
 * Asset loading via XHR with localstorage caching
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./emitter
 * @require ./transport/xhr
 * @require ./promise/defer
 * @require ./function/merge
 * @require ./function/unique/uuid
 */
;(function(definition, global) {
	global.qoopido.register('asset', definition, [ './emitter', './transport/xhr', './promise/defer', './function/merge', './function/unique/uuid' ]);
}(function(qoopido, global, undefined) {
	'use strict';

	var prototype,
		defaults     = qoopido.defaults('asset', { prefix: global.location.host, limit: 3, version: null, expiration: null }),
		document     = global.document,
		lookup       = {},
		xhrOptions   = { cache: true },
		TransportXhr = qoopido.module('transport/xhr'),
		PromiseDefer = qoopido.module('promise/defer'),
		merge        = qoopido.module('function/merge'),
		uniqueUuid   = qoopido.module('function/unique/uuid'),
		regex        = new RegExp('/', 'g'),
		queue        = {};

	function queueAdd(asset) {
		var host    = lookup[asset._uuid].host,
			pointer = queue[host] || (queue[host] = { queued: 0, assets: [] }),
			assets  = pointer.assets;

		assets.push(asset);

		pointer.queued === 0 && queueProcess(pointer);
	}

	function queueProcess(queue) {
		var assets = queue.assets;

		while(queue.queued < defaults.limit && assets[0]) {
			loadAsset(queue, assets.splice(0, 1)[0]);
		}
	}

	function loadAsset(queue, asset) {
		var properties = lookup[asset._uuid],
			defered    = properties.dfd,
			url        = properties.url,
			limit      = defaults.limit,
			assets     = queue.assets;

		queue.queued++;

		TransportXhr
			.get(url, null, xhrOptions)
			.then(
				function(response) {
					queue.queued--;
					queue.queued < limit && assets.length >= 1 && queueProcess(queue);

					var value    = response.data,
						id       = properties.id,
						storage  = properties.storage,
						settings = properties.settings,
						cookie;

					asset.emit('loaded', id, value, storage.value);

					if(storage) {
						localStorage[storage.value] = value;

						if(properties.settings.version || properties.settings.version) {
							cookie = [];

							if(settings.version) {
								cookie.push('"version":"' + settings.version + '"');
							}

							if(settings.expiration) {
								cookie.push('"expiration":"' + settings.expiration + '"');
							}

							document.cookie = properties.cookie + '=' + encodeURIComponent('{' + cookie.join(',') + '}') + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
						}

						asset.emit('stored', id, value, storage.value);
					}

					defered.resolve(localStorage[storage.value]);
				},
				function() {
					queue.queued--;
					queue.queued < limit && assets.length >= 1 && queueProcess(queue);

					defered.reject();
				}
			);
	}

	function onHit(event) {
		var properties = lookup[this._uuid],
			storage    = properties.storage,
			settings   = properties.settings,
			version    = settings.version,
			expiration = settings.expiration,
			time       = new Date().getTime();

		localStorage[storage.access] = time;

		if(expiration && event === 'stored') {
			localStorage[storage.expiration] = time + expiration;
		}

		if(version && event === 'stored') {
			localStorage[storage.version] = version;
		}
	}

	function resolveUrl(url) {
		var resolver = document.createElement('a');

		resolver.href = url;

		return resolver;
	}

	prototype = qoopido.module('emitter').extend({
		_uuid: null,
		_constructor: function(url, id, options) {
			var self       = prototype._parent._constructor.call(this),
				uuid       = uniqueUuid(),
				properties = lookup[uuid] = { dfd: new PromiseDefer(), url: url },
				settings   = merge({}, defaults, options),
				pid;

			self._uuid = uuid;

			if(id) {
				pid = settings.prefix + '[' + id + ']';

				properties.id       = id;
				properties.host     = resolveUrl(url).host;
				properties.settings = settings;
				properties.cookie   = encodeURIComponent('qoopido[asset][' + id.replace(regex, '][') + ']');
				properties.storage  = {
					value:      '$' + pid,
					access:     '@' + pid,
					version:    '#' + pid,
					expiration: '?' + pid
				};

				self.on('hit stored', onHit);
			}

			return self;
		},
		fetch: function() {
			var self       = this,
				properties       = lookup[self._uuid],
				defered          = properties.dfd,
				id               = properties.id,
				storage          = properties.storage,
				settings         = properties.settings,
				version          = settings.version,
				expiration       = settings.expiration,
				storedValue      = storage.value && localStorage[storage.value],
				storedVersion    = storedValue && localStorage[storage.version],
				storedExpiration = storedValue && localStorage[storage.expiration];

			if(!storedValue || (storedVersion && storedVersion !== version) || (storedExpiration && storedExpiration < new Date().getTime()) || (!storedVersion && version) || (!storedExpiration &&  expiration)) {
				self.emit('miss', id);

				queueAdd(self);
			} else {
				var value = localStorage[properties.storage.value];

				self.emit('hit', id, value);
				defered.resolve(value);
			}

			return defered.promise;
		},
		clear: function() {
			var self       = this,
				properties = lookup[self._uuid],
				storage    = properties.storage,
				key;

			if(storage) {
				document.cookie = properties.cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

				for(key in storage) {
					delete localStorage[storage[key]];
				}

				self.emit('cleared', properties.id);
			}

			return self;
		}
	});

	return prototype;
}, this));