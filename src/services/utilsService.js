/**
 * Created by Aleksandr on 28/03/14.
 */
var utilsServiceModule = angular.module('itvUtilsService', []);

utilsServiceModule.factory('UtilsService', function(filterFilter){
    var UtilsService = {};

    UtilsService.createHeaders = function(headers, notEditableFields, hiddenColumns){
        var classHeaders = [];
        angular.forEach(headers, function(value, key){
            classHeaders.push({
                name: value,
                isEditable: !_.contains(notEditableFields, value),
                isHidden: _.contains(hiddenColumns, value)
            });
        });
        return classHeaders;
    };

    UtilsService.filterData = function(filterParams, scopedData){
        if(angular.isString(filterParams)){
            return filterParams.length > 0 ? filterFilter(scopedData, filterParams) : scopedData;
        } else if(angular.isFunction(filterParams)){
            return filterFilter(scopedData, filterParams);
        } else if(angular.isObject(filterParams) && !_.isEmpty(filterParams)){
            return filterFilter(scopedData, filterParams);
        } else {
            return scopedData;
        }
    };

    UtilsService.setHiddenColumns = function(headers, hiddenColumns){
        angular.forEach(headers, function(value, key){
            value.isHidden = _.contains(hiddenColumns, value.name);
        });
    };

    UtilsService.createAdvancedFilterObj = function(headers, advancedFilterObj){
        var newAdvancedFilter = {};
        angular.forEach(headers, function(value, key){
            if(!value.isHidden){
                newAdvancedFilter[value.name] = '' || advancedFilterObj[value.name];
            }
        });
        return newAdvancedFilter;
    };

    // método para crear una función a medida para su uso en el filtro "filter" de AngularJS
    // al no existir documentación al respecto he tenido que buscar su implementación en el código fuente para
    // averiguar cómo utilizar el filtro para que no aplique a las columnas no visibles
    UtilsService.createCustomFilterFunction = function(filterText, headers){
        return function(obj){
            var text = ('' + filterText).toLowerCase();
            for (var i in headers){
                var property = (headers[i]).name;
                if ((!(headers[i]).isHidden)
                    && (obj.hasOwnProperty(property)
                    && ('' + obj[property]).toLowerCase().indexOf(text) > -1)) {
                    return true;
                }
            }
            return false;
        };
    };

    /**
     * Crea un objeto con los índices de los elementos mostrados inicial y final así como los elementos totales
     * @param currentPage Número de página actual
     * @param totalItems Total de elementos mostrados
     * @param itemsPerPage Elementos mostrados en cada página
     * @returns {{initIndex: number, endIndex: *, totalItems: *}}
     */
    UtilsService.getFirstLastTotalObject = function(currentPage, totalItems, itemsPerPage){
        var initIndex = ((currentPage - 1) * itemsPerPage) + 1;
        var endIndex = initIndex - 1 + itemsPerPage;
        if(endIndex > totalItems){
            endIndex = totalItems;
        }

        return {
            'initIndex': initIndex,
            'endIndex': endIndex,
            'totalItems': totalItems
        }
    };

    return UtilsService;
});
