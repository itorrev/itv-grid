/**
 * Created by Aleksandr on 26/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule', ['ui.bootstrap', 'checkBoxListModule', 'utilsServiceModule']);

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
                    scope.hiddenColumns = columnsToHide;
                    UtilsService.setHiddenColumns(scope.headers, columnsToHide);
                });
            };

            scope.openAdvancedFilterModal = function(){
                scope.clearEditMode(scope.originalEditingRow, scope.copiedEditingRow);

                var advancedFilterModal = $modal.open({
                    templateUrl: '../src/templates/advancedFilterModal.html',
                    controller: AdvancedFilterModalCtrl,
                    resolve: {
                        headers: function(){
                            return scope.headers;
                        },
                        hiddenColumns: function(){
                            return scope.hiddenColumns;
                        },
                        advancedFilterObj: function(){
                            return scope.advancedFilterObj;
                        }
                    }
                });


            };

            var HideColumnModalCtrl = function($scope, $modalInstance, headers, hiddenColumns){
                $scope.headerNames = [];
                angular.forEach(headers, function(value, key){
                    $scope.headerNames.push(value.name);
                });

                $scope.columnsToHide = hiddenColumns;

                $scope.ok = function () {
                    console.log('seleccionadas columnas:');
                    console.log($scope.columnsToHide);
                    $modalInstance.close($scope.columnsToHide);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            var AdvancedFilterModalCtrl = function($scope, $modalInstance, headers, hiddenColumns, advancedFilterObj)
            {

            };
        }
    }
}]);