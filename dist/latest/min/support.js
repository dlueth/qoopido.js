/*!
* Qoopido.js library v3.4.8, 2014-7-24
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){var t=["./base","./promise/all","./promise/defer"];String.prototype.ucfirst||t.push("./polyfill/string/ucfirst"),String.prototype.lcfirst||t.push("./polyfill/string/lcfirst"),window.qoopido.registerSingleton("support",e,t)}(function(e,t,r,s,o,i,p){"use strict";function n(e){return e.replace(a,"$1").lcfirst().replace(c,"").replace(m,g)}var l=e["promise/all"],u=e["promise/defer"],f=new RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"),a=new RegExp("^(?:webkit|khtml|icab|moz|ms|o)([A-Z])"),c=new RegExp("^-(?:webkit|khtml|icab|moz|ms|o)-"),m=new RegExp("-([a-z])","gi"),h=new RegExp("([A-Z])","g"),g=function(){return arguments[1].ucfirst()},y={prefix:null,method:{},property:{},css:{},promises:{prefix:null,method:{},property:{},css:{},test:{}}};return e.base.extend({test:{},pool:t.pool&&t.pool.dom,testMultiple:function(){for(var e,t=[],r=0;(e=arguments[r])!==p;r++)switch(typeof e){case"string":t.push(this.test[e]());break;case"boolean":var s=new u;e?s.resolve():s.reject(),t.push(s.promise);break;default:t.push(e)}return new l(t)},getPrefix:function(){var e,t=this,r=y.prefix||null;if(null===r){var s=t.pool?t.pool.obtain("div"):i.createElement("div"),o=s.style;r=!1;for(e in o)f.test(e)&&(r=e.match(f)[0]);r===!1&&"WebkitOpacity"in o&&(r="WebKit"),r===!1&&"KhtmlOpacity"in o&&(r="Khtml"),r=y.prefix=r===!1?!1:[r.toLowerCase(),r.toLowerCase().ucfirst(),r],s.dispose&&s.dispose()}return r},getMethod:function(e,t){e=n(e),t=t||o;var r=t.tagName,s=y.method[r]=y.method[r]||{},i=s[e]=y.method[r][e]||null;if(null===i){i=!1;var l,u,f=0,a=e.ucfirst(),c=this.getPrefix();for(l=c!==!1?(e+" "+c.join(a+" ")+a).split(" "):[e];(u=l[f])!==p;f++)if(t[u]!==p&&("function"==typeof t[u]||"object"==typeof t[u])){i=u;break}y.method[r][e]=i}return i},getProperty:function(e,t){e=n(e),t=t||o;var r=t.tagName,s=y.property[r]=y.property[r]||{},i=s[e]=y.property[r][e]||null;if(null===i){i=!1;var l,u,f=0,a=e.ucfirst(),c=this.getPrefix();for(l=c!==!1?(e+" "+c.join(a+" ")+a).split(" "):[e],f;(u=l[f])!==p;f++)if(t[u]!==p){i=u;break}y.property[r][e]=i}return i},getCssProperty:function(e){e=n(e);var t=this,r=y.css[e]||null;if(null===r){r=!1;var s,o=0,l=t.pool?t.pool.obtain("div"):i.createElement("div"),u=e.ucfirst(),f=this.getPrefix()||[],a=(e+" "+f.join(u+" ")+u).split(" "),c="";for(o;(s=a[o])!==p;o++)if(l.style[s]!==p){r=s,o>0&&(c="-");break}r=y.css[e]=r!==!1?[c+r.replace(h,"-$1").toLowerCase(),r]:!1,l.dispose&&l.dispose()}return r},supportsPrefix:function(){return!!this.getPrefix()},supportsMethod:function(e,t){return!!this.getMethod(e,t)},supportsProperty:function(e,t){return!!this.getProperty(e,t)},supportsCssProperty:function(e){return!!this.getCssProperty(e)},testPrefix:function(){var e=y.promises.prefix;if(null===e){var t=new u,r=this.getPrefix();r?t.resolve(r):t.reject(),e=y.promises.prefix=t.promise}return e},testMethod:function(e,t){t=t||o;var r=t.tagName,s=y.promises.method[r]=y.promises.method[r]||{},i=s[e]=y.promises.method[r][e]||null;if(null===i){var p=new u,n=this.getMethod(e,t);n?p.resolve(n):p.reject(),i=y.promises.method[r][e]=p.promise}return i},testProperty:function(e,t){t=t||o;var r=t.tagName,s=y.promises.property[r]=y.promises.property[r]||{},i=s[e]=y.promises.property[r][e]||null;if(null===i){var p=new u,n=this.getProperty(e,t);n?p.resolve(n):p.reject(),i=y.promises.property[r][e]=p.promise}return i},testCssProperty:function(e){var t=y.promises.css[e]||null;if(null===t){var r=new u,s=this.getCssProperty(e);s?r.resolve(s):r.reject(),t=y.promises.css[e]=r.promise}return t},addTest:function(e,t){return this.test[e]=function(){var r=y.promises.test[e]||null;if(null===r){var s=new u,o=Array.prototype.slice.call(arguments);o.splice(0,0,s),t.apply(null,o),r=y.promises.test[e]=s.promise}return r}}})});