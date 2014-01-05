require.config({
	baseUrl: 'example/',
	paths: {
		qoopido: '//cdn.qoopido.com/portfolio/assets/vendor/qoopido.js/dist/latest/min',
		q:       '//cdn.qoopido.com/portfolio/assets/vendor/q.0.9.7.min'
	}
});

require([ 'qoopido/base' ], function() {
	'use strict';

	require([
		'qoopido/support',
		'qoopido/support/capability/datauri',
		'qoopido/support/css/borderradius',
		'qoopido/support/css/boxshadow',
		'qoopido/support/css/rem',
		'qoopido/support/css/rgba',
		'qoopido/support/css/textshadow',
		'qoopido/support/css/transform',
		'qoopido/support/css/transform/2d',
		'qoopido/support/css/transform/3d',
		'qoopido/support/element/canvas',
		'qoopido/support/element/canvas/todataurl',
		'qoopido/support/element/canvas/todataurl/jpeg',
		'qoopido/support/element/canvas/todataurl/png',
		'qoopido/support/element/canvas/todataurl/webp',
		'qoopido/support/element/video',
		'qoopido/support/element/video/mp4',
		'qoopido/support/element/video/ogg',
		'qoopido/support/element/video/webm',
		'qoopido/support/element/svg'
	], function(support) {
		document.getElementById('prefix-property').textContent = !support.supportsPrefix() ? 'none' : support.getPrefix().join(', ');
		document.getElementById('prefix-method-requestanimationframe').textContent = (support.supportsMethod('requestAnimationFrame') ? 'yes' : 'no') + ' (' + support.getMethod('requestAnimationFrame') + ')';
		document.getElementById('prefix-method-matchesselector').textContent = (support.supportsMethod('matchesSelector', document.createElement('div')) ? 'yes' : 'no') + ' (' + support.getMethod('matchesSelector', document.createElement('div')) + ')';
		document.getElementById('prefix-property-hidden').textContent = (support.supportsProperty('hidden', document) ? 'yes' : 'no') + ' (' + support.getProperty('hidden', document) + ')';
		document.getElementById('prefix-css-borderradius').textContent = (support.supportsCssProperty('borderRadius') ? 'yes' : 'no') + ' (' + support.getCssProperty('borderRadius').join(', ') + ')';
		document.getElementById('prefix-css-boxsizing').textContent = (support.supportsCssProperty('boxSizing') ? 'yes' : 'no') + ' (' + support.getCssProperty('boxSizing').join(', ') + ')';
		document.getElementById('prefix-css-animation').textContent = (support.supportsCssProperty('animation') ? 'yes' : 'no') + ' (' + support.getCssProperty('animation').join(', ') + ')';

		support.test['/capability/datauri']()
			.then(function() { document.getElementById('capability-datauri').textContent = 'yes' }, function() { document.getElementById('capability-datauri').textContent = 'no' });

		support.test['/css/borderradius']()
			.then(function() { document.getElementById('css-borderradius').textContent = 'yes' }, function() { document.getElementById('css-borderradius').textContent = 'no' });

		support.test['/css/boxshadow']()
			.then(function() { document.getElementById('css-boxshadow').textContent = 'yes' }, function() { document.getElementById('css-boxshadow').textContent = 'no' });

		support.test['/css/rem']()
			.then(function() { document.getElementById('css-rem').textContent = 'yes' }, function() { document.getElementById('css-rem').textContent = 'no' });

		support.test['/css/rgba']()
			.then(function() { document.getElementById('css-rgba').textContent = 'yes' }, function() { document.getElementById('css-rgba').textContent = 'no' });

		support.test['/css/textshadow']()
			.then(function() { document.getElementById('css-textshadow').textContent = 'yes' }, function() { document.getElementById('css-textshadow').textContent = 'no' });

		support.test['/css/transform']()
			.then(function() { document.getElementById('css-transform').textContent = 'yes' }, function() { document.getElementById('css-transform').textContent = 'no' });

		support.test['/css/transform/2d']()
			.then(function() { document.getElementById('css-transform-2d').textContent = 'yes' }, function() { document.getElementById('css-transform-2d').textContent = 'no' });

		support.test['/css/transform/3d']()
			.then(function() { document.getElementById('css-transform-3d').textContent = 'yes' }, function() { document.getElementById('css-transform-3d').textContent = 'no' });

		support.test['/element/canvas']()
			.then(function() { document.getElementById('element-canvas').textContent = 'yes' }, function() { document.getElementById('element-canvas').textContent = 'no' });

		support.test['/element/canvas/todataurl']()
			.then(function() { document.getElementById('element-canvas-todataurl').textContent = 'yes' }, function() { document.getElementById('element-canvas-todataurl').textContent = 'no' });

		support.test['/element/canvas/todataurl/jpeg']()
			.then(function() { document.getElementById('element-canvas-todataurl-jpeg').textContent = 'yes' }, function() { document.getElementById('element-canvas-todataurl-jpeg').textContent = 'no' });

		support.test['/element/canvas/todataurl/png']()
			.then(function() { document.getElementById('element-canvas-todataurl-png').textContent = 'yes' }, function() { document.getElementById('element-canvas-todataurl-png').textContent = 'no' });

		support.test['/element/canvas/todataurl/webp']()
			.then(function() { document.getElementById('element-canvas-todataurl-webp').textContent = 'yes' }, function() { document.getElementById('element-canvas-todataurl-webp').textContent = 'no' });

		support.test['/element/video']()
			.then(function() { document.getElementById('element-video').textContent = 'yes' }, function() { document.getElementById('element-video').textContent = 'no' });

		support.test['/element/video/mp4']()
			.then(function() { document.getElementById('element-video-mp4').textContent = 'yes' }, function() { document.getElementById('element-video-mp4').textContent = 'no' });

		support.test['/element/video/ogg']()
			.then(function() { document.getElementById('element-video-ogg').textContent = 'yes' }, function() { document.getElementById('element-video-ogg').textContent = 'no' });

		support.test['/element/video/webm']()
			.then(function() { document.getElementById('element-video-webm').textContent = 'yes' }, function() { document.getElementById('element-video-webm').textContent = 'no' });

		support.test['/element/svg']()
			.then(function() { document.getElementById('element-svg').textContent = 'yes' }, function() { document.getElementById('element-svg').textContent = 'no' });
	});
});