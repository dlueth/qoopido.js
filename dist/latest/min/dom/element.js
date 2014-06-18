/*!
* Qoopido.js library v3.2.6, 2014-5-18
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){var t=["../proxy"];window.getComputedStyle||t.push("../polyfill/window/getcomputedstyle"),window.qoopido.register("dom/element",e,t)}(function(e,t,n,r,i,l,s){"use strict";function o(e){return e.target||(e.target=e.srcElement||l),3===e.target.nodeType&&(e.target=e.target.parentNode),!e.relatedTarget&&e.fromElement&&(e.relatedTarget=e.fromElement===e.target?e.toElement:e.fromElement),e}var a,u,f,c="object",p="string";return a=i.addEventListener?function(e,t){var n=this,r=n.element,i="".concat("listener[",e,"][",t._quid||t,"]");r[i]=function(e){t.call(this,o(e))},r.addEventListener(e,r[i],!1)}:function(e,t){var n,r=this,l=r.element;l["on"+e]!==s?(n="".concat("listener[",e,"][",t._quid||t,"]"),l[n]=function(){t.call(this,o(i.event))},l.attachEvent("on"+e,l[n])):(e="".concat("fake[",e,"]"),l[e]=null,l.attachEvent("onpropertychange",function(n){n.propertyName===e&&t.call(this,o(l[e]))}))},u=i.removeEventListener?function(e,t){var n=this,r=n.element,i="".concat("listener[",e,"][",t._quid||t,"]");r.removeEventListener(e,r[i],!1),delete r[i]}:function(e,t){var n=this,r=n.element,i="".concat("listener[",e,"][",t._quid||t,"]");r.detachEvent("on"+e,r[i]),delete r[i]},f=l.createEvent?function(e,t){var n=this,r=n.element,i=l.createEvent("HTMLEvents");i.initEvent(e,!0,!0),i.data=t,r.dispatchEvent(i)}:function(e,t){var n=this,r=n.element,i=l.createEventObject();i.type=i.eventType=e,i.data=t;try{r.fireEvent("on"+i.eventType,i)}catch(o){var a="".concat("fake[",e,"]");r[a]!==s&&(r[a]=i)}},e.base.extend({type:null,element:null,listener:null,_constructor:function(e){var t=this;if(!e)throw new Error("Missing element argument");t.type=e.tagName,t.element=e,t.listener={}},getAttribute:function(e){if(e&&typeof e===p){var t=this;return e=e.split(" "),1===e.length?t.element.getAttribute(e[0]):t.getAttributes(e)}},getAttributes:function(e){var t=this,n={};if(e&&(e=typeof e===p?e.split(" "):e,typeof e===c&&e.length)){var r,i;for(r=0;(i=e[r])!==s;r++)n[i]=t.element.getAttributes(i)}return n},setAttribute:function(e,t){var n=this;return e&&typeof e===p&&n.element.setAttribute(e,t),n},setAttributes:function(e){var t=this;if(e&&typeof e===c&&!e.length){var n;for(n in e)t.element.setAttribute(n,e[n])}return t},removeAttribute:function(e){var t=this;return e&&typeof e===p&&(e=e.split(" "),1===e.length?t.element.removeAttribute(e[0]):t.removeAttributes(e)),t},removeAttributes:function(e){var t=this;if(e&&(e=typeof e===p?e.split(" "):e,typeof e===c&&e.length)){var n,r;for(n=0;(r=e[n])!==s;n++)t.element.removeAttribute(r)}return t},getStyle:function(e){if(e&&typeof e===p){var t=this;return e=e.split(" "),1===e.length?i.getComputedStyle(t.element,null).getPropertyValue(e[0]):t.getStyles(e)}},getStyles:function(e){var t=this,n={};if(e&&(e=typeof e===p?e.split(" "):e,typeof e===c&&e.length)){var r,l;for(r=0;(l=e[r])!==s;r++)n[l]=i.getComputedStyle(t.element,null).getPropertyValue(l)}return n},setStyle:function(e,t){var n=this;return e&&typeof e===p&&(n.element.style[e]=t),n},setStyles:function(e){var t=this;if(e&&typeof e===c&&!e.length){var n;for(n in e)t.element.style[n]=e[n]}return t},isVisible:function(){var e=this.element;return!(e.offsetWidth<=0&&e.offsetHeight<=0)},hasClass:function(e){return new RegExp("(?:^|\\s)"+e+"(?:\\s|$)").test(this.element.className)},addClass:function(e){var t,n=this;return n.hasClass(e)||(t=n.element.className.split(" "),t.push(e),n.element.className=t.join(" ")),n},removeClass:function(e){var t=this;return t.hasClass(e)&&(t.element.className=t.element.className.replace(new RegExp("(?:^|\\s)"+e+"(?!\\S)"),"")),t},toggleClass:function(e){var t=this;return t.hasClass(e)?t.removeClass(e):t.addClass(e),t},prepend:function(e){var t=this,n=t.element;return e=e.element||e,n.firstChild?n.insertBefore(e,n.firstChild):t.append(e),t},append:function(e){var t=this;return t.element.appendChild(e.element||e),t},replaceWith:function(e){var t=this,n=t.element;return e=e.element||e,n.parentNode.replaceChild(e,n),t},prependTo:function(e){var t=this,n=t.element;return(e=e.element||e).firstChild?e.insertBefore(n,e.firstChild):t.appendTo(e),t},appendTo:function(e){var t=this;return(e.element||e).appendChild(t.element),t},insertBefore:function(e){var t=this,n=t.element;return(e=e.element||e).parentNode.insertBefore(n,e),t},insertAfter:function(e){var t=this,n=t.element;return(e=e.element||e).nextSibling?e.parentNode.insertBefore(n,e.nextSibling):t.appendTo(e.parentNode),t},replace:function(e){var t=this,n=t.element;return(e=e.element||e).parentNode.replaceChild(n,e),t},remove:function(){var e=this,t=e.element;return t.parentNode.removeChild(t),e},on:function(e,t){var n,r,i=this;for(e=e.split(" "),n=0;(r=e[n])!==s;n++)(i.listener[r]=i.listener[r]||[]).push(t),a.call(i,r,t);return i},one:function(t,n,r){r=r!==!1;var i=this,l=e.proxy.create(i,function(e){i.off(r===!0?e.type:t,l),n.call(i,e)});return i.on(t,l),i},off:function(e,t){var n,r,i,l,o=this;if(e)for(e=e.split(" "),n=0;(r=e[n])!==s;n++)if(o.listener[r]=o.listener[r]||[],t)for(i=0;(l=o.listener[r][i])!==s;i++)l===t&&(o.listener[r].splice(i,1),u.call(o,r,l),i--);else for(;o.listener[r].length>0;)u.call(o,r,o.listener[r].pop());else for(r in o.listener)for(;o.listener[r].length>0;)u.call(o,r,o.listener[r].pop());return o},emit:function(e,t){var n=this;return f.call(n,e,t),n}})});