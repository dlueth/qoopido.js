(function(e,t){"use strict";function n(){return t.qoopido.shared.module.initialize("element/emerge",e)}"function"==typeof define&&define.amd?define(["../element","../function/merge","../unique"],n):n()})(function(e,t,n,r,i){"use strict";function o(e){var t,r=h[e];for(t in r)"length"!==t&&c.call(r[t]);0===r.length&&(n.element.clearInterval(d[e]),delete d[e])}function l(){v.left=0,v.top=0,v.right=p.clientWidth,v.bottom=p.clientHeight}function u(){var e=this,t=e._settings.threshold||p.clientWidth*e._settings.auto,n=e._settings.threshold||p.clientHeight*e._settings.auto;e._viewport.left=v.left-t,e._viewport.top=v.top-n,e._viewport.right=v.right+t,e._viewport.bottom=v.bottom+n}function c(){var e,t=this,n=!1,r=2;!t.isVisible()||"hidden"===t.getStyle("visibility")&&t._settings.visibility!==!1||(e=t.element.getBoundingClientRect(),(e.left>=t._viewport.left&&e.top>=t._viewport.top&&e.left<=t._viewport.right&&e.top<=t._viewport.bottom||e.right>=t._viewport.left&&e.bottom>=t._viewport.top&&e.right<=t._viewport.right&&e.bottom<=t._viewport.bottom)&&((e.left>=v.left&&e.top>=v.top&&e.left<=v.right&&e.top<=v.bottom||e.right>=v.left&&e.bottom>=v.top&&e.right<=v.right&&e.bottom<=v.bottom)&&(r=1),n=!0)),(n!==t._state||n===!0&&r!==t._priority)&&s.call(t,n,r)}function s(e,t){var n=this;n._state=e,n._priority=t,n._settings.recur!==!0&&n.remove(),e===!0?n.emit(y,t):n.emit(m)}var f,a={interval:50,threshold:"auto",recur:!0,auto:.5,visibility:!0},p=n.document.documentElement,v={},d={},h={},y="emerged",m="demerged",b="resize orientationchange";if(n=e.element.create(n),"CSS1Compat"!==r.compatMode)throw"This script requires your browser to work in standards mode";return f=e.element.extend({_viewport:null,_uuid:null,_element:null,_settings:null,_state:null,_priority:null,_constructor:function(t,r){var l=this;f._parent._constructor.call(l,t),r=e.function.merge({},a,r||{}),"auto"===r.threshold&&delete r.threshold,d[r.interval]===i&&(h[r.interval]=h[r.interval]||{length:0},d[r.interval]=n.element.setInterval(function(){o(r.interval)},r.interval)),l._viewport={},l._uuid=e.unique.uuid(),l._settings=r,l._state=!1,l._priority=2,h[r.interval][l._uuid]=l,h[r.interval].length++,n.on(b,function(){u.call(l)}),u.call(l)},remove:function(){var e=this;delete h[e._settings.interval][e._uuid],h[e._settings.interval].length--}}),n.on(b,l),l(),f},window);