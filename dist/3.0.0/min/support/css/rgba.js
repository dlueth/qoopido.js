(function(e,t){"use strict";function n(){return t.qoopido.initialize("support/css/rgba",e,arguments)}"function"==typeof define&&define.amd?define(["../../support","../../pool/dom"],n):n()})(function(e){"use strict";return e.support.addTest("/css/rgba",function(e){var t=window.qoopido.shared.pool.dom.obtain("div");try{t.style.backgroundColor="rgba(150,255,150,.5)"}catch(n){}/rgba/.test(t.style.backgroundColor)?e.resolve():e.reject(),t.dispose()})},window);