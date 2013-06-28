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
				'*  - <%= _.pluck(pkg.licenses, "url").join("\\n*  - ") %>\n' +
				'*/'
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
					{src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/'}
				]
			}
		},
		uglifyrecursive: {
			build: {
				files: [
					{ strip: 'src', src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/min/'}
				]
			}
		},
		dependo: {
			targetPath: './src',
			outputPath: './dependo',
			format: 'amd'
		}
	});

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-uglifyrecursive');
	grunt.loadNpmTasks('grunt-dependo');

	grunt.registerTask('default', ['jshint', 'clean', 'copy', 'uglifyrecursive', 'dependo']);
};
