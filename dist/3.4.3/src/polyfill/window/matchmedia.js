/*!
* Qoopido.js library
*
* version: 3.4.3
* date:    2014-6-11
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/(function(definition) {
    window.qoopido.register("polyfill/window/matchmedia", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    if (!window.matchMedia) {
        var _doc = document, _viewport = _doc.documentElement, _queries = [], _queryID = 0, _type = "", _features = {}, _typeExpr = /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i, _mediaExpr = /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/, _timer = 0, _matches = function(media) {
            var mql = media.indexOf(",") !== -1 && media.split(",") || [ media ], mqIndex = mql.length - 1, mqLength = mqIndex, mq = null, negateType = null, negateTypeFound = "", negateTypeIndex = 0, negate = false, type = "", exprListStr = "", exprList = null, exprIndex = 0, exprLength = 0, expr = null, prefix = "", length = "", unit = "", value = "", feature = "", match = false;
            if (media === "") {
                return true;
            }
            do {
                mq = mql[mqLength - mqIndex];
                negate = false;
                negateType = mq.match(_typeExpr);
                if (negateType) {
                    negateTypeFound = negateType[0];
                    negateTypeIndex = negateType.index;
                }
                if (!negateType || mq.substring(0, negateTypeIndex).indexOf("(") === -1 && (negateTypeIndex || !negateType[3] && negateTypeFound !== negateType.input)) {
                    match = false;
                    continue;
                }
                exprListStr = mq;
                negate = negateType[1] === "not";
                if (!negateTypeIndex) {
                    type = negateType[2];
                    exprListStr = mq.substring(negateTypeFound.length);
                }
                match = type === _type || type === "all" || type === "";
                exprList = exprListStr.indexOf(" and ") !== -1 && exprListStr.split(" and ") || [ exprListStr ];
                exprIndex = exprList.length - 1;
                exprLength = exprIndex;
                if (match && exprIndex >= 0 && exprListStr !== "") {
                    do {
                        expr = exprList[exprIndex].match(_mediaExpr);
                        if (!expr || !_features[expr[3]]) {
                            match = false;
                            break;
                        }
                        prefix = expr[2];
                        length = expr[5];
                        value = length;
                        unit = expr[7];
                        feature = _features[expr[3]];
                        if (unit) {
                            if (unit === "px") {
                                value = Number(length);
                            } else if (unit === "em" || unit === "rem") {
                                value = 16 * length;
                            } else if (expr[8]) {
                                value = (length / expr[8]).toFixed(2);
                            } else if (unit === "dppx") {
                                value = length * 96;
                            } else if (unit === "dpcm") {
                                value = length * .3937;
                            } else {
                                value = Number(length);
                            }
                        }
                        if (prefix === "min-" && value) {
                            match = feature >= value;
                        } else if (prefix === "max-" && value) {
                            match = feature <= value;
                        } else if (value) {
                            match = feature === value;
                        } else {
                            match = !!feature;
                        }
                        if (!match) {
                            break;
                        }
                    } while (exprIndex--);
                }
                if (match) {
                    break;
                }
            } while (mqIndex--);
            return negate ? !match : match;
        }, _setFeature = function() {
            var w = window.innerWidth || _viewport.clientWidth, h = window.innerHeight || _viewport.clientHeight, dw = window.screen.width, dh = window.screen.height, c = window.screen.colorDepth, x = window.devicePixelRatio;
            _features.width = w;
            _features.height = h;
            _features["aspect-ratio"] = (w / h).toFixed(2);
            _features["device-width"] = dw;
            _features["device-height"] = dh;
            _features["device-aspect-ratio"] = (dw / dh).toFixed(2);
            _features.color = c;
            _features["color-index"] = Math.pow(2, c);
            _features.orientation = h >= w ? "portrait" : "landscape";
            _features.resolution = x && x * 96 || window.screen.deviceXDPI || 96;
            _features["device-pixel-ratio"] = x || 1;
        }, _watch = function() {
            clearTimeout(_timer);
            _timer = setTimeout(function() {
                var query = null, qIndex = _queryID - 1, qLength = qIndex, match = false;
                if (qIndex >= 0) {
                    _setFeature();
                    do {
                        query = _queries[qLength - qIndex];
                        if (query) {
                            match = _matches(query.mql.media);
                            if (match && !query.mql.matches || !match && query.mql.matches) {
                                query.mql.matches = match;
                                if (query.listeners) {
                                    for (var i = 0, il = query.listeners.length; i < il; i++) {
                                        if (query.listeners[i]) {
                                            query.listeners[i].call(window, query.mql);
                                        }
                                    }
                                }
                            }
                        }
                    } while (qIndex--);
                }
            }, 10);
        }, _init = function() {
            var head = _doc.getElementsByTagName("head")[0], style = _doc.createElement("style"), info = null, typeList = [ "screen", "print", "speech", "projection", "handheld", "tv", "braille", "embossed", "tty" ], typeIndex = 0, typeLength = typeList.length, cssText = "#mediamatchjs { position: relative; z-index: 0; }", eventPrefix = "", addEvent = window.addEventListener || (eventPrefix = "on") && window.attachEvent;
            style.type = "text/css";
            style.id = "mediamatchjs";
            head.appendChild(style);
            info = window.getComputedStyle && window.getComputedStyle(style) || style.currentStyle;
            for (;typeIndex < typeLength; typeIndex++) {
                cssText += "@media " + typeList[typeIndex] + " { #mediamatchjs { position: relative; z-index: " + typeIndex + " } }";
            }
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.textContent = cssText;
            }
            _type = typeList[info.zIndex * 1 || 0];
            head.removeChild(style);
            _setFeature();
            addEvent(eventPrefix + "resize", _watch);
            addEvent(eventPrefix + "orientationchange", _watch);
        };
        _init();
        window.matchMedia = function(media) {
            var id = _queryID, mql = {
                matches: false,
                media: media,
                addListener: function addListener(listener) {
                    _queries[id].listeners || (_queries[id].listeners = []);
                    listener && _queries[id].listeners.push(listener);
                },
                removeListener: function removeListener(listener) {
                    var query = _queries[id], i = 0, il = 0;
                    if (!query) {
                        return;
                    }
                    il = query.listeners.length;
                    for (;i < il; i++) {
                        if (query.listeners[i] === listener) {
                            query.listeners.splice(i, 1);
                        }
                    }
                }
            };
            if (media === "") {
                mql.matches = true;
                return mql;
            }
            mql.matches = _matches(media);
            _queryID = _queries.push({
                mql: mql,
                listeners: null
            });
            return mql;
        };
        return window.matchMedia;
    }
});