/*!
* Qoopido.js library v3.4.5, 2014-7-12
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){window.qoopido.register("polyfill/window/event",e)}(function(e,n,t,r,b,c,o){"use strict";if(!b.Event){var l=c.createEvent?function(e,n){var t=c.createEvent("Event"),r=n&&n.bubbles!==o?n.bubbles:!1,b=n&&n.cancelable!==o?n.cancelable:!0;return t.initEvent(e,r,b),t}:function(e,n){var t=c.createEventObject();return t.type=e,t.bubbles=n&&n.bubbles!==o?n.bubbles:!1,t.cancelable=n&&n.cancelable!==o?n.cancelable:!0,t};console.log("hier"),b.Event=Window.prototype.Event=function(e,n){if(!e)throw new Error("Not enough arguments");return l(e,n)}}return b.Event});