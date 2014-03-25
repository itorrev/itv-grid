/**
 * Created by Aleksandr on 23/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule');

panelDirectivesModule.directive('itvPanelbody', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelBody.html',
        replace: true,
        link: function(scope){
            scope.insertMode = false;

            scope.setInsertMode = function(){
                scope.insertMode = !scope.insertMode;
            };
        }
    }
});