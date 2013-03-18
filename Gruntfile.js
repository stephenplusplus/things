var srcFiles = [
  // source header.
  'src/src-begins.js',

  // helper functions.
  'src/helpers.js',

  // jQuery-esque DOM api.
  'src/$$.js',

  // thing globals.
  'src/globals.js',

  // route-related functions.
  'src/routes/route-elements.js',

  // handling dependencies within things.
  'src/dependencies/register.js',
  'src/dependencies/request.js',
  'src/dependencies/invoke.js',

  // public things api.
  'src/things/things-begins.js',
  'src/things/things.js',
  'src/things/things-ends.js',

  // source footer.
  'src/src-ends.js'
];

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner:
          "/*!\n"
          +"* things. it's so thingy.\n"
          +"* v<%= pkg.version %> @stephenplusplus <%= grunt.template.today('m/d/yy') %>\n"
          +"* github.com/stephenplusplus/things\n"
          +"*/\n\n"
      },
      build: {
        src: srcFiles,
        dest: 'things.js'
      }
    },

    jasmine: {
      compiled: {
        src: ['things.js', 'test-compiled/helpers.js'],
        options: {
          specs: 'test-compiled/**/*.js'
        }
      }
    },

    uglify: {
      options: {
        compress: true,
        preserveComments: 'some'
      },
      build: {
        src: 'things.js',
        dest: 'things.min.js'
      }
    },

    watch: {
      src: {
        files: ['src/**/*.js', 'test-compiled/**/*.js'],
        tasks: ['concat:build', 'jasmine:compiled']
      }
    }
  });

  grunt.registerTask('test', 'jasmine:compiled');
  grunt.registerTask('build', ['concat:build', 'jasmine:compiled', 'uglify:build']);
  grunt.registerTask('default', ['build']);
};
