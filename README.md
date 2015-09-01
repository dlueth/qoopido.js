# Qoopido.js
This is an alpha preview of the upcoming release of Qoopido.js 4.0.0. It is mainly provided for testing and feedback reasons and things will most likely be subject to change.

Qoopido.js is a highly modular and flexible JavaScript library providing inheritance/extension mechanisms to strongly encourage the creation of re-usable code in a very modular fashion. Because of its modular nature it comes with its own promise like loader as well.

There will always be some demo code in the ```demo``` directory of this repository which you can directly view via [rawgit](https://rawgit.com/dlueth/qoopido.js/release/4.0.0/demo/debug.html). Keep in mind thought that the demo code is only for alpha testing purposes. You will most likely have to open your browser's developer console to see some output plus you might have to flush your localStorage frequently.


## Compatibility
Qoopido.js does not officially support older legacy Internet Explorers (< IE9) but might still work with some polyfills.


## External dependencies
None, beside polyfills eventually(!!!)


## Installation
There currently are four ways to get Qoopido.js included into your project:

**remark**
> As Qoopido.js 4.0.0 is not yet released this section is not currently not valid and the only way to get the alpha is by either downloading or cloning from the corresponding git branch.

### CDN
Qoopido.js will continue to be pushed to jsdelivr and CDNJS. I personally recommend jsdelivr.

### Manual
Download the current version from GitHub and put all the contents of the directory ```dist/latest/src``` and/or ```dist/latest/min``` into a directory under your project root.

```
https://github.com/dlueth/qoopido.js
```

### GitHub
Clone the following repository into your projects directory structure.

```
git clone https://github.com/dlueth/qoopido.js.git
```

### Bower
Change into your project directory and type

```
bower install qoopido.js
```

If you have Node, NPM and bower installed typing ```bower install``` will install eventually required external dependencies into the location you specified in the ```.bowerrc``` file in your users home directory.


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
				version: '1.0.0', // optional, defaults to "1.0.0"
				base: '[path/url to your scripts]', // optional, defaults to "/"
				pattern: {
					'/qoopido': '[path/url to Qoopido.js]'
				}
			});
	}
	
	provide(definition);
}(this, demand, provide));
```

Once demand.js is loaded anything that is either explicitly requested via ```demand``` or as a dependency of a ```provide``` call will be loaded via XHR as well as modified and injected into the DOM with the help of a handler. The result will be cached in ```localStorage``` and will get validated against the version number set via ```configure```.

As you might have guessed already ```main``` itself is also loaded as a module and therefore will get cached in localStorage.

```demand``` comes with handlers for JavaScript and CSS. Handlers have three objectives:

- provide a file extension/suffix to be added the the url
- provide a function named ```resolve``` that handles DOM injection and final resolution of a module via an anonymous ```provide``` call
- provide an optional function named ```modify``` that handles eventually necessary conversion of the loaded source (e.g. CSS paths that are normally relative to the CSS-file path)

Handlers can, quite similar to require.js, be explicitly set for a certain module by prefixing the module path by ```[mimetype]!```. The default handler, e.g., is ```application/javascript``` which will automatically be used when no other handler is set.

You can also set your own handlers easily:

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

Just keep in mind that ```[File extension]``` has to include a leading ```.``` to be able to stay flexible and that ```resolve``` contains an anonymous ```provide``` call that resolves the queued loader. In case you need a ```modify``` function make sure it returns the modified ```value```.


### Demanding modules
After your project is set up accordingly you can load further modules like this

```javascript
demand('app/test', '/qoopido/component/iterator')
	.then(
		function(appTest, qoopidoComponentIterator) {
			console.log('=> success', appTest, qoopidoComponentIterator);

			new qoopidoComponentIterator();
		},
		function(error) {
			console.log('=> error', error);
		}
	);
```

Module paths not starting with a ```/``` will be resolved relative to the path of an eventual parent module. The resulting path will afterwards get matched to patterns defined via ```demand.configure``` which will finally lead to an absolute URL to fetch the module from.


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
- definition/factory of the module

When dynamically loading modules ```path``` will has to be omitted and get internally resolved via loading queue handling instead.

Module resolution via ```provide``` is internally defered via a setTimeout call to be able to return an object providing a ```when``` function to request dependencies. Although this might technically not be the cleanest solution it feels much better to write and understand. Beside that, it simply works great :)


### Providing loadable modules
Demand will dynamically load any modules that are not already registered. You just learnt how to provide inline modules which is only slightly different from building an external, loadable module. In addition to inline modules you just need some boilerplate code and an anynymous ```provide``` call without the ```path``` argument like in the following example:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {
		return function appTest() {

		}
	}

	provide(definition).when('/qoopido/base');
}());
```

This example shows the module ```/app/test``` which we already know as the first dependency of the prior example. As with the inline module the ```definition``` factory will receive all dependencies as arguments passed so they are in scope of the actual module.


### Extending modules
Beside simply providing means to demand and provide modules Qoopido.js also offers an easy, nice and flexible, prototype based inheritance/extension mechanism for you to use. This is especially of great use if you, like myself, prefer small modular/atomic modules that are easily combinable over big, unmaintainable monolitic scripts.

Extension is absolutely dead simple. Let us rewrite the prior example making the module ```/app/test``` extend the ```base``` module of Qoopido.js:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {

		function appTest() {

		}
		
		return qoopidoBase.extend(appTest);
	}

	provide(definition).when('/qoopido/base');
}());
```

Our ```appTest``` module just inherited from ```base``` which will only add an ```extend``` method to it so it may itself be extended by further modules. Note that it is also possible to prohibit further extension by setting a ```final``` property on the module itself before calling ```extend```:

```javascript
;(function() {
	'use strict';

	function definition(qoopidoBase) {

		function appTest() {

		}
		
		appTest.final = true;
		
		return qoopidoBase.extend(appTest);
	}

	provide(definition).when('/qoopido/base');
}());
```

Adding a ```final``` will prohibit ```base``` to add an extend method to the module. In case of this example this does not make any sense but might be necessary in more complex real world scenarios.

If you want some more examples simply look into the ```src``` directory of this repository. At the moment the best example for multiple extension/inheritance is the ```component/iterator``` module.

The extension mechanism works in a way that ensures that native JavaScript ```instanceof``` will work and stay fully intact which is a big improvement over earlier versions of Qoopido.js. Beside that new instances will now be created via the native JavaScript ```new``` keyword instead of having to call a. explicit ```create``` method manually.


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

