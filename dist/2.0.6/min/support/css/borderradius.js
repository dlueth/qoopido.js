(function(t,e,r,n){"use strict";var o="qoopido/support/css/borderradius",i=function i(){for(var i=(o=o.split("/")).splice(o.length-1,1),s=e,a=0;o[a]!==n;a++)s[o[a]]=s[o[a]]||{},s=s[o[a]];return[].push.apply(arguments,[e,r,n]),s[i]=t.apply(null,arguments)};"function"==typeof define&&define.amd?define(["../../support"],i):i(e.qoopido.support)})(function(t){"use strict";return t.addTest("/css/borderradius",function(e){t.supportsProperty("border-radius")?e.resolve(t.getProperty("border-radius")):e.reject()})},window,document);