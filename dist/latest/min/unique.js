(function(t,e){"use strict";var n=function n(){return e.qoopido.shared.module.initialize("unique",t,arguments,!0)};"function"==typeof define&&define.amd?define(["./base"],n):n(e.qoopido.base)})(function(t){"use strict";function e(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=0|16*Math.random(),n="x"===t?e:8|3&e;return n.toString(16)})}function n(t){for(t=parseInt(t,10)||12,r="",o=0;t>o;o++)r+=u[parseInt(Math.random()*(u.length-1),10)];return r}var r,o,i={uuid:{},string:{}},u="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");return t.extend({uuid:function(){do r=e();while(i.uuid[r]!==undefined);return i.uuid[r]=!0,r},string:function(t){do r=n(t);while(i.string[r]!==undefined);return i.string[r]=!0,r}})},window);