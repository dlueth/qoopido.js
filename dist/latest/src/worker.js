/*
 * Qoopido worker
 *
 * Provides a web worker abstraction
 *
 * Copyright (c) 2013 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @require ./base
 * @require ./support
 * @external Q
 */
;(function(definition) {
	window.qoopido.register('worker', definition, [ './base', './support', 'q' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var Q              = modules['q'] || window.Q,
		regex          = new RegExp('Blob$', 'i'),
		supportsWorker = modules['support'].supportsMethod('Worker'),
		urlMethod      = modules['support'].supportsMethod('URL') ? window[modules['support'].getMethod('URL')] : null,
		blobMethod     = modules['support'].getMethod('Blob') || modules['support'].getMethod('BlobBuilder'),
		workerSource   = "var self = this, regex = new RegExp(',\\s+', 'g'); self.addEventListener('message', function(pEvent) { self.postMessage({ type: 'result', result: self.process(pEvent.data.func).apply(null, pEvent.data.args)}); }, false); self.postProgress = function(pProgress) { self.postMessage({ type: 'progress', progress: pProgress}); }; self.process = function(pFunction) { var functionArguments = pFunction.substring(pFunction.indexOf('(') + 1, pFunction.indexOf(')')).replace(regex, ',').split(','); functionArguments.push(pFunction.substring(pFunction.indexOf('{') + 1, pFunction.lastIndexOf('}'))); return Function.apply(null, functionArguments); };",
		task           = null;

	if(supportsWorker && urlMethod && blobMethod) {
		if(regex.test(blobMethod) === true) {
			task = urlMethod.createObjectURL(new window[blobMethod]([ workerSource ], {type: 'text/javascript'}));
		} else {
			task = urlMethod.createObjectURL(new window[blobMethod]().append(workerSource).getBlob('text/javascript'));
		}
	}

	return modules['base'].extend({
		execute: function(pFunction, pArguments) {
			var deferred  = Q.defer();

			pArguments = pArguments || [];

			if(task) {
				var worker = new Worker(task);

				worker.addEventListener('message', function(event) {
					switch(event.data.type) {
						case 'progress':
							deferred.notify(event.data.progress);
							break;
						case 'result':
							deferred.resolve(event.data.result);
							break;
					}
				}, false);

				worker.addEventListener('error', function(event) {
					deferred.reject(event);
				}, false);

				worker.postMessage({ func: pFunction.toString(), args: pArguments });
			} else {
				setTimeout(function(){
					try {
						deferred.resolve(pFunction.apply(null, pArguments));
					} catch(exception) {
						deferred.reject();
					}
				}, 0);
			}

			return deferred.promise;
		}
	});
}));