/*! Qoopido.js 4.0.0, 2015-08-31 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(t){"use strict";function e(t,e,r){function s(t,a){var o=this["super"].call(this),l=o.uuid;return!l&&(l=r())&&n(o,"uuid",i(l)),u[l]={settings:e({},s.settings,a),length:null,index:null,current:null,data:null},t&&o.setData(t),o}var a;return s.prototype={setData:function(t){var e,n,i,r=this;return"object"==typeof t&&t.length&&(e=r.uuid,n=u[e],i=n.settings,n.data=t,n.length=t.length,null!==i.initial&&r.seek(i.initial)),r},getState:function(){return this.state},getLength:function(){return this.state.length},getIndex:function(){return this.state.index},getCurrent:function(){return this.state.current},getItem:function(t){return this.state.data[t]},getData:function(){return this.state.data},seek:function(t){var e=this,n=u[e.uuid];return t=parseInt(t,10),t!==n.index&&"undefined"!=typeof n.data[t]&&(n.index=t,n.current=n.data[t]),e},first:function(){return this.seek(0)},last:function(){var t=this,e=u[t.uuid];return t.seek(e.length-1)},previous:function(){var t,e=this,n=e.uuid,i=u[n],r=i.settings;return t=r.loop===!0?(i.index-1)%i.length:i.index-1,t=r.loop===!0&&0>t?i.length+t:t,e.seek(t)},next:function(){var t,e=this,n=e.uuid,i=u[n],r=i.settings;return t=r.loop===!0?(i.index+1)%i.length:i.index+1,e.seek(t)}},a=t.extend(s),a.settings={loop:!0,initial:0},a}var n=Object.defineProperty,i=function(t,e){return{writable:!!e,configurable:!1,enumerable:!1,value:t}},u={};provide(e).when("../emitter","../function/merge","../function/unique/uuid")}();