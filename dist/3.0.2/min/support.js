(function(t,e){"use strict";function n(){return e.qoopido.initialize("support",t,arguments,!0)}"function"==typeof define&&define.amd?define(["./base","./polyfill/string/ucfirst","q","./pool/dom"],n):n()})(function(t,e,n,i,r,o){"use strict";var u=i.Q||e[2],s=RegExp("-([a-z])","gi"),a=RegExp("^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])"),c=function(t){return t.ucfirst()},l={prefix:null,property:{},method:{},element:{},promises:{prefix:null,property:{},method:{},test:{}}};return t.base.extend({test:{},testMultiple:function(){var t,e=[],n=0;for(n;(t=arguments[n])!==o;n++)switch(typeof t){case"string":e.push(this.test[t]());break;case"boolean":var i=u.defer();t?i.resolve():i.reject(),e.push(i.promise);break;default:e.push(t)}return u.all(e)},getPrefix:function(){var t,e=l.prefix||null;if(null===e){var n=i.qoopido.shared.pool.dom.obtain("div"),r=n.style;e=!1;for(t in r)a.test(t)&&(e=t.match(a)[0]);e===!1&&"WebkitOpacity"in r&&(e="WebKit"),e===!1&&"KhtmlOpacity"in r&&(e="Khtml"),e=l.prefix=e===!1?!1:{method:e,properties:[e.toLowerCase(),e.toLowerCase().ucfirst()]},n.dispose()}return e},getProperty:function(t){t=t.replace(s,c);var e=l.property[t]||null;if(null===e){e=!1;var n,r=0,u=i.qoopido.shared.pool.dom.obtain("div"),a=t.ucfirst(),f=(this.getPrefix()||{properties:[]}).properties,p=(t+" "+f.join(a+" ")+a).split(" ");for(r;(n=p[r])!==o;r++)if(u.style[n]!==o){e=n;break}l.property[t]=e,u.dispose()}return e},getMethod:function(t,e){e=e||i;var n=e.tagName,r=l.method[n]=l.method[n]||{},u=r[t]=l.method[n][t]||null;if(null===u){u=!1;var s,a,c=0,f=t.ucfirst(),p=this.getPrefix();for(s=p!==!1?(t+" "+p.method+f+" "+p.properties.join(f+" ")+f).split(" "):[t],c;(a=s[c])!==o;c++)if(e[a]!==o&&("function"==typeof e[a]||"object"==typeof e[a])){u=a;break}l.method[n][t]=u}return u},supportsPrefix:function(){return!!this.getPrefix()},supportsProperty:function(t){return!!this.getProperty(t)},supportsMethod:function(t,e){return!!this.getMethod(t,e)},testPrefix:function(){var t=l.promises.prefix;if(null===t){var e=u.defer(),n=this.getPrefix();n?e.resolve(n):e.reject(),t=l.promises.prefix=e.promise}return t},testProperty:function(t){var e=l.promises.property[t]||null;if(null===e){var n=u.defer(),i=this.getProperty(t);i?n.resolve(i):n.reject(),e=l.promises.property[t]=n.promise}return e},testMethod:function(t,e){e=e||i;var n=e.tagName,r=l.promises.method[n]=l.promises.method[n]||{},o=r[t]=l.promises.method[n][t]||null;if(null===o){var s=u.defer(),a=this.getMethod(t,e);a?s.resolve(a):s.reject(),o=l.promises.method[n][t]=s.promise}return o},addTest:function(t,e){return this.test[t]=function(){var n=l.promises.test[t]||null;if(null===n){var i=u.defer(),r=Array.prototype.slice.call(arguments);r.splice(0,0,i),e.apply(null,r),n=l.promises.test[t]=i.promise}return n}}})},window);