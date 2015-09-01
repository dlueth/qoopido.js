/*!
* Qoopido.js
*
* version: 4.0.0
* date:    2015-09-01
* author:  Dirk Lueth <info@qoopido.com>
* website: https://github.com/dlueth/qoopido.js
*
* Copyright (c) 2015 Dirk Lueth
*/
(function(global) {
    "use strict";
    var d = document, ls = localStorage, st = setTimeout, a_p_s = Array.prototype.slice, a_p_c = Array.prototype.concat, target = d.getElementsByTagName("head")[0], resolver = d.createElement("a"), regexIsAbsolute = /^\//i, regexMatchHandler = /^([-\w]+\/[-\w]+)!/, regexMatchSpecial = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, regexMatchCssUrl = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g, regexMatchProtocol = /^http(s?):/, BOND_PENDING = "pending", BOND_RESOLVED = "resolved", BOND_REJECTED = "rejected", defaults = {
        version: "1.0.0",
        base: "/"
    }, main = global.demand.main, settings = global.demand.settings, host = global.location.host, base = {}, pattern = {}, handler = {}, modules = {}, version, queue, resolve, storage, JavascriptHandler, CssHandler;
    function demand() {
        var self = this || {}, module = isInstanceOf(self, Module) ? self : null, dependencies = a_p_s.call(arguments);
        dependencies.forEach(function(dependency, index) {
            var resolved = resolve.path(dependency, module), handler = resolved.handler, path = resolved.path, pointer = modules[handler] || (modules[handler] = {});
            this[index] = pointer[path] || (pointer[path] = new Loader(dependency, module).bond);
        }, dependencies);
        return Bond.all(dependencies);
    }
    function provide() {
        var path = arguments[0] && typeof arguments[0] === "string" && arguments[0] || null, factory = !path && arguments[0] || arguments[1], dependencies, loader;
        if (!path && queue.current) {
            loader = queue.current;
            path = loader.handler + "!" + loader.path;
        }
        if (path) {
            st(function() {
                var resolved = resolve.path(path), pointer = modules[resolved.handler], module, bond, defered;
                if (!loader && pointer[resolved.path]) {
                    throw new Error("duplicate found for module", path);
                } else {
                    module = new Module(path, factory, dependencies || []);
                    bond = modules[module.handler][module.path] = module.bond;
                    if (loader) {
                        !loader.cached && loader.store();
                        defered = loader.defered;
                        bond.then(function() {
                            defered.resolve.apply(null, arguments);
                        }, function() {
                            defered.reject(new Error("unable to resolve module", path, arguments));
                        });
                        queue.length > 0 && queue.next();
                    }
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
        return true;
    }
    function addHandler(aType, aSuffix, aHandler) {
        if (!handler[aType]) {
            handler[aType] = {
                suffix: aSuffix,
                resolve: aHandler.resolve,
                modify: aHandler.modify
            };
            modules[aType] = {};
        }
    }
    function log(aMessage) {
        var type = isInstanceOf(aMessage, Error) ? "error" : "info";
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
    function removeProtocol(url) {
        return url.replace(regexMatchProtocol, "");
    }
    function isInstanceOf(instance, module) {
        return instance instanceof module;
    }
    resolve = {
        url: function(aUrl) {
            resolver.href = aUrl;
            return resolver;
        },
        path: function(aPath, aParent) {
            var self = this, pointer = aPath.match(regexMatchHandler) || "application/javascript", isLoader = isInstanceOf(self, Loader), absolute, key, match;
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
                pattern[key].matches(aPath) && (match = pattern[key]);
            }
            if (isLoader || isInstanceOf(self, Module)) {
                self.handler = pointer;
                self.path = aPath;
                isLoader && (self.url = removeProtocol(resolve.url(match ? match.process(aPath) : (absolute ? "//" + host : base.url) + aPath).href));
            } else {
                return {
                    handler: pointer,
                    path: aPath
                };
            }
        }
    };
    storage = {
        get: function(aPath, aUrl) {
            var data = JSON.parse(ls.getItem(aPath));
            if (data && data.version === version && data.url === aUrl) {
                return data;
            }
        },
        set: function(aPath, aValue, aUrl) {
            ls.setItem(aPath, JSON.stringify({
                version: version,
                url: aUrl,
                source: aValue
            }));
        },
        clear: function(aPath) {
            aPath && ls.removeItem(aPath) || ls.clear();
        }
    };
    function Bond(executor) {
        var self = this, listener = {
            resolved: [],
            rejected: []
        };
        function resolve() {
            handle(BOND_RESOLVED, arguments);
        }
        function reject() {
            handle(BOND_REJECTED, arguments);
        }
        function handle(aState, aParameter) {
            if (self.state === BOND_PENDING) {
                self.state = aState;
                self.value = aParameter;
                listener[aState].forEach(function(aHandler) {
                    aHandler.apply(null, self.value);
                });
            }
        }
        self.then = function(aResolved, aRejected) {
            var self = this;
            if (self.state === BOND_PENDING) {
                aResolved && listener[BOND_RESOLVED].push(aResolved);
                aRejected && listener[BOND_REJECTED].push(aRejected);
            } else {
                switch (self.state) {
                  case BOND_RESOLVED:
                    aResolved.apply(null, self.value);
                    break;

                  case BOND_REJECTED:
                    aRejected.apply(null, self.value);
                    break;
                }
            }
        };
        executor(resolve, reject);
    }
    Bond.prototype = {
        constructor: Bond,
        state: BOND_PENDING,
        value: null,
        listener: null
    };
    Bond.defer = function() {
        var self = {};
        self.bond = new Bond(function(aResolve, aReject) {
            self.resolve = aResolve;
            self.reject = aReject;
        });
        return self;
    };
    Bond.all = function(aBonds) {
        var defered = Bond.defer(), bond = defered.bond, resolved = [], countTotal = aBonds.length, countResolved = 0;
        aBonds.forEach(function(aBond, aIndex) {
            aBond.then(function() {
                if (bond.state === BOND_PENDING) {
                    resolved[aIndex] = a_p_s.call(arguments);
                    countResolved++;
                    countResolved === countTotal && defered.resolve.apply(null, a_p_c.apply([], resolved));
                }
            }, defered.reject);
        });
        return bond;
    };
    Bond.race = function(aBonds) {
        var defered = Bond.defer();
        aBonds.forEach(function(aBond) {
            aBond.then(defered.resolve, defered.reject);
        });
        return defered.bond;
    };
    function Error(aMessage, aModule, aStack) {
        var self = this;
        self.message = aMessage;
        self.module = aModule;
        aStack && (self.stack = aStack);
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
        var self = this, defered = Bond.defer(), xhr = new XMLHttpRequest(), pointer, cached;
        resolve.path.call(self, aPath, aParent);
        self.defered = defered;
        self.bond = defered.bond;
        self.cached = false;
        pointer = handler[self.handler];
        if (!parent) {
            self.bond.then(null, log);
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
                st(function() {
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
            storage.set(self.path, self.source, self.url);
        },
        retrieve: function() {
            var self = this, cache = storage.get(self.path, self.url), cached = self.cached = !!cache;
            cached && (self.source = cache.source);
            return cached;
        }
    };
    function Module(aPath, aFactory, aDependencies) {
        var self = this, defered = Bond.defer();
        resolve.path.call(self, aPath);
        self.bond = defered.bond;
        self.bond.then(null, function(error) {
            log(new Error("unable to resolve module", self.path, error));
        });
        if (aDependencies.length > 0) {
            demand.apply(self, aDependencies).then(function() {
                defered.resolve(aFactory.apply(null, arguments));
            }, function(error) {
                defered.reject(new Error("unable to resolve dependencies for", self.path, error));
            });
        } else {
            defered.resolve(aFactory());
        }
        return self;
    }
    JavascriptHandler = {
        resolve: function(aPath, aValue) {
            var script = d.createElement("script");
            script.type = "application/javascript";
            script.defer = script.async = true;
            script.text = aValue;
            script.setAttribute("demand-path", aPath);
            target.appendChild(script);
        }
    };
    CssHandler = {
        resolve: function(aPath, aValue) {
            var style = d.createElement("style"), sheet = style.styleSheet;
            style.type = "text/css";
            style.media = "only x";
            sheet && (sheet.cssText = aValue) || (style.innerHTML = aValue);
            style.setAttribute("demand-path", aPath);
            target.appendChild(style);
            st(function() {
                provide(function() {
                    return style;
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
    queue = new Queue();
    addHandler("application/javascript", ".js", JavascriptHandler);
    addHandler("text/css", ".css", CssHandler);
    configure(defaults) && settings && configure(settings);
    demand.configure = configure;
    demand.addHandler = addHandler;
    demand.clear = storage.clear;
    global.demand = demand;
    global.provide = provide;
    provide("/demand", function() {
        return demand;
    });
    provide("/provide", function() {
        return provide;
    });
    provide("/bond", function() {
        return Bond;
    });
    if (main) {
        demand(main);
    }
})(this);