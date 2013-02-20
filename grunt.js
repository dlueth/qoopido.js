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
				'*/',
			remux:'/*!\n' +
				'* Qoopido remux, an REM-driven approach to RWD\n' +
				'*\n' +
				'* Source:  <%= pkg.title || pkg.name %>\n' +
				'* Version: <%= pkg.version %>\n' +
				'* Date:    <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* Author:  <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
				'* Website: <%= pkg.homepage %>\n' +
				'*\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*\n' +
				'* Licensed under the <%= _.pluck(pkg.licenses, "type").join(" and ") %> license.\n' +
				'*  - <%= _.pluck(pkg.licenses, "url").join("\n*  - ") %>\n' +
				'*/'
		},
		concat:{
			remux:{
				src:[
					'<banner:meta.remux>',
					'<file_strip_banner:src/base.js>',
					'<file_strip_banner:src/emitter.js>',
					'<file_strip_banner:src/remux.js>'
				],
				dest:'packages/qoopido.remux.js'
			}
		},
		min:{
			remux:{
				src:['<config:concat.remux.dest>'],
				dest:'packages/qoopido.remux.min.js'
			}
		},
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
		compress:{
			remux:{
				options:{
					mode:'zip',
					basePath:'',
					level:1,
					flatten:true
				},
				files:{
					'packages/qoopido.remux.zip': ['packages/qoopido.remux*.js']
				}
			}
		},
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
	grunt.registerTask('default', 'lint clean qmin concat min compress dependencygraph');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-qmin');
	grunt.loadNpmTasks('grunt-dependencygraph');
};
