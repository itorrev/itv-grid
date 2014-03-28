/**
 * Created by Aleksandr on 10/03/14.
 */
'use strict';

var itvGridTestApp = angular.module('itvGridTestApp',['dataResourceModule', 'ui.bootstrap', 'panelDirectivesModule', 'paginationFilterModule', 'checkBoxListModule', 'utilsServiceModule']);

itvGridTestApp.config(function(DataResourceProvider){
    DataResourceProvider.setUrl('http://localhost:8080/itvRestServer/rest/personas');
});

itvGridTestApp.controller('itvGridTestCtrl', function($scope, DataResource, $log, UtilsService){
    $scope.title = 'Tabla';
    $scope.itemsPorPagina = 10;
    $scope.itemsTotales = 0;
    $scope.orderBy = {headerName: '', asc: false};
    $scope.insertRow = {};
    $scope.hiddenColumns = [];

    $scope.setOrderBy = function(header){
        console.log('ordenando by ' + header);
        $scope.orderBy.asc = $scope.orderBy.headerName === header ? !$scope.orderBy.asc : true;
        $scope.orderBy.headerName = header;
    };

    $scope.$watch('searchFilter', function(filterText){
        if(!_.isUndefined($scope.filteredData)){
            $scope.filteredData = UtilsService.filterData(filterText, $scope.data);
            $scope.itemsTotales = $scope.filteredData.length;
        }
    });

    $scope.reloadData = function(){
        DataResource.query().then(function(data){
            console.log(data);
            $scope.data = data;
            $scope.filteredData = data;
            $scope.headers = UtilsService.createHeaders(_.keys(data[0]), DataResource.getNotEditableFields(), $scope.hiddenColumns);
            $scope.itemsTotales = $scope.filteredData.length;
            $scope.cambioPagina(1);
            $scope.searchFilter = '';
        });
    };

    $scope.reloadData();

    $scope.deleteData = function(deletedResource){
        $log.log('borrando id: ' + deletedResource.$id() );
        deletedResource.$remove().then(function(){
            $scope.reloadData();
        });
    };

    $scope.updateData = function(editedResource){
        $log.log('Actualizando id: ' + editedResource.$id());
        editedResource.$update().then(function(resource){
            $scope.reloadData();
        });
    };

    $scope.insertData = function(){
        DataResource.save($scope.insertRow).then(function(){
            $scope.insertRow = {};
            $scope.insertMode = false;
            $scope.reloadData();
        });
    };

    $scope.setRowEditable = function(editedResource){
        editedResource.editMode = !editedResource.editMode;
    };

    $scope.checkDisabledField = function(fieldName){
        return _.contains(DataResource.getNotEditableFields(), fieldName);
    };
});