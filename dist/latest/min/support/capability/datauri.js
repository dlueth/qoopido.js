(function(e,t){"use strict";function n(){return t.qoopido.initialize("support/capability/datauri",e,arguments)}"function"==typeof define&&define.amd?define(["../../support","../../dom/element","../../pool/dom"],n):n()})(function(e,t,n,r){"use strict";return e.support.addTest("/capability/datauri",function(t){var n=e["dom/element"].create(r.qoopido.shared.pool.dom.obtain("img"));n.one("error load",function(e){"load"===e.type&&1===n.element.width&&1===n.element.height?t.resolve():t.reject(),n.element.dispose()},!1).setAttribute("src","data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")})},window);