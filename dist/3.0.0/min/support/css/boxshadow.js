(function(e,t){"use strict";function n(){return t.qoopido.initialize("support/css/boxshadow",e,arguments)}"function"==typeof define&&define.amd?define(["../../support"],n):n()})(function(e){"use strict";return e.support.addTest("/css/boxshadow",function(t){e.support.supportsProperty("box-shadow")?t.resolve(e.support.getProperty("box-shadow")):t.reject()})},window);