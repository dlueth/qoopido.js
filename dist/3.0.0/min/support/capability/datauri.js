(function(t,e){"use strict";function n(){return e.qoopido.shared.module.initialize("support/capability/datauri",t)}"function"==typeof define&&define.amd?define(["../../support"],n):n()})(function(t){"use strict";return t.support.addTest("/capability/datauri",function(e){var n=t.support.getElement("image");n.onerror=function(){e.reject()},n.onload=function(){1===n.width&&1===n.height?e.resolve():e.reject()},n.src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="})},window);