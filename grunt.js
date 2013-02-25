/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg:'<json:package.json>',
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
		concat:{},
		min:{},
		qmin: {
			all:{
				src:    ['src/**/*.js'],
				root:   'src/',
				dest:   'min/'
			}
		},
		dependencygraph: {
			targetPath: './src',
			outputPath: './info/dependencies',
			format: 'amd'
		},
		lint:{
			files:[
				'grunt.js',
				'src/**/*.js'
			]
		},
		compress:{},
		clean: {
			all: ['min/**/*', 'packages/**/*']
		},
		watch:{
			files:'<config:lint.files>',
			tasks:'lint'
		},
		jshint:{
			options:{
				curly:true,
				eqeqeq:true,
				immed:true,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				undef:true,
				boss:true,
				eqnull:true,
				browser:true,
				proto:true,
				expr:true
			},
			globals:{
				jQuery: true,
				define: true,
				require: true
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint clean qmin dependencygraph');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-qmin');
	grunt.loadNpmTasks('grunt-dependencygraph');
};
