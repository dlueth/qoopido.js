(function(e,t){"use strict";var r=function r(){return t.qoopido.shared.module.initialize("support/css/rgba",e,arguments)};"function"==typeof define&&define.amd?define(["../../support"],r):r(t.qoopido.support)})(function(e){"use strict";return e.addTest("/css/rgba",function(t){var r=e.getElement("div");try{r.style.backgroundColor="rgba(150,255,150,.5)"}catch(n){}/rgba/.test(r.style.backgroundColor)?t.resolve():t.reject()})},window);