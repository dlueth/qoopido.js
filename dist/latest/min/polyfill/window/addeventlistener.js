/*!
* Qoopido.js library v3.4.5, 2014-7-13
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){var t=[];Array.prototype.indexOf||t.push("../array/indexof"),window.qoopido.register("polyfill/window/addeventlistener",e,t)}(function(e,t,n,a,r,o,i){"use strict";return r.addEventListener||(r.addEventListener=Window.prototype.addEventListener=HTMLDocument.prototype.addEventListener=Element.prototype.addEventListener=function(e,t){var n=this;n._events||(n._events={}),n._events[e]||(n._events[e]=function(e){var t,a=n._events[e.type].list,r=Array.prototype.concat.call([],a),l=0;for(e.preventDefault=function(){e.cancelable!==!1&&(e.returnValue=!1)},e.stopPropagation=function(){e.cancelBubble=!0},e.stopImmediatePropagation=function(){e.cancelBubble=!0,e.cancelImmediate=!0},e.currentTarget=n,e.relatedTarget=e.fromElement||null,e.target=e.srcElement||n,e.timeStamp=(new Date).getTime(),e.clientX&&(e.pageX=e.clientX+o.documentElement.scrollLeft,e.pageY=e.clientY+o.documentElement.scrollTop);(t=r[l])!==i&&!e.cancelImmediate;++l)a.indexOf(t)>-1&&t.call(n,e)},n._events[e].list=[],n.attachEvent&&n.attachEvent("on"+e,n._events[e])),n._events[e].list.push(t)}),r.addEventListener});