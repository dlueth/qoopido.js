(function(t){window.qoopido.register("pool",t,["./function/merge","./function/unique/uuid"])})(function(t){"use strict";function e(){var t,e,n,r=this,o=r.metrics,i=r._settings,s=r._queue,l=r._variables,u=1;if(s.length>0&&(l.durationAverage>0&&(u=~~(1>(u=i.frameBudget/l.durationAverage)?1:u)),(t=Math.min(s.length,(e=s.splice(0,u)).length))>0))if(o.inPool+t<=i.maxPoolsize){n=(new Date).getTime();for(var a=0;t>a;a++){var c=e[a],f=c._quid,p=c.dispose;c=r._dispose(c),c._quid=f,c.dispose=p,r._getPool.call(r,c).push(c)}o.inPool+=t,o.inQueue-=t,l.durationSamples+=t,l.durationTotal+=(new Date).getTime()-n,l.durationAverage=l.durationTotal/l.durationSamples}else{if("function"==typeof r._destroy)for(var d=0;t>d;d++)r._destroy(e[d]);e.length=0,o.inQueue-=t,o.destroyed+=t}}var n,r={interval:1e3/60,frameBudget:.5,maxPoolsize:1e3};return n=t.base.extend({metrics:null,_settings:null,_pool:null,_queue:null,_variables:null,_constructor:function(n){var o=this;o.metrics={total:0,inPool:0,inUse:0,inQueue:0,recycled:0,destroyed:0},o._settings=t["function/merge"]({},r,n),o._pool=o._initPool(),o._queue=[],o._variables={durationSamples:0,durationTotal:0,durationAverage:0},setInterval(function(){e.call(o)},o._settings.interval)},_initPool:function(){return[]},_initElement:function(e){var n=this;return e._quid=t["function/unique/uuid"](),e.dispose=function(){n.dispose(e)},n.metrics.total++,e},_getPool:function(){return this._pool},obtain:function(){var t=this,e=t._getPool.apply(t,arguments).pop();return e?(t.metrics.inPool--,t.metrics.recycled++):e=t._initElement(t._obtain.apply(t,arguments)),"function"==typeof e._obtain&&e._obtain.apply(e,arguments),t.metrics.inUse++,e},dispose:function(t){var e=this,n=e._queue;return t._quid||(t=e._initElement(t),e.metrics.inUse++),"function"==typeof t._dispose&&t._dispose(),n.push(t),e.metrics.inUse--,e.metrics.inQueue++,null}})});