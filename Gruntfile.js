module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [ {
                  cwd: "app",
                  src: "**/*.jade",
                  dest: "build/templates",
                  expand: true,
                  ext: ".html"
                } ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
