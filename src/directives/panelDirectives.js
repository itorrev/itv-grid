/**
 * Created by Aleksandr on 26/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule', ['ui.bootstrap', 'itvUtilDirectivesModule', 'utilsServiceModule']);

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

panelDirectivesModule.directive('itvPanelfooter', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelFooter.html',
        replace: true,
        link: function(scope){
            scope.pagina = 1;

            scope.cambioPagina = function(pagina){
                console.log('invocado cambio de pagina: ' + pagina);
                scope.clearEditMode();
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

panelDirectivesModule.directive('itvPanelbody', ['$modal', 'UtilsService', function($modal, UtilsService){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelBody.html',
        replace: true,
        link: function(scope){
            scope.insertMode = false;

            scope.setInsertMode = function(){
                scope.clearEditMode();
                scope.insertMode = !scope.insertMode;
            };

            scope.clearAdvancedFilter = function(){
                scope.advancedFilterActive = false;
                scope.advancedFilterObj = {};
                scope.filteredData = scope.data;
                scope.itemsTotales = scope.filteredData.length;
            };

            scope.doGenericFilter = function(){
                scope.searchFilter = scope.genericSearchFilter ? scope.genericSearchFilter : '';
            };

            scope.openHideColumnModal = function(){
                scope.clearEditMode();

                var hideColumnModal = $modal.open({
                    templateUrl: '../src/templates/hideColumnModal.html',
                    controller: HideColumnModalCtrl,
                    resolve: {
                        headers: function(){
                            return scope.headers;
                        },
                        hiddenColumns: function(){
                            return scope.hiddenColumns;
                        }
                    }
                });

                hideColumnModal.result.then(function(columnsToHide){
                    // si la selección de columnas a ocultar ha cambiado se deber comprobar si existe un filtro
                    // de búsqueda activo y volverlo a lanzar
                    var columnsChange = (scope.hiddenColumns.length != columnsToHide.length ?
                        true : _.difference(scope.hiddenColumns, columnsToHide).length > 0);
                    scope.hiddenColumns = columnsToHide;
                    UtilsService.setHiddenColumns(scope.headers, columnsToHide);
                    if(columnsChange){
                        scope.reloadFilter();
                        scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
                    }
                });
            };

            scope.openAdvancedFilterModal = function(){
                scope.clearEditMode();

                var advancedFilterModal = $modal.open({
                    templateUrl: '../src/templates/advancedFilterModal.html',
                    controller: AdvancedFilterModalCtrl,
                    resolve: {
                        headers: function(){
                            return scope.headers;
                        },
                        advancedFilterObj: function(){
                            return scope.advancedFilterObj;
                        }
                    }
                });

                advancedFilterModal.result.then(function(advancedFilterObj){
                    scope.advancedFilterObj = advancedFilterObj;
                    scope.advancedFilterActive = true;
                    scope.searchFilter = '';
                    scope.genericSearchFilter = '';
                    scope.filteredData = UtilsService.filterData(advancedFilterObj, scope.data);
                    scope.itemsTotales = scope.filteredData.length;
                    scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
                });
            };

            var HideColumnModalCtrl = function($scope, $modalInstance, headers, hiddenColumns){
                $scope.headerNames = [];
                angular.forEach(headers, function(value, key){
                    $scope.headerNames.push(value.name);
                });

                $scope.columnsToHide = [];
                angular.extend($scope.columnsToHide, hiddenColumns);

                $scope.ok = function () {
                    console.log('seleccionadas columnas:');
                    console.log($scope.columnsToHide);
                    $modalInstance.close($scope.columnsToHide);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var AdvancedFilterModalCtrl = function($scope, $modalInstance, headers, advancedFilterObj)
            {
                $scope.advancedFilterObj = UtilsService.createAdvancedFilterObj(headers, advancedFilterObj);
                $scope.headerNames = [];
                angular.forEach(headers, function(value, key){
                    if(!value.isHidden){
                        $scope.headerNames.push(value.name);
                    }
                });

                $scope.ok = function () {
                    $modalInstance.close($scope.advancedFilterObj);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    }
}]);