(function(t,e){"use strict";function n(){return e.qoopido.initialize("emitter",t,arguments)}"function"==typeof define&&define.amd?define(["./base"],n):n()})(function(t,e,n,i,r,o){"use strict";function a(t,e){var n=e.charAt(0).toUpperCase()+e.slice(1);return t._mapped[e]=t[e],function(){var i,r=Array.prototype.slice.call(arguments);return t.emit.apply(t,["pre"+n,r]),i=t._mapped[e].apply(t,r),t.emit.apply(t,["post"+n,r,i]),i}}var l=/^(_|extend$|create$|on$|one$|off$|emit$|get.+)/;return t.base.extend({_mapped:null,_listener:null,_constructor:function(){var t,e=this;e._listener={},e._mapped={};for(t in e)"function"==typeof e[t]&&l.test(t)===!1&&(e[t]=a(e,t))},on:function(t,e){var n,i,r=this;for(t=t.split(" "),n=0;(i=t[n])!==o;n++)(r._listener[i]=r._listener[i]||[]).push(e);return r},one:function(t,e,n){n=n!==!1;var i=this;return i.on(t,function r(o){i.off(n===!0?o:t,r),e.apply(this,arguments)}),i},off:function(t,e){var n,i,r,a,l=this;if(t)for(t=t.split(" "),n=0;(i=t[n])!==o;n++)if(l._listener[i]=l._listener[i]||[],e)for(r=0;(a=l._listener[i][r])!==o;r++)a===e&&(l._listener[i].splice(r,1),r--);else l._listener[i].length=0;else for(i in l._listener)l._listener[i].length=0;return l},emit:function(t){var e,n,i=this;if(t!==o)for(i._listener[t]=i._listener[t]||[],e=0;(n=i._listener[t][e])!==o;e++)n.apply(i,arguments);return i}})},window);