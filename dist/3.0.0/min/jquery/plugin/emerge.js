(function(t,e){"use strict";function n(){return e.qoopido.initialize("jquery/plugins/emerge",t,arguments)}"function"==typeof define&&define.amd?define(["../../dom/element/emerge","jquery"],n):n()})(function(t,e,n){"use strict";var i,r=window.jQuery||e[1],o=n.pop(),a="emerged",u="demerged",s="".concat(a,".",o),l="".concat(u,".",o);return r.fn[o]=function(t){return this.each(function(){i.create(this,t)})},i=t["element/emerge"].extend({_constructor:function(t,e){var n=this,o=r(t);i._parent._constructor.call(n,t,e),n.on(a,function(t){o.trigger(s,{priority:t.data})}),n.on(u,function(){o.trigger(l)})}})},window);