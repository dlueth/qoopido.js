/*! Qoopido.js library 3.6.7, 2015-07-08 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(t){window.qoopido.register("support/css/transform/2d",t,["../../../support","../transform"])}(function(t,r,o,s,e,n,p){"use strict";var c=t.support;return c.addTest("/css/transform/2d",function(r){t["support/css/transform"]().then(function(){var o=c.pool?c.pool.obtain("div"):n.createElement("div"),s=t.support.getCssProperty("transform");try{o.style[s]="rotate(30deg)"}catch(e){}/rotate/.test(o.style[s])?r.resolve():r.reject(),o.dispose&&o.dispose()},function(){r.reject()})})});