# Qoopido.js
This is an alpha preview of the upcoming release of Qoopido.js 4.0.0. It is mainly provided for testing and feedback reasons and things will most likely be subject to change.

Qoopido.js is a highly modular and flexible JavaScript library providing inheritance/extension mechanisms to encourage writing re-usable code. Because of its modular nature it comes with its own Promise based loader as well.

There will always be some demo code in the ```demo``` directory of this repository which you can directly view via [rawgit](https://rawgit.com/dlueth/qoopido.js/release/4.0.0/demo/debug.html).


## Compatibility
---------------------------
Qoopido.js does not officially isupport older legacy Internet Explorers (< IE9) but might still work with a lot of polyfills.

In this early alpha the loader (called ```demand``` and its counterpart ```provide```) require your browser to provide native ```Promise``` support or a polyfill.


## External dependencies
---------------------------
None, beside polyfills eventually(!!!)


## Installation
---------------------------
There currently are four ways to get Qoopido.js included into your project:

### CDN
Qoopido.js will continue to be pushed to jsdelivr and CDNJS. I personally recommend jsdelivr.

### Manual
Download the current version from the following URL and put all the contents of the directory ```dist/latest/src``` and/or ```dist/latest/min``` into a directory under your project root.

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
---------------------------
In contrast to earlier versions Qoopido.js does come with its own loader. The loader consists of two components ```demand``` and ```provide``` just like require.js ```require``` and ```define```. Use the following code snippet in a standalone script tag before the clsoing body tag to include demand:

```javascript
(function(url, window, document, type, name, script, target, pointer) {
	script  = document.createElement(type = 'script');
	target  = document.getElementsByTagName(type)[0];

	pointer = window[name] = function(path) {
		pointer.main = path;
	};

	pointer.configure = function(settings) {
		pointer.settings = settings;
	};

	script.async = script.defer = 1;
	script.src   = url;

	target.parentNode.insertBefore(script, target);
}('[path/url to demand.js]', window, document, 'script', 'demand'));

demand('main.js');
```

The above snippet is very similar to how Google Analytics is loaded. As you can see you can directly call ```demand``` to set the main JavaScript file as well as ```demand.configure``` to set basic configuration options (more on that later).

The demanded ```main.js``` might look like the following example:

```javascript
;(function() {
	'use strict';

	demand
		.configure({
			base: '[path/url to your scripts]',
			pattern: {
				'/qoopido': '[path/url to Qoopidpo.js]'
			}
		});
}());
```

At the moment ```main.js``` will not be loaded via ```demand``` but it will be added to the DOM as a normal script tag with its async and defer attributes set to true.

Once demand.js is loaded anything that is either explicitly requested via ```demand``` or as a dependency of a ```provide``` call will be loaded via XHR and injected into the DOM with the help of a handler.

```demand``` comes with a handler for JavaScript and another handler for CSS is in the works. Handlers have two jobs:

- provide a filename extension/suffix to be added the the url
- provide a callback that handles DOM injection and final resolution of a module via an anonymous ```provide``` call

Handlers can, quite similar to require.js, be explicitly set for a certain module by prefixing the module path by ```[mimetype]!```. The default handler, e.g., is ```application/javascript``` which will automatically be used when no other handler is set.

After your project is set up accordingly you can load further modules like this

```javascript
demand('app/test', '/qoopido/component/iterator')
	.then(
		function(appTest, qoopidoComponentIterator) {
			console.log('=> success', appTest, qoopidoComponentIterator);

			new qoopidoComponentIterator();
		},
		function() {
			console.log('=> error');
		}
	);
```

Module paths not starting with a ```/``` will be resolved relative to  the path of an eventual parent module. The resulting path will afterwards get matched to patterns defined via ```demand.configure``` which will finally lead to an absolute URL to fetch the module from.

Beside demanding other modules you can as well provide your own, just like in the following example:

```javascript
function definition(appTest, qoopidoBase) {
	return function appMain() {

	}
}

provide('/app/main', definition, 'test', '/qoopido/base');
```

This is an example for an inline module. The ```provide``` call, in this case, consists of three parts:

- first argument: path of the module
- second argument: definition of the module
- further arguments: dependencies

So the most simple inline ```provide``` call possible has two arguments: path and definition.

```provide``` can and will also be called anonymously in case of a dynamically loaded module. This is purely reserved for modules being loaded due to the queue used to resolve such modules.

**Sidenote**
> I think about changing the current ```provide``` syntax to feel a bit more like the promise like ```demand``` syntax (read: demand is not a real promise, although native promises are used internally) introducing a ```when``` method. I am not exactly sure yet on how and if this will be possible to achieve.


## Extending modules
---------------------------
Will be written within the next couple of days. See the modules already provided to get a rough idea for the time being :)

## Included modules
---------------------------
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

