(function(e,t){"use strict";var n="qoopido/pager",r=function r(){return t.qoopido.shared.prepareModule(n,e,arguments)};"function"==typeof define&&define.amd?define(["./emitter","jquery"],r):r(t.qoopido.emitter,t.jQuery)})(function(e,t,n,r,o){"use strict";var i={loop:!0,initial:0};return e.extend({_settings:null,_state:null,_constructor:function(e,n){var r=this;r._parent._constructor.call(r),r._settings=t.extend(!0,{},i,n||{}),r._state={length:null,index:null,item:null,data:null},e!==o&&null!==e&&r.setData(e)},getState:function(){var e=this;return e._state},setData:function(e){var t=this;return"object"==typeof e&&(t._state.data=e,t._state.length=e.length,null!==t._settings.initial&&t.seek(t._settings.initial)),t},getData:function(){var e=this;return e._state.data},getLength:function(){var e=this;return e._state.length},getIndex:function(){var e=this;return e._state.index},getItem:function(e){var t=this;return t._state.data[e]!==o?t._state.data[e]:null},first:function(){var e=this;return e.seek(0)},last:function(){var e=this;return e.seek(e._state.length-1)},previous:function(){var e,t=this;return e=t._settings.loop===!0?(t._state.index-1)%t._state.length:t._state.index-1,e=t._settings.loop===!0&&0>e?t._state.length+e:e,t.seek(e)},next:function(){var e,t=this;return e=t._settings.loop===!0?(t._state.index+1)%t._state.length:t._state.index+1,t.seek(e)},seek:function(e){var t=this;return e=parseInt(e,10),e!==t._state.index&&t._state.data[e]!==o&&(t._state.index=e,t._state.item=t._state.data[e]),t}})},window,document);