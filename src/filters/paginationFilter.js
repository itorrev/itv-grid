'use strict';

var paginationFilterModule = angular.module('paginationFilterModule', []);

paginationFilterModule.filter('paginationFilter', function(){
    return function(input, pagina, itemsPorPagina){
        console.log('Activado filtro con pagina ' + pagina + ' y itemsPorPagina ' + itemsPorPagina);
        if(_.isUndefined(input)){
            return input;
        }
        else{
            var itemInicio = pagina == 1 ? 0 : (pagina - 1) * itemsPorPagina;
            var resultado = input.slice(itemInicio, itemInicio + (itemsPorPagina * 1));
            console.log(resultado);
            return resultado;
        }
    }
});