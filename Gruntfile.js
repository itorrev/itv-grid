module.exports = function(grunt){
    grunt.initConfig({
        bowercopy: {
            initial: {
                options: {
                    destPrefix: 'vendor',
                    srcPrefix: 'bower_components'
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
                    'greensock/TweenMax.min.js': 'bower_components/greensock/src/minified/TweenMax.min.js',
                    'showdown/showdown.js': 'bower_components/showdown/compressed/showdown.js',
                    'angular-mocks/angular-mocks.js': 'bower_components/angular-mocks/angular-mocks.js'
                }
            },
            builddev: {
                options: {
                    destPrefix: 'build',
                    srcPrefix: 'src'
                },
                files: {
                    'dev/gridStyle.css': 'styles/gridStyle.css'
                }
            },
            buildprod: {
                options: {
                    destPrefix: 'build',
                    srcPrefix: 'src'
                },
                files: {
                    'prod/gridStyle.css': 'styles/gridStyle.css'
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
                        collapseWhitespace: false
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
            },
            prod: {
                src: ['<%= srcFilesProd %>'],
                dest: 'build/prod/itvDataGrid.js'
            }
        },
        clean: {
            builddev: {
                src: ['<%= ngtemplates.dev.dest %>']
            },
            buildprod: {
                src: ['<%= ngtemplates.prod.dest %>',
                        '<%= ngmin.prod.dest %>',
                        '<%= concat.prod.dest %>']
            }
        },
        ngmin: {
            prod: {
                src: ['<%= concat.prod.dest %>'],
                dest: 'build/prod/itvDataGridNgMin.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            buildprod: {
                files: {
                    'build/prod/itvDataGrid.min.js': ['<%= ngmin.prod.dest %>']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('builddev', ['ngtemplates:dev', 'concat:dev', 'bowercopy:builddev']);
    grunt.registerTask('buildprod', ['ngtemplates:prod', 'concat:prod', 'bowercopy:buildprod', 'ngmin:prod', 'uglify:buildprod', 'clean:buildprod']);
};