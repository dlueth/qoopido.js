/*! Qoopido.js library 3.6.8, 2015-07-09 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(t){window.qoopido.register("support/element/canvas/todataurl/png",t,["../../../../support","../todataurl"])}(function(t,e,a,n,o,r,s){"use strict";var p=t.support;return p.addTest("/element/canvas/todataurl/png",function(e){t["support/element/canvas/todataurl"]().then(function(){var t=p.pool?p.pool.obtain("canvas"):r.createElement("canvas");0===t.toDataURL("image/png").indexOf("data:image/png")?e.resolve():e.reject(),t.dispose&&t.dispose()},function(){e.reject()})})});