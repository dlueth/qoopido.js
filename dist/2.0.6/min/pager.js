(function(t,e,n,r){"use strict";var i="qoopido/pager",o=function o(){for(var o=(i=i.split("/")).splice(i.length-1,1),s=e,a=0;i[a]!==r;a++)s[i[a]]=s[i[a]]||{},s=s[i[a]];return[].push.apply(arguments,[e,n,r]),s[o]=t.apply(null,arguments)};"function"==typeof define&&define.amd?define(["./emitter","jquery"],o):o(e.qoopido.emitter,e.jQuery)})(function(t,e,n,r,i){"use strict";var o={loop:!0,initial:0};return t.extend({_settings:null,_state:null,_constructor:function(t,n){var r=this;r._parent._constructor.call(r),r._settings=e.extend(!0,{},o,n||{}),r._state={length:null,index:null,item:null,data:null},t!==i&&null!==t&&r.setData(t)},getState:function(){var t=this;return t._state},setData:function(t){var e=this;return"object"==typeof t&&(e._state.data=t,e._state.length=t.length,null!==e._settings.initial&&e.seek(e._settings.initial)),e},getData:function(){var t=this;return t._state.data},getLength:function(){var t=this;return t._state.length},getIndex:function(){var t=this;return t._state.index},getItem:function(t){var e=this;return e._state.data[t]!==i?e._state.data[t]:null},first:function(){var t=this;return t.seek(0)},last:function(){var t=this;return t.seek(t._state.length-1)},previous:function(){var t,e=this;return t=e._settings.loop===!0?(e._state.index-1)%e._state.length:e._state.index-1,t=e._settings.loop===!0&&0>t?e._state.length+t:t,e.seek(t)},next:function(){var t,e=this;return t=e._settings.loop===!0?(e._state.index+1)%e._state.length:e._state.index+1,e.seek(t)},seek:function(t){var e=this;return t=parseInt(t,10),t!==e._state.index&&e._state.data[t]!==i&&(e._state.index=t,e._state.item=e._state.data[t]),e}})},window,document);