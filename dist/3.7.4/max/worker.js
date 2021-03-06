/*!
* Qoopido.js library
*
* version: 3.7.4
* date:    2015-08-14
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(definition, global) {
    global.qoopido.register("worker", definition, [ "./base", "./support", "./promise/defer" ]);
})(function(modules, shared, global, undefined) {
    "use strict";
    var DeferredPromise = modules["promise/defer"], regex = new RegExp("Blob$", "i"), supportsWorker = modules["support"].supportsMethod("Worker"), urlMethod = modules["support"].supportsMethod("URL") ? global[modules["support"].getMethod("URL")] : null, blobMethod = modules["support"].getMethod("Blob") || modules["support"].getMethod("BlobBuilder"), workerSource = "var self = this, regex = new RegExp(',\\s+', 'g'); self.addEventListener('message', function(pEvent) { self.postMessage({ type: 'result', result: self.process(pEvent.data.func).apply(null, pEvent.data.args)}); }, false); self.postProgress = function(pProgress) { self.postMessage({ type: 'progress', progress: pProgress}); }; self.process = function(pFunction) { var functionArguments = pFunction.substring(pFunction.indexOf('(') + 1, pFunction.indexOf(')')).replace(regex, ',').split(','); functionArguments.push(pFunction.substring(pFunction.indexOf('{') + 1, pFunction.lastIndexOf('}'))); return Function.apply(null, functionArguments); };", task = null;
    if (supportsWorker && urlMethod && blobMethod) {
        if (regex.test(blobMethod) === true) {
            task = urlMethod.createObjectURL(new global[blobMethod]([ workerSource ], {
                type: "text/javascript"
            }));
        } else {
            task = urlMethod.createObjectURL(new global[blobMethod]().append(workerSource).getBlob("text/javascript"));
        }
    }
    return modules["base"].extend({
        execute: function(pFunction, pArguments) {
            var deferred = new DeferredPromise();
            pArguments = pArguments || [];
            if (task) {
                var worker = new Worker(task);
                worker.addEventListener("message", function(event) {
                    switch (event.data.type) {
                      case "result":
                        deferred.resolve(event.data.result);
                        break;
                    }
                }, false);
                worker.addEventListener("error", function(event) {
                    deferred.reject(event);
                }, false);
                worker.postMessage({
                    func: pFunction.toString(),
                    args: pArguments
                });
            } else {
                setTimeout(function() {
                    try {
                        deferred.resolve(pFunction.apply(null, pArguments));
                    } catch (exception) {
                        deferred.reject();
                    }
                }, 0);
            }
            return deferred.promise;
        }
    });
}, this);