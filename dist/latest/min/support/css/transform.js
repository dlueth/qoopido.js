(function(t,e){"use strict";var n=function n(){return e.qoopido.shared.module.initialize("support/css/transform",t,arguments)};"function"==typeof define&&define.amd?define(["../../support"],n):n(e.qoopido.support)})(function(t){"use strict";return t.addTest("/css/transform",function(e){t.supportsProperty("transform")?e.resolve(t.getProperty("transform")):e.reject()})},window);