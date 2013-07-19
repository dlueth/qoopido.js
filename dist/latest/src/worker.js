/*
 * Qoopido worker
 *
 * Provides a web worker abstraction
 *
 * Copyright (c) 2013 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require ./base
 * @require ./support
 * @require q (external)
 */
;(function(pDefinition, window) {
	'use strict';

	function definition() {
		return window.qoopido.initialize('worker', pDefinition, arguments, true);
	}

	if(typeof define === 'function' && define.amd) {
		define([ './base', './support', 'q' ], definition);
	} else {
		definition();
	}
}(function(modules, dependencies) {
	'use strict';

	var Q              = window.Q || dependencies[2],
		supportsWorker = modules['support'].supportsMethod('Worker');

	return modules['base'].extend({
		execute: function(pWorker, pFunction, pArguments) {
			var deferred  = Q.defer();

			pArguments = pArguments || [];

			if(supportsWorker === true) {
				var worker = new Worker(pWorker);

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
}, window));