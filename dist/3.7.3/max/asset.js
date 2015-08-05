/*!
* Qoopido.js library
*
* version: 3.7.3
* date:    2015-08-05
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition) {
    window.qoopido.register("asset", definition, [ "./emitter", "./transport/xhr", "./promise/defer", "./function/unique/uuid" ]);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var prototype, lookup = {}, xhrTransport = modules["transport/xhr"], xhrOptions = {
        cache: true
    }, DeferedPromise = modules["promise/defer"], generateUuid = modules["function/unique/uuid"], regex = new RegExp("/", "g"), queue = [];
    function queueAdd(asset) {
        queue.push(asset);
        queue.length === 1 && queueProcess();
    }
    function queueProcess() {
        loadAsset(queue[0]).then(function() {
            queue.splice(0, 1) && queue.length >= 1 && queueProcess();
        }, function() {
            queue.splice(0, 1) && queue.length >= 1 && queueProcess();
        });
    }
    function loadAsset(asset) {
        var properties = lookup[asset._uuid], defered = properties.dfd, url = properties.url;
        return xhrTransport.get(url, null, xhrOptions).then(function(transport) {
            var value = transport.data, id = properties.id, version = properties.version, storage = properties.storage;
            asset.emit("loaded", url, id, version, value);
            if (storage) {
                document.cookie = properties.cookie + "=" + encodeURIComponent(version) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
                localStorage[storage.version] = version;
                localStorage[storage.value] = value;
                asset.emit("stored", url, id, version, value, storage.version, storage.value);
            }
            defered.resolve(localStorage[storage.value]);
        }, function() {
            defered.reject();
        });
    }
    prototype = modules["emitter"].extend({
        _uuid: null,
        _constructor: function(url, id, version) {
            var self = prototype._parent._constructor.call(this), uuid = generateUuid(), properties = lookup[uuid] = {
                dfd: new DeferedPromise(),
                url: url
            };
            self._uuid = uuid;
            if (id && version) {
                properties.id = id;
                properties.version = version;
                properties.cookie = encodeURIComponent("qoopido[asset][" + id.replace(regex, "][") + "]");
                properties.storage = {
                    version: "@" + id,
                    value: "©" + id
                };
            }
            return self;
        },
        fetch: function() {
            var self = this, properties = lookup[self._uuid], defered = properties.dfd, url = properties.url, id = properties.id, version = properties.version, storage = properties.storage, stored = storage && storage.version && localStorage[storage.version];
            if (stored && stored >= version) {
                var value = localStorage[properties.storage.value];
                self.emit("hit", url, id, version, value);
                defered.resolve(value);
            } else {
                self.emit("miss", url, id, version);
                queueAdd(self);
            }
            return defered.promise;
        },
        clear: function() {
            var self = this, properties = lookup[self._uuid], storage = properties.storage;
            if (storage) {
                document.cookie = properties.cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                delete localStorage[storage.version];
                delete localStorage[storage.value];
                self.emit("cleared", properties.url, properties.id, properties.version);
            }
            return self;
        }
    });
    return prototype;
}, window, document);