var gulp    = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	files   = {},
	package, date, banner;

module.exports = gulp;

/**************************************************
 * file configuration
 **************************************************/
	files.watch     = [ './.jshintrc' ];
	files.bump      = [ './package.json', './bower.json', './emerge.jquery.json', './lazyimage.jquery.json', './shrinkimage.jquery.json' ];
	files.all       = './src/**/*.js';
	files.base      = [
		'./src/polyfill/object/defineproperty.js',
		'./src/polyfill/object/defineproperties.js',
		'./src/polyfill/object/create.js',
		'./src/polyfill/object/getownpropertynames.js',
		'./src/polyfill/object/getownpropertydescriptor.js',
		'./src/base.js'
	];
	files.sense     = files.base.concat([
		'./src/polyfill/window/getcomputedstyle.js',
		'./src/polyfill/window/matchmedia.js',
		'./src/emitter.js',
		'./src/component/sense.js'
	]);
	files.remux     = files.sense.concat([
		'./src/component/remux.js'
	]);
	files.emerge    = files.base.concat([
		'./src/polyfill/window/getcomputedstyle.js',
		'./src/function/merge.js',
		'./src/function/unique/uuid.js',
		'./src/dom/element.js',
		'./src/dom/element/emerge.js'
	]);
	files.lazyimage = files.emerge.concat([
		'./src/dom/element/lazyimage.js'
	]);
	files.shrinkimage = files.base.concat([
		'./src/polyfill/string/ucfirst.js',
		'./src/polyfill/window/getcomputedstyle.js',
		'./src/polyfill/window/promise.js',
		'./src/function/merge.js',
		'./src/function/unique/string.js',
		'./src/function/unique/uuid.js',
		'./src/proxy.js',
		'./src/dom/element.js',
		'./src/url.js',
		'./src/promise/all.js',
		'./src/promise/defer.js',
		'./src/support.js',
		'./src/support/capability/datauri.js',
		'./src/support/element/canvas.js',
		'./src/support/element/canvas/todataurl.js',
		'./src/support/element/canvas/todataurl/png.js',
		'./src/transport.js',
		'./src/transport/xhr.js',
		'./src/dom/element/shrinkimage.js'
	]);
	files.jquery = {
		emerge: files.emerge.concat([
			'./src/jquery/plugin/emerge.js'
		]),
		lazyimage: files.lazyimage.concat([
			'./src/jquery/plugin/lazyimage.js'
		]),
		shrinkimage: files.shrinkimage.concat([
			'./src/jquery/plugin/shrinkimage.js'
		])
	}

/**************************************************
 * helper & initialization
 **************************************************/
	function getDate() {
		return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
	}

	function initialize() {
		delete require.cache[require.resolve('./package.json')];

		package = require('./package.json');
		date    = new Date();

		banner  = {
			src: [
				'/*!',
				'* ' + package.title,
				'*',
				'* version: ' + package.version,
				'* date:    ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
				'* author:  ' + package.author.name + ' <' + package.author.email + '>',
				'* website: ' + package.homepage,
				'*',
				'* Copyright (c) ' + date.getFullYear() + ' ' + package.author.name,
				'*',
				'* Dual licensed under the MIT and GPL licenses.',
				'* - http://www.opensource.org/licenses/mit-license.php',
				'* - http://www.gnu.org/copyleft/gpl.html',
				'*/',
				''
			].join('\n'),
			min: [
				'/*!',
				'* ' + package.title + ' v' + package.version + ', ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
				'* ' + package.homepage,
				'* (c) ' + date.getFullYear() + ' ' + package.author.name,
				'* Dual licensed under MIT and GPL',
				'*/',
				''
			].join('\n')
		}
	};

	function onError(err) {
		console.log(err);
	};

/**************************************************
 * bump version
 **************************************************/
	gulp.task('bump:patch', function(){
		gulp.src(files.bump)
			.pipe(plugins.bump({type:'patch'}))
			.pipe(gulp.dest('./'));
	});
	
	gulp.task('bump:minor', function(){
		gulp.src(files.bump)
			.pipe(plugins.bump({type:'minor'}))
			.pipe(gulp.dest('./'));
	});
	
	gulp.task('bump:major', function(){
		gulp.src(files.bump)
			.pipe(plugins.bump({type:'major'}))
			.pipe(gulp.dest('./'));
	});

/**************************************************
 * lint with jshint
 **************************************************/
	gulp.task('lint:dist', function() {
		gulp.src(files.all)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:base', function() {
		gulp.src(files.base)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:sense', function() {
		gulp.src(files.sense)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:remux', function() {
		gulp.src(files.remux)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:emerge', function() {
		gulp.src(files.jquery.emerge)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:lazyimage', function() {
		gulp.src(files.jquery.lazyimage)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:shrinkimage', function() {
		gulp.src(files.jquery.shrinkimage)
			.pipe(plugins.jshint('./.jshintrc'))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

/**************************************************
 * build tasks (internal)
 **************************************************/
	gulp.task('build:dist', function() {
		initialize();
		
		gulp.src(files.all)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./dist/' + package.version + '/src/'))
			.pipe(gulp.dest('./dist/latest/src/'))
			.pipe(plugins.uglify())
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./dist/' + package.version + '/min/'))
			.pipe(gulp.dest('./dist/latest/min/'));
	});

	gulp.task('build:base', function() {
		initialize();
		
		gulp.src(files.base)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.base.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.base.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:sense', function() {
		initialize();

		gulp.src(files.remux)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.sense.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.sense.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:remux', function() {
		initialize();
		
		gulp.src(files.remux)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.remux.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.remux.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:emerge', function() {
		initialize();
		
		gulp.src(files.emerge)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.emerge.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.emerge.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:lazyimage', function() {
		initialize();
		
		gulp.src(files.lazyimage)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.lazyimage.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.lazyimage.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:shrinkimage', function() {
		initialize();
		
		gulp.src(files.shrinkimage)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.shrinkimage.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.shrinkimage.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:emerge', function() {
		initialize();
		
		gulp.src(files.jquery.emerge)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.emerge.jquery.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.emerge.jquery.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.emerge.jquery.' + package.version + '.js', './packages/qoopido.emerge.jquery.' + package.version + '.min.js' ])
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.zip('qoopido.emerge.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:lazyimage', function() {
		initialize();
		
		gulp.src(files.jquery.lazyimage)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.lazyimage.jquery.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.lazyimage.jquery.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.lazyimage.jquery.' + package.version + '.js', './packages/qoopido.lazyimage.jquery.' + package.version + '.min.js' ])
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.zip('qoopido.lazyimage.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:shrinkimage', function() {
		initialize();
		
		gulp.src(files.jquery.shrinkimage)
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(plugins.concat('qoopido.shrinkimage.jquery.' + package.version + '.js'))
			.pipe(plugins.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename('qoopido.shrinkimage.jquery.' + package.version + '.min.js'))
			.pipe(plugins.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.shrinkimage.jquery.' + package.version + '.js', './packages/qoopido.shrinkimage.jquery.' + package.version + '.min.js' ])
			.pipe(plugins.plumber({ errorHandler: onError}))
			.pipe(plugins.zip('qoopido.shrinkimage.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

/**************************************************
 * tasks (public)
 **************************************************/
	gulp.task('watch', function() {
		gulp.watch(files.watch.concat(files.all), [ 'lint:dist', 'build:dist' ]);
		gulp.watch(files.watch.concat(files.base), [ 'lint:base', 'build:base' ]);
		gulp.watch(files.watch.concat(files.sense), [ 'lint:sense', 'build:sense' ]);
		gulp.watch(files.watch.concat(files.remux), [ 'lint:remux', 'build:remux' ]);
		gulp.watch(files.watch.concat(files.jquery.emerge), [ 'lint:emerge', 'build:emerge', 'build:jquery:emerge' ]);
		gulp.watch(files.watch.concat(files.jquery.lazyimage), [ 'lint:lazyimage', 'build:lazyimage', 'build:jquery:lazyimage' ]);
		gulp.watch(files.watch.concat(files.jquery.shrinkimage), [ 'lint:shrinkimage', 'build:shrinkimage', 'build:jquery:shrinkimage' ]);
	});

	gulp.task('all', [ 'lint:dist', 'build:dist', 'build:base', 'build:sense', 'build:remux', 'build:emerge', 'build:jquery:emerge', 'build:lazyimage', 'build:jquery:lazyimage', 'build:shrinkimage', 'build:jquery:shrinkimage' ]);
	gulp.task('default', [ 'watch' ]);
