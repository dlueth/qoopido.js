/*!
* Qoopido.js library
*
* version: 3.4.5
* date:    2014-7-9
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2014 Dirk Lueth
*
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
*/
(function(definition) {
    window.qoopido.register("polyfill/window/promise", definition);
})(function(modules, shared, namespace, navigator, window, document, undefined) {
    "use strict";
    var STATE_PENDING = void 0, STATE_SEALED = 0, STATE_FULFILLED = 1, STATE_REJECTED = 2, queue = [];
    function addCallback(fn, arg) {
        var length = queue.push([ fn, arg ]);
        if (length === 1) {
            scheduleFlushCallbacks();
        }
    }
    function scheduleFlushCallbacks() {
        window.setTimeout(flushCallbacks, 1);
    }
    function flushCallbacks() {
        var i = 0, tuple;
        for (;(tuple = queue[i]) !== undefined; i++) {
            tuple[0](tuple[1]);
        }
        queue.length = 0;
    }
    function handleThenable(promise, value) {
        var then = null, resolved;
        try {
            if (promise === value) {
                throw new TypeError("A promises callback cannot return that same promise.");
            }
            if (typeof value === "function" || typeof value === "object" && value !== null) {
                then = value.then;
                if (typeof then === "function") {
                    then.call(value, function(val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        if (value !== val) {
                            resolve(promise, val);
                        } else {
                            fulfill(promise, val);
                        }
                    }, function(val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        reject(promise, val);
                    });
                    return true;
                }
            }
        } catch (exception) {
            if (resolved) {
                return true;
            }
            reject(promise, exception);
            return true;
        }
        return false;
    }
    function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
            resolve(promise, value);
        }
        function rejectPromise(reason) {
            reject(promise, reason);
        }
        try {
            resolver(resolvePromise, rejectPromise);
        } catch (exception) {
            rejectPromise(exception);
        }
    }
    function invokeCallback(settled, promise, callback, detail) {
        var hasCallback = typeof callback === "function", value, error, succeeded, failed;
        if (hasCallback) {
            try {
                value = callback(detail);
                succeeded = true;
            } catch (exception) {
                failed = true;
                error = exception;
            }
        } else {
            value = detail;
            succeeded = true;
        }
        if (handleThenable(promise, value)) {
            return;
        } else if (hasCallback && succeeded) {
            resolve(promise, value);
        } else if (failed) {
            reject(promise, error);
        } else if (settled === STATE_FULFILLED) {
            resolve(promise, value);
        } else if (settled === STATE_REJECTED) {
            reject(promise, value);
        }
    }
    function resolve(promise, value) {
        if (promise === value) {
            fulfill(promise, value);
        } else if (!handleThenable(promise, value)) {
            fulfill(promise, value);
        }
    }
    function fulfill(promise, value) {
        if (promise._state !== STATE_PENDING) {
            return;
        }
        promise._state = STATE_SEALED;
        promise._detail = value;
        addCallback(publishFulfillment, promise);
    }
    function reject(promise, reason) {
        if (promise._state !== STATE_PENDING) {
            return;
        }
        promise._state = STATE_SEALED;
        promise._detail = reason;
        addCallback(publishRejection, promise);
    }
    function publishFulfillment(promise) {
        publish(promise, promise._state = STATE_FULFILLED);
    }
    function publishRejection(promise) {
        publish(promise, promise._state = STATE_REJECTED);
    }
    function subscribe(parent, child, onFulfillment, onRejection) {
        var subscribers = parent._subscribers, length = subscribers.length;
        subscribers[length] = child;
        subscribers[length + STATE_FULFILLED] = onFulfillment;
        subscribers[length + STATE_REJECTED] = onRejection;
    }
    function publish(promise, settled) {
        var child, callback, subscribers = promise._subscribers, detail = promise._detail, i = 0;
        for (;(child = subscribers[i]) !== undefined; i += 3) {
            callback = subscribers[i + settled];
            invokeCallback(settled, child, callback, detail);
        }
        promise._subscribers = null;
    }
    function Promise(resolver) {
        var self = this;
        if (typeof resolver !== "function") {
            throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
        }
        self._subscribers = [];
        invokeResolver(resolver, self);
    }
    Promise.prototype = {
        _state: undefined,
        _detail: undefined,
        _subscribers: undefined,
        then: function(onFulfilled, onRejected) {
            var self = this, thenPromise = new Promise(function() {});
            if (self._state) {
                addCallback(function invokePromiseCallback() {
                    invokeCallback(self._state, thenPromise, arguments[self._state - 1], self._detail);
                });
            } else {
                subscribe(self, thenPromise, onFulfilled, onRejected);
            }
            return thenPromise;
        },
        "catch": function(onRejected) {
            return this.then(null, onRejected);
        }
    };
    if (!window.Promise) {
        window.Promise = Promise;
    }
    return window.Promise;
});