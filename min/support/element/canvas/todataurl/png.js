(function(e,t,n,r){"use strict";function o(){return[].push.apply(arguments,[t,n,r]),t[i]=t[i]||{},t[i][s]=e.apply(null,arguments)}var i="qoopido",s="support/element/canvas/todataurl/png";typeof define=="function"&&define.amd?define(["../../../../support","../todataurl"],o):o(t[i].support,t[i]["support/element/canvas/todataurl"])})(function(e,t,n,r,i){"use strict";return e.addTest("/element/canvas/todataurl/png",function(n){t().then(function(){e.getElement("canvas").toDataURL("image/png").indexOf("data:image/png")===0?n.resolve():n.reject()}).fail(function(){n.reject()})})},window,document);