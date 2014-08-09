/*!
* Qoopido.js library v3.4.5, 2014-7-9
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(t){var n=[];window.Event||n.push("./event"),window.qoopido.register("polyfill/window/customevent",t,n)}(function(t,n,e,o,i){"use strict";return i.CustomEvent||(i.CustomEvent=Window.prototype.CustomEvent=function(t,n){var e=new i.Event(t,n);return e.detail=n&&n.detail,e}),i.CustomEvent});