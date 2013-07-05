qoopido.js
==========

Collection of classes, functions and extensions for Javascript and jQuery.


Attention
---------------------------
REMux, my REM and JS based approach to responsive web design featured on CSS-Tricks, and everything related was moved to it's [own repository](https://github.com/dlueth/qoopido.remux) by popular demand.


Currently contains
---------------------------
- base (object inheritance)
- emitter (event emitter)
- unique (generate UUIDs and unique strings)
- url (handle URLs, parameter etc.)
- element (DOM element extension)
	- emerge (react on elements entering or nearing the visible browser area)
	- lazyimage (load images when entering or nearing the visible browser area)
	- shrinkimage (load ".shrunk" files from server, alpha PNGs reduced by 60-80% in filesize)
- function (provides single functions, e.g. helper)
   	- merge (function to deep merge objects)
   	- proximity (calculate px distance between two positions)
- module
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
- transport
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

General Usage
---------------------------
See source code for any options that may be passed. Any dependencies are mentioned in the top comment block as "@require".

### Base
This is the most basic class that every other class extends. It provides the object inheritance/extension mechanism of qoopido.js. Every class that extends "base" has two methods

 - extend (to extend that particular class)
 - create (to get an instance of that class)

 If "create" is called on a class both "extend" and "create" will be undefined to prohibit extension/creation of an already instanciated class.
