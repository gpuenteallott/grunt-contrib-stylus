/*
 * grunt-contrib-stylus
 * http://gruntjs.com/
 *
 * Copyright (c) 2016 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function testPlugin(param) {
    param = param || 'nope';

    return function(style) {
      style.define('test-plugin', param);
    };
  }

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    // Configuration to be run (and then tested).
    stylus: {
      compile: {
        files: {
          'tmp/stylus.css': ['test/fixtures/stylus.styl'],
          'tmp/concat.css': ['test/fixtures/stylus.styl', 'test/fixtures/stylus2.styl']
        },
        options: {
          paths: ['test/fixtures/include'],
          compress: true
        }
      },
      nib: {
        files: {
          'tmp/nib_.css': 'test/fixtures/nib_/nib_.styl'
        },
        options: {
          paths: ['test/fixtures/include']
        }
      },
      autocompress: {
        files: {
          'tmp/autocompress.css': 'test/fixtures/stylus.styl'
        },
        options: {
          paths: ['test/fixtures/include']
        }
      },
      plugin: {
        files: {
          'tmp/plugin.css': 'test/fixtures/plugin/plugin.styl'
        },
        options: {
          use: [
            testPlugin,
            function() {
              return testPlugin('yep');
            }
          ]
        }
      },
      urlfunc: {
        files: {
          'tmp/urlfunc.css': 'test/fixtures/urlfunc/urlfunc.styl'
        },
        options: {
          urlfunc: 'data-uri'
        }
      },
      urlfuncObj: {
        files: {
          'tmp/urlfuncObj.css': 'test/fixtures/urlfunc/urlfunc.styl'
        },
        options: {
          urlfunc: {
            name: 'data-uri'
          }
        }
      },
      urlfuncOpts: {
        files: {
          'tmp/urlfuncOpts.css': 'test/fixtures/urlfunc/urlfuncOpts.styl'
        },
        options: {
          urlfunc: {
            name: 'data-uri',
            limit: 10,
            paths: []
          }
        }
      },
      urlfuncLimitFalse: {
        files: {
          'tmp/urlfuncLimitFalse.css': 'test/fixtures/urlfunc/urlfuncLimitFalse.styl'
        },
        options: {
          urlfunc: {
            name: 'data-uri',
            limit: false,
            paths: []
          }
        }
      },
      relative: {
        files: {
          'tmp/relative.css': 'test/fixtures/relative/relative.styl'
        }
      },
      define: {
        files: {
          'tmp/define.css': 'test/fixtures/define/define.styl'
        },
        options: {
          define: {
            var1: 42,
            var2: 'Helvetica'
          }
        }
      },
      defineRaw: {
        files: {
          'tmp/defineRaw.css': 'test/fixtures/defineRaw/defineRaw.styl'
        },
        options: {
          define: {
            rawVar: {
              nestedVar: 42
            },
            castedVar: {
              disc: 'outside'
            }
          },
          // would probably need an option to flag use of raw define
          rawDefine: ['rawVar']
        }
      },
      resolveUrl: {
        files: {
          'tmp/resolveUrl.css': 'test/fixtures/resolveUrl/resolveUrl.styl'
        },
        options: {
          'resolve url': true
        }
      },
      resolveUrlNocheck: {
        files: {
          'tmp/resolveUrlNocheck.css': 'test/fixtures/resolveUrlNocheck/resolveUrlNocheck.styl'
        },
        options: {
          'resolve url nocheck': true
        }
      },
      import: {
        files: {
          'tmp/import.css': 'test/fixtures/import/import.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          import: [
            'include/variables',
            'nib'
          ]
        }
      },
      banner: {
        files: {
          'tmp/banner.css': 'test/fixtures/banner/banner.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          banner: '/* test css banner */\n'
        }
      },
      relativeDestOut: {
        options: {
          relativeDest: '/out',
          compress: false
        },
        files: [{
          expand: true,
          src: ['test/fixtures/relativeDest/relativeDest.styl'],
          dest: 'tmp',
          ext: '.css'
        }]
      },
      relativeDestIn: {
        options: {
          relativeDest: '../../',
          compress: false
        },
        files: [{
          expand: true,
          src: ['test/fixtures/relativeDest/relativeDest.styl'],
          dest: 'tmp',
          ext: '.css'
        }]
      },
      sourceMapExternal: {
        files: {
          'tmp/sourcemapExternal.css': 'test/fixtures/sourcemapExternal/sourcemapExternal.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          sourcemap: {
            // from: http://stylus-lang.com/docs/sourcemaps.html#options
            comment: true,
            sourceRoot: '/' // style sources relative to built css
          }
        }
      },
      sourceMapInline: {
        files: {
          'tmp/sourcemapInline.css': 'test/fixtures/sourcemapInline/sourcemapInline.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          sourcemap: {
            inline: true
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'clean', 'stylus', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test', 'build-contrib']);

};
