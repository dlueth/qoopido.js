Qoopido.js
==========

Qoopido.js is a concept for a modularly built and loadable JavaScript library. Due to its modular structure and the extension/interitance pattern it is based on it is easily extendable as well. Every module supports being loaded via require.js as an AMD module beside including it (and its dependencies) via script tags.

The idea to build Qoopido.js was born when developing jQuery plugins. Trying to find the best possible plugin skeleton/boilerplate started to show that jQuery has, albeit being a really exceptional library, its limitations. Especially when dealing with more and more complex plugins. Complex, in this case, mainly stands for stateful and programmatically independent via a public API that supports or encourages the use of Vanilla JS.

If you really need to compare Qoopido.js to something: It is a mixture of jQuery, modernizr and standalone JavaScript modules providing more complex functionality together building a highly modular, flexible and extendable foundation.

External dependencies
---------------------------
The library itself does not depend on jQuery but some modules (everything under the jquery folder) are either jQuery specific or provide an abstraction for Qoopido.js modules to function as jQuery plugins in addition.

To deal with the special challenges of asynchronous tasks some modules (support, transport, worker) of Qoopido.js make use of promises/deferreds. To stay standards conform and open Qoopido.js relies on Q.js a standards based implementation of promises.

By the time of this writing only one module (shrinkimage) requires support for JSON.parse. JSON should be built-in on all newer Browsers but lacks support in older legacy browsers. For this purpose I greatly recommend JSON2 specifically.

Currently contains
---------------------------
- [base](#base) (object inheritance)
- [emitter](#emitter) (event emitter)
- unique (generate UUIDs and unique strings)
- url (handle URLs, parameter etc.)
- [element](#element) (DOM element extension)
	- emerge (react on elements entering or nearing the visible browser area)
	- lazyimage (load images when entering or nearing the visible browser area)
	- shrinkimage (load ".shrunk" files from server, alpha PNGs reduced by 60-80% in filesize)
- pool (pooling facilities and pool factory)
	- array (pooling facilities for arrays)
	- dom (pooling facilities for DOM elements)
	- object (pooling facilities for objects)
- function (provides single functions, e.g. helper)
   	- merge (function to deep merge objects)
   	- proximity (calculate px distance between two positions)
- component
	- remux (REM based aproach to responsive web design)
	- pager (flexible and UI/UX independent data pager)
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
	- element
		- canvas
			- todataurl
				- jpeg
				- png
				- webp
		- svg
- transport (base class for all transports)
	- jsonp (JSONP transport)
	- xhr (AJAX transport)
- worker (flexible web worker implementation)
	- task
- jquery
	- extension
		- selector
	- function
		- prefetch
	- plugin
		- emerge
		- lazyimage

Installation
---------------------------
There currently are two ways to get Qoopido.js included into your project:

### Manual way
Just download the current version from GitHub and put all the contents of the directory dist/latest/min into a directory under your project.

### GitHub way
Clone the repository into your projects diretory structure and change into this directory. If you have Node, NPM and bower installed typing "bower install" will install eventually required external dependencies into a subdirectory named "vendor".


Implementation
---------------------------
For whichever installation way you choose you have another two options of how to actually include the modules:

### Manual way
Simply include any required modules and, in addition, eventually required external dependencies (jQuery, Q.js, JSON2) into your HTML.

### Require.js way
Alter your require config to include "qoopido" pointing towards the folder where you placed qoopido.js. Do not forget to add optional external dependencies like jQuery, Q.js or JSON2 to your config as wel.

Usage
---------------------------
### base
Most basic class that every(!) other class extends. It provides the object inheritance/extension mechanism of Qoopido.js and provides and manages the module factory. Every class that extends "base" inherits two methods

- extend (to extend that particular class)
- create (to get an instance of that class)

If "create" is called on a class both "extend" and "create" will get undefined to prohibit extension/creation of an already instanciated class.

Calling "create" will pass any arguments given to the class "_constructor" method.

---------------------------
### element
Provides DOM element abstraction, adds some commonly used functionality and extends and unifies processing of DOM events.

#### function getAttribute(string attribute)
> **Description:**
Retrieves an attribute from a DOM element. If "attribute" contains several, space delimited attributes it will return an object with the requested attributes as keys.

> **Returns:**
string | object

#### function getAtrributes(string|array attributes)
> **Description:**
Retrieves mutliple attributes from a DOM element. Will always return an object with the requested attributes as keys.

> **Returns:**
object

#### function setAttribute(string attribute, mixed value)
> **Description:**
Sets a single attribute on a DOM element.

> **Returns:**
instance

#### function setAttributes(object attributes)
> **Description:**
Sets multiple attributes on a DOM element.

> **Returns:**
instance

#### function removeAttribute(string attribute)
> **Description:**
Removes an attribute from a DOM element, If "attribute" contains several, space delimited attributes it will remove all of them.

> **Returns:**
instance

#### function removeAttributes(string|array attribute)
> **Description:**
Removes multiple attributes from a DOM element.

> **Returns:**
instance

#### function getStyle(string property)
> **Description:**
Retrieves a style property from a DOM element. If "property" contains several, space delimited properties it will return an object with the requested properties as keys.

> **Returns:**
string|object

#### function getStyles(string|array properties)
> **Description:**
Retrieves mutliple style properties from a DOM element. Will always return an object with the requested properties as keys.

> **Returns:**
object

#### function setStyle(string property, string value)
> **Description:**
Sets a single style property on a DOM element.

> **Returns:**
instance

#### function setStyles(object properties)
> **Description:**
Sets multiple style properties on a DOM element.

> **Returns:**
instance

#### function isVisible()
> **Description:**
Detects if the DOM element is visible or not.

> **Notice:**
Keep in mind, that "visible" in this case is not related to the CSS property "visibility" (which does not change the element's dimensions) but "display" (which does).

#### function emit(string event, mixed data)
> **Description:**
Calls all registered listeners for the given DOM event storing "data" in "event.data".

> **Returns:**
instance

#### function on(string events, function listener)
> **Description:**
Register a listener for a specified DOM event or a list of space separated events.

> **Returns:**
instance

#### function one(string events, function listener, bool each = true)
> **Description:**
Register a once only listener for a specified DOM event or a list of space separated events.

> **Notice:**
The parameter "each" defines if every listener may be called once (default, "true")  or if only one of all the listeners should be called once.

> **Returns:**
instance

#### function off(string events[, function listener])
> **Description:**
Unregister a listener for a specified DOM event or a list of space separated events.

> **Notice:**
If no listener is specified any listener for the given events will be removed.

> **Returns:**
instance

---------------------------
### emitter
Provides functions to emit events and or register listeners to events for a module. Whenever you need this kind of functions for a pure JavaScript module (for DOM elements use "element" instead). It offers the following methods:

#### function emit(string event)
> **Description:**
Calls all registered listeners for the given event.

> **Returns:**
instance

#### function on(string event, function listener)
> **Description:**
Register a listener for a specified event

> **Returns:**
instance

#### function one(string event, function listener)
> **Description:**
Register a once only listener for a specified event

> **Returns:**
instance

#### function off(string event[, function listener])
> **Description:**
Unregister a specific listener or all listeners from an event

> **Notice:**
If no listener is specified any listener for the given events will be removed.

> **Returns:**
instance