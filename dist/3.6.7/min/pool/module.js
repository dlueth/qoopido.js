/*! Qoopido.js library 3.6.7, 2015-07-08 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(o){window.qoopido.register("pool/module",o,["../pool","../function/unique/uuid"])}(function(o,u,n,t,e,i,r){"use strict";var l=o["function/unique/uuid"],d=o.pool.extend({_module:null,_destroy:null,_constructor:function(o,n,t){var e=this,i=o._quid||(o._quid=l()),r=t&&(u.pool||(u.pool={}))&&(u.pool.module||(u.pool.module={}));return t===!0&&r[i]?r[i]:(d._parent._constructor.call(e,n),e._module=o,"function"==typeof o._destroy&&(e._destroy=function(o){o._destroy()}),t===!0&&(r[i]=e),void 0)},_dispose:function(o){return o},_obtain:function(){return this._module.create.apply(this._module,arguments)}});return d});