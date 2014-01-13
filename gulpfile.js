var gulp    = require('gulp'),
	util    = require('gulp-util'),
	tasks   = require('gulp-load-tasks')(),
	package = require('./package.json'),
	files   = {},
	date, banner;

/**************************************************
 * file configuration
 **************************************************/
	files.watch     = [ './.jshintrc' ];
	files.all       = './src/**/*.js';
	files.bump      = [ './package.json', './bower.json', './emerge.jquery.json', './lazyimage.jquery.json', './shrinkimage.jquery.json' ];
	files.base      = [
		'./src/polyfill/object/defineproperty.js',
		'./src/polyfill/object/defineproperties.js',
		'./src/polyfill/object/create.js',
		'./src/polyfill/object/getownpropertynames',
		'./src/polyfill/object/getownpropertydescriptor.js',
		'./src/base.js'
	];
	files.remux     = files.base.concat([
		'./src/emitter.js',
		'./src/component/remux.js'
	]);
	files.emerge    = files.base.concat([
		'./src/polyfill/window/getcomputedstyle.js',
		'./src/function/merge.js',
		'./src/function/unique/uuid.js',
		'./src/proxy.js',
		'./src/dom/element.js',
		'./src/dom/element/emerge.js'
	]);
	files.lazyimage = files.emerge.concat([
		'./src/dom/element/lazyimage.js'
	]);
	files.shrinkimage = files.base.concat([
		'./src/polyfill/string/ucfirst.js',
		'./src/polyfill/window/getcomputedstyle.js',
		'./src/function/merge.js',
		'./src/function/unique/string.js',
		'./src/function/unique/uuid.js',
		'./src/proxy.js',
		'./src/dom/element.js',
		'./src/url.js',
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

	function getDatetime() {
		return getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}

	function initialize() {
		date = new Date();

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
				'*/'
			].join('\n'),
			min: [
				'/*!',
				'* ' + package.title + ' v' + package.version + ', ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
				'* ' + package.homepage,
				'* (c) ' + date.getFullYear() + ' ' + package.author.name,
				'* Dual licensed under MIT and GPL',
				'*/'
			].join('\n')
		}
	};

	initialize();

/**************************************************
 * bump version
 **************************************************/
	gulp.task('bump:patch', function(){
		gulp.src(files.bump)
			.pipe(tasks.bump({type:'patch'}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('bump:minor', function(){
		gulp.src(files.bump)
			.pipe(tasks.bump({type:'minor'}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('bump:major', function(){
		gulp.src(files.bump)
			.pipe(tasks.bump({type:'major'}))
			.pipe(gulp.dest('./'));
	});

/**************************************************
 * lint with jshint
 **************************************************/
	gulp.task('lint:dist', function() {
		gulp.src(files.all)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:base', function() {
		gulp.src(files.base)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:remux', function() {
		gulp.src(files.remux)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:emerge', function() {
		gulp.src(files.jquery.emerge)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:lazyimage', function() {
		gulp.src(files.jquery.lazyimage)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

	gulp.task('lint:shrinkimage', function() {
		gulp.src(files.jquery.shrinkimage)
			.pipe(tasks.jshint('./.jshintrc'))
			.pipe(tasks.jshint.reporter('jshint-stylish'));
	});

/**************************************************
 * build tasks (internal)
 **************************************************/
	gulp.task('build:dist', function() {
		gulp.src(files.all)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./dist/' + package.version + '/src/'))
			.pipe(gulp.dest('./dist/latest/src/'))
			.pipe(tasks.uglify())
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./dist/' + package.version + '/min/'))
			.pipe(gulp.dest('./dist/latest/min/'));
	});

	gulp.task('build:base', function() {
		gulp.src(files.base)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.base.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.base.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:remux', function() {
		gulp.src(files.remux)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.remux.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.remux.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:emerge', function() {
		gulp.src(files.emerge)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.emerge.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.emerge.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:lazyimage', function() {
		gulp.src(files.lazyimage)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.lazyimage.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.lazyimage.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:shrinkimage', function() {
		gulp.src(files.shrinkimage)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.shrinkimage.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.shrinkimage.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:emerge', function() {
		gulp.src(files.jquery.emerge)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.emerge.jquery.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.emerge.jquery.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.emerge.jquery.' + package.version + '.js', './packages/qoopido.emerge.jquery.' + package.version + '.min.js' ])
			.pipe(tasks.zip('qoopido.emerge.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:lazyimage', function() {
		gulp.src(files.jquery.lazyimage)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.lazyimage.jquery.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.lazyimage.jquery.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.lazyimage.jquery.' + package.version + '.js', './packages/qoopido.lazyimage.jquery.' + package.version + '.min.js' ])
			.pipe(tasks.zip('qoopido.lazyimage.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

	gulp.task('build:jquery:shrinkimage', function() {
		gulp.src(files.jquery.shrinkimage)
			.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
			.pipe(tasks.concat('qoopido.shrinkimage.jquery.' + package.version + '.js'))
			.pipe(tasks.header(banner.src))
			.pipe(gulp.dest('./packages/'))
			.pipe(tasks.uglify())
			.pipe(tasks.rename('qoopido.shrinkimage.jquery.' + package.version + '.min.js'))
			.pipe(tasks.header(banner.min))
			.pipe(gulp.dest('./packages/'));

		gulp.src([ './packages/qoopido.shrinkimage.jquery.' + package.version + '.js', './packages/qoopido.shrinkimage.jquery.' + package.version + '.min.js' ])
			.pipe(tasks.zip('qoopido.shrinkimage.jquery.latest.zip'))
			.pipe(gulp.dest('./packages/'));
	});

/**************************************************
 * build tasks (public)
 **************************************************/
	gulp.task('default', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:dist', 'build:dist');
	});

	gulp.task('base', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:base', 'build:base');
	});

	gulp.task('remux', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:remux', 'build:remux');
	});

	gulp.task('emerge', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:remux', 'build:emerge', 'build:jquery:emerge');
	});

	gulp.task('lazyimage', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:remux', 'build:lazyimage', 'build:jquery:lazyimage');
	});

	gulp.task('shrinkimage', function(){
		util.log('@' + getDatetime());
		util.log('--------------------------------');
		gulp.run('lint:shrinkimage', 'build:shrinkimage', 'build:jquery:shrinkimage');
	});

	gulp.task('all', function(){
		initialize();

		util.log('--------------------------------');
		gulp.run('default');
		util.log('--------------------------------');

		initialize();

		util.log('--------------------------------');
		gulp.run('base');
		util.log('--------------------------------');

		initialize();

		util.log('--------------------------------');
		gulp.run('remux');
		util.log('--------------------------------');

		initialize();

		util.log('--------------------------------');
		gulp.run('emerge');
		util.log('--------------------------------');

		initialize();

		util.log('--------------------------------');
		gulp.run('lazyimage');
		util.log('--------------------------------');

		initialize();

		util.log('--------------------------------');
		gulp.run('shrinkimage');
		util.log('--------------------------------');
	});


/**************************************************
 * watch task
 **************************************************/
	gulp.task('watch', function(){
		gulp.watch(files.watch.concat(files.all), function(){
			initialize();

			util.log('--------------------------------');
			gulp.run('default');
			util.log('--------------------------------');
		});

		gulp.watch(files.watch.concat(files.base), function() {
			initialize();

			util.log('--------------------------------');
			gulp.run('base');
			util.log('--------------------------------');
		});

		gulp.watch(files.watch.concat(files.remux), function() {
			initialize();

			util.log('--------------------------------');
			gulp.run('remux');
			util.log('--------------------------------');
		});

		gulp.watch(files.watch.concat(files.jquery.emerge), function() {
			initialize();

			util.log('--------------------------------');
			gulp.run('emerge');
			util.log('--------------------------------');
		});

		gulp.watch(files.watch.concat(files.jquery.lazyimage), function() {
			initialize();

			util.log('--------------------------------');
			gulp.run('lazyimage');
			util.log('--------------------------------');
		});

		gulp.watch(files.watch.concat(files.jquery.shrinkimage), function() {
			initialize();

			util.log('--------------------------------');
			gulp.run('shrinkimage');
			util.log('--------------------------------');
		});
	});