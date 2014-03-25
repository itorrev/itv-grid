/**
 * Created by Aleksandr on 23/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule', []);

panelDirectivesModule.directive('itvPanelheader', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelHeader.html',
        replace: true,
        link: function(scope){
            scope.isCollapsed = false;

            scope.collapse = function(){
                scope.isCollapsed = !scope.isCollapsed;
            };
        }
    }
});