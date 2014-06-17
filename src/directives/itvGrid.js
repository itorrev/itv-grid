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
            scope.title = attrs.itvGridTitle || 'ITV Data Grid';
            scope.itemsPorPagina = 10;
            scope.itemsTotales = 0;
            scope.orderBy = {headerName: '', asc: false};
            scope.insertRow = {};
            scope.originalEditingRow = {};
            scope.copiedEditingRow = {};
            scope.hiddenColumns = [];
            scope.advancedFilterActive = false;
            scope.advancedFilterObj = {};
            scope.paramHeaders = [];
            scope.notEditableFields = [];
            scope.allowCUD = false;
            scope.editActive = false;
            scope.masterDetailActive = false;
            scope.detailCols = [];
            scope.multiselection = true;
            scope.selectedRows = [];
            scope.selectionView = false;
            scope.storedItemsTotales = 0;
            scope.createsubgrid = false;

            if(attrs.itvSubgrid && attrs.itvSubgridPath.length > 0){
                scope.createsubgrid = true;
                scope.subgridInitObj = {};
                scope.subgridPath = attrs.itvSubgridPath;
            }

            if(attrs.itvGridColumns){
                angular.forEach(attrs.itvGridColumns.split(','), function(value, key){
                    scope.paramHeaders.push(value);
                });
            }

            if(attrs.itvGridHide){
                angular.forEach(attrs.itvGridHide.split(','), function(value, key){
                    scope.hiddenColumns.push(value);
                });
                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-hide'] = attrs.itvGridHide;
                }
            }

            if(attrs.itvGridAllowcud === 'true'){
                scope.allowCUD = true;
            }

            if(attrs.itvGridMasterDetail === 'true'){
                scope.masterDetailActive = true;
            }

            if(attrs.itvGridDetailCols){
                angular.forEach(attrs.itvGridDetailCols.split(','), function(value, key){
                    scope.detailCols.push(value);
                });
                if(_.isEmpty(scope.detailCols)){
                    scope.masterDetailActive = false;
                }
            } else {
                scope.masterDetailActive = false;
            }

            var specificConfigDataService = {};

            if(attrs.itvGridUrl && (attrs.itvGridUrl !== DataResource.getUrl())){
                specificConfigDataService.url = attrs.itvGridUrl;
            }

            if(attrs.itvGridId){
                specificConfigDataService.id = attrs.itvGridId;

                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-id'] = attrs.itvGridId;
                }
            }

            if(attrs.itvGridParamName && attrs.itvGridParamValue){
                var key = attrs.itvGridParamName;
                var value = attrs.itvGridParamValue;
                var params = {};
                params[key] = value;
                specificConfigDataService.params = params;

                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-param-name'] = attrs.itvGridParamName;
                    scope.subgridInitObj['itv-grid-param-value'] = attrs.itvGridParamValue;
                }
            }

            if(attrs.itvGridStripUpdateid){
                if(attrs.itvGridStripUpdateid === 'true'){
                    specificConfigDataService.requestDataTx = UtilsService.getStripIdOnUpdateTransformer();
                } else if(attrs.itvGridStripUpdateid === 'false'){
                    specificConfigDataService.requestDataTx = UtilsService.getSimpleTransformer();
                }

                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-strip-updateid'] = attrs.itvGridStripUpdateid;
                }
            }
            if(attrs.itvGridMultiquery === 'true'){
                specificConfigDataService.multi = true;

                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-multiquery'] = attrs.itvGridMultiquery;
                }
            }
            var dataResourceInstance = UtilsService.getSpecificDataService(specificConfigDataService);

            scope.notEditableFields.push(dataResourceInstance.getIdField());

            if(attrs.itvGridNoteditable){
                angular.forEach(attrs.itvGridNoteditable.split(','), function(value, key){
                    scope.notEditableFields.push(value);
                });

                if(scope.createsubgrid){
                    scope.subgridInitObj['itv-grid-noteditable'] = attrs.itvGridNoteditable;
                }
            }

            if(scope.createsubgrid){
                scope.subgridInitObj['itv-grid-url'] = dataResourceInstance.getUrl();
                scope.subgridInitObj['itv-grid-allowcud'] = scope.allowCUD + '';
                scope.subgridInitObj['itv-grid-master-detail'] = scope.masterDetailActive + '';

                if(attrs.itvSubgridColumns){
                    scope.subgridInitObj['itv-grid-columns'] = attrs.itvSubgridColumns;
                }

                if(attrs.itvSubgridDetailCols){
                    scope.subgridInitObj['itv-grid-detail-cols'] = attrs.itvGridDetailCols;
                }
                console.log('****************');
                console.log(JSON.stringify(scope.subgridInitObj));
                console.log('****************');
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
                dataResourceInstance.query().then(function(data){
                    scope.data = data;
                    scope.filteredData = data;
                    var baseHeaders = scope.paramHeaders.length > 0 ? scope.paramHeaders : _.pairs(data[0]);
                    scope.headers = UtilsService.createHeaders(baseHeaders, scope.notEditableFields, scope.hiddenColumns, dataResourceInstance.getIdField());
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
                dataResourceInstance.save(scope.insertRow).then(function(){
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
                    angular.copy(_.omit(editedResource, 'editMode'), scope.copiedEditingRow);
                    scope.editActive = true;
                }
            };

            scope.checkDisabledField = function(fieldName){
                return _.contains(scope.notEditableFields, fieldName);
            };

            scope.clearEditMode = function(){
                if(!_.isEmpty(scope.originalEditingRow)){
                    scope.originalEditingRow.editMode = false;
                    scope.originalEditingRow = {};
                    scope.copiedEditingRow = {};
                    scope.editActive = false;
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

            scope.addDetailIndex = function(index){
                if((scope.masterDetailActive || scope.createsubgrid) && !scope.editActive){
                    scope.detailIndex = index == scope.detailIndex ? -1 : index;
                }
            };

            scope.getRowClass = function(row){
                var clickable = (scope.masterDetailActive || scope.createsubgrid) && !scope.editActive ? 'clickable' : '';
                var selected = (scope.multiselection && !scope.selectionView && (scope.selectedRows.indexOf(row.$id() + '') != -1)) ? 'rowSelected' : '';
                return clickable + ' ' + selected;
            };

            scope.removeFromSelection = function(row){
                scope.selectedRows = _.without(scope.selectedRows, row.$id() + '');
                if(_.isEmpty(scope.selectedRows)){
                    scope.toggleSelectionView();
                } else {
                    scope.itemsTotales--;
                    scope.updateLiteral();
                }
            };

            scope.reloadData();
        }
    }
});

itvGridModule.directive('itvSubGrid', function($compile){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){
            if(attrs.createchild == 'true'){
                var dataUrl = scope.$parent.subgridInitObj['itv-grid-url'] + attrs.parentid + '/' + scope.$parent.subgridPath;

                var html = '<itv-grid itv-grid-url="' + dataUrl + '" itv-grid-title="Subgrid: ' + dataUrl + '" ';
                angular.forEach(scope.$parent.subgridInitObj, function(value, key){
                    if(key != 'itv-grid-url'){
                        html = html + key + '="' + value + '" ';
                    }
                });
                html = html + '><itv-grid/>';

                console.log('html --> ' + html);

                var compiledHtml = $compile(html)(scope);
                element.html(compiledHtml);
            }
        }
    }
});

itvGridModule.directive('itvDetail', function($compile){
    return {
        restrict: 'E',
        scope: {
            names: '=itvDetailNames',
            row: '=itvDetailRow'
        },
        link: function(scope, element, attrs){

            var checkImg = function(value){
                var imgPattern = /\.jpg$|\.png$|\.jpeg$|\.gif$|\.bmp$/i;
                return imgPattern.test(value);
            };

            var capitalize = function(s){
                return s.substring(0,1).toUpperCase() + s.substring(1);
            };

            if(attrs.itvDetailActive == 'true' && scope.names.length > 0){
                var imgHtml = '';
                var html = '';
                angular.forEach(scope.names, function(value, key){
                    if(checkImg(scope.row[value])){
                        imgHtml = '<img src="' + scope.row[value] + '" style="float: left; padding-right: 25px;">';
                    } else {
                        if(html.length == 0){
                            html = '<ul>';
                        }
                        html = html + '<li><b>' + capitalize(value) +'</b>: ' + scope.row[value] + '</li>';
                    }
                });

                if(html.length > 0){
                    html = html + '</ul>';
                }

                if(imgHtml.length > 0){
                    html = imgHtml + html + '<div style="clear: both;"></div>'
                }

                var compiledHtml = $compile(html)(scope);
                element.html(compiledHtml);
            }
        }
    }
});