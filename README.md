qoopido.js
==========

Collection of classes, functions and extensions for Javascript and jQuery.


Attention
---------------------------
REMux, my REM and JS based approach to responsive web design featured on CSS-Tricks, and everything related was moved to it's [own repository](https://github.com/dlueth/qoopido.remux) by popular demand.


Currently contains
---------------------------
- Base (object inheritance)
- Emitter (extendable event emitter)
- Pager (data/animation independent pager)
- Unique (random UUID and string generator)
- XHR (standalone AJAX abstraction, still under heavy development)
- Worker (flexible web worker implementation)
- Support (deferred/promise based modular feature detection) <sup>[1](#dependencies)</sup>
- Proximity (calculate distance of pixel coordinates)
- jQuery Extensions <sup>[2](#dependencies)</sup>
	- Selector
- jQuery Functions <sup>[2](#dependencies)</sup>
	- Prefetch


General Usage
---------------------------
See source code for any options that may be passed. Any dependencies are mentioned in the top comment block as "@require".


Dependencies
---------------------------
<sup>1</sup> Support and all its tests require q.js by Kris Kowal which can be found under https://github.com/kriskowal/q and comes with its own license

<sup>2</sup> jQuery extensions and functions require jQuery
