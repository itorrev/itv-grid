/**
 * Created by itorrev on 4/04/14.
 */
'use strict';

var itvGridModule = angular.module('itvGrid', ['itvDataResource', 'ui.bootstrap', 'itvPanelDirectives', 'itvFilters', 'itvUtilDirectives', 'itvUtilsService', 'itvAnimations']);

itvGridModule.directive('itvGrid', function(DataResource, $log, UtilsService){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'itvGridTemplates/src/templates/itvGrid.html',
        link: function(scope, element, attrs){
            DataResource.setUrl(attrs.itvGridUrl);
            scope.title = attrs.itvGridTitle || 'Data Grid';
            scope.itemsPorPagina = 10;
            scope.itemsTotales = 0;
            scope.orderBy = {headerName: '', asc: false};
            scope.insertRow = {};
            scope.originalEditingRow = {};
            scope.copiedEditingRow = {};
            scope.hiddenColumns = [];
            scope.advancedFilterActive = false;
            scope.advancedFilterObj = {};

            if(attrs.itvGridHide){
                angular.forEach(attrs.itvGridHide.split(','), function(value, key){
                    scope.hiddenColumns.push(value);
                });
            }

            scope.setOrderBy = function(header){
                console.log('ordenando by ' + header);
                scope.clearEditMode();
                scope.orderBy.asc = scope.orderBy.headerName === header ? !scope.orderBy.asc : true;
                scope.orderBy.headerName = header;
            };

            scope.$watch('searchFilter', function(filterText){
                scope.clearEditMode();
                if(!scope.advancedFilterActive && !angular.isUndefined(scope.filteredData)){
                    var filterParams = filterText;
                    if(filterParams){
                        filterParams = UtilsService.createCustomFilterFunction(filterText, scope.headers);
                    }
                    scope.filteredData = UtilsService.filterData(filterParams, scope.data);
                    scope.itemsTotales = scope.filteredData.length;
                    scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
                }
            });

            scope.reloadData = function(){
                scope.clearEditMode();
                DataResource.query().then(function(data){
                    console.log(data);
                    scope.data = data;
                    scope.filteredData = data;
                    scope.headers = UtilsService.createHeaders(_.keys(data[0]), DataResource.getNotEditableFields(), scope.hiddenColumns);
                    scope.itemsTotales = scope.filteredData.length;
                    scope.cambioPagina(1);
                    scope.searchFilter = '';
                    scope.genericSearchFilter = '';
                    scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
                });
            };

            scope.deleteData = function(deletedResource){
                $log.log('borrando id: ' + deletedResource.$id() );
                deletedResource.$remove().then(function(){
                    scope.reloadData();
                });
            };

            scope.updateData = function(editedResource){
                $log.log('Actualizando id: ' + editedResource.$id());
                editedResource.$update().then(function(resource){
                    scope.reloadData();
                });
            };

            scope.insertData = function(){
                DataResource.save(scope.insertRow).then(function(){
                    scope.insertRow = {};
                    scope.insertMode = false;
                    scope.reloadData();
                });
            };

            scope.setRowEditable = function(editedResource){
                if(editedResource === scope.originalEditingRow){
                    scope.clearEditMode();
                } else {
                    scope.clearEditMode();
                    editedResource.editMode = !editedResource.editMode;
                    scope.originalEditingRow = editedResource;
                    angular.copy(editedResource, scope.copiedEditingRow);
                }
            };

            scope.checkDisabledField = function(fieldName){
                return _.contains(DataResource.getNotEditableFields(), fieldName);
            };

            scope.clearEditMode = function(){
                if(!_.isEmpty(scope.originalEditingRow)){
                    scope.originalEditingRow.editMode = false;
                    scope.originalEditingRow = {};
                    scope.copiedEditingRow = {};
                }
            };

            scope.reloadFilter = function(){
                if(scope.advancedFilterActive){
                    scope.advancedFilterObj = UtilsService.createAdvancedFilterObj(scope.headers, scope.advancedFilterObj);
                    scope.filteredData = UtilsService.filterData(scope.advancedFilterObj, scope.data);
                } else if(angular.isString(scope.searchFilter) && scope.searchFilter){
                    var customFilterFunction = UtilsService.createCustomFilterFunction(scope.searchFilter, scope.headers);
                    scope.filteredData = UtilsService.filterData(customFilterFunction, scope.data);
                }
                scope.itemsTotales = scope.filteredData.length;
            };

            scope.reloadData();
        }
    }
})