/*!
* Qoopido.js library v3.4.5, 2014-7-7
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){window.qoopido.register("function/merge",e)}(function(e,t,n,o,r,i,u){"use strict";return function c(){var e,t,n,o,r,i=arguments[0];for(e=1;(t=arguments[e])!==u;e++)for(n in t)o=i[n],r=t[n],r!==u&&(null!==r&&"object"==typeof r?(o=r.length!==u?o&&"object"==typeof o&&o.length!==u?o:[]:o&&"object"==typeof o&&o.length===u?o:{},i[n]=c(o,r)):(console.log("hier",n,r),i[n]=r));return i}});