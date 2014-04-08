/**
 * Created by Aleksandr on 23/03/14.
 */
'use strict';

var panelDirectivesModule = angular.module('panelDirectivesModule', ['ui.bootstrap', 'itvUtilDirectivesModule']);

panelDirectivesModule.directive('itvPanelbody', ['$modal', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelBody.html',
        replace: true,
        link: function(scope){
            scope.insertMode = false;

            scope.setInsertMode = function(){
                scope.insertMode = !scope.insertMode;
            };

            var setHiddenColumns = function(){
                angular.forEach(scope.headers, function(value, key){
                    value.isHidden = _.contains(scope.hiddenColumns, value.name);
                });
            };

            scope.openHideColumnModal = function(){
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
                    setHiddenColumns();
                });
            };

            var HideColumnModalCtrl = function($scope, $modalInstance, headers, hiddenColumns){
                $scope.headers = headers;
                $scope.columnsToHide = hiddenColumns;

                $scope.ok = function () {
                    console.log('seleccionadas columnas:');
                    console.log($scope.columnsToHide);
                    $modalInstance.close($scope.columnsToHide);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        }
    }
}]);