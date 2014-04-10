/**
 * Created by Aleksandr on 6/04/14.
 */
'use strict';

var itvFiltersModule = angular.module('itvFiltersModule', ['itvMessagesModule']);

itvFiltersModule.filter('paginationFilter', function(){
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

itvFiltersModule.filter('capitalize', function(){
    return function(input) {
        if (!angular.isString(input) || !input){
            return input;
        } else {
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    }
});

itvFiltersModule.filter('messageFilter', function(itvMessages){
    return function(key){
        if(!angular.isString(key) || !key){
            return key;
        } else {
            return itvMessages[key] || key;
        }
    }
});