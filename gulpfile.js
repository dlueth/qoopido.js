var gulp    = require('gulp'),
	util    = require('gulp-util'),
	tasks   = require('gulp-load-tasks')(),
	package = require('./package.json'),
	files   = {},
	date, banner;

files.watch     = [ './.jshintrc' ];
files.all       = './src/**/*.js';
files.bump      = [ './package.json', './bower.json' ];
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
	'./src/proxy.js',
	'./src/dom/element.js',
	'./src/function/merge.js',
	'./src/function/unique/uuid.js',
	'./src/dom/element/emerge.js'
]);
files.lazyimage = files.base.concat([
	'./src/proxy.js',
	'./src/dom/element.js',
	'./src/function/merge.js',
	'./src/function/unique/uuid.js',
	'./src/dom/element/emerge.js',
	'./src/dom/element/lazyimage.js'
]);

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

gulp.task('lint:dist', function() {
	gulp.src(files.all)
		.pipe(tasks.jshint('./.jshintrc'))
		.pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('lint:base', function() {
	gulp.src(files.base)
		//.pipe(tasks.jshint('./.jshintrc'))
		.pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('lint:remux', function() {
	gulp.src(files.remux)
		//.pipe(tasks.jshint('./.jshintrc'))
		.pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('lint:emerge', function() {
	gulp.src(files.emerge)
		//.pipe(tasks.jshint('./.jshintrc'))
		.pipe(tasks.jshint.reporter('jshint-stylish'));
});

gulp.task('lint:lazyimage', function() {
	gulp.src(files.lazyimage)
		//.pipe(tasks.jshint('./.jshintrc'))
		.pipe(tasks.jshint.reporter('jshint-stylish'));
});

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
		.pipe(tasks.concat('qoopido.base.js'))
		.pipe(tasks.header(banner.src))
		.pipe(gulp.dest('./packages/' + package.version + '/src/'))
		.pipe(tasks.uglify())
		.pipe(tasks.header(banner.min))
		.pipe(gulp.dest('./packages/' + package.version + '/min/'));
});

gulp.task('build:remux', function() {
	gulp.src(files.remux)
		.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
		.pipe(tasks.concat('qoopido.remux.js'))
		.pipe(tasks.header(banner.src))
		.pipe(gulp.dest('./packages/' + package.version + '/src/'))
		.pipe(tasks.uglify())
		.pipe(tasks.header(banner.min))
		.pipe(gulp.dest('./packages/' + package.version + '/min/'));
});

gulp.task('build:emerge', function() {
	gulp.src(files.emerge)
		.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
		.pipe(tasks.concat('qoopido.emerge.js'))
		.pipe(tasks.header(banner.src))
		.pipe(gulp.dest('./packages/' + package.version + '/src/'))
		.pipe(tasks.uglify())
		.pipe(tasks.header(banner.min))
		.pipe(gulp.dest('./packages/' + package.version + '/min/'));
});

gulp.task('build:lazyimage', function() {
	gulp.src(files.lazyimage)
		.pipe(tasks.uglify({ mangle: false, compress: false, output: { beautify: true, comments: false } }))
		.pipe(tasks.concat('qoopido.lazyimage.js'))
		.pipe(tasks.header(banner.src))
		.pipe(gulp.dest('./packages/' + package.version + '/src/'))
		.pipe(tasks.uglify())
		.pipe(tasks.header(banner.min))
		.pipe(gulp.dest('./packages/' + package.version + '/min/'));
});

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
	gulp.run('lint:remux', 'build:emerge');
});

gulp.task('lazyimage', function(){
	util.log('@' + getDatetime());
	util.log('--------------------------------');
	gulp.run('lint:remux', 'build:lazyimage');
});

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

	gulp.watch(files.watch.concat(files.emerge), function() {
		initialize();

		util.log('--------------------------------');
		gulp.run('emerge');
		util.log('--------------------------------');
	});

	gulp.watch(files.watch.concat(files.lazyimage), function() {
		initialize();

		util.log('--------------------------------');
		gulp.run('lazyimage');
		util.log('--------------------------------');
	});
});