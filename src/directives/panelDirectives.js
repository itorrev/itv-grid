'use strict';

/**
 * @ngdoc module
 * @name itvPanelDirectives
 * @description
 *
 * Define las directivas para la cabecera, cuerpo y pie del panel que contiene
 * la tabla del grid de datos.
 *
 */
var panelDirectivesModule = angular.module('itvPanelDirectives', ['ui.bootstrap', 'itvUtilDirectives', 'itvUtilsService']);

/**
 * @ngdoc directive
 * @name itvPanelheader
 * @restrict E
 *
 * @description
 *
 * Directiva que define la cabecera del panel del grid de datos. Contiene
 * únicamente la función para recoger el resto del grid al pulsar el icono
 * correspondiente.
 * No define un scope aislado.
 *
 */
panelDirectivesModule.directive('itvPanelheader', function(){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelHeader.html',
        replace: true,
        link: function(scope){
            // se inicializa la variable que define si está desplegado el grid
            // y se define la función para el efecto plegado-desplegado
            scope.isCollapsed = false;

            scope.collapse = function(){
                scope.isCollapsed = !scope.isCollapsed;
            };
        }
    }
});

/**
 * @ngdoc directive
 * @name itvPanelheader
 * @restrict E
 *
 * @description
 *
 * Define mediante su plantilla el pie del grid de datos, donde está situado
 * el elemento paginador así como un literal con los elementos mostrados y totales.
 * Contiene la función de cambio de página.
 * El elemento paginador pertenece al proyecto angular bootstrap ui.
 * No define un scope aislado.
 *
 */
panelDirectivesModule.directive('itvPanelfooter', function(UtilsService){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelFooter.html',
        replace: true,
        link: function(scope){
            scope.pagina = 1;

            scope.cambioPagina = function(pagina){
                console.log('invocado cambio de pagina: ' + pagina);
                // si se está editando algún elemento, al cambiar de
                // página se quita el modo de edición
                scope.clearEditMode();
                scope.pagina = pagina;
                // al cambiar de página se vuelven a calcular los valores de los
                // elementos mostrados y totales para actualizar el literal del pie
                scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
            };

            // TODO eliminar, ya no se invoca
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

/**
 * @ngdoc directive
 * @name itvPanelheader
 * @restrict E
 *
 * @description
 *
 * Directiva cuya plantilla contiene múltiples elementos como el filtro general,
 * la selección de elementos por página, el botón de opciones y la lógica
 * correspondiente a los 'modal panel' utilizados para la selección de columnas
 * a ocultar y el filtro por columna.
 * Hace uso de distintos componentes del proyecto angular bootstrap ui.
 * No define un scope aislado.
 *
 */
panelDirectivesModule.directive('itvPanelbody', function($modal, UtilsService){
    return {
        restrict: 'E',
        templateUrl: '../src/templates/panelBody.html',
        replace: true,
        link: function(scope){
            // establece la variable que regula el modo de inserción
            // de nuevos elementos
            scope.insertMode = false;

            scope.setInsertMode = function(){
                scope.clearEditMode();
                scope.insertMode = !scope.insertMode;
            };

            // función que limpia el filtro por columna que está activo
            scope.clearAdvancedFilter = function(){
                scope.advancedFilterActive = false;
                scope.advancedFilterObj = {};
                scope.filteredData = scope.data;
                scope.itemsTotales = scope.filteredData.length;
            };

            // al invocar el método se modificará el valor de la variable 'searchFilter',
            // lo cual desencadenará una nueva ejecución del filtro general en caso de
            // que su valor haya cambiado
            scope.doGenericFilter = function(){
                scope.searchFilter = scope.genericSearchFilter ? scope.genericSearchFilter : '';
            };

            // función que abre el 'modal' de ocultación de columnas, se apoya en el
            // servicio $modal (del proyecto angular bootstrap ui). A través del método 'open'
            // del servicio se establecen los parámetros del modal como su plantilla, los
            // parámetros que se pasan y su controlador (definido más abajo). Tras ello se
            // establece la función 'callback' a ejecutar tras el cierre del panel.
            scope.openHideColumnModal = function(){
                scope.clearEditMode();

                var hideColumnModal = $modal.open({
                    templateUrl: '../src/templates/hideColumnModal.html',
                    controller: HideColumnModalCtrl,
                    // 'resolve' define los parámetros que se pasarán al controller
                    resolve: {
                        headers: function(){
                            return scope.headers;
                        },
                        hiddenColumns: function(){
                            return scope.hiddenColumns;
                        }
                    }
                });

                // función callback cuando el modal se cierre
                hideColumnModal.result.then(function(columnsToHide){
                    // si la selección de columnas a ocultar ha cambiado se deber comprobar si
                    // existe un filtro de búsqueda activo y volverlo a lanzar
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

            // al igual que en la función previa, se apoya en el servicio $modal de angular
            // bootstrap ui para mostrar el filtro por columna
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
                    // se establecen los parámetros en el objeto de filtrado y se activa el mismo,
                    // por otro lado se elimina el filtrado general si existía. Por último se
                    // llama al servicio de utilidades para filtrar el array de datos y se
                    // recalculan los valores de elementos actuales y totales para actualizar
                    // el literal del pie.
                    scope.advancedFilterObj = advancedFilterObj;
                    scope.advancedFilterActive = true;
                    scope.searchFilter = '';
                    scope.genericSearchFilter = '';
                    scope.filteredData = UtilsService.filterData(advancedFilterObj, scope.data);
                    scope.itemsTotales = scope.filteredData.length;
                    scope.firstLastTotalObj = UtilsService.getFirstLastTotalObject(scope.pagina , scope.itemsTotales, scope.itemsPorPagina);
                });
            };

            // controller que manejará el modal de ocultación de columna.
            var HideColumnModalCtrl = function($scope, $modalInstance, headers, hiddenColumns){
                // se crea un array con los nombres de columna para utilizarlo en la vista
                $scope.headerNames = [];
                angular.forEach(headers, function(value, key){
                    $scope.headerNames.push(value.name);
                });

                // es necesario utilizar una copia del array de columnas ocultadas ya que
                // tras cambiar los valores será necesario comparar los nuevos valores
                // con los antiguos y actualizar los filtros en caso de ser necesario
                $scope.columnsToHide = [];
                angular.extend($scope.columnsToHide, hiddenColumns);

                // en este caso se llamará a la función de callback, en la función cancel, no
                $scope.ok = function () {
                    console.log('seleccionadas columnas:');
                    console.log($scope.columnsToHide);
                    $modalInstance.close($scope.columnsToHide);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            // controller que manejará el modal del filtro por columna
            var AdvancedFilterModalCtrl = function($scope, $modalInstance, headers, advancedFilterObj)
            {
                $scope.advancedFilterObj = UtilsService.createAdvancedFilterObj(headers, advancedFilterObj);
                $scope.headerNames = [];
                angular.forEach(headers, function(value, key){
                    if(!value.isHidden){
                        $scope.headerNames.push(value.name);
                    }
                });

                // en este caso se llamará a la función de callback, en la función cancel, no
                $scope.ok = function () {
                    $modalInstance.close($scope.advancedFilterObj);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    }
});