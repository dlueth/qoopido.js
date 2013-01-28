/*!
* Qoopido jQuery Plugin "shrinkimage"
*
* Source:  Qoopido JS
* Version: 1.1.4
* Date:    2013-01-28
* Author:  Dirk Lüth <info@qoopido.com>
* Website: https://github.com/dlueth/Qoopido-JS
*
* Copyright (c) 2013 Dirk Lüth
*
* Licensed under the MIT and GPL license.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*
* Important note:
* Includes q.js by Kris Kowal which can be found under
* https://github.com/kriskowal/q
* and comes its own license
*/

(function(p){"function"===typeof bootstrap?bootstrap("promise",p):"object"===typeof exports?p(void 0,exports):"function"===typeof define?define(p):"undefined"!==typeof ses?ses.ok()&&(ses.makeQ=function(){return p(void 0,{})}):p(void 0,Q={})})(function(p,b){function H(a,c){c.stack&&("object"===typeof a&&null!==a&&a.stack&&-1===a.stack.indexOf(I))&&(a.stack=J(a.stack)+"\n"+I+"\n"+J(c.stack))}function J(a){for(var a=a.split("\n"),c=[],d=0;d<a.length;++d){var e=a[d],b;if(b=/at .+ \((.*):(\d+):\d+\)/.exec(e)){var h=
b[2];b=b[1]===K&&h>=W&&h<=X}else b=!1;!b&&!(-1!==e.indexOf("(module.js:")||-1!==e.indexOf("(node.js:"))&&c.push(e)}return c.join("\n")}function L(){if(Error.captureStackTrace){var a,c,d=Error.prepareStackTrace;Error.prepareStackTrace=function(d,b){a=b[1].getFileName();c=b[1].getLineNumber()};Error().stack;Error.prepareStackTrace=d;K=a;return c}}function M(a,c,d){return function(){"undefined"!==typeof console&&"function"===typeof console.warn&&console.warn(c+" is deprecated, use "+d+" instead.",Error("").stack);
return a.apply(a,arguments)}}function i(){function a(a){c&&(e=q(a),s(c,function(a,c){l(function(){e.promiseDispatch.apply(e,c)})},void 0),d=c=void 0)}var c=[],d=[],e,b=y(i.prototype),h=y(j.prototype);h.promiseDispatch=function(a,b,h){var k=g(arguments);c?(c.push(k),"when"===b&&h[1]&&d.push(h[1])):l(function(){e.promiseDispatch.apply(e,k)})};h.valueOf=function(){return c?h:e.valueOf()};Error.captureStackTrace&&(Error.captureStackTrace(h,i),h.stack=h.stack.substring(h.stack.indexOf("\n")+1));w(h);b.promise=
h;b.resolve=a;b.reject=function(c){a(m(c))};b.notify=function(a){c&&s(d,function(c,d){l(function(){d(a)})},void 0)};return b}function j(a,c,d,b){void 0===c&&(c=function(a){return m(Error("Promise does not support operation: "+a))});var k=y(j.prototype);k.promiseDispatch=function(d,b,e){var f;try{f=a[b]?a[b].apply(k,e):c.call(k,b,e)}catch(i){f=m(i)}d&&d(f)};d&&(k.valueOf=d);b&&(k.exception=b);w(k);return k}function r(a){return t(a)?a.valueOf():a}function t(a){return a&&"function"===typeof a.promiseDispatch}
function z(a){return!t(r(a))}function N(a){a=r(a);return t(a)&&"exception"in a}function m(a){var a=a||Error(),c=j({when:function(c){if(c){var b=Y(A,this);-1!==b&&(B.splice(b,1),A.splice(b,1))}return c?c(a):m(a)}},function(){return m(a)},function(){return this},a);!O&&("undefined"!==typeof window&&!window.Touch&&window.console)&&console.log("Should be empty:",B);O=!0;A.push(c);B.push(a);return c}function q(a){if(t(a))return a;if((a=r(a))&&"function"===typeof a.then){var c=i();a.then(c.resolve,c.reject,
c.notify);return c.promise}return j({when:function(){return a},get:function(c){return a[c]},put:function(c,b){a[c]=b;return a},del:function(c){delete a[c];return a},post:function(c,b){return a[c].apply(a,b)},apply:function(c){return a.apply(void 0,c)},keys:function(){return Z(a)}},void 0,function(){return a})}function f(a,c,d,b){function k(a){try{return c?c(a):a}catch(d){return m(d)}}function h(a){if(d){H(a,j);try{return d(a)}catch(c){return m(c)}}return m(a)}var f=i(),g=!1,j=q(a);l(function(){j.promiseDispatch(function(a){g||
(g=!0,f.resolve(k(a)))},"when",[function(a){g||(g=!0,f.resolve(h(a)))}])});j.promiseDispatch(void 0,"when",[void 0,function(a){f.notify(b?b(a):a)}]);return f.promise}function P(a,c,d){return f(a,function(a){return x(a).then(function(a){return c.apply(void 0,a)},d)},d)}function C(a,c,d){var b=i();l(function(){q(a).promiseDispatch(b.resolve,c,d)});return b.promise}function o(a){return function(c){var d=g(arguments,1);return C(c,a,d)}}function D(a){var c=g(arguments,1);return u(a,c)}function x(a){return f(a,
function(a){var d=a.length;if(0===d)return q(a);var b=i();s(a,function(k,h,g){z(h)?(a[g]=r(h),0===--d&&b.resolve(a)):f(h,function(f){a[g]=f;0===--d&&b.resolve(a)}).fail(b.reject)},void 0);return b.promise})}function R(a,c){return f(a,void 0,c)}function S(a,c){var d=g(arguments,2),b=i();d.push(b.makeNodeResolver());E(a,c,d).fail(b.reject);return b.promise}var W=L(),K,F=function(){},w=Object.freeze||F;"undefined"!==typeof cajaVM&&(w=cajaVM.def);var l;if("undefined"!==typeof process)l=process.nextTick;
else if("function"===typeof setImmediate)l=setImmediate;else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,v={},U=v;T.port1.onmessage=function(){v=v.next;var a=v.task;delete v.task;a()};l=function(a){U=U.next={task:a};T.port2.postMessage(0)}}else l=function(a){setTimeout(a,0)};var n;Function.prototype.bind?(n=Function.prototype.bind,n=n.bind(n.call)):n=function(a){return function(){return a.call.apply(a,arguments)}};var g=n(Array.prototype.slice),s=n(Array.prototype.reduce||function(a,
c){var d=0,b=this.length;if(arguments.length===1){do{if(d in this){c=this[d++];break}if(++d>=b)throw new TypeError;}while(1)}for(;d<b;d++)d in this&&(c=a(c,this[d],d));return c}),Y=n(Array.prototype.indexOf||function(a){for(var c=0;c<this.length;c++)if(this[c]===a)return c;return-1}),V=n(Array.prototype.map||function(a,c){var b=this,e=[];s(b,function(f,h,g){e.push(a.call(c,h,g,b))},void 0);return e}),y=Object.create||function(a){function c(){}c.prototype=a;return new c},Z=Object.keys||function(a){var c=
[],b;for(b in a)c.push(b);return c},$=Object.prototype.toString,G;G="undefined"!==typeof ReturnValue?ReturnValue:function(a){this.value=a};var I="From previous event:";b.nextTick=l;b.defer=i;i.prototype.makeNodeResolver=function(){var a=this;return function(c,b){c?a.reject(c):arguments.length>2?a.resolve(g(arguments,1)):a.resolve(b)}};b.promise=function(a){var c=i();D(a,c.resolve,c.reject,c.notify).fail(c.reject);return c.promise};b.makePromise=j;j.prototype.then=function(a,c,b){return f(this,a,c,
b)};j.prototype.thenResolve=function(a){return f(this,function(){return a})};s("isResolved isFulfilled isRejected dispatch when spread get put del post send invoke keys fapply fcall fbind all allResolved timeout delay catch finally fail fin progress end done nfcall nfapply nfbind ncall napply nbind npost nsend ninvoke nend nodeify".split(" "),function(a,c){j.prototype[c]=function(){return b[c].apply(b,[this].concat(g(arguments)))}},void 0);j.prototype.toSource=function(){return this.toString()};j.prototype.toString=
function(){return"[object Promise]"};w(j.prototype);b.nearer=r;b.isPromise=t;b.isResolved=function(a){return z(a)||N(a)};b.isFulfilled=z;b.isRejected=N;var A=[],B=[],O;b.reject=m;b.resolve=q;b.master=function(a){return j({isDef:function(){}},function(c,b){return C(a,c,b)},function(){return r(a)})};b.when=f;b.spread=P;b.async=function(a){return function(){function c(a,c){var i;try{i=b[a](c)}catch(j){return $(j)==="[object StopIteration]"||j instanceof G?j.value:m(j)}return f(i,e,g)}var b=a.apply(this,
arguments),e=c.bind(c,"send"),g=c.bind(c,"throw");return e()}};b["return"]=function(a){throw new G(a);};b.promised=function(a){return function(){return P([this,x(arguments)],function(c,b){return a.apply(c,b)})}};b.dispatch=C;b.dispatcher=o;b.get=o("get");b.put=o("put");b["delete"]=b.del=o("del");var E=b.post=o("post");b.send=function(a,c){var b=g(arguments,2);return E(a,c,b)};b.invoke=M(b.send,"invoke","send");var u=b.fapply=o("apply");b["try"]=D;b.fcall=D;b.fbind=function(a){var c=g(arguments,1);
return function(){var b=c.concat(g(arguments));return u(a,b)}};b.keys=o("keys");b.all=x;b.allResolved=function(a){return f(a,function(a){return f(x(V(a,function(a){return f(a,F,F)})),function(){return V(a,q)})})};b["catch"]=b.fail=R;b.progress=function(a,c){return f(a,void 0,void 0,c)};b["finally"]=b.fin=function(a,c){return f(a,function(a){return f(c(),function(){return a})},function(a){return f(c(),function(){return m(a)})})};b.done=function(a,c,d,e){c=c||d||e?f(a,c,d,e):a;R(c,function(c){l(function(){H(c,
a);if(b.onerror)b.onerror(c);else throw c;})})};b.timeout=function(a,c){var b=i(),e=setTimeout(function(){b.reject(Error("Timed out after "+c+" ms"))},c);f(a,function(a){clearTimeout(e);b.resolve(a)},function(a){clearTimeout(e);b.reject(a)});return b.promise};b.delay=function(a,c){if(c===void 0){c=a;a=void 0}var b=i();setTimeout(function(){b.resolve(a)},c);return b.promise};b.nfapply=function(a,c){var b=g(c),e=i();b.push(e.makeNodeResolver());u(a,b).fail(e.reject);return e.promise};b.nfcall=function(a){var c=
g(arguments,1),b=i();c.push(b.makeNodeResolver());u(a,c).fail(b.reject);return b.promise};b.nfbind=function(a){var c=g(arguments,1);return function(){var b=c.concat(g(arguments)),e=i();b.push(e.makeNodeResolver());u(a,b).fail(e.reject);return e.promise}};b.npost=function(a,c,b){var b=g(b),e=i();b.push(e.makeNodeResolver());E(a,c,b).fail(e.reject);return e.promise};b.nsend=S;b.ninvoke=M(S,"ninvoke","nsend");b.nodeify=function(a,b){if(b)a.then(function(a){l(function(){b(null,a)})},function(a){l(function(){b(a)})});
else return a};var X=L()});

;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'base',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define(initialize);
	} else {
		initialize();
	}
}(function(window, document, undefined) {
	'use strict';

	var supportsEs5 = !!(Object.getOwnPropertyNames && Array.prototype.forEach && Object.getOwnPropertyDescriptor);

	if(Object.create === undefined) {
		Object.create = function(prototype, properties) {
			var object;

			if (prototype === null) {
				object = { '__proto__': null };
			} else {
				if(typeof prototype !== 'object') {
					throw new TypeError('typeof prototype[' + (typeof prototype) + '] != "object"');
				}

				var Type = function () {};
				Type.prototype = prototype;

				object = new Type();
				object.__proto__ = prototype;
			}

			if(properties !== undefined) {
				Object.defineProperties(object, properties);
			}

			return object;
		};
	}

	if(Object.getOwnPropertyDescriptors === undefined) {
		Object.getOwnPropertyDescriptors = function(object) {
			var descriptors = {};

			Object.getOwnPropertyNames(object).forEach(function(property) {
				descriptors[property] = Object.getOwnPropertyDescriptor(object, property);
			});

			return descriptors;
		};
	}

	return {
		create: function create() {
			var instance = Object.create(this);

			if(instance._constructor) {
				instance._constructor.apply(instance, arguments);
			}

			return instance;
		},
		extend: function extend(properties) {
			properties         = properties || {};
			properties._parent = this;

			if(supportsEs5 === true) { // Primary version for ECMAScript 5 compatible browsers
				return Object.create(this, Object.getOwnPropertyDescriptors(properties));
			} else { // Fallback version for non ECMAScript 5 compatible browsers
				var extended = Object.create(this),
					property;

				for(property in properties) {
					if(property !== '__proto__') {
						extended[property] = properties[property];
					}
				}

				return Object.create(extended);
			}
		}
	};
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'unique',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base' ], initialize);
	} else {
		initialize(window[namespace].base);
	}
}(function(mBase, window, document, undefined) {
	'use strict';

	var result, j, x, i,
		lookup     = { uuid: { }, string: { } },
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function generateUuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = (c === 'x') ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	function generateString(length) {
		length = parseInt(length, 10) || 12;
		result = '';

		for(i = 0; i < length; i++) {
			result += characters[parseInt(Math.random() * (characters.length - 1), 10)];
		}

		return result;
	}

	return mBase.extend({
		uuid: function uuid() {
			do {
				result = generateUuid();
			} while(typeof lookup.uuid[result] !== 'undefined');

			lookup.uuid[result] = true;

			return result;
		},
		string: function string(length) {
			do {
				result = generateString(length);
			} while(typeof lookup.string[result] !== 'undefined');

			lookup.string[result] = true;

			return result;
		}
	});
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ './base', 'q' ], initialize);
	} else {
		initialize(window[namespace].base, window.Q);
	}
}(function(mBase, mQ, window, document, undefined) {
	'use strict';

	var lookup = {
		prefix:   null,
		property: { },
		method:   { },
		element:  { },
		promises: {
			prefix: null,
			property: { },
			method: { },
			test: { }
		}
	};

	return mBase.extend({
			test: { },
			testMultiple: function testMultiple() {
				var test, tests = [], i = 0;

				for(i; (test = arguments[i]) !== undefined; i++) {
					switch(typeof test) {
						case 'string':
							tests.push(this.test[test]());
							break;
						case 'boolean':
							var deferred = mQ.defer();

							!!(test) ? deferred.resolve() : deferred.reject();

							tests.push(deferred.promise);
							break;
						default:
							tests.push(test);
							break;
					}
				}

				return mQ.all(tests);
			},
			getElement: function getElement(pType, pClone) {
				var element = lookup.element[pType] = lookup.element[pType] || document.createElement(pType);

				pClone = !!(pClone);

				return (pClone) ? element.cloneNode(false) : element;
			},
			getPrefix: function getPrefix() {
				var property,
					stored = lookup.prefix || null,
					styles = this.getElement('div').style,
					regex  = /^(Moz|WebKit|Khtml|ms|O|Icab)(?=[A-Z])/;

				if(stored === null) {
					stored = false;

					for(property in styles) {
						if(regex.test(property)) {
							stored = property.match(regex)[0];
						}
					}

					if(stored === false && 'WebkitOpacity' in styles) {
						stored = 'WebKit';
					}

					if(stored === false && 'KhtmlOpacity' in styles) {
						stored =  'Khtml';
					}

					stored = lookup.prefix = (stored === false)? false : { method: stored, property: stored.toLowerCase() };
				}

				return stored;
			},
			getProperty: function getProperty(pProperty) {
				var stored = lookup.property[pProperty] || null;

				if(stored === null) {
					var element = this.getElement('div');

					stored = false;

					if(element.style[pProperty] !== undefined) {
						stored = pProperty;
					} else {
						var prefix;

						if((prefix = this.getPrefix()) !== false) {
							var prefixed = '-' + prefix.property + '-' + pProperty;

							if(element.style[prefixed] !== undefined) {
								stored = prefixed;
							}
						}
					}

					lookup.property[pProperty] = stored;
				}

				return stored;
			},
			getMethod: function getMethod(pMethod, pElement) {
				pElement = pElement || window;

				var type    = pElement.tagName,
					pointer = lookup.method[type] = lookup.method[type] || { },
					stored  = pointer[pMethod] = lookup.method[type][pMethod] || null;

				if(stored === null) {
					var prefix;

					stored = false;

					if(pElement[pMethod] !== undefined && (typeof pElement[pMethod] === 'function' || typeof pElement[pMethod] === 'object')) {
						stored = pMethod;
					}

					if((prefix = this.getPrefix()) !== false) {
						var prefixed = prefix.method + pMethod;

						if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
							stored = prefixed;
						} else {
							prefixed = prefix.property + pMethod;

							if(pElement[prefixed] !== undefined && (typeof pElement[prefixed] === 'function' || typeof pElement[prefixed] === 'object')) {
								stored = prefixed;
							}
						}
					}

					lookup.method[type][pMethod] = stored;
				}

				return stored;
			},
			supportsPrefix: function supportsPrefix() {
				return !!this.getPrefix();
			},
			supportsProperty: function supportsProperty(pProperty) {
				return !!this.getProperty(pProperty);
			},
			supportsMethod: function supportsMethod(pMethod, pElement) {
				return !!this.getMethod(pMethod, pElement);
			},
			testPrefix: function testPrefix() {
				var stored = lookup.promises.prefix;

				if(stored === null) {
					var deferred = mQ.defer(),
						prefix   = this.getPrefix();

					(!!prefix) ? deferred.resolve(prefix) : deferred.reject();

					stored = lookup.promises.prefix =  deferred.promise;
				}

				return stored;
			},
			testProperty: function testProperty(pProperty) {
				var stored = lookup.promises.property[pProperty] || null;

				if(stored === null) {
					var deferred = mQ.defer(),
						property = this.getProperty(pProperty);

					(!!property) ? deferred.resolve(property) : deferred.reject();

					stored = lookup.promises.property[pProperty] =  deferred.promise;
				}

				return stored;
			},
			testMethod: function testMethod(pMethod, pElement) {
				pElement = pElement || window;

				var type    = pElement.tagName,
					pointer = lookup.promises.method[type] = lookup.promises.method[type] || { },
					stored  = pointer[pMethod] = lookup.promises.method[type][pMethod] || null;

				if(stored === null) {
					var deferred = mQ.defer(),
						method   = this.getMethod(pMethod, pElement);

					(!!method) ? deferred.resolve(method) : deferred.reject();

					stored = lookup.promises.method[type][pMethod] = deferred.promise;
				}

				return stored;
			},
			addTest: function addTest(pId, pTest) {
				return this.test[pId] = function() {
					var stored = lookup.promises.test[pId] || null;

					if(stored === null) {
						var deferred  = mQ.defer(),
							parameter = Array.prototype.slice.call(arguments);

						parameter.splice(0, 0, deferred);

						pTest.apply(null, parameter);

						stored = lookup.promises.test[pId] =  deferred.promise;
					}

					return stored;
				};
			}
		});
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/capability/datauri',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window[namespace].support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	mSupport.addTest('/capability/datauri', function(deferred) {
		var element = mSupport.getElement('image');

		element.onerror = function onerror() {
			deferred.reject();
		};

		element.onload = function onload() {
			(element.width === 1 && element.height === 1) ? deferred.resolve() : deferred.reject();
		};

		element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	});

	return mSupport.test['/capability/datauri'];
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../support' ], initialize);
	} else {
		initialize(window[namespace].support);
	}
}(function(mSupport, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas', function(deferred) {
		var element = mSupport.getElement('canvas');

		(element.getContext && element.getContext('2d')) ? deferred.resolve() : deferred.reject();
	});

	return mSupport.test['/element/canvas'];
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas/todataurl',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../support', '../canvas' ], initialize);
	} else {
		initialize(window[namespace].support, window[namespace]['support/element/canvas']);
	}
}(function(mSupport, mSupportElementCanvas, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas/todataurl', function(deferred) {
		mSupportElementCanvas()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL !== undefined) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});

	return mSupport.test['/element/canvas/todataurl'];
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'support/element/canvas/todataurl/png',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ '../../../../support', '../todataurl' ], initialize);
	} else {
		initialize(window[namespace].support, window[namespace]['support/element/canvas/todataurl']);
	}
}(function(mSupport, mSupportElementCanvasTodataurl, window, document, undefined) {
	'use strict';

	mSupport.addTest('/element/canvas/todataurl/png', function(deferred) {
		mSupportElementCanvasTodataurl()
			.then(function() {
				(mSupport.getElement('canvas').toDataURL('image/png').indexOf('data:image/png') === 0) ? deferred.resolve() : deferred.reject();
			})
			.fail(function() {
				deferred.reject();
			});
	});

	return mSupport.test['/element/canvas/todataurl/png'];
}, window, document));
;(function(definition, window, document, undefined) {
	'use strict';

	var namespace  = 'qoopido',
		name       = 'jquery/plugins/shrinkimage',
		initialize = function initialize() {
			[].push.apply(arguments, [ window, document, undefined ]);

			window[namespace] = window[namespace] || { };

			return (window[namespace][name] = definition.apply(null, arguments));
		};

	if(typeof define === 'function' && define.amd) {
		define([ 'jquery', '../../base', '../../unique', '../../support', '../../support/capability/datauri', '../../support/element/canvas/todataurl/png' ], initialize);
	} else {
		initialize(window.jQuery, window[namespace].base, window[namespace].unique, window[namespace].support, undefined, undefined);
	}
}(function(mJquery, mBase, mUnique, mSupport, mIndirect1, mIndirect2, window, document, undefined) {
	'use strict';

	var // properties
		name        = 'shrinkimage',
		defaults    = { attribute: 'data-' + name, quality: 80, debug: false },
		process     = false,
		lookup      = {},
		hostname    = window.location.hostname,
		expressions = {
			test:     new RegExp('^url(\\x28"{0,1}|)data:image/shrink,(.+?)("{0,1}\\x29|)$', 'i'),
			path:     new RegExp('^(?:url\\x28"{0,1}|)(?:data:image/shrink,|)(.+?)(?:"{0,1}\\x29|)$', 'i'),
			hostname: new RegExp('^\\w+://([^/]+)', 'i')
		},
		$resolver    = mJquery('<a />'),

	// methods / classes
		getLoader,
		shrinkimage,

	// events
		EVENT_REQUESTED = 'requested.' + name,
		EVENT_QUEUED    = 'queued.' + name,
		EVENT_CACHED    = 'cached.' + name,
		EVENT_LOADED    = 'loaded.' + name,

	// listener
		LISTENER_LOAD   = 'load';

	mSupport.testMultiple('/capability/datauri', '/element/canvas/todataurl/png')
		.then(function() {
			process = true;
		});

	mJquery.fn[name] = function(settings) {
		settings = mJquery.extend({}, defaults, settings || {});

		return this.each(function() {
			var self       = mJquery(this),
				source     = self.attr(settings.attribute),
				background = self.css('background-image');

			if(this.tagName === 'IMG') {
				if(process === true && settings.debug === false) {
					shrinkimage.create(settings, self, source);
				} else {
					self.attr('src', source).removeAttr(settings.attribute);
				}
			}

			if(background !== 'none' && expressions.test.test(background) === true) {
				if(process === true && settings.debug === false) {
					shrinkimage.create(settings, self, background, true);
				} else {
					self.css('background-image', 'url(' + expressions.path.exec(background)[1] + ')');
				}
			}
		});
	};

	getLoader = function getLoader(attribute, source) {
		return mJquery('<img />').attr(attribute, source).on(LISTENER_LOAD, function(event) { event.stopPropagation(); });
	};

	shrinkimage = mBase.extend({
		_constructor: function(settings, target, url, background) {
			var self = this;

			self._loader     = null;
			self._settings   = mJquery.extend({}, defaults, settings || {});
			self._target     = target.css({ visibility: 'hidden', opacity: 0 });
			self._background = background || false;
			self._result     = null;
			self._url        = url || false;
			self._parameter  = {
				quality: self._getParameter('quality', self._url) || self._settings.quality,
				source:  (self._url !== false) ? expressions.path.exec(self._resolveUrl(self._url))[1].split('?')[0] : false,
				target:  self._getParameter('target', self._url) || false
			};

			if(self._url !== false) {
				if(self._parameter.target === false) {
					self._parameter.target = self._parameter.source.replace(/\.png$/i, '.q' + self._parameter.quality + '.shrunk');
				}

				self._target.removeAttr(self._settings.attribute);

				switch(typeof lookup[self._parameter.target]) {
					case 'object':
						lookup[self._parameter.target]._target.one(EVENT_CACHED, function(event) {
							if(event.namespace === name) {
								self._assign(true);
							}
						});

						self._target.trigger(EVENT_QUEUED, [ self._parameter.target]);

						break;
					case 'string':
						self._assign(true);
						break;
					default:
						self._loader = getLoader(settings.attribute, url);
						lookup[self._parameter.target] = self;
						self._load();

						self._target.trigger(EVENT_REQUESTED, [ self._parameter.target]);
						break;
				}
			}
		},
		_load: function() {
			var self   = this,
				remote = (hostname !== expressions.hostname.exec(self._parameter.target)[1]);

			mJquery.ajax({
				url:           (remote === true) ? self._parameter.target + '.jsonp' : self._parameter.target,
				context:       self,
				data:          { source: self._parameter.source, quality: self._parameter.quality },
				global:        false,
				cache:         true,
				crossDomain:   remote || null,
				dataType:      (remote === true) ? 'jsonp' : 'json',
				jsonpCallback: (remote === true) ? name + '-' + mUnique.string() : null
			})
				.fail(function(response, status, error) {
					self._fallback();
				})
				.done(function(data, status, response) {
					if(typeof data !== 'object' || data.width === undefined || data.height === undefined || data.size === undefined || data.main === undefined || data.alpha === undefined) {
						self._fallback();
					} else {
						self._result = {
							original:   parseInt(data.size, 10),
							compressed: parseInt(response.getResponseHeader('Content-Length'), 10)
						};

						self._process(data);
					}
				});
		},
		_fallback: function() {
			var self = this;

			lookup[self._parameter.target] = self._parameter.source;
			self._assign(false, true);
		},
		_process: function(data) {
			var self = this;

			self._loader.one(LISTENER_LOAD, function() {
				var canvas = document.createElement('canvas'),
					loader = self._loader.get(0),
					context;

				canvas.style.display = 'none';
				canvas.width         = data.width;
				canvas.height        = data.height;

				context = canvas.getContext('2d');
				context.clearRect(0, 0, data.width, data.height);
				context.drawImage(loader, 0, 0, data.width, data.height);

				self._loader.one(LISTENER_LOAD, function() {
					self._loader.remove();

					context.globalCompositeOperation = 'xor';
					context.drawImage(loader, 0, 0, data.width, data.height);

					lookup[self._parameter.target] = canvas.toDataURL('image/png');

					mJquery(canvas).remove();

					self._assign();
				}).attr('src', data.alpha);
			}).attr('src', data.main);
		},
		_assign: function(cached, fallback) {
			var self = this;

			if(self._background === false) {
				self._target.one(LISTENER_LOAD, function() {
					self._target.css({ visibility: '', opacity: '' }).trigger(EVENT_LOADED, [ self._parameter.target, cached || false, fallback || false]);
				}).attr('src', lookup[self._parameter.target]);
			} else {
				self._target.css({ 'background-image': 'url(' + lookup[self._parameter.target] + ')' }).trigger(EVENT_LOADED, [ self._parameter.target, cached || false, fallback || false]);
			}

			if(cached !== true && self._result !== null) {
				self._target.trigger(EVENT_CACHED, [ self._parameter.target, self._result.compressed, self._result.original ]);
			}
		},
		_resolveUrl: function(url) {
			return $resolver.attr('href', url).prop('href');
		},
		_getParameter: function(name, url) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || ['',''])[1].replace(/\+/g, '%20')) || null;
		}
	});

	return shrinkimage;
}, window, document));