/*! Qoopido.js library 3.7.4, 2015-08-14 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(e,t){var n=[];Array.prototype.indexOf||n.push("../array/indexof"),t.qoopido.register("polyfill/window/removeeventlistener",e,n)}(function(e,t,n,r){"use strict";return n.removeEventListener||(n.removeEventListener=Window.prototype.removeEventListener=HTMLDocument.prototype.removeEventListener=Element.prototype.removeEventListener=function(e,t){var n=this;if(n._events&&n._events[e]&&n._events[e].list){var r=n._events[e].list.indexOf(t);r>-1&&(n._events[e].list.splice(r,1),n._events[e].list.length||n.detachEvent&&n.detachEvent("on"+e,n._events[e]))}}),n.removeEventListener},this);