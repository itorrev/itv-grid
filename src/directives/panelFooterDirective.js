/**
 * Created by Aleksandr on 24/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule');

panelDirectivesModule.directive('itvPanelfooter', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelFooter.html',
        replace: true,
        link: function(scope){
            scope.pagina = 1;

            scope.cambioPagina = function(pagina){
                console.log('invocado cambio de pagina: ' + pagina);
                scope.pagina = pagina;
            };

            scope.getItemsShown = function(){
                if(scope.filteredData){
                    return scope.filteredData.length < scope.itemsPorPagina ? scope.filteredData.length : scope.itemsPorPagina;
                } else {
                    return 0;
                }
            }
        }
    }
});
