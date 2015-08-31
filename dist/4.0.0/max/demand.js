/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-08-31
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(global) {
    "use strict";
    var g_st = global.setTimeout, d = document, ls = localStorage, a_p_s = Array.prototype.slice, defaults = {
        version: "1.0.0",
        base: "/"
    }, target = d.getElementsByTagName("head")[0], resolver = d.createElement("a"), regexIsAbsolute = /^\//i, regexMatchHandler = /^([-\w]+\/[-\w]+)!/, regexMatchSpecial = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, regexMatchCssUrl = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g, main = global.demand.main, settings = global.demand.settings, host = global.location.host, base = {}, pattern = {}, handler = {}, modules = {}, version, resolve, storage, queue;
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
                    !loader.cached && loader.store();
                    defered = loader.defered;
                    promise.then(function(value) {
                        defered.resolve(value);
                    }, function(error) {
                        defered.reject(new Error("unable to resolve module", path, error));
                    });
                    queue.length > 0 && queue.next();
                }
            });
        } else {
            throw new Error("unspecified anonymous provide");
        }
        return {
            when: function() {
                dependencies = a_p_s.call(arguments);
            }
        };
    }
    function configure(aConfig) {
        var pointerVersion = aConfig.version, pointerBase = aConfig.base, pointerPattern = aConfig.pattern, key;
        if (pointerVersion) {
            version = pointerVersion;
        }
        if (pointerBase) {
            base = new Pattern(pointerBase, resolve.url(pointerBase).href);
        }
        if (pointerPattern) {
            for (key in pointerPattern) {
                pattern[key] = new Pattern(key, pointerPattern[key]);
            }
        }
    }
    function addHandler(aType, aSuffix, aHandler) {
        if (!handler[aType]) {
            handler[aType] = {
                suffix: aSuffix,
                resolve: aHandler.resolve,
                modify: aHandler.modify
            };
            modules[aType] = {};
            return true;
        }
        return false;
    }
    function log(aMessage) {
        var type = aMessage instanceof Error ? "error" : "info";
        if (typeof console !== "undefined") {
            console[type](aMessage.toString());
        }
    }
    function escape(aValue) {
        return aValue.replace(regexMatchSpecial, "\\$&");
    }
    function isAbsolute(aPath) {
        return regexIsAbsolute.test(aPath);
    }
    resolve = {
        url: function(aUrl) {
            resolver.href = aUrl;
            return resolver;
        },
        path: function(aPath, aParent) {
            var self = this, pointer = aPath.match(regexMatchHandler) || "application/javascript", absolute, key, match;
            if (typeof pointer !== "string") {
                aPath = aPath.replace(new RegExp("^" + escape(pointer[0])), "");
                pointer = pointer[1];
            }
            if (absolute = isAbsolute(aPath)) {
                aPath = base.remove(resolve.url(base.url + aPath).href);
            } else {
                aPath = resolve.url((aParent && aParent.path + "/../" || "/") + aPath).pathname;
            }
            for (key in pattern) {
                if (pattern[key].matches(aPath)) {
                    match = pattern[key];
                }
            }
            if (self instanceof Module || self instanceof Loader) {
                self.handler = pointer;
                self.path = aPath;
                self.version = version;
                if (self instanceof Loader) {
                    self.url = resolve.url(match ? match.process(aPath) : (absolute ? "//" + host : base.url) + aPath).href;
                }
            } else {
                return {
                    handler: handler,
                    path: aPath,
                    version: version
                };
            }
        }
    };
    function Storage() {}
    Storage.prototype = {
        get: function(aPath, aVersion) {
            var data = JSON.parse(ls.getItem(aPath));
            if (!aVersion || data && aVersion === data.version) {
                return data;
            }
        },
        set: function(aPath, aValue, aVersion) {
            ls.setItem(aPath, JSON.stringify({
                version: aVersion || version,
                source: aValue
            }));
        },
        clear: function(aPath) {
            aPath && ls.removeItem(aPath) || ls.clear();
        }
    };
    function Error(aMessage, aModule, aStack) {
        var self = this;
        self.message = aMessage;
        self.module = aModule;
        if (aStack) {
            self.stack = aStack;
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
    function Pattern(aPattern, aUrl) {
        var self = this;
        self.url = resolve.url(aUrl).href;
        self.regexPattern = new RegExp("^" + escape(aPattern));
        self.regexUrl = new RegExp("^" + escape(aUrl));
    }
    Pattern.prototype = {
        matches: function(aPath) {
            return this.regexPattern.test(aPath);
        },
        remove: function(aUrl) {
            return aUrl.replace(this.regexUrl, "");
        },
        process: function(aPath) {
            var self = this;
            return aPath.replace(self.regexPattern, self.url);
        }
    };
    function Queue() {
        var self = this;
        self.queue = [];
        self.current = null;
    }
    Queue.prototype = {
        length: 0,
        add: function(aItem) {
            var self = this, queue = self.queue;
            queue.push(aItem);
            self.length++;
            queue.length === 1 && self.next();
        },
        next: function() {
            var self = this, current = self.current, queue = self.queue, pointer;
            if (current) {
                self.current = null;
                queue.shift();
                self.length--;
            }
            if (queue.length) {
                current = self.current = self.queue[0];
                pointer = handler[current.handler];
                !current.cached && pointer.modify && (current.source = pointer.modify(current.url, current.source));
                pointer.resolve(current.path, current.source);
            }
        }
    };
    function Loader(aPath, aParent) {
        var self = this, defered = Promise.defer(), xhr = new XMLHttpRequest(), pointer, cached;
        resolve.path.call(self, aPath, aParent);
        self.defered = defered;
        self.promise = defered.promise;
        self.cached = false;
        pointer = handler[self.handler];
        if (!parent) {
            self.promise.then(null, log);
        }
        if (pointer) {
            cached = self.retrieve();
            if (cached) {
                queue.add(self);
            } else {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 0 && xhr.responseText) {
                            self.source = xhr.responseText;
                            queue.add(self);
                        } else {
                            defered.reject(new Error("unable to load module", self.path));
                        }
                    }
                };
                xhr.open("GET", self.url + pointer.suffix, true);
                xhr.send();
                g_st(function() {
                    if (xhr.readyState < 4) {
                        xhr.abort();
                    }
                }, 5e3);
            }
        } else {
            defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
        }
        return self;
    }
    Loader.prototype = {
        store: function() {
            var self = this;
            storage.set(self.path, self.source, self.version);
        },
        retrieve: function() {
            var self = this, cache = storage.get(self.path, self.version), cached = self.cached = !!cache;
            cached && (self.source = cache.source);
            return cached;
        }
    };
    function Module(aPath, aFactory, aDependencies) {
        var self = this, defered = Promise.defer();
        resolve.path.call(self, aPath);
        self.promise = defered.promise;
        self.promise.then(null, function(error) {
            log(new Error("unable to resolve module", self.path, error));
        });
        demand.apply(self, aDependencies).then(function() {
            defered.resolve(aFactory.apply(null, arguments));
        }, function(error) {
            defered.reject(new Error("unable to resolve dependencies for", self.path, error));
        });
        return self;
    }
    function JavascriptHandler() {}
    JavascriptHandler.prototype = {
        resolve: function(aPath, aValue) {
            var script = d.createElement("script");
            script.defer = script.async = true;
            script.text = aValue;
            script.setAttribute("demand-path", aPath);
            target.appendChild(script);
        }
    };
    function CssHandler() {}
    CssHandler.prototype = {
        resolve: function(aPath, aValue) {
            var style = d.createElement("style"), sheet = style.styleSheet;
            style.type = "text/css";
            style.media = "only x";
            sheet && (sheet.cssText = aValue) || (style.innerHTML = aValue);
            style.setAttribute("demand-path", aPath);
            target.appendChild(style);
            g_st(function() {
                style.media = "all";
                provide(function() {
                    return true;
                });
            });
        },
        modify: function(aUrl, aValue) {
            var base = resolve.url(aUrl + "/..").href, match;
            while (match = regexMatchCssUrl.exec(aValue)) {
                aValue = aValue.replace(match[0], "url(" + resolve.url(base + match[1]).pathname + ")");
            }
            return aValue;
        }
    };
    storage = new Storage();
    queue = new Queue();
    addHandler("application/javascript", ".js", new JavascriptHandler());
    addHandler("text/css", ".css", new CssHandler());
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
})(this);