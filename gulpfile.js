var gulp     = require('gulp'),
	chmod    = require('gulp-chmod'),
	util     = require('gulp-util'),
	plugins  = require('gulp-load-plugins')(),
	sequence = require('run-sequence'),
	del      = require('del'),
	config   = {},
	jshintConfig, package, config, patterns = [], key;

module.exports = gulp;

/**************************************************
 * helper
 **************************************************/
	function handleError (error) {
		util.log(error);
	}

	function loadPackageFile() {
		delete require.cache[require.resolve('./package.json')];

		package      = require('./package.json');
		jshintConfig = package.jshintConfig;
	}

	function loadConfigFile() {
		delete require.cache[require.resolve('./gulp/config.json')];

		config = replacePatterns(require('./gulp/config.json'));
	}

	function preparePatterns(node, prefix) {
		var key, id, item;

		node = node || package;

		for(key in node) {
			id   = (prefix) ? prefix + '.' + key : 'package.' + key;
			item = node[key];

			if(typeof item === 'string') {
				patterns.push({ pattern: new RegExp('{{gulp:' + id + '}}', 'g'), replacement: item });
			} else if(Object.prototype.toString.call(item) === '[object Object]') {
				preparePatterns(item, id);
			}
		}
	}

	function replacePatterns(value) {
		var i = 0, entry;

		value = JSON.stringify(value);

		for(; (entry = patterns[i]) !== undefined; i++) {
			value = value.replace(entry.pattern, entry.replacement);
		}

		return JSON.parse(value);
	}

	function getDatePatterns() {
		var date  = new Date(),
			month = ''.concat('0', (date.getMonth() + 1).toString()).slice(-2),
			day   = ''.concat('0', date.getDate().toString()).slice(-2),
			time  = ''.concat('0', date.getHours().toString()).slice(-2) + ':' + ''.concat('0', date.getMinutes().toString()).slice(-2) + ':' + ''.concat('0', date.getSeconds().toString()).slice(-2);

		return [
			{ pattern: new RegExp('{{gulp:date.year}}', 'g'), replacement: date.getFullYear() },
			{ pattern: new RegExp('{{gulp:date.month}}', 'g'), replacement: month },
			{ pattern: new RegExp('{{gulp:date.day}}', 'g'), replacement: day },
			{ pattern: new RegExp('{{gulp:date.time}}', 'g'), replacement: time }
		];
	}

	function registerPackageBuildTasks(name) {
		var pointer = config.tasks.packages[name];

		gulp.task('package:' + name + ':lint', function() {
			return gulp.src(pointer.watch)
				.pipe(plugins.jshint(jshintConfig))
				.pipe(plugins.jshint.reporter('jshint-stylish'));
		});

		gulp.task('package:' + name + ':build', function() {
			return gulp.src(pointer.watch)
				.pipe(plugins.plumber({ errorHandler: handleError}))
				// max
				.pipe(plugins.uglify({ compress: false, mangle: false, preserveComments: 'none', output: { beautify: true } }))
				.pipe(plugins.concat(name + '.js'))
				.pipe(plugins.header(config.strings.banner.max.join('\n')))
				.pipe(plugins.frep(patterns))
				.pipe(plugins.frep(getDatePatterns()))
				.pipe(chmod(644))
				.pipe(gulp.dest(config.tasks.dist.destination + '/' + package.version + '/max/packages/'))
				.pipe(gulp.dest(config.tasks.dist.destination + '/latest/max/packages/'))
				// min
				.pipe(plugins.uglify({ preserveComments: 'none' }))
				.pipe(plugins.concat(name + '.js'))
				.pipe(plugins.header(config.strings.banner.min.join('\n')))
				.pipe(plugins.frep(patterns))
				.pipe(plugins.frep(getDatePatterns()))
				.pipe(chmod(644))
				.pipe(gulp.dest(config.tasks.dist.destination + '/' + package.version + '/min/packages/'))
				.pipe(gulp.dest(config.tasks.dist.destination + '/latest/min/packages/'));
		});

		gulp.task('package:' + name, function(callback) {
			return sequence('package:' + name + ':lint', 'package:' + name + ':build', callback);
		});
	}

	function registerPackageWatchTasks(name) {
		gulp.watch(config.tasks.packages[name].watch, [ 'package:' + name ]);
	}

/**************************************************
 * initialization
 **************************************************/
	loadPackageFile();
	preparePatterns();
	loadConfigFile();

/**************************************************
 * tasks (private)
 **************************************************/
	gulp.task('bump', function(callback) {
		var tasks = [ 'dist' ];

		loadPackageFile();
		preparePatterns();
		loadConfigFile();

		/*
		for(key in config.tasks.packages) {
			if(key === 'destination') {
				continue;
			}

			tasks.push('package:' + key);
		}
		*/

		tasks.push(callback);

		return sequence.apply(null, tasks);
	});

	gulp.task('dist:lint', function() {
		return gulp.src(config.tasks.dist.lint || config.tasks.dist.watch)
			.pipe(plugins.jshint(jshintConfig))
			.pipe(plugins.jshint.reporter('jshint-stylish'));
	});

	gulp.task('dist:clean', function(callback) {
		return del(config.tasks.dist.clean || [ config.tasks.dist.destination + '**/*' ], callback);
	});

	gulp.task('dist:build', function() {
		return gulp.src(config.tasks.dist.build || config.tasks.dist.watch)
			.pipe(plugins.plumber({ errorHandler: handleError}))
			// max
			.pipe(plugins.uglify({ compress: false, mangle: false, preserveComments: 'none', output: { beautify: true } }))
			.pipe(plugins.header(config.strings.banner.max.join('\n')))
			.pipe(plugins.frep(patterns))
			.pipe(plugins.frep(getDatePatterns()))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.dist.destination + '/' + package.version + '/max/'))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.dist.destination + '/latest/max/'))
			// min
			.pipe(plugins.uglify({ preserveComments: 'none' }))
			.pipe(plugins.header(config.strings.banner.min.join('\n')))
			.pipe(plugins.frep(patterns))
			.pipe(plugins.frep(getDatePatterns()))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.dist.destination + '/' + package.version + '/min/'))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.dist.destination + '/latest/min/'));
	});

	gulp.task('dist', function(callback) {
		return sequence('dist:lint', 'dist:clean', 'dist:build', callback);
	});


	// create package tasks
	/*
	for(key in config.tasks.packages) {
		if(key === 'destination') {
			continue;
		}

		registerPackageBuildTasks(key);
	}
	*/

/**************************************************
 * tasks (public)
 **************************************************/
	gulp.task('bump:patch', function() {
		return gulp.src(config.tasks.bump.watch)
			.pipe(plugins.bump({ type: 'patch' }))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.bump.destination));
	});

	gulp.task('bump:minor', function() {
		return gulp.src(config.tasks.bump.watch)
			.pipe(plugins.bump({ type: 'minor' }))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.bump.destination));
	});

	gulp.task('bump:major', function() {
		return gulp.src(config.tasks.bump.watch)
			.pipe(plugins.bump({ type: 'major' }))
			.pipe(chmod(644))
			.pipe(gulp.dest(config.tasks.bump.destination));
	});

	gulp.task('all', [ 'bump' ]);

	gulp.task('watch', function() {
		gulp.watch(config.tasks.bump.watch, [ 'bump' ]);
		gulp.watch(config.tasks.dist.watch, [ 'dist' ]);

		// create package tasks
		/*
		for(key in config.tasks.packages) {
			if(key === 'destination') {
				continue;
			}

			registerPackageWatchTasks(key);
		}
		*/
	});

	gulp.task('default', [ 'watch' ]);
