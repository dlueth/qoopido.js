(function(t,e){"use strict";function n(){return e.qoopido.initialize("support/element/canvas/todataurl",t,arguments)}"function"==typeof define&&define.amd?define(["../../../support","../canvas","../../../pool/dom"],n):n()})(function(t,e,n,i,r,o){"use strict";return t.support.addTest("/element/canvas/todataurl",function(e){t["support/element/canvas"]().then(function(){var t=i.qoopido.shared.pool.dom.obtain("canvas");t.toDataURL!==o?e.resolve():e.reject(),t.dispose()}).fail(function(){e.reject()})})},window);