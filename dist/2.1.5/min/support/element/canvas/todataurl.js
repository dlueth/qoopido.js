(function(e,t){"use strict";var r=function r(){return t.qoopido.shared.module.initialize("support/element/canvas/todataurl",e,arguments)};"function"==typeof define&&define.amd?define(["../../../support","../canvas"],r):r(t.qoopido.support,t.qoopido.support.element.canvas)})(function(e,t,r,n,o,i){"use strict";return e.addTest("/element/canvas/todataurl",function(r){t().then(function(){e.getElement("canvas").toDataURL!==i?r.resolve():r.reject()}).fail(function(){r.reject()})})},window);