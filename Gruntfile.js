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

  grunt.initConfig({
    concat: {
      build: {
        src: srcFiles,
        dest: 'things.js'
      }
    },

    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
      },
      build: {
        src: 'things.js',
        dest: 'things.min.js'
      }
    }
  });

  grunt.registerTask('build', ['concat:build', 'uglify:build']);
  grunt.registerTask('default', ['build']);
};
