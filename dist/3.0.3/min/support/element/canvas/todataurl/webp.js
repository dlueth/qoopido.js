(function(t,e){"use strict";function n(){return e.qoopido.initialize("support/element/canvas/todataurl/webp",t,arguments)}"function"==typeof define&&define.amd?define(["../../../../support","../todataurl","../../../../pool/dom"],n):n()})(function(t){"use strict";return t.support.addTest("/element/canvas/todataurl/webp",function(e){t["support/element/canvas/todataurl"]().then(function(){var t=window.qoopido.shared.pool.dom.obtain("canvas");0===t.toDataURL("image/webp").indexOf("data:image/webp")?e.resolve():e.reject(),t.dispose()}).fail(function(){e.reject()})})},window);