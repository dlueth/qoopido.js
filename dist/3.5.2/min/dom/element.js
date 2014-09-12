/*!
* Qoopido.js library v3.5.2, 2014-8-12
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){var t=["../base","../function/unique/uuid","../hook/css","./event"];window.CustomEvent||t.push("../polyfill/window/customevent"),window.addEventListener||t.push("../polyfill/window/addeventlistener"),window.removeEventListener||t.push("../polyfill/window/removeeventlistener"),window.dispatchEvent||t.push("../polyfill/window/dispatchevent"),Element.prototype.matches||t.push("../polyfill/element/matches"),document.querySelector||t.push("../polyfill/document/queryselector"),document.querySelectorAll||t.push("../polyfill/document/queryselectorall"),window.qoopido.register("dom/element",e,t)}(function(e,t,n,r,i,s,o){"use strict";function l(e,t,n){var r=this,i=s.createEvent("CustomEvent");i.initCustomEvent(e,"load"===e?!1:!0,!0,t),n&&(i._quid=n,i.isDelegate=!0),r.element.dispatchEvent(i)}function u(e){var t;if("string"==typeof e)try{p.test(e)===!0?(t=e.replace(p,"$1").toLowerCase(),e=s.createElement(t)):e=s.querySelector(e)}catch(n){e=null}if(!e)throw new Error("[Qoopido.js] Element could not be resolved");return e}var a="object",f="string",m=e["function/unique/uuid"],c="textContent"in s.createElement("a")?"textContent":"innerText",p=new RegExp("^<(\\w+)\\s*/>$"),d=new RegExp("^[^-]+"),h=e["pool/module"]&&e["pool/module"].create(e["dom/event"],null,!0)||null,v={},g=e["hook/css"];return e.base.extend({type:null,element:null,_listener:null,_constructor:function(e,t,n){var r=this;e=u(e),r.type=e.tagName,r.element=e,r._listener=r._listener||{},"object"==typeof t&&null!==t&&r.setAttributes(t),"object"==typeof n&&null!==n&&r.setStyles(n)},_obtain:function(e,t,n){this._constructor(e,t,n)},_dispose:function(){var e,t,n=this;for(e in n._listener)t=e.match(d),n.element.removeEventListener(t,n._listener[e]),delete n._listener[e];n.type=null,n.element=null},getContent:function(e){var t=this.element;return e&&e!==!1?t.innerHTML:t[c]},setContent:function(e,t){var n=this,r=n.element;return t&&t!==!1?r.innerHTML=e:r[c]=e,n},getAttribute:function(e){var t=this;return e&&typeof e===f?t.element.getAttribute(e):void 0},getAttributes:function(e){var t,n=this,r={},i=0;if(e)for(e=typeof e===f?e.split(" "):e;(t=e[i])!==o;i++)r[t]=n.element.getAttributes(t);return r},setAttribute:function(e,t){var n=this;return e&&typeof e===f&&n.element.setAttribute(e,t),n},setAttributes:function(e){var t,n=this;if(e&&typeof e===a&&!e.length)for(t in e)n.element.setAttribute(t,e[t]);return n},removeAttribute:function(e){var t=this;return e&&typeof e===f&&t.element.removeAttribute(e),t},removeAttributes:function(e){var t,n=this,r=0;if(e)for(e=typeof e===f?e.split(" "):e;(t=e[r])!==o;r++)n.element.removeAttribute(t);return n},getStyle:function(e){var t=this;return e&&typeof e===f?g.process("get",t.element,e):void 0},getStyles:function(e){var t,n=this,r={},i=0;if(e)for(e=typeof e===f?e.split(" "):e;(t=e[i])!==o;i++)r[t]=g.process("get",n.element,t);return r},setStyle:function(e,t){var n=this;return e&&typeof e===f&&g.process("set",n.element,e,t),n},setStyles:function(e){var t,n=this;if(e&&typeof e===a&&!e.length)for(t in e)g.process("set",n.element,t,e[t]);return n},removeStyle:function(e){var t=this;return e&&typeof e===f&&t.setStyle(e,""),t},removeStyles:function(e){var t,n=this,r=0;if(e)for(e=typeof e===f?e.split(" "):e;(t=e[r])!==o;r++)n.setStyle(t,"");return n},siblings:function(e){for(var t=this.element,n=t.parentNode.firstChild,r=[];n;n=n.nextSibling)1===n.nodeType&&n!==t&&(!e||n.matches(e))&&r.push(n);return r},siblingsBefore:function(e){for(var t=this.element.previousSibling,n=[];t;t=t.previousSibling)1===t.nodeType&&(!e||t.matches(e))&&n.push(t);return n},siblingsAfter:function(e){for(var t=this.element.nextSibling,n=[];t;t=t.nextSibling)1===t.nodeType&&(!e||t.matches(e))&&n.push(t);return n},previous:function(e){var t;if(!e)return this.element.previousSibling;for(t=this.element.previousSibling;t;t=t.previousSibling)if(1===t.nodeType&&t.matches(e))return t},next:function(e){var t;if(!e)return this.element.nextSibling;for(t=this.element.nextSibling;t;t=t.nextSibling)if(1===t.nodeType&&t.matches(e))return t},find:function(e){return this.element.querySelectorAll(e)},parent:function(e){var t;if(!e)return this.element.parentNode;for(t=this.element;t;t=t.parentNode)if(t.matches(e))return t},parents:function(e){for(var t=this.element.parentNode,n=[];t;t=t.parentNode){if(9===t.nodeType)return n;1===t.nodeType&&(!e||t.matches(e))&&n.push(t)}},isVisible:function(){var e=this.element;return!(e.offsetWidth<=0&&e.offsetHeight<=0)},hasClass:function(e){return e?new RegExp("(?:^|\\s)"+e+"(?:\\s|$)").test(this.element.className):!1},addClass:function(e){var t,n=this;return e&&!n.hasClass(e)&&(t=n.element.className.split(" "),t.push(e),n.element.className=t.join(" ")),n},removeClass:function(e){var t=this;return e&&t.hasClass(e)&&(t.element.className=t.element.className.replace(new RegExp("(?:^|\\s)"+e+"(?!\\S)"))),t},toggleClass:function(e){var t=this;return e&&(t.hasClass(e)?t.removeClass(e):t.addClass(e)),t},prepend:function(e){var t=this,n=t.element;if(e)try{e=e.element||u(e),n.firstChild?n.insertBefore(e,n.firstChild):t.append(e)}catch(r){n.insertAdjacentHTML("afterBegin",e)}return t},append:function(e){var t=this,n=t.element;if(e)try{n.appendChild(e.element||u(e))}catch(r){n.insertAdjacentHTML("beforeEnd",e)}return t},prependTo:function(e){var t=this,n=t.element;return e&&((e=e.element||u(e)).firstChild?e.insertBefore(n,e.firstChild):t.appendTo(e)),t},appendTo:function(e){var t=this;return e&&(e.element||u(e)).appendChild(t.element),t},insertBefore:function(e){var t=this,n=t.element;return e&&(e=e.element||u(e)).parentNode.insertBefore(n,e),t},insertAfter:function(e){var t=this,n=t.element;return e&&((e=e.element||u(e)).nextSibling?e.parentNode.insertBefore(n,e.nextSibling):t.appendTo(e.parentNode)),t},replace:function(e){var t=this,n=t.element;return e&&(e=e.element||u(e)).parentNode.replaceChild(n,e),t},replaceWith:function(e){var t=this,n=t.element;return e&&(e=e.element||u(e),n.parentNode.replaceChild(e,n)),t},hide:function(){return this.setStyle("display","none")},show:function(){return this.removeStyle("display")},remove:function(){var e=this,t=e.element;return t.parentNode.removeChild(t),e},on:function(t){var n,r=this,s=r.element,u=arguments.length>2?arguments[1]:null,a=arguments.length>2?arguments[2]:arguments[1],f=a._quid||(a._quid=m()),c=0;for(t=t.split(" ");(n=t[c])!==o;c++){var p=n+"-"+f,d=function(t){var n,s=t._quid||(t._quid=m());v[s]||(v[s]=h&&h.obtain(t)||e["dom/event"].create(t)),t=v[s],n=t.delegate,i.clearTimeout(t._timeout),(!u||t.target.matches(u))&&a.call(t.target,t,t.originalEvent.detail),n&&(delete t.delegate,l.call(r,n,null,t._quid)),t._timeout=i.setTimeout(function(){delete v[s],delete t._timeout,t.dispose&&t.dispose()},5e3)};d.type=n,r._listener[p]=d,s.addEventListener(n,d)}return r},one:function(e){var t=this,n=arguments.length>3||"string"==typeof arguments[1]?arguments[1]:null,r=arguments.length>3||"function"==typeof arguments[2]?arguments[2]:arguments[1],i=(arguments.length>3?arguments[3]:arguments[2])!==!1,s=function(n){t.off(i===!0?n.type:e,s),r.call(t,n,n.originalEvent.detail)};return r._quid=s._quid=m(),n?t.on(e,n,s):t.on(e,s),t},off:function(e,t){var n,r,i,s=this,l=s.element,u=0;for(e=e.split(" ");(n=e[u])!==o;u++)r=t._quid&&n+"-"+t._quid||null,i=r&&s._listener[r]||null,i?(l.removeEventListener(n,i),delete s._listener[r]):l.removeEventListener(n,t);return s},emit:function(e,t){var n=this;return l.call(n,e,t),n}})});