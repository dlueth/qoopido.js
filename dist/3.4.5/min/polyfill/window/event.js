/*!
* Qoopido.js library v3.4.5, 2014-7-11
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){window.qoopido.register("polyfill/window/event",e)}(function(e,n,t,r,b,c,l){"use strict";if(!b.Event){var o=c.createEvent?function(e,n){var t=c.createEvent("Event"),r=n&&n.bubbles!==l?n.bubbles:!1,b=n&&n.cancelable!==l?n.cancelable:!0;return t.initEvent(e,r,b),t}:function(e,n){var t=c.createEventObject();return t.type=e,t.bubbles=n&&n.bubbles!==l?n.bubbles:!1,t.cancelable=n&&n.cancelable!==l?n.cancelable:!0,t};b.Event=Window.prototype.Event=function(e,n){if(!e)throw new Error("Not enough arguments");return o(e,n)}}return b.Event});