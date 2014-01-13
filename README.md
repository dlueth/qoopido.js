Qoopido.js
==========

Qoopido.js is a concept for a modularly built and loadable JavaScript library. Due to its flexible structure and the extension/interitance pattern it is based on it is easily extendable. So it is both, a library of existing modules as well as an extendable base for your very own modules. Every module included supports being loaded via require.js as an AMD module or manually including it (and its dependencies) via script tags.



Compatibility
---------------------------
Qoopido.js is not meant to support older legacy Internet Explorers but should run (with limitations regarding some of the modules) from IE8 onwards. I test on Chrome, Firefox, Safari for OSX, Safari for iOS and Android as well as IE8 and IE9.



External dependencies
---------------------------
The library itself does not depend on jQuery but some modules (everything within the jquery folder) are either jQuery specific or provide an abstraction for Qoopido.js modules to function as jQuery plugins.

To deal with the special challenges of asynchronous tasks some modules (e.g. support, transport, worker) of Qoopido.js make use of promises/deferreds. To stay standards conform and open Qoopido.js relies on Q.js a standards based implementation of JavaScript promises.

By the time of this writing only one module (shrinkimage) requires support for JSON.parse. JSON should be built-in on all newer Browsers but lacks support in older legacy browsers. For this purpose I greatly recommend JSON2 specifically (JSON3 does not seem to work reliably yet).



Installation
---------------------------
There currently are three ways to get Qoopido.js included into your project:

### Manual
Download the current version from the following URLGitHub and put all the contents of the directory dist/latest/src and/or dist/latest/min into a directory under your project root.

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

If you have Node, NPM and bower installed typing "bower install" will install eventually required external dependencies into the location you specified in the ***.bowerrc*** file in your users home directory.



Using the library
---------------------------
Although the library is technically capable of being manually included the prefered way definately is to load it via an AMD loader like require.js. After downloading and placing it in a sane place put the following code snippet into your HTML code to get require.js up & running:

```html
<script type="text/javascript" data-main="./app/main" src="./vendor/require.js/require.min.js"></script>
```

Next create the file ***./app/main.js*** (from the ***data-main*** attribute above), copy & paste the following code snippet and adjust paths and dependencies according to your specific needs and habits:

```javascript
require.config({
	baseUrl: 'app/',
	paths: {
		qoopido: '../vendor/qoopido.js/dist/latest/min',
		q:       '../vendor/q.js/q.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require([ 'qoopido/worker' ], function(mWorker) {
		// put your code here, e.g.
		var worker = mWorker.create();

		worker.execute(function() {
				var result;
				// do something time-consuming here

				return result;
			})
			.then(
				function(result) {
					// success
				},
				function() {
					// error
				}
			);
	});
});
```

This code will set some basic configuration for require.js, load Qoopido.js ***base*** module which is required for the ***worker*** module that finally gets invoked and processes a time-consuming task in the background without blocking the browsers UI.



Extending the library
---------------------------
Put the following code snippet into your HTML code to get require.js up & running - remember to adjust any paths accordingly:
```html
<script type="text/javascript" data-main="./app/main" src="./vendor/require.js/require.min.js"></script>
```

Like in the example above create the file ***./app/main.js*** and copy & paste the following code:

```javascript
require.config({
	baseUrl: 'app/',
	paths: {
		qoopido: '../vendor/qoopido.js/dist/latest/min',
		q:       '../vendor/q.js/q.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require('mymodule', function(mymodule) {
		// put your code here, e.g.
		var instance = mymodule.create();
	});
});
```

This code will set some basic configuration for require.js, load Qoopido.js ***base*** module which is required for your custom module to be loaded and processed afterwards.

Next create your module file ***app/mymodule.js*** and add the code below:

```javascript
;(function(definition) {
	window.qoopido.register('mymodule', definition, [ 'qoopido/emitter' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	// add private, static(!) properties and variables here
	// add private, static(!) methods here
	// add private methods here (use call/apply for invocation)

	var prototype = modules['emitter'].extend({
		// add pulic properties here
		_constructor: function() {
			var self = this;

			// optionally call parent constructor
			prototype._parent._constructor.call(self);
		},
		// add public methods here
		publicMethod: function() {
			console.log('public method called');

			return true;
		}
	});

	return prototype;
}));
```

You just developed your first custom module with only one public method, ***publicMethod***. By defining ***qoopido/emitter*** as a dependency and extending ***modules['emitter']*** your custom module also inherited all of its original methods.

So let us see what happens when you actually call your public method (console openened) by changing your ***./app/main.js*** to:

```javascript
require.config({
	baseUrl: 'app/',
	paths: {
		qoopido: '../vendor/qoopido.js/dist/latest/min',
		q:       '../vendor/q.js/q.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require('mymodule', function(mymodule) {
		var instance = mymodule.create();

		instance.publicMethod();
	});
});
```

OK, so far so good: The module just output the string

```text
public method called
```

to your console, correct? Anything more to it, you ask? Sure! Alter your ***./app/main.js*** again to contain the following code:

```javascript
require.config({
	baseUrl: 'app/',
	paths: {
		qoopido: '../vendor/qoopido.js/dist/latest/min',
		q:       '../vendor/q.js/q.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require('mymodule', function(mymodule) {
		var instance = mymodule.create()
        		.on('prePublicMethod', function(event, originalArguments) {
        			console.log(arguments);
        		})
        		.on('postPublicMethod', function(event, originalArguments, result) {
        			console.log(arguments);
        		});

		instance.publicMethod('argument 1', 'argument 2');
	});
});
```

If you run this it should output something like

```text
["prePublicMethod", Array[2]]
public method called
["postPublicMethod", Array[2], true]
```

to your console. But what exactly happened?

Remember that your module extends ***emitter*** which provides facilities to emit events and register to them. The ***emitter*** module has its own ***_constructor*** which, if invoked like you did, maps all the original methods of the extending module to emit ***pre*** and ***post*** events automatically. Private methods (prefixed with an underscore), methods of the ***emitter*** or ***base*** modules itself as well as any method prefixed with the word ***get*** will not get mapped.

What we did here was to register listeners to these automatically emitted events. You can easily emit your own custom events by changing your ***app/mymodule.js*** to something like:

```javascript
;(function(definition) {
	window.qoopido.register(mymodule, definition, [ 'qoopido/emitter' ]);
}(function(modules, shared, namespace, navigator, window, document, undefined) {
	'use strict';

	var prototype = modules['emitter'].extend({
		_constructor: function() {
			var self = this;

			prototype._parent._constructor.call(self);
		},
		_privateMethod: function() {
			this.emit('privateMethod', 'argument 1', 'argument 2');
		},
		publicMethod: function() {
			this._privateMethod();
		}
	});

	return prototype;
}));
```

And afterwards register listeners in your ***./app/main.js*** like in the following example:

```javascript
require.config({
	baseUrl: 'app/',
	paths: {
		qoopido: '../vendor/qoopido.js/dist/latest/min',
		q:       '../vendor/q.js/q.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require('mymodule', function(mymodule) {
		var instance = mymodule.create()
			.on('privateMethod', function() {
				console.log(arguments);
			});

		instance.publicMethod();
	});
});
```

Although this example does absolutely not present a practical use case nor anything you would come across in real code it should output something like to your console:

```text
["privateMethod", "argument 1", "argument 2"]
```



Included modules
---------------------------
- (object inheritance)
- (event emitter)
- proxy (universal proxy method)
- url (handle URLs, parameter etc.)
- component
	- remux (REM based aproach to responsive web design)
	- pager (flexible and UI/UX independent data pager)
- dom
	- (DOM element extension)
		- emerge (react on elements entering or nearing the visible browser area)
		- lazyimage (load images when entering or nearing the visible browser area)
		- shrinkimage (load ".shrunk" files from server, alpha PNGs reduced by 60-80% in filesize)
- function (provides single functions, e.g. helper)
   	- merge (function to deep merge objects)
   	- proximity (calculate px distance between two positions)
   	- unique (generate unique identifiers)
   		- string (generate unique strings, e.g. for callbacks)
   		- uuid (generate unique ids)
- jquery
	- extension
		- selector
	- function
		- prefetch
	- plugin
		- emerge
		- lazyimage
		- shrinkimage
- particle (still very basic)
- polyfill
	- document
		- getelementsbyclassname
		- queryselector
		- queryselectorall
	- element
		- matches/matchesSelector
	- object
		- create
		- defineproperties
		- defineproperty
		- getoqnpropertynames
		- keys
	- string
		- trim
		- ucfirst
	- window
		- getcomputedstyle
- pool (pooling facilities and pool factory)
	- array (pooling facilities for arrays)
	- dom (pooling facilities for DOM elements)
	- module (pooling facilities for Qoopido.js modules or external objects/classes)
	- object (pooling facilities for objects)
- renderer (centralized rendering pipeline)
- support (base for feature detection)
	- capability
		- datauri
	- css
		- borderradius
		- boxshadow
		- rem
		- rgba
		- textshadow
		- transform
			- 2d
			- 3d
		- transition
	- element
		- canvas
			- todataurl
				- jpeg
				- png
				- webp
		- svg
		- video
			- mp4
			- ogg
			- webm
- transport (base class for all transports)
	- jsonp (JSONP transport)
	- xhr (AJAX transport)
- vector
	- 2d
- worker (flexible web worker implementation)