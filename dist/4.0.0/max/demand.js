/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-08-30
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(global) {
    "use strict";
    var g_st = global.setTimeout, d = document, a_p_s = Array.prototype.slice, defaults = {
        base: "/"
    }, target = d.getElementsByTagName("head")[0], resolver = d.createElement("a"), regexIsAbsolute = /^\//i, regexMatchHandler = /^([-\w]+\/[-\w]+)!/, regexMatchSpecial = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, main = global.demand.main, settings = global.demand.settings, host = global.location.host, base = {}, pattern = {}, handler = {}, modules = {}, resolve, queue;
    function demand() {
        var self = this || {}, module = self instanceof Module ? self : null, dependencies = a_p_s.call(arguments), resolveHandler, rejectHandler;
        self.then = function(onResolve, onReject) {
            resolveHandler = onResolve;
            rejectHandler = onReject;
        };
        dependencies.forEach(function(dependency, index) {
            var resolved = resolve.path(dependency, module), handler = resolved.handler, pointer = modules[handler] || (modules[handler] = {});
            this[index] = pointer[resolved.path] || (pointer[resolved.path] = new Loader(dependency, module).promise);
        }, dependencies);
        Promise.all(dependencies).then(function() {
            typeof resolveHandler === "function" && resolveHandler.apply(null, arguments[0]);
        }, function(error) {
            typeof rejectHandler === "function" && rejectHandler(error);
        });
        return self;
    }
    function provide() {
        var path = arguments[0] && typeof arguments[0] === "string" && arguments[0] || null, factory = !path && arguments[0] || arguments[1], dependencies, loader, module, promise, defered;
        if (!path && queue.current) {
            loader = queue.current;
            path = loader.path;
        }
        if (path) {
            g_st(function() {
                module = new Module(path, factory, dependencies || []);
                promise = modules[module.handler][module.path] = module.promise;
                if (loader) {
                    defered = loader.defered;
                    promise.then(function(value) {
                        defered.resolve(value);
                    }, function(error) {
                        defered.reject(new Error("unable to resolve module", loader.path, error));
                    });
                    queue.length > 0 && queue.next();
                }
            }, 0);
        } else {
            throw new Error("unspecified anonymous provide");
        }
        return {
            when: function() {
                dependencies = a_p_s.call(arguments);
            }
        };
    }
    function configure(config) {
        var pointerBase = config.base, pointerPattern = config.pattern, key;
        if (pointerBase) {
            base = new Pattern(pointerBase, resolve.url(pointerBase).href);
        }
        if (pointerPattern) {
            for (key in pointerPattern) {
                pattern[key] = new Pattern(key, pointerPattern[key]);
            }
        }
    }
    function addHandler(type, suffix, fn) {
        if (!handler[type]) {
            handler[type] = {
                suffix: suffix,
                callback: fn
            };
            modules[type] = {};
            return true;
        }
        return false;
    }
    function log(message) {
        var type = message instanceof Error ? "error" : "info";
        if (typeof console !== "undefined") {
            console[type](message.toString());
        }
    }
    function escape(value) {
        return value.replace(regexMatchSpecial, "\\$&");
    }
    function isAbsolute(path) {
        return regexIsAbsolute.test(path);
    }
    resolve = {
        url: function(url) {
            resolver.href = url;
            return resolver;
        },
        path: function(path, parent) {
            var self = this, handler = path.match(regexMatchHandler) || "application/javascript", absolute, key, match;
            if (typeof handler !== "string") {
                path = path.replace(handler[0], "");
                handler = handler[1];
            }
            if (absolute = isAbsolute(path)) {
                path = base.remove(resolve.url(base.url + path).href);
            } else {
                path = resolve.url((parent && parent.path + "/../" || "/") + path).pathname;
            }
            for (key in pattern) {
                if (pattern[key].matches(path)) {
                    match = pattern[key];
                }
            }
            if (self instanceof Module || self instanceof Loader) {
                self.handler = handler;
                self.path = path;
                if (self instanceof Loader) {
                    self.url = resolve.url(match ? match.process(path) : (absolute ? "//" + host : base.url) + path).href;
                }
            } else {
                return {
                    handler: handler,
                    path: path
                };
            }
        }
    };
    function Error(message, module, stack) {
        var self = this;
        self.message = message;
        self.module = module;
        if (stack) {
            self.stack = stack;
        }
        return self;
    }
    Error.prototype = {
        toString: function() {
            var self = this, result = "[demand] " + self.message + " " + self.module;
            if (self.stack) {
                while (self = self.stack) {
                    result += "\n    > " + self.message + " " + self.module;
                }
            }
            return result;
        }
    };
    function Pattern(pattern, url) {
        var self = this;
        self.url = resolve.url(url).href;
        self.regexPattern = new RegExp("^" + escape(pattern));
        self.regexUrl = new RegExp("^" + escape(url));
    }
    Pattern.prototype = {
        matches: function(path) {
            return this.regexPattern.test(path);
        },
        remove: function(url) {
            return url.replace(this.regexUrl, "");
        },
        process: function(path) {
            var self = this;
            return path.replace(self.regexPattern, self.url);
        }
    };
    function Queue() {
        var self = this;
        self.queue = [];
        self.current = null;
    }
    Queue.prototype = {
        length: 0,
        add: function(item) {
            var self = this, queue = self.queue;
            queue.push(item);
            self.length++;
            queue.length === 1 && self.next();
        },
        next: function() {
            var self = this, current = self.current, queue = self.queue;
            if (current) {
                self.current = null;
                queue.shift();
                self.length--;
            }
            if (queue.length) {
                current = self.current = self.queue[0];
                handler[current.handler].callback(current.path, current.value);
            }
        }
    };
    function Loader(path, parent) {
        var self = this, defered = Promise.defer(), xhr = new XMLHttpRequest(), pointer;
        resolve.path.call(self, path, parent);
        self.defered = defered;
        self.promise = defered.promise;
        pointer = handler[self.handler];
        if (!parent) {
            self.promise.then(null, log);
        }
        if (pointer) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0 && xhr.responseText) {
                        self.value = xhr.responseText;
                        queue.add(self);
                    } else {
                        defered.reject(new Error("unable to load module", self.path));
                    }
                }
            };
            xhr.open("GET", self.url + pointer.suffix, true);
            xhr.send();
            setTimeout(function() {
                if (xhr.readyState < 4) {
                    xhr.abort();
                }
            }, 5e3);
        } else {
            defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
        }
        return self;
    }
    function Module(path, factory, dependencies) {
        var self = this, defered = Promise.defer();
        resolve.path.call(self, path);
        self.promise = defered.promise;
        self.promise.then(null, function(error) {
            log(new Error("unable to resolve module", self.path, error));
        });
        demand.apply(self, dependencies).then(function() {
            defered.resolve(factory.apply(null, arguments));
        }, function(error) {
            defered.reject(new Error("unable to resolve dependencies for", self.path, error));
        });
        return self;
    }
    function JavascriptHandler(path, value) {
        var script = d.createElement("script");
        script.defer = script.async = true;
        script.text = value;
        script.setAttribute("demand-path", path);
        target.appendChild(script);
    }
    function CssHandler(value) {}
    queue = new Queue();
    addHandler("application/javascript", ".js", JavascriptHandler);
    addHandler("text/css", ".css", CssHandler);
    configure(defaults) && settings && configure(settings);
    demand.configure = configure;
    demand.addHandler = addHandler;
    global.demand = demand;
    global.provide = provide;
    if (main) {
        var script = d.createElement("script");
        script.defer = script.async = true;
        script.src = main;
        target.appendChild(script);
    }
    global.debug = {
        modules: modules,
        queue: queue
    };
})(this);