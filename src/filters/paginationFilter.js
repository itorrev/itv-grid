'use strict';

var paginationFilterModule = angular.module('paginationFilterModule', []);

paginationFilterModule.filter('paginationFilter', function(){
    return function(input, pagina, itemsPorPagina){
        if(_.isUndefined(input)){
            return input;
        }
        else{
            var itemInicio = pagina == 1 ? 0 : (pagina - 1) * itemsPorPagina;
            return input.slice(itemInicio, itemInicio + (itemsPorPagina * 1));
        }
    }
});