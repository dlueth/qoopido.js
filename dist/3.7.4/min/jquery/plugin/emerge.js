/*! Qoopido.js library 3.7.4, 2015-08-14 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(e,r){r.qoopido.register("jquery/plugins/emerge",e,["../../dom/element/emerge","jquery"])}(function(e,r,t,n){"use strict";var o,c=e.jquery||t.jQuery,i="emerge",u="emerged",g="demerged",a="".concat(u,".",i),m="".concat(g,".",i);return c.fn[i]=function(e){return this.each(function(){o.create(this,e)})},o=e["dom/element/emerge"].extend({_constructor:function(e,r){var t=o._parent._constructor.call(this,e,r),n=c(e);return t.on(u,function(e){n.trigger(a,{priority:e.data})}),t.on(g,function(){n.trigger(m)}),t}})},this);