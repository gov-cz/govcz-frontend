module.exports = function(grunt) {

  // Display the elapsed execution time of grunt tasks
  require('time-grunt')(grunt);

  // A JIT(Just In Time) plugin - task loader
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // folder containing resources
    resourceDirectory: 'public',

    // CSS source files
    cssSourceFile: {
      front: '<%= resourceDirectory %>/scss/front.scss',
      print: '<%= resourceDirectory %>/scss/print.scss'
    },

    // CSS source files
    jsSourceFile: {
      front: '<%= resourceDirectory %>/js/front.js'
    },

    // compiled CSS files
    cssFile: {
      front: '<%= resourceDirectory %>/css/front.css',
      frontMin: '<%= resourceDirectory %>/css/front.min.css',
      print: '<%= resourceDirectory %>/css/print.css',
      printMin: '<%= resourceDirectory %>/css/print.min.css'
    },

    // compiled JS files
    jsFile: {
      frontMin: '<%= resourceDirectory %>/js/front.min.js'
    },

    // paired front.css files with source files
    cssPair: {
      '<%= cssFile.front %>': '<%= cssSourceFile.front %>',
      '<%= cssFile.print %>': '<%= cssSourceFile.print %>'
    },

    // paired front.min.css files with source files
    cssPairMin: {
      '<%= cssFile.frontMin %>': '<%= cssSourceFile.front %>',
      '<%= cssFile.printMin %>': '<%= cssSourceFile.print %>'
    },

    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',

    /**
     * SCSS file compilation
     */
    sass: {
			// compilation for development, uncompressed with source map
			develop: {
				files: '<%= cssPair %>',
				options: {
					style: 'expanded'
				}
			},

			// compilation for production, compressed
			production: {
				files: '<%= cssPairMin %>',
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
			},
		},

    /**
     * Count CSS selectors
     */
    csscount: {
      dev: {
        src: [
          '<%= cssFile.front %>'
        ],
        options: {
          maxSelectors: 4096,
          beForgiving: true
        }
      }
    },


    /**
     * Creates githooks for post-merge and post-checkout
     */
    githooks: {
      all: {
        // generates git hook that runs build task after every merge or pull
        'post-merge': 'build',
        'post-checkout': 'build',
      }
    },

    /**
     * Run predefined tasks whenever watched file patterns are added, changed or deleted
     */
    watch: {
      options: {
        nospawn: true
      },

      styles: {
        files: [
          '<%= resourceDirectory %>/scss/**/*.scss'
        ],
        tasks: [
          'sass:develop'
        ],
      },

      scripts: {
        files: [
          '<%= jsSourceFile.front %>'
        ],
        tasks: [
          'uglify'
        ],
      }
    },

    // JS
    uglify: {
      options: {
        banner: '/*' + ' Generated: <%= grunt.template.today("dd.mm.yyyy HH:MM:ss") %>' + ' */\n'
      },
      my_target: {
        options: {
          sourceMap: false
        },
        files: {
          '<%= jsFile.frontMin %>': [
            '<%= resourceDirectory %>/js/vendor/jquery-3.2.0.min.js',
            '<%= resourceDirectory %>/js/vendor/jquery.ba-throttle-debounce.min.js',
            '<%= resourceDirectory %>/js/vendor/bootstrap.min.js',
            '<%= resourceDirectory %>/js/vendor/bootstrap-datepicker.js',
            '<%= resourceDirectory %>/js/vendor/bootstrap-datepicker.cs.js',
            '<%= jsSourceFile.front %>'
          ]
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-css-count');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', [
    'sass:develop',
    'uglify'
  ]);

  grunt.registerTask('build-production', [
    'sass:develop',
    'sass:production',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'watch'
  ]);

  grunt.registerTask('count', [
    'csscount'
  ]);
};
