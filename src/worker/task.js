/*
 * Qoopido worker task
 *
 * Copyright (c) 2012 Dirk Lüth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lüth <info@qoopido.com>
 */
var self = this;

self.addEventListener('message', function(pEvent) {
	'use strict';

	var processed = self.process(pEvent.data.func, pEvent.data.args);

	self.postMessage({ type: 'result', result: processed.func.apply(null, processed.args)});
}, false);

self.postProgress = function(pProgress) {
	'use strict';

	self.postMessage({ type: 'progress', progress: pProgress});
};

self.process = function(pFunction, pArguments) {
	'use strict';

	var functionArguments = pFunction.substring(pFunction.indexOf('(') + 1, pFunction.indexOf(')')).replace(/,\s+/g, ',').split(','),
		finalArguments    = [],
		i, argument;

	for(i = 0; (argument = functionArguments[i]) !== undefined; i++) {
		finalArguments[i] = (pArguments[argument] !== undefined) ? pArguments[argument] : null;
	}

	functionArguments.push(pFunction.substring(pFunction.indexOf('{') + 1, pFunction.lastIndexOf('}')));

	return {
		func: Function.apply(null, functionArguments),
		args: finalArguments
	};
};