(function(e,t,r,n,o){"use strict";function c(){return i("base",e)}function i(e,t,c){var i=e.split("/"),u=i[i.length-1],f=p;if(l[e])return l[e];for(var a=0;i[a+1]!==o;a++)f[i[a]]=f[i[a]]||{},f=f[i[a]];return f[u]=l[e]=function(){return c===!0?t.call(null,p,i,r,n,o).create():t.call(null,p,i,r,n,o)}()}t();var u="qoopido",p=r[u]=r[u]||{},l=p._lookup=p._lookup||{};i("shared/module/initialize",function(e,t){return"function"==typeof define&&define.amd&&define(t,i),i}),"function"==typeof define&&define.amd?define(c):c()})(function(e,t,r,n,o){"use strict";return{create:function(){var e=Object.create(this,Object.getOwnPropertyDescriptors(this));return e._constructor&&e._constructor.apply(e,arguments),e.create=e.extend=o,e},extend:function(e){return e=e||{},e._parent=this,Object.create(this,Object.getOwnPropertyDescriptors(e))}}},function(e){"use strict";function t(){}function r(e){try{return Object.defineProperty(e,"sentinel",{}),"sentinel"in e}catch(t){}}function n(e){try{return e.sentinel=0,0===Object.getOwnPropertyDescriptor(e,"sentinel").value}catch(t){}}var o,c,i,u=Object.prototype,p=null===u.hasOwnProperty,l=u.hasOwnProperty("__defineGetter__");if(!Object.keys){var f,a=!0,s=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];for(f in{toString:null})a=!1;Object.keys=function(t){var r,n=[];if("object"!=typeof t&&"function"!=typeof t||null===t)throw new TypeError("Object.keys called on a non-object");for(r in t)t.hasOwnProperty(r)&&n.push(r);if(a===!0){var o;for(o=0;(r=s[o])!==e;o++)t.hasOwnProperty(r)&&n.push(r)}return n}}if(Object.defineProperty&&((!r({})||"undefined"!=typeof document&&!r(document.createElement("div")))&&(o=Object.defineProperty,c=Object.defineProperties),(!n({})||"undefined"!=typeof document&&!n(document.createElement("div")))&&(i=Object.getOwnPropertyDescriptor)),Object.defineProperty&&null===o||(Object.defineProperty=function(e,t,r){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError("Object.defineProperty called on non-object: "+e);if("object"!=typeof r&&"function"!=typeof r||null===r)throw new TypeError("Property description must be an object: "+r);if(null!==o)try{return o.call(Object,e,t,r)}catch(n){}if(r.hasOwnProperty("value"))if(l&&(e.__lookupGetter__(t)||e.__lookupSetter__(t))){var c=e.__proto__;e.__proto__=u,delete e[t],e[t]=r.value,e.__proto__=c}else e[t]=r.value;else{if(l===!1)throw new TypeError("getters & setters can not be defined on this javascript engine");r.hasOwnProperty("get")&&e.__defineGetter__(t,r.get),r.hasOwnProperty("set")&&e.__defineSetter__(t,r.set)}return e}),Object.defineProperties&&null===c||(Object.defineProperties=function(e,t){var r;if(c)try{return c.call(Object,e,t)}catch(n){}for(r in t)t.hasOwnProperty(r)&&"__proto__"!==r&&Object.defineProperty(e,r,t[r]);return e}),Object.getOwnPropertyDescriptor&&null===i||(Object.getOwnPropertyDescriptor=function(e,t){var r={enumerable:!0,configurable:!0};if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError("Object.getOwnPropertyDescriptor called on non-object: "+e);if(null!==i)try{return i.call(Object,e,t)}catch(n){}if(e.hasOwnProperty(t)){if(l===!0){var o,c,p=e.__proto__;if(e.__proto__=u,o=e.__lookupGetter__(t),c=e.__lookupSetter__(t),e.__proto__=p,o||c)return o&&(r.get=o),c&&(r.set=c),r}return r.value=e[t],r.writable=!0,r}}),Object.getOwnPropertyDescriptors||(Object.getOwnPropertyDescriptors=function(t){var r,n,o={},c=Object.getOwnPropertyNames(t);for(r=0;(n=c[r])!==e;r++)o[n]=Object.getOwnPropertyDescriptor(t,n);return o}),Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(e){return Object.keys(e)}),!Object.create){var y;y=p||"undefined"==typeof document?function(){return{__proto__:null}}:function(){var e,r=document.createElement("iframe"),n=document.body||document.documentElement;return r.style.display="none",n.appendChild(r),r.src="javascript:",e=r.contentWindow.pointerObjectPrototype,delete e.constructor,delete e.hasOwnProperty,delete e.propertyIsEnumerable,delete e.isPrototypeOf,delete e.toLocaleString,delete e.toString,delete e.valueOf,e.__proto__=null,n.removeChild(r),r=null,t.prototype=e,y=function(){return new t},new t},Object.create=function(e,t){function r(){}var n;if(null===e)n=y();else{if("object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object prototype may only be an Object or null");r.prototype=e,n=new r,n.__proto__=e}return t!==void 0&&Object.defineProperties(n,t),n}}},window,document);