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
        if(_.isString(filterParams)){
            return filterParams.length > 0 ? filterFilter(scopedData, filterParams) : scopedData;
        } else if(!_.isEmpty(filterParams)){
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

    return UtilsService;
});
