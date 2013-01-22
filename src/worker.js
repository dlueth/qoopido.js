/*
 * Qoopido worker class
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 * @require qoopido/base.js
 * @require qoopido/support/method/worker.js
 * @require Q.js
 */
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'worker',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'qoopido/base', 'qoopido/support', 'q' ], initialize);
	} else {
		initialize(window[namespace].base, window[namespace].support, window.Q);
	}
}(function(mBase, mSupport, mQ, window, document, undefined) {
	'use strict';

	var supportsWorker = mSupport.supportsMethod('Worker');

	return mBase.extend({
		execute: function execute(pWorker, pFunction, pArguments) {
			var deferred  = mQ.defer();

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

				worker.postMessage({ func: pFunction.toString(), args: pArguments || {} });
			} else {
				setTimeout(function(){
					try {
						var list = (pFunction.toString().match(/\(.+\)/) || [''])[0].replace(/[()\r\n ]/g, '').split(','),
							i    = 0,
							parameter;

						for(i; (parameter = list[i]) !== undefined; i++) {
							list[i] = pArguments[parameter] || null;
						}

						deferred.resolve(pFunction.apply(null, list));
					} catch(exception) {
						deferred.reject();
					}
				}, 0);
			}

			return deferred.promise;
		}
	});
}, window, document));