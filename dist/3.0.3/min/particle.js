(function(t,e){"use strict";function n(){return e.qoopido.initialize("particle",t,arguments)}"function"==typeof define&&define.amd?define(["./emitter","./function/merge"],n):n()})(function(t){"use strict";var e,n={gravity:.06,velocity:{x:0,y:0}};return e=t.emitter.extend({_settings:null,angle:null,velocity:null,position:null,_constructor:function(i,r,o){var a=this;a._settings=t["function/merge"]({},n,o),a.position={x:i||0,y:r||0},a.velocity=a._settings.velocity,e._parent._constructor.call(a)},_obtain:function(e,n,i){var r=this;r._settings=t["function/merge"](r._settings,i),r.velocity=r._settings.velocity,r.position.x=e||0,r.position.y=n||0},update:function(){var t=this;t.velocity.y+=t._settings.gravity,t.position.x+=t.velocity.x,t.position.y+=t.velocity.y}})},window);