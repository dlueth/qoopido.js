/*
 * Qoopido worker task
 *
 * Copyright (c) 2013 Dirk Lüth
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

	self.postMessage({ type: 'result', result: self.process(pEvent.data.func).apply(null, pEvent.data.args)});
}, false);

self.postProgress = function(pProgress) {
	'use strict';

	self.postMessage({ type: 'progress', progress: pProgress});
};

self.process = function(pFunction) {
	'use strict';

	var functionArguments = pFunction.substring(pFunction.indexOf('(') + 1, pFunction.indexOf(')')).replace(/,\s+/g, ',').split(',');

	functionArguments.push(pFunction.substring(pFunction.indexOf('{') + 1, pFunction.lastIndexOf('}')));

	return Function.apply(null, functionArguments);
};