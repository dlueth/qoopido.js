/*! Qoopido.js library 3.7.4, 2015-08-14 | https://github.com/dlueth/qoopido.js | (c) 2015 Dirk Lueth */
!function(o,u){u.qoopido.register("pool/module",o,["../pool","../function/unique/uuid"])}(function(o,u,t,n){"use strict";var e=o["function/unique/uuid"],i=o.pool.extend({_module:null,_destroy:null,_constructor:function(o,t,n){var r=this,l=o._puid||(o._puid=e()),d=n&&(u.pool||(u.pool={}))&&(u.pool.module||(u.pool.module={}));return n===!0&&d[l]?d[l]:(r=i._parent._constructor.call(this,t),r._module=o,"function"==typeof o._destroy&&(r._destroy=function(o){o._destroy()}),n===!0&&(d[l]=r),r)},_dispose:function(o){return o},_obtain:function(){return this._module.create.apply(this._module,arguments)}});return i},this);