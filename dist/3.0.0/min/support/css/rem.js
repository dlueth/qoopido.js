(function(t,e){"use strict";function n(){return e.qoopido.shared.module.initialize("support/css/rem",t)}"function"==typeof define&&define.amd?define(["../../support"],n):n()})(function(t){"use strict";return t.support.addTest("/css/rem",function(e){var n=t.support.getElement("div");try{n.style.fontSize="3rem"}catch(r){}/rem/.test(n.style.fontSize)?e.resolve():e.reject()})},window);