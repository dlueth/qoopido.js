/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {
			src:    'src',
			dist:   'dist/<%= pkg.version %>',
			latest: 'dist/latest'
		},
		meta:{
			general:'/*!\n' +
				'* This file is part of <%= pkg.title || pkg.name %>\n' +
				'*\n' +
				'* Source:  <%= pkg.title || pkg.name %>\n' +
				'* Version: <%= pkg.version %>\n' +
				'* Date:    <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* Author:  <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
				'* Website: <%= pkg.homepage %>\n' +
				'*\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*\n' +
				'* Licensed under <%= _.pluck(pkg.licenses, "type").join(" and ") %> license.\n' +
				'*  - <%= _.pluck(pkg.licenses, "url").join("\\n*  - ") %>\n' +
				'*/'
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
				jshintrc: '.jshintrc'
			},
			build:[
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			build: ['dist/<%= pkg.version %>/**/*.js']
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						src: ['**/*.js'],
						dest: '<%= config.dist %>/src/'
					}
				]
			},
			latest: {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						src: ['**/*.js'],
						dest: '<%= config.latest %>/'
					}
				]
			}
		},
		uglifyrecursive: {
			build: {
				files: [
					{ strip: '<%= config.src %>', src: ['<%= config.src %>/**/*.js'], dest: '<%= config.dist %>/min/'}
				]
			}
		},
		dependo: {
			targetPath: '<%= config.src %>',
			outputPath: './dependo',
			format: 'amd'
		},
		watch: {
			scripts: {
				files: ['**/*.js', '**/*.hbs'],
				tasks: ['jshint', 'clean', 'copy:build', 'uglifyrecursive', 'dependo', 'copy:latest'],
				options: {
					spawn: false
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', ['jshint', 'clean', 'copy:build', 'uglifyrecursive', 'dependo', 'copy:latest']);
};
