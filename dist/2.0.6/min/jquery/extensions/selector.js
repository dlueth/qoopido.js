(function(e,t){"use strict";var r="qoopido/jquery/extensions/selector",n=function n(){return t.qoopido.shared.prepareModule(r,e,arguments)};"function"==typeof define&&define.amd?define(["../../base","jquery"],n):n(t.qoopido.base,t.jQuery)})(function(e,t,r,n,o){"use strict";var i=t(r),s=t(n);return t.extend(t.expr[":"],{loaded:function(e){return t(e).data("loaded")},scrollable:function(e){return"auto"===t(e).css("overflow")},width:function(e,r,n){return n[3]&&/^(<|>)\d+$/.test(n[3])?">"===n[3].substr(0,1)?t(e).width()>n[3].substr(1):t(e).width()<n[3].substr(1):!1},height:function(e,r,n){return n[3]&&/^(<|>)\d+$/.test(n[3])?">"===n[3].substr(0,1)?t(e).height()>n[3].substr(1):t(e).height()<n[3].substr(1):!1},leftOf:function(e,r,n){return n[3]?(e=t(e),n=t(n[3]),e.offset().left+e.width()<n.offset().left):!1},rightOf:function(e,r,n){return n[3]?(e=t(e),n=t(n[3]),e.offset().left>n.offset().left+n.width()):!1},external:function(e){return e.href?e.hostname&&e.hostname!==r.location.hostname:!1},inView:function(e){e=t(e);var r=i,n=s,o=e.offset(),c={top:n.scrollTop(),height:n.scrollLeft()};return!(o.top>r.height()+c.top||o.top+e.height()<c.top||o.left>r.width()+c.left||o.left+e.width()<c.left)},largerThan:function(e,r,n){return n[3]?(e=t(e),n=t(n[3]),e.width()*e.height()>n.width()*n.height()):!1},isBold:function(e){return"700"===t(e).css("fontWeight")},color:function(e,r,n){return n[3]?t(e).css("color")===n[3]:!1},hasId:function(e){return e=t(e),e.attr("id")!==o&&""!==e.attr("id")}}),t},window,document);