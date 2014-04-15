'use strict';

/**
 * @ngdoc module
 * @name itvFilters
 * @description
 *
 * Módulo con los filtros utilizados en el grid
 *
 */
var itvFiltersModule = angular.module('itvFilters', ['itvMessagesModule']);

/**
 * @ngdoc filter
 * @name paginationFilter
 * @function
 *
 * @description
 *
 * Realiza la paginación de los elementos del grid de datos. Devuelve un subconjunto
 * de elementos del array en base a los parámetros recibidos.
 *
 * @param {array} input Array de elementos a paginar
 * @param {number | string} pagina Número de página a devolver
 * @param {number | string} itemsPorPagina Número de elementos mostrados en cada página
 *
 * @returns {array} subconjunto del array de entrada en base a los parámetros recibidos.
 *
 */
itvFiltersModule.filter('paginationFilter', function(){
    return function(input, pagina, itemsPorPagina){
        if(_.isUndefined(input)){
            return input;
        }
        else{
            var itemInicio = pagina == 1 ? 0 : (pagina - 1) * itemsPorPagina;
            // al venir de un elemento 'select' de html, itemsPorPagina se recibe como
            // string, para evitar que el operador '+' haga concatenación en vez de
            // suma se realiza antes la multiplicación para forzar la conversión en número
            return input.slice(itemInicio, itemInicio + (itemsPorPagina * 1));
        }
    }
});

/**
 * @ngdoc filter
 * @name capitalize
 * @function
 *
 * @description
 *
 * Convierte la primera letra de la cadena recibida en mayúscula.
 * Si no recibe un string devolverá el parámetro sin modificarlo.
 *
 * @param {string} input Cadena cuya primera letra hay que mostrar en mayúsculas
 *
 * @returns {string} String de entrada con su primera letra en mayúsculas
 *
 */
itvFiltersModule.filter('capitalize', function(){
    return function(input) {
        if (!angular.isString(input) || !input){
            return input;
        } else {
            return input.substring(0,1).toUpperCase() + input.substring(1);
        }
    }
});

/**
 * @ngdoc filter
 * @name messageFilter
 * @function
 *
 * @description
 *
 * Utiliza la clave recibida para obtener un literal almacenado en el módulo de mensajes.
 * Si no recibe un string o si no encuentra correspondencia con un literal para la clave,
 * la devolverá sin modificar.
 *
 * @param {string} key Clave del módulo de mensajes que corresponde a un literal definido.
 *
 * @returns {string} Literal definido en el módulo de mensajes que corresponde a la clave
 * pasada como parámetro o la clave si no lo encuentra.
 */
itvFiltersModule.filter('messageFilter', function(itvMessages){
    return function(key){
        if(!angular.isString(key) || !key){
            return key;
        } else {
            return itvMessages[key] || key;
        }
    }
});