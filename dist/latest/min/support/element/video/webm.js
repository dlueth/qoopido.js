/*!
* Qoopido.js library v3.4.9, 2014-7-26
* https://github.com/dlueth/qoopido.js
* (c) 2014 Dirk Lueth
* Dual licensed under MIT and GPL
*/
!function(e){window.qoopido.register("support/element/video/webm",e,["../../../support","../video"])}(function(e,o,t,i,n,r){"use strict";var p=e.support;return p.addTest("/element/video/webm",function(o){e["support/element/video"]().then(function(){var e=p.pool?p.pool.obtain("video"):r.createElement("video");e.canPlayType('video/webm; codecs="vp8, vorbis"')?o.resolve():o.reject(),e.dispose&&e.dispose()},function(){o.reject()})})});