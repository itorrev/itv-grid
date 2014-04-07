/**
 * Created by Aleksandr on 28/03/14.
 */
var utilsServiceModule = angular.module('utilsServiceModule', []);

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

    return UtilsService;
});
