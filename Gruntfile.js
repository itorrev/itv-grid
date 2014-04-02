module.exports = function(grunt){
    grunt.initConfig({
        bowercopy: {
            options: {
                srcPrefix: 'bower_components'
            },
            test: {
                options: {
                    destPrefix: 'vendor'
                },
                files: {
                    'angular/angular.min.js' : 'bower_components/angular/angular.min.js',
                    'angular-animate/angular-animate.min.js' : 'bower_components/angular-animate/angular-animate.min.js',
                    'angular-bootstrap/ui-bootstrap.min.js' : 'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                    'angular-bootstrap/ui-bootstrap-tpls.min.js' : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bootstrap/bootstrap.min.js' : 'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bootstrap/bootstrap.min.css' : 'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'font-awesome/css/font-awesome.min.css': 'bower_components/font-awesome/css/font-awesome.min.css',
                    'font-awesome/fonts/FontAwesome.otf' : 'bower_components/font-awesome/fonts/FontAwesome.otf',
                    'font-awesome/fonts/fontawesome-webfont.eot' : 'bower_components/font-awesome/fonts/fontawesome-webfont.eot',
                    'font-awesome/fonts/fontawesome-webfont.svg' : 'bower_components/font-awesome/fonts/fontawesome-webfont.svg',
                    'font-awesome/fonts/fontawesome-webfont.ttf' : 'bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
                    'font-awesome/fonts/fontawesome-webfont.woff' : 'bower_components/font-awesome/fonts/fontawesome-webfont.woff',
                    'jquery/jquery.min.js' : 'bower_components/jquery/dist/jquery.min.js',
                    'underscore/underscore.js': 'bower_components/underscore/underscore.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bowercopy');

    grunt.registerTask('gbc', ['bowercopy']);
};