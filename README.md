qoopido.js
==========

Collection of classes, plugins, functions and extensions for Javascript and jQuery.

Currently contains
---------------------------
- Base (object inheritance)
- Emitter (extendable event emitter)
- Pager (data/animation independent pager)
- Remux (REM based responsive website concept)
- Unique (random UUID and string generator)
- Worker (flexible web worker implementation)
- Support (deferred/promise based modular feature detection)
- jQuery Extensions
	- Selector
- jQuery Functions
	- Prefetch
	- Proximity
- jQuery Plugins
	- [Emerge](#emerge-installation--usage)
	- [Lazyimage](#lazyimage-installation--usage)
	- [Shrinkimage](#shrinkimage-installation--usage) <sup>[1](#footnotes)</sup>


General Usage
---------------------------
See source code for any options that may be passed. Any dependencies are mentioned in the top comment block as "@require".


Emerge installation & usage
---------------------------
Download and extract the ZIP file of the emerge package from [here](https://github.com/dlueth/qoopido.js/blob/master/packages/qoopido.emerge.zip?raw=true) and put the contents somewhere onto your webspace.

Finally add jQuery and qoopido.emerge.min.js to your script block and you are all set.

Example Javascript:
```javascript
<script type="text/javascript">
;(function($, window, document, undefined) {
    'use strict';

    $(document).ready(function() {
        $('#footer img')
            .on('emerged.emerge', function(event) {
                // do something when the element emerges
            })
            .on('demerged.emerge', function(event) {
				// do something when the element demerges
			})
        .emerge({
        	interval:   20,     // default
        	threshold:  'auto', // default
        	recur:      true,   // default
        	auto:       0.5,    // default (meaning 0.5 * screen width/height threshold)
        	visibility: true    // default
		});
    });
})(jQuery, window, document);
</script>
```


Lazyimage installation & usage
---------------------------
Download and extract the ZIP file of the emerge package from [here](https://github.com/dlueth/qoopido.js/blob/master/packages/qoopido.lazyimage.zip?raw=true) and put the contents somewhere onto your webspace.

Finally add jQuery and qoopido.lazyimage.min.js to your script block and you are all set.

Example HTML:
```html
<img alt="" data-lazyimage="img/example.png" />
```

Corresponding Javascript:
```javascript
<script type="text/javascript">
;(function($, window, document, undefined) {
    'use strict';

    $(document).ready(function() {
        $('img[data-lazyimage],.lazyimage')
            .on('requested.lazyimage', function(event) {
                // do something when the image gets requested
            })
            .on('loaded.lazyimage', function(event) {
				// do something when the image was loaded
			})
        .lazyimage({
        	interval:   20,     // default
        	threshold:  'auto', // default
        	auto:       0.5,    // default (meaning 0.5 * screen width/height threshold)
        	visibility: true    // default
		});
    });
})(jQuery, window, document);
</script>
```


Shrinkimage installation & usage
---------------------------
Download and extract the ZIP file of the shrinkimage package from [here](https://github.com/dlueth/qoopido.js/blob/master/packages/qoopido.shrinkimage.zip?raw=true), put the enclosed shrinkimage.php into your projects root directory and add the lines from the included .htaccess to your projects .htaccess file. If you do not want to put the srinkimage.php into your projects root directory for any reason you will have to change the paths in the .htaccess (both rewrite rules) as well as in the shrinkimage.php (line 3) accordingly.

Finally add jQuery and qoopido.shrinkimage.min.js to your script block and you are all set.

Example HTML:
```html
<!-- Foreground image -->
<img alt="" data-shrinkimage="img/example.png" />

<!-- Background image -->
<div class="shrinkimage" style="background-image: url(data:image/shrink,img/example.png);"></div>

<!-- Foreground image with non default quality -->
<img alt="" data-shrinkimage="img/example.png?quality=75" />

<!-- Background image with non default quality -->
<div class="shrinkimage" style="background-image: url(data:image/shrink,img/example.png?quality=75);"></div>

<!-- Foreground image with non default storage location -->
<img alt="" data-shrinkimage="img/example.png?target=img/custom.shrunk" />
```

Corresponding Javascript:
```javascript
<script type="text/javascript">
;(function($, window, document, undefined) {
    'use strict';

    $(document).ready(function() {
        $('img[data-shrinkimage],.shrinkimage')
            .on('requested.shrinkimage', function(event, file) {
                // do something when shrinkimage requests the
                // shrunk image
            })
            .on('queued.shrinkimage', function(event, file) {
				// do something when shrinkimage queued a request
				// because the same resource is already requested
			})
			.on('cached.shrinkimage', function(event, file, compressedSize, originalSize) {
				// do something whenever shrinkimage adds a
				// shrunk version to its temporary cache
			})
            .on('loaded.shrinkimage', function(event, file, usedCache, usedFallback) {
                // do something when shrinkimage loaded/processed
                // the shrunk image (includes cache hits)
            })
        .shrinkimage({
			attribute: 'data-shrinkimage', // default
			debug:     false,              // default
			quality:   80                  // default
		});
    });
})(jQuery, window, document);
</script>
```

Footnotes
---------------------------
<sup>1</sup> Shrinkimage is based on an idea I published in a series of articles on headers-already-sent.com which can be found [here](http://headers-already-sent.com/artikel/shrinkimage-1/ "shrinkImage - A method to reduce the filesize of PNG-images with full alpha-channel by about 70-80%") and [here](http://headers-already-sent.com/artikel/shrinkimage-2/ "shrinkImage continued - jQuery plugin and automatic generation").
