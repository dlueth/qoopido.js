/*!
* Qoopido.js library v3.6.0, 2014-12-2
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){window.qoopido.register("dom/event",e,["../base","../hook/event"])}(function(e,t,o,i,n,a,r){"use strict";var p=e["hook/event"];return e.base.extend({originalEvent:null,isDelegate:!1,isDefaultPrevented:!1,isPropagationStopped:!1,isImmediatePropagationStopped:!1,_properties:null,_constructor:function(e){var t=this;t._properties=[],t._obtain(e)},_obtain:function(e){p.process(this,e)},_dispose:function(){for(var e,t=this,o=0;(e=t._properties[o])!==r;o++)delete t[e];delete t.delegate,t.originalEvent=null,t.isDelegate=!1,t.isDefaultPrevented=!1,t.isPropagationStopped=!1,t.isImmediatePropagationStopped=!1,t._properties.length=0},preventDefault:function(){var e=this,t=e.originalEvent;t.cancelable!==!1&&(e.isDefaultPrevented=!0,t.preventDefault?t.preventDefault():t.returnValue=!1)},stopPropagation:function(){var e=this,t=e.originalEvent;e.isPropagationStopped=!0,t.stopPropagation&&t.stopPropagation(),t.cancelBubble=!0},stopImmediatePropagation:function(){var e=this,t=e.originalEvent;e.isImmediatePropagationStopped=!0,t.stopImmediatePropagation&&t.stopImmediatePropagation(),e.stopPropagation()}})});