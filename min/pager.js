(function(e,t,n,r){"use strict";function o(){return[].push.apply(arguments,[t,n,r]),t[i]=t[i]||{},t[i][s]=e.apply(null,arguments)}var i="qoopido",s="pager";typeof define=="function"&&define.amd?define(["jquery","./emitter"],o):o(jQuery,t[i].emitter)})(function(e,t,n,r,i){"use strict";var s={loop:!0,initial:0};return t.extend({_settings:null,_state:null,_constructor:function(n,r){var o=this;o._parent._constructor.call(o),o._settings=e.extend(!0,{},s,r||{}),o._state={length:null,index:null,item:null,data:null},n!==i&&n!==null&&o.setData(n)},getState:function(){var t=this;return t._state},setData:function(t){var n=this;return typeof t=="object"&&(n._state.data=t,n._state.length=t.length,n._settings.initial!==null&&n.seek(n._settings.initial)),n},getData:function(t){var n=this;return n._state.data},getLength:function(){var t=this;return t._state.length},getIndex:function(){var t=this;return t._state.index},getItem:function(t){var n=this;return n._state.data[t]!==i?n._state.data[t]:null},first:function(){var t=this;return t.seek(0)},last:function(){var t=this;return t.seek(t._state.length-1)},previous:function(){var t=this,n;return n=t._settings.loop===!0?(t._state.index-1)%t._state.length:t._state.index-1,n=t._settings.loop===!0&&n<0?t._state.length+n:n,t.seek(n)},next:function(){var t=this,n;return n=t._settings.loop===!0?(t._state.index+1)%t._state.length:t._state.index+1,t.seek(n)},seek:function(t){var n=this;return t=parseInt(t,10),t!==n._state.index&&n._state.data[t]!==i&&(n._state.index=t,n._state.item=n._state.data[t]),n}})},window,document);