# Qoopido.js
This is an alpha preview of the upcoming release of Qoopido.js 4.0.0. It is mainly provided for testing and feedback reasons and things will most likely be subject to change.

Qoopido.js is a highly modular and flexible JavaScript library providing inheritance/extension mechanisms to strongly encourage the creation of re-usable code in a very modular fashion. Because of its modular nature it comes with its own promise like loader called ```demand```.

There will always be some demo code in the ```demo``` directory of this repository which you can directly view via [rawgit](https://rawgit.com/dlueth/qoopido.js/release/4.0.0/demo/debug.html). Keep in mind thought that the demo code is only for alpha testing purposes. You will most likely have to open your browser's developer console to see some output plus you might have to flush your localStorage frequently.


## Compatibility
Qoopido.js does not officially support older legacy Internet Explorers (< IE9) but might still work with some polyfills.


## External dependencies
None, yet :)


## Installation
As Qoopido.js 4.0.0 is not yet released the only way to get the alpha is by either downloading or cloning from this GitHub branch.


## Using the library
In contrast to earlier versions Qoopido.js 4.0.0 will come with its own loader. The loader consists of two components ```demand``` and ```provide``` just like require.js ```require``` and ```define```. Use the following code snippet in a standalone script tag before the closing body tag to include demand:

```javascript
(function(url, main, settings) {
	(function(window, document, type, target, script){
		target = document.getElementsByTagName(type)[0];
		script = document.createElement(type);

		window['demand'] = { main: main, settings: settings };

		script.async = script.defer = 1;
		script.src   = url;

		target.parentNode.insertBefore(script, target);
	}(window, document, 'script'))
}('/src/demand.js', 'main', { base: '/demo', version: '1.0.0' }));
```

You may as well use the uglified version:

```javascript
!function(a,b,c){!function(d,e,f,g,h){g=e.getElementsByTagName(f)[0],h=e.createElement(f),d.demand={main:b,settings:c},h.async=h.defer=1,h.src=a,g.parentNode.insertBefore(h,g)}(window,document,"script")}
("/src/demand.js","main",{base:"/demo",version:"1.0.0"});
```

The above snippet is very similar to the one Google Analytics provides. The outer function allows you to specify an URL from which to load demand itself as well as a path to the main module and configuration settings for demand. The path to the main module will be relative to base if it is relative itself.

The demanded ```main``` module might look like the following example:

```javascript
;(function(global, demand, provide) {
	'use strict';

	function definition() {
		demand
			.configure({
				// enables or disables localStorage caching
				// optional, defaults to "true"
				cache: true,
				
				// cache will be validated against version
				// optional, defaults to "1.0.0"
				version: '1.0.0',
				
				// cache will be validated against lifetime, if > 0
				// optional, defaults to "0"
				// unit: seconds
				lifetime: 60,
				
				// sets the timeout for XHR requests
				// loaded but not yet resolved modules 
				// have a timeout of timeout / 5 to get
				// resolved by their handler
				// optional, defaults to "5" (limited to "2" up to "10")
				// unit: seconds
				timeout: 8, 
				
				// base path from where your relative 
				// dependencies get loaded
				// optional, defaults to "/"
				base: '[path/url to your scripts]',
				
				// optional
				pattern: {
					'/qoopido': '[path/url to Qoopido.js]',
					'/jquery':  '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min'
				},
				
				// probes allow you to write fallback tests
				// for modules that do not natively support
				// demand/provide
				// optional
				probes: {
					'/jquery': function() { return global.jQuery; }
				}
			});
	}
	
	provide(definition);
}(this, demand, provide));
```

Once demand is loaded anything that is either explicitly requested via ```demand``` or as a dependency of a ```provide``` call will be loaded via XHR as well as modified and injected into the DOM with the help of a handler. The result will be cached in ```localStorage``` (if caching is enabled and localStorage is available) and will get validated against the version number and the timeout both set via ```configure```, as well as the modules URL.

As you might have guessed already ```main``` itself is also loaded as a module and therefore will also get cached in localStorage.

```demand``` comes with handlers for JavaScript and CSS. Handlers have three objectives:

- provide a file extension/suffix to be added the the url
- provide a function named ```resolve``` that handles DOM injection and final resolution of a module via an anonymous ```provide``` call
- provide an optional function named ```modify``` that, if present, handles necessary conversion of the loaded source (e.g. CSS paths that are normally relative to the CSS-file path)

Handlers can, quite similar to require.js, be explicitly set for a certain module by prefixing the module path by ```[mimetype]!```. The default handler, e.g., is ```application/javascript``` which will automatically be used when no other handler is explicitly set.

You can also create your own handlers easily:

```javascript
demand.addHandler(
	'[mimetype]',
	'[file extension]',
	{ 
		resolve: function(path, value) {
			/* inject or otherwise resolve the dependency */
			
			provide(function definition() {
				return true;
			});
		},
		modify: function(url, value) {
			/* modify the passed value */
			
			return value;
		}
	}
);
```

Just keep these few things in mind:

- ```[File extension]``` has to include a leading ```.``` to be able to stay flexible
- ```resolve``` must make an anonymous ```provide``` call that resolves the queued loader
- in case you need a ```modify``` function make sure it returns the modified ```value```


### Controlling the cache
If caching is enabled, localStorage available and its quota not exceeded chances are good you will never have to manually deal with the caching.

By default demand will invalidate a modules cache under the following conditions:

- global ```version``` changed
- cache is expired due to ```lifetime```
- a modules URL changed

Demand will, in addition, do its best to keep leftover garbage to a minimum. It does so by starting an automatic garbage collection for expired caches on load. In addition it will also clear a cache if it gets requested and is found to be invalid for any reason.

Beside this demand still offers manual control by registering a ```demand.clear``` method to the global demand function. See the following example to learn more about the details:

```javascript
// without parameters it will clear all demand-related caches in localStorage
demand.clear();

// called this way it will only clear caches that are expired
demand.clear(true);

// called with a path of a module only this modules cache will be cleared
demand.clear('[path of the module]')
```

**Sidenote**
> Demand does use a prefix for its localStorage keys to prevent conflicts with other scripts. Each cache will consist of two keys, one to store the ```state``` information (as JSON) and one for the actual ```source``` of the module. By separating the two only a very small string will have to get parsed as JSON which could lead to performance constraints if a potentially huge module would have to get parsed this way.

> Demand will also do its best to detect "quota exceeded" errors by putting a try/catch around the actual cache writes. As IE does not throw exceptions currently a workaround to use ```localStorage.remainingSpace```is implemented as well.


### Demanding modules
After your project is set up accordingly you can load further modules like this

```javascript
demand('app/test', '/qoopido/component/iterator')
	.then(
		function(appTest, qoopidoComponentIterator) {
			console.log('=> success', appTest, qoopidoComponentIterator);

			new qoopidoComponentIterator();
		},
		function() {
			console.log('=> error', arguments);
		}
	);
```

Module paths not starting with a ```/``` will be resolved relative to the path of an eventual parent module. The resulting path will afterwards get matched to patterns defined via ```demand.configure``` which will finally lead to an absolute URL to fetch the module from.

**Sidenote**
> The error callback function will be passed **all** rejected dependencies as arguments, not only the first one rejected.


### Providing inline modules
Beside demanding other modules you can as well provide your own, just like in the following example:

```javascript
function definition(appTest, qoopidoBase) {
	return function appMain() {

	}
}

provide('/app/main', definition).when('test', '/qoopido/base');
```

This is an example for an inline module. The ```provide``` call, in this case, consists of two arguments:

- path of the module
- definition of the module

When dynamically loading modules ```path``` will have to be omitted and gets internally resolved via loading queue handling instead.

Module resolution via ```provide``` is internally defered via a setTimeout call to be able to return an object providing a ```when``` function to request dependencies. Although this might technically not be the cleanest solution it feels much better to write and understand. Beside that, it simply works great :)


### Providing loadable modules
You just learnt how to provide inline modules which is only slightly different from building an external, loadable module. Demand will dynamically load any modules that are not already registered.

In addition to inline modules you just need some boilerplate code and an anynymous ```provide``` call without the ```path``` argument like in the following example:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {
		return function appTest() {

		}
	}

	provide(definition)
		.when('/qoopido/base');
}());
```

This example illustrates a module named ```/app/test``` which we already know as the first dependency of the prior example. As with the inline module the ```definition``` function will receive all dependencies as arguments passed so they are in scope of the actual module.


### Extending modules
Beside simply providing means to demand and provide modules Qoopido.js also offers an easy, nice and flexible, prototype based inheritance/extension mechanism for you to use. This is especially great if you, like myself, prefer small modular/atomic modules that are easily combinable over big, unmaintainable monolitic scripts.

Extension is absolutely dead simple. Let us rewrite the prior example making the module ```/app/test``` extend the ```base``` module of Qoopido.js:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {

		function appTest() {

		}
		
		return qoopidoBase.extend(appTest);
	}

	provide(definition)
		.when('/qoopido/base');
}());
```

Our ```appTest``` module just inherited from ```base``` which will only add an ```extend``` method to it so it may itself be extended by further modules. 

Note that it is also possible to prohibit further extension by setting a ```final``` property on the module itself before calling ```extend```:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {

		function appTest() {

		}
		
		appTest.final = true;
		
		return qoopidoBase.extend(appTest);
	}

	provide(definition)
		.when('/qoopido/base');
}());
```

Adding a ```final``` property will prohibit ```base``` to add an extend method to the module. In case of this example it does certainly not make any sense but it might be necessary in more complex, real world scenarios.

If you want some more examples simply look into the ```src``` directory of this repository. At the moment the best example for multiple extension/inheritance is the ```component/iterator``` module.

**Sidenote**
> The extension mechanism works in a way that ensures that native JavaScript ```instanceof``` will work and stay fully intact - which is a big improvement over earlier versions of Qoopido.js. Beside that, new instances will now be created via the native JavaScript ```new``` keyword instead of having to call an explicit ```create``` method manually.


## Included modules
Keep in mind that this is a very early aplha. I will migrate most of the modules from prior releases as soon as the base is finalized.

- demand/provide (Promise based flexible loader)
- base (abstract, object inheritance)
- component
	- iterator (flexible and UI/UX independent iterator for e.g. paging)
- emitter (event emitter)
- function (provides single functions, e.g. helper)
   	- merge (function to deep merge objects)
   	- unique (generate unique identifiers)
   		- uuid (generate unique ids)

