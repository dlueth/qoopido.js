(function(t){"use strict";"function"==typeof define&&define.amd?define(t):t()})(function(){"use strict";if(!window.getComputedStyle){var t=RegExp("(\\-([a-z]){1})","g"),e=function(){return arguments[2].toUpperCase()};window.getComputedStyle=function(n){var i=this;return i.element=n,i.getPropertyValue=function(i){return"float"===i&&(i="styleFloat"),t.test(i)&&(i=i.replace(t,e)),n.currentStyle[i]?n.currentStyle[i]:null},i}}});