(function(e,t,r,n,o){"use strict";function c(){return i("base",e)}function i(e,t,c){var i=e.split("/"),u=i[i.length-1],p=f;if(a[e])return a[e];for(var l=0;i[l+1]!==o;l++)p[i[l]]=p[i[l]]||{},p=p[i[l]];return p[u]=a[e]=function(){return c===!0?t.call(null,f,i,r,n,o).create():t.call(null,f,i,r,n,o)}()}t();var u="qoopido",f=r[u]=r[u]||{},a=f._lookup=f._lookup||{};i("shared/module/initialize",function(e,t){return"function"==typeof define&&define.amd&&define(t,i),i}),"function"==typeof define&&define.amd?define(c):c()})(function(e,t,r,n,o){"use strict";return{create:function(){var e=Object.create(this,Object.getOwnPropertyDescriptors(this));return e._constructor&&e._constructor.apply(e,arguments),e.create=e.extend=o,e},extend:function(e){return e=e||{},e._parent=Object.create(this,Object.getOwnPropertyDescriptors(this)),Object.create(this,Object.getOwnPropertyDescriptors(e))}}},function(e){"use strict";function t(){}function r(e){try{return Object[y](e,"sentinel",{}),"sentinel"in e}catch(t){}}function n(e){try{return e.sentinel=0,0===Object[d](e,"sentinel").value}catch(t){}}var o,c,i,u=null,f="function",a="object",p="undefined",l="__proto__",s="prototype",b="hasOwnProperty",y="defineProperty",O="defineProperties",d="getOwnPropertyDescriptor",j="getOwnPropertyDescriptors",_="getOwnPropertyNames",v=Object[s],w=v[l]===u,h=v[b]("__defineGetter__");if(!Object.keys){var m,g=!0,P=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];for(m in{toString:u})g=!1;Object.keys=function(t){var r,n=[];if(typeof t!==a&&typeof t!==f||t===u)throw new TypeError("Object.keys called on a non-object");for(r in t)t[b](r)&&n.push(r);if(g===!0){var o;for(o=0;(r=P[o])!==e;o++)t[b](r)&&n.push(r)}return n}}if(Object[y]&&((!r({})||typeof document!==p&&!r(document.createElement("div")))&&(o=Object[y],c=Object[O]),(!n({})||typeof document!==p&&!n(document.createElement("div")))&&(i=Object[d])),Object[y]&&o===u||(Object[y]=function(e,t,r){if(typeof e!==a&&typeof e!==f||e===u)throw new TypeError("Object[stringDefineProperty] called on non-object: "+e);if(typeof r!==a&&typeof r!==f||r===u)throw new TypeError("Property description must be an object: "+r);if(o!==u)try{return o.call(Object,e,t,r)}catch(n){}if(r[b]("value"))if(h&&(e.__lookupGetter__(t)||e.__lookupSetter__(t))){var c=e[l];e[l]=v,delete e[t],e[t]=r.value,e[l]=c}else e[t]=r.value;else{if(h===!1)throw new TypeError("getters & setters can not be defined on this javascript engine");r[b]("get")&&e.__defineGetter__(t,r.get),r[b]("set")&&e.__defineSetter__(t,r.set)}return e}),Object[O]&&c===u||(Object[O]=function(e,t){var r;if(c)try{return c.call(Object,e,t)}catch(n){}for(r in t)t[b](r)&&"__proto__"!==r&&Object[y](e,r,t[r]);return e}),Object[d]&&i===u||(Object[d]=function(e,t){var r={enumerable:!0,configurable:!0};if(typeof e!==a&&typeof e!==f||e===u)throw new TypeError("Object[stringGetOwnPropertyDescriptor] called on non-object: "+e);if(i!==u)try{return i.call(Object,e,t)}catch(n){}if(e[b](t)){if(h===!0){var o,c,p=e[l];if(e[l]=v,o=e.__lookupGetter__(t),c=e.__lookupSetter__(t),e[l]=p,o||c)return o&&(r.get=o),c&&(r.set=c),r}return r.value=e[t],r.writable=!0,r}}),Object[j]||(Object[j]=function(t){var r,n,o={},c=Object[_](t);for(r=0;(n=c[r])!==e;r++)o[n]=Object[d](t,n);return o}),Object[_]||(Object[_]=function(e){return Object.keys(e)}),!Object.create){var E;E=w||typeof document===p?function(){return{__proto__:u}}:function(){var e,r=document.createElement("iframe"),n=document.body||document.documentElement;return r.style.display="none",n.appendChild(r),r.src="javascript:",e=r.contentWindow.pointerObjectPrototype,delete e.constructor,delete e.hasOwnProperty,delete e.propertyIsEnumerable,delete e.isPrototypeOf,delete e.toLocaleString,delete e.toString,delete e.valueOf,e[l]=u,n.removeChild(r),r=u,t[s]=e,E=function(){return new t},new t},Object.create=function(e,t){function r(){}var n;if(e===u)n=E();else{if(typeof e!==a&&typeof e!==f)throw new TypeError("Object prototype may only be an Object or null");r[s]=e,n=new r,n[l]=e}return t!==void 0&&Object[O](n,t),n}}},window,document);