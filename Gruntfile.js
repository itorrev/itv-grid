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
                    'underscore/underscore.js': 'bower_components/underscore/underscore.js',
                    'greensock/TweenLite.min.js': 'bower_components/greensock/src/minified/TweenLite.min.js',
                    'greensock/TweenMax.min.js': 'bower_components/greensock/src/minified/TweenMax.min.js'
                }
            }
        },
        ngtemplates: {
            dev: {
                options: {
                    prefix: 'itvGridTemplates/',
                    module: 'itvGrid'
                },
                src: ['src/templates/**.html'],
                dest: 'build/dev/itvGridTemplates.js'
            },
            prod: {
                options: {
                    prefix: 'itvGridTemplates/',
                    module: 'itvGrid',
                    htmlmin:  {
                        collapseWhitespace: true
                    }
                },
                src: ['src/templates/**.html'],
                dest: 'build/prod/itvGridTemplates.js'
            }
        },
        srcFilesDev: [
            'src/directives/*.js',
            'src/filters/*.js',
            'src/services/*.js',
            'src/animations/*.js',
            '<%= ngtemplates.dev.dest %>'
        ],
        srcFilesProd: [
            'src/directives/*.js',
            'src/filters/*.js',
            'src/services/*.js',
            'src/animations/*.js',
            '<%= ngtemplates.prod.dest %>'
        ],
        concat: {
            dev: {
                src: ['<%= srcFilesDev %>'],
                dest: 'build/dev/itvDataGrid.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('gbc', ['bowercopy']);
    grunt.registerTask('builddev', ['ngtemplates:dev', 'concat:dev']);
};