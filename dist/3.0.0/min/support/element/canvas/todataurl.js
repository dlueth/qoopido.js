(function(t,e){"use strict";function n(){return e.qoopido.initialize("support/element/canvas/todataurl",t,arguments)}"function"==typeof define&&define.amd?define(["../../../support","../canvas"],n):n()})(function(t,e,n,r,i,o){"use strict";return t.support.addTest("/element/canvas/todataurl",function(e){t["support/element/canvas"]().then(function(){t.support.getElement("canvas").toDataURL!==o?e.resolve():e.reject()}).fail(function(){e.reject()})})},window);