/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
				'*  - <%= _.pluck(pkg.licenses, "url").join("\n*  - ") %>\n' +
				'*/'
		},
		jshint:{
			options: {
				"curly":true,
				"eqeqeq":true,
				"immed":true,
				"latedef":true,
				"newcap":true,
				"noarg":true,
				"sub":true,
				"undef":true,
				"boss":true,
				"eqnull":true,
				"browser":true,
				"proto":true,
				"expr":true,
				"globals":{
					"jQuery": true,
					"define": true,
					"require": true
				}
			},
			all:[
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			all: ['min/**/*', 'packages/**/*']
		},
		copy: {
			all: {
				files: [
					{src: ['src/**'], dest: 'min/'}
				]
			}
		},
		uglifyrecursive: {
			all: {
				files: [
					{ strip: 'src', src: ['src/**'], dest: 'min/'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-uglifyrecursive');
	//grunt.loadNpmTasks('grunt-mindirect');
	//grunt.loadNpmTasks('grunt-qmin');
	//grunt.loadNpmTasks('grunt-dependencygraph');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'clean', 'uglifyrecursive']); // 'copy',
};
