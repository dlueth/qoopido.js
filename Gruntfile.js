/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {
			src:      './src',
			packages: './packages/<%= pkg.version %>',
			dist:     './dist/<%= pkg.version %>',
			latest:   './dist/latest'
		},
		meta:{
			package:'/*!\n' +
				'* <%= pkg.title || pkg.name %> package\n' +
				'*\n' +
				'* version: <%= pkg.version %>\n' +
				'* date:    <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* author:  <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
				'* website: <%= pkg.homepage %>\n' +
				'*\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*\n' +
				'* Dual licensed under the <%= _.pluck(pkg.licenses, "type").join(" and ") %> licenses.\n' +
				'*  - <%= _.pluck(pkg.licenses, "url").join("\\n*  - ") %>\n' +
				'*/\n'
		},
		bump: {
			options: {
				commit: false,
				createTag: false,
				push: false
			}
		},
		jshint:{
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all:[
				'./Gruntfile.js',
				'./src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			dist: ['./dist/<%= pkg.version %>/**/*.js']
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						src: ['./**/*.js'],
						dest: '<%= config.dist %>/src/'
					}
				]
			},
			latest: {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						src: ['./**/*.js'],
						dest: '<%= config.latest %>/'
					}
				]
			}
		},
		uglifyrecursive: {
			dist: {
				files: [
					{ strip: '<%= config.src %>', src: ['<%= config.src %>/**/*.js'], dest: '<%= config.dist %>/min/'}
				]
			}
		},
		concat:{
			options:{
				stripBanners: true,
				banner: '<%= meta.package %>'
			},
			remux: {
				files: {
					'<%= config.packages %>/min/remux.js': [
						'<%= config.dist %>/min/polyfill/object/defineproperty.js',
						'<%= config.dist %>/min/polyfill/object/defineproperties.js',
						'<%= config.dist %>/min/polyfill/object/create.js',
						'<%= config.dist %>/min/polyfill/object/getownpropertynames',
						'<%= config.dist %>/min/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/min/base.js',
						'<%= config.dist %>/min/emitter.js',
						'<%= config.dist %>/min/component/remux.js'
					],
					'<%= config.packages %>/src/remux.js': [
						'<%= config.dist %>/src/polyfill/object/defineproperty.js',
						'<%= config.dist %>/src/polyfill/object/defineproperties.js',
						'<%= config.dist %>/src/polyfill/object/create.js',
						'<%= config.dist %>/src/polyfill/object/getownpropertynames',
						'<%= config.dist %>/src/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/src/base.js',
						'<%= config.dist %>/src/emitter.js',
						'<%= config.dist %>/src/component/remux.js'
					]
				}
			},
			emerge: {
				files: {
					'<%= config.packages %>/min/emerge.js': [
						'<%= config.dist %>/min/polyfill/object/defineproperty.js',
						'<%= config.dist %>/min/polyfill/object/defineproperties.js',
						'<%= config.dist %>/min/polyfill/object/create.js',
						'<%= config.dist %>/min/polyfill/object/getownpropertynames',
						'<%= config.dist %>/min/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/min/base.js',
						'<%= config.dist %>/min/proxy.js',
						'<%= config.dist %>/min/dom/element.js',
						'<%= config.dist %>/min/function/merge.js',
						'<%= config.dist %>/min/function/unique/uuid.js',
						'<%= config.dist %>/min/dom/element/emerge.js'
					],
					'<%= config.packages %>/src/emerge.js': [
						'<%= config.dist %>/src/polyfill/object/defineproperty.js',
						'<%= config.dist %>/src/polyfill/object/defineproperties.js',
						'<%= config.dist %>/src/polyfill/object/create.js',
						'<%= config.dist %>/src/polyfill/object/getownpropertynames',
						'<%= config.dist %>/src/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/src/base.js',
						'<%= config.dist %>/src/proxy.js',
						'<%= config.dist %>/src/dom/element.js',
						'<%= config.dist %>/src/function/merge.js',
						'<%= config.dist %>/src/function/unique/uuid.js',
						'<%= config.dist %>/src/dom/element/emerge.js'
					]
				}
			},
			lazyimage: {
				files: {
					'<%= config.packages %>/min/lazyimage.js': [
						'<%= config.dist %>/min/polyfill/object/defineproperty.js',
						'<%= config.dist %>/min/polyfill/object/defineproperties.js',
						'<%= config.dist %>/min/polyfill/object/create.js',
						'<%= config.dist %>/min/polyfill/object/getownpropertynames',
						'<%= config.dist %>/min/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/min/base.js',
						'<%= config.dist %>/min/proxy.js',
						'<%= config.dist %>/min/dom/element.js',
						'<%= config.dist %>/min/function/merge.js',
						'<%= config.dist %>/min/function/unique/uuid.js',
						'<%= config.dist %>/min/dom/element/emerge.js',
						'<%= config.dist %>/min/dom/element/lazyimage.js'
					],
					'<%= config.packages %>/src/lazyimage.js': [
						'<%= config.dist %>/src/polyfill/object/defineproperty.js',
						'<%= config.dist %>/src/polyfill/object/defineproperties.js',
						'<%= config.dist %>/src/polyfill/object/create.js',
						'<%= config.dist %>/src/polyfill/object/getownpropertynames',
						'<%= config.dist %>/src/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/src/base.js',
						'<%= config.dist %>/src/proxy.js',
						'<%= config.dist %>/src/dom/element.js',
						'<%= config.dist %>/src/function/merge.js',
						'<%= config.dist %>/src/function/unique/uuid.js',
						'<%= config.dist %>/src/dom/element/emerge.js',
						'<%= config.dist %>/src/dom/element/lazyimage.js'
					]
				}
			},
			shrinkimage: {
				files: {
					'<%= config.packages %>/min/shrinkimage.js': [
						'<%= config.dist %>/min/polyfill/object/defineproperty.js',
						'<%= config.dist %>/min/polyfill/object/defineproperties.js',
						'<%= config.dist %>/min/polyfill/object/create.js',
						'<%= config.dist %>/min/polyfill/object/getownpropertynames.js',
						'<%= config.dist %>/min/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/min/base.js',
						'<%= config.dist %>/min/polyfill/window/getcomputedstyle.js',
						'<%= config.dist %>/min/function/unique/uuid.js',
						'<%= config.dist %>/min/proxy.js',
						'<%= config.dist %>/min/dom/element.js',
						'<%= config.dist %>/min/function/merge.js',
						'<%= config.dist %>/min/function/unique/uuid.js',
						'<%= config.dist %>/min/function/unique/string.js',
						'<%= config.dist %>/min/url.js',
						'<%= config.dist %>/min/pool.js',
						'<%= config.dist %>/min/pool/dom.js',
						'<%= config.dist %>/min/transport.js',
						'<%= config.dist %>/min/transport/xhr.js',
						'<%= config.dist %>/min/polyfill/string/ucfirst.js',
						'<%= config.dist %>/min/support.js',
						'<%= config.dist %>/min/support/capability/datauri.js',
						'<%= config.dist %>/min/support/element/canvas.js',
						'<%= config.dist %>/min/support/element/canvas/todataurl.js',
						'<%= config.dist %>/min/support/element/canvas/todataurl/png.js',
						'<%= config.dist %>/min/dom/element/shrinkimage.js'
					],
					'<%= config.packages %>/src/shrinkimage.js': [
						'<%= config.dist %>/src/polyfill/object/defineproperty.js',
						'<%= config.dist %>/src/polyfill/object/defineproperties.js',
						'<%= config.dist %>/src/polyfill/object/create.js',
						'<%= config.dist %>/src/polyfill/object/getownpropertynames.js',
						'<%= config.dist %>/src/polyfill/object/getownpropertydescriptor.js',
						'<%= config.dist %>/src/base.js',
						'<%= config.dist %>/src/polyfill/window/getcomputedstyle.js',
						'<%= config.dist %>/src/function/unique/uuid.js',
						'<%= config.dist %>/src/proxy.js',
						'<%= config.dist %>/src/dom/element.js',
						'<%= config.dist %>/src/function/merge.js',
						'<%= config.dist %>/src/function/unique/uuid.js',
						'<%= config.dist %>/src/function/unique/string.js',
						'<%= config.dist %>/src/url.js',
						'<%= config.dist %>/src/pool.js',
						'<%= config.dist %>/src/pool/dom.js',
						'<%= config.dist %>/src/transport.js',
						'<%= config.dist %>/src/transport/xhr.js',
						'<%= config.dist %>/src/polyfill/string/ucfirst.js',
						'<%= config.dist %>/src/support.js',
						'<%= config.dist %>/src/support/capability/datauri.js',
						'<%= config.dist %>/src/support/element/canvas.js',
						'<%= config.dist %>/src/support/element/canvas/todataurl.js',
						'<%= config.dist %>/src/support/element/canvas/todataurl/png.js',
						'<%= config.dist %>/src/dom/element/shrinkimage.js'
					]
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['jshint:all', 'clean:dist', 'copy:dist', 'uglifyrecursive:dist', 'copy:latest', 'concat']);
};
