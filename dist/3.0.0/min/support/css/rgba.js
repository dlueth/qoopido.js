(function(e,t){"use strict";function n(){return t.qoopido.initialize("support/css/rgba",e,arguments)}"function"==typeof define&&define.amd?define(["../../support"],n):n()})(function(e){"use strict";return e.support.addTest("/css/rgba",function(t){var n=e.support.getElement("div");try{n.style.backgroundColor="rgba(150,255,150,.5)"}catch(r){}/rgba/.test(n.style.backgroundColor)?t.resolve():t.reject()})},window);