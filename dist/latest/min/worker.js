(function(e,t){"use strict";function n(){return t.qoopido.shared.module.initialize("worker",e,!0)}"function"==typeof define&&define.amd?define(["./base","./support","q"],n):n()})(function(e){"use strict";var t=window.Q,n=e.support.supportsMethod("Worker");return e.base.extend({execute:function(e,r,i){var o=t.defer();if(i=i||[],n===!0){var u=new Worker(e);u.addEventListener("message",function(e){switch(e.data.type){case"progress":o.notify(e.data.progress);break;case"result":o.resolve(e.data.result)}},!1),u.addEventListener("error",function(e){o.reject(e)},!1),u.postMessage({func:""+r,args:i})}else setTimeout(function(){try{o.resolve(r.apply(null,i))}catch(e){o.reject()}},0);return o.promise}})},window);