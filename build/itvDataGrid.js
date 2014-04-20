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
'use strict';

/**
 * @ngdoc module
 * @name itvUtilDirectives
 * @description
 *
 * Módulo con directivas de utilidad para diversas tareas.
 *
 */
var itvUtilDirectivesModule = angular.module('itvUtilDirectives', ['itvMessagesModule', 'ngAnimate']);

/**
 * @ngdoc directive
 * @name itvCheckboxlist
 * @restrict A
 *
 * @description
 * Directiva para manejar una lista de checkboxes y convertir la selección en un array de valores.
 * Recibe un array que almacenará la lista de checkboxes marcados, para cada checkbox marcado su
 * atributo 'value' será guardado en el array, que es pasado a la directiva de forma que se
 * establece un enlace de datos bidireccional ('two-way data binding').
 * Vigila el cambio del valor del checkbox para actualizar los valores cada vez que cambie.
 * También establece un $watch sobre el array, de modo que permitiría que un elemento externo
 * introdujese valores en el array y actualizaría el valor del checkbox.
 *
 * @element INPUT (checkbox)
 * @param {array=} itvCheckboxlist Array con los valores marcados de la lista de checkbox.
 * @param {string} value Cadena que se almacenará en el Array en caso de que el checkbox sea marcado.
 *
 */
itvUtilDirectivesModule.directive('itvCheckboxlist', function($log){
    return {
        scope: {
            list: '=itvCheckboxlist',
            value: '@'
        },
        link: function(scope, elem, attrs){
            var modelToView = function(){
                var checked = elem.prop('checked');
                var index = scope.list.indexOf(scope.value);
                if(checked && index == -1){
                    elem.prop('checked', false);
                } else if(!checked && index != -1){
                    elem.prop('checked', true);
                }
            };

            var viewToModel = function(){
                var checked = elem.prop('checked');
                var index = scope.list.indexOf(scope.value);
                if(checked && index == -1){
                    scope.list.push(scope.value);
                } else if(!checked && index != -1){
                    scope.list.splice(index, 1);
                }
            };

            elem.bind('change', function(){
                scope.$apply(viewToModel());
            });
            scope.$watch('list', modelToView, true);
        }
    }
});

/**
 * @ngdoc directive
 * @name itvEnterkey
 * @restrict A
 *
 * @description
 * Directiva que responde a una pulsación de la tecla 'Enter' ejecutando la función referenciada.
 * Intercepta las pulsaciones y las compara con el código de la tecla 'Enter' (13).
 *
 * @element INPUT
 * @param {expression} itvEnterkey Función a ejecutar cuando se detecte la pulsación de la tecla 'Enter'.
 *
 */
itvUtilDirectivesModule.directive('itvEnterkey', function(){
    return function (scope, element, attrs){
        element.bind('keydown keypress', function(event){
            // 13 es el código de la tecla enter
            if(event.which === 13){
                event.preventDefault();
                scope.$apply(function(){
                    scope.$eval(attrs.itvEnterkey);
                });
            }
        });
    };
});

/**
 * @ngdoc directive
 * @name itvBlur
 * @restrict A
 *
 * @description
 * Directiva que responde al evento de pérdida de foco ejecutando la función referenciada.
 *
 * @element INPUT
 * @param {expression} itvBlur Función a ejecutar cuando se detecte la pérdida de foco.
 *
 */
itvUtilDirectivesModule.directive('itvBlur', function(){
    return function(scope, element, attrs){
        element.bind('blur', function(event){
            scope.$apply(function(){
                scope.$eval(attrs.itvBlur);
            });
        });
    };
});

/**
 * @ngdoc directive
 * @name itvMessage
 * @restrict A
 *
 * @description
 * Directiva para mostrar un literal a partir de una clave.
 * Al hacer uso del servicio de Angular $interpolate, permite que los literales contengan
 * elementos interpolados del tipo:
 *
 * Lorem ipsum {{ dolor }} sit amet...
 *
 * Se utiliza la función 'compile' para determinar inicialmente si existe un parámetro
 * que defina los valores en los que se apoyará un literal con valores interpolados.
 * El parámetro en sí también será un valor interpolado de forma que mediante la
 * función $observe del objeto de atibutos se detectará un cambio en los parámetros
 * utilizados y se actualizará el literal.
 *
 * A pesar de definir un scope aislado la interpolación se realizará con el objeto
 * 'scope' del padre de la directiva (scope.$parent).
 * Una vez resuelto el literal a mostrar lo inyectará en el html del elemento.
 *
 * @element ANY
 * @param {string} itvMessage Función a ejecutar cuando se detecte la pérdida de foco.
 *
 */
itvUtilDirectivesModule.directive('itvMessage', function($interpolate, itvMessages){
    return {
        restrict: 'A',
        scope: true,
        compile: function(tElem, tAttr){
            var params = tAttr.itvMessageParam ? tAttr.itvMessageParam : undefined;

            return function(scope, elem, attrs){
                if(attrs.itvMessage){
                    scope.literal = itvMessages[attrs.itvMessage] || attrs.itvMessage;
                }

                var updateValue = function(){
                    scope.value = $interpolate(scope.literal)(scope.$parent);
                    elem.html(scope.value);
                };

                if(params){
                    attrs.$observe('itvMessageParam', function(newParams){
                        updateValue();
                    });
                }

                updateValue();
            }
        }
    }
});

/**
 * @ngdoc directive
 * @name itvTooltipfade
 * @restrict A
 *
 * @description
 * Directiva para hacer desaparecer el tooltip de Angular Bootstrap UI.
 * Dado que no hay api para el acceso programático se utiliza un 'hack'
 * que consiste en modificar una propiedad expuesta por el propio bootstrap
 * para realizar la ocultación tras un timeout definido.
 * La directiva permite su uso con un valor en milisegundos como parámetro
 * para definir el tiempo que tarda el tooltip en desaparecer
 *
 * @element ANY
 * @param {number} itvTooltipfade Opcional, define el tiempo de timeout para
 * eliminar el tooltip.
 *
 */
itvUtilDirectivesModule.directive('itvTooltipfade', function($timeout){
    return function(scope, elem, attrs){
        elem.bind('mouseenter', function(){
            var timeout = attrs.itvTooltipfade || 2000;
            $timeout(function(){
                scope.tt_isOpen = false;
            }, timeout);
        });
    }
});

/**
 * @ngdoc directive
 * @name itvAnimate
 * @restrict A
 *
 * @description
 * Directiva que añade una clase css al elemento cuando cambia la expresión
 * definida como parámetro, para ello utiliza $watch().
 * Permite definir la clase a añadir si se incluye el parámetro
 * itv-animate-class
 *
 * @element ANY
 * @param {expression} itvAnimate Expresión de cuyo valor depende que
 * se añada la clase css al elemento.
 *
 */
itvUtilDirectivesModule.directive('itvAnimate', function($animate){
    return {
        scope: true,
        link: function(scope, element, attrs){
            var classToAdd = attrs.itvAnimateClass ? attrs.itvAnimateClass : 'itvAnimate';
            scope.$watch(attrs.itvAnimate, function(newValue){
                if(newValue){
                    $animate.addClass(element, classToAdd);
                } else {
                    $animate.removeClass(element, classToAdd);
                }
            })
        }
    }
});
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
        templateUrl: 'itvGridTemplates/src/templates/panelHeader.html',
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
        templateUrl: 'itvGridTemplates/src/templates/panelFooter.html',
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
        templateUrl: 'itvGridTemplates/src/templates/panelBody.html',
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
                    templateUrl: 'itvGridTemplates/src/templates/hideColumnModal.html',
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
                    templateUrl: 'itvGridTemplates/src/templates/advancedFilterModal.html',
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
'use strict';

/**
 * @ngdoc module
 * @name itvFilters
 * @description
 *
 * Módulo con los filtros utilizados en el grid
 *
 */
var itvFiltersModule = angular.module('itvFilters', ['itvMessagesModule']);

/**
 * @ngdoc filter
 * @name paginationFilter
 * @function
 *
 * @description
 *
 * Realiza la paginación de los elementos del grid de datos. Devuelve un subconjunto
 * de elementos del array en base a los parámetros recibidos.
 *
 * @param {array} input Array de elementos a paginar
 * @param {number | string} pagina Número de página a devolver
 * @param {number | string} itemsPorPagina Número de elementos mostrados en cada página
 *
 * @returns {array} subconjunto del array de entrada en base a los parámetros recibidos.
 *
 */
itvFiltersModule.filter('paginationFilter', function(){
    return function(input, pagina, itemsPorPagina){
        if(_.isUndefined(input)){
            return input;
        }
        else{
            var itemInicio = pagina == 1 ? 0 : (pagina - 1) * itemsPorPagina;
            // al venir de un elemento 'select' de html, itemsPorPagina se recibe como
            // string, para evitar que el operador '+' haga concatenación en vez de
            // suma se realiza antes la multiplicación para forzar la conversión en número
            return input.slice(itemInicio, itemInicio + (itemsPorPagina * 1));
        }
    }
});

/**
 * @ngdoc filter
 * @name capitalize
 * @function
 *
 * @description
 *
 * Convierte la primera letra de la cadena recibida en mayúscula.
 * Si no recibe un string devolverá el parámetro sin modificarlo.
 *
 * @param {string} input Cadena cuya primera letra hay que mostrar en mayúsculas
 *
 * @returns {string} String de entrada con su primera letra en mayúsculas
 *
 */
itvFiltersModule.filter('capitalize', function(){
    return function(input) {
        if (!angular.isString(input) || !input){
            return input;
        } else {
            return input.substring(0,1).toUpperCase() + input.substring(1);
        }
    }
});

/**
 * @ngdoc filter
 * @name messageFilter
 * @function
 *
 * @description
 *
 * Utiliza la clave recibida para obtener un literal almacenado en el módulo de mensajes.
 * Si no recibe un string o si no encuentra correspondencia con un literal para la clave,
 * la devolverá sin modificar.
 *
 * @param {string} key Clave del módulo de mensajes que corresponde a un literal definido.
 *
 * @returns {string} Literal definido en el módulo de mensajes que corresponde a la clave
 * pasada como parámetro o la clave si no lo encuentra.
 */
itvFiltersModule.filter('messageFilter', function(itvMessages){
    return function(key){
        if(!angular.isString(key) || !key){
            return key;
        } else {
            return itvMessages[key] || key;
        }
    }
});
'use strict';

/**
 * @ngdoc module
 * @name itvDataResource
 * @description
 *
 * Define un servicio para recuperar datos a partir de una URL definida a través de
 * un api REST.
 *
 */
var dataResourceModule = angular.module('itvDataResource', []);

/**
 * @ngdoc object
 * @name DataResource
 * @description
 *
 * Servicio para manipulación de datos de forma remota (http) a través de
 * un api REST.
 * Permite las operaciones habituales de crear, leer, actualizar y borrar
 * (CRUD por su acrónimo inglés).
 *
 * El servicio está definido como un 'provider' para permitir la opción de
 * realizar tareas de configuración en la fase de configuración de AngularJS.
 * En la fase de configuración, al no estar instanciado todavía el servicio
 * deberá inyectarse en el código el 'provider' correspondiente al mismo,
 * la notación es el nombre del servicio concatenado con la cadena 'Provider',
 * en este caso se debería realizar la inyección del objeto
 * DataResourceProvider.
 *
 */
dataResourceModule.provider('DataResource', function(){

    var configurador = {};
    var configObj = {};

    // se define un método en el que se realizará la configuración y se
    // inicializará añadiendo métodos al objeto pasado como parámetro.
    // Así será posible invocarlo con 'this' como el objeto (en este caso
    // 'this' corresponderá al 'provider') y posteriormente realizar la
    // llamada al método con el servicio como parámetro, lo que permitirá
    // el uso de los métodos tanto en fase de configuración como en fase
    // de ejecución sin duplicar código.
    configurador.configurar = function(obj, config){

        /**
         * @ngdoc method
         * @name DataResource#setUrl (DataResourceProvider#setUrl)
         *
         * @description
         *
         * Establece la Url base del servicio REST con el que interactuar.
         *
         * @param {string} url Url base del api REST cuyos datos se mostrarán.
         *
         */
        obj.setUrl = function(url){
            if(!_.isUndefined(url)){
                if(url.charAt(url.length - 1)  !== '/'){
                    url = url + '/';
                }
                config.url = url;
                console.log('Establecida url: ' + config.url);
            }
        };

        config.idField = _.isUndefined(config.idField) ? 'id' : config.idField;

        /**
         * @ngdoc method
         * @name DataResource#setIdField (DataResourceProvider#setIdField)
         *
         * @description
         *
         * Establece el campo que actuará como identificador de los registros.
         * Su valor por defecto es 'id'.
         *
         * @param {string} idField Campo identificador de cada uno de los
         * registros recuperados a través del servidor.
         *
         */
        obj.setIdField = function(idField){
            if(!_.isUndefined(idField)){
                config.idField = idField;
            }
        };

        config.requestParams = {} || config.requestParams;

        /**
         * @ngdoc method
         * @name DataResource#setRequestParams (DataResourceProvider#setRequestParams)
         *
         * @description
         *
         * Permite establecer parámetros por defecto que se enviarán en las peticiones
         *
         * @param {object} params Objeto con los parámetros a enviar en las peticiones
         * http al servidor.
         *
         */
        obj.setRequestParams = function(params){
            if(!_.isUndefined(params)){
                config.requestParams = params;
            }
        };

        config.notEditableFields = [config.idField];

        //TODO método para establecer los campos no editables

        /**
         * @ngdoc method
         * @name DataResource#getNotEditableFields (DataResourceProvider#getNotEditableFields)
         *
         * @description
         *
         * Obtiene la lista de campos que no se pueden editar. Por defecto el campo
         * definido como id no será editable.
         *
         * @returns {array} Un array de string con los nombres de los campos no editables.
         */
        obj.getNotEditableFields = function(){
            return config.notEditableFields;
        };
    };

    configurador.configurar(this, configObj);

    // para la instanciación del servicio, al estar declarado como 'provider',
    // angularJS invocará el método $get() y utilizará el resultado en la inyección
    this.$get = ['$http', '$log', '$q', function($http, $log, $q){

        // constructor para objetos DataResource, todos los elementos devueltos
        // por el servicio serán de este tipo.
        var DataResource = function(data){
            angular.extend(this, data);
        };

        // método para obtener el id de un elemento.
        var getId = function(data){
            return data[configObj.idField];
        };

        /**
         * @ngdoc method
         * @name DataResource#query
         *
         * @description
         *
         * Método para consultar la lista de elementos a través del api REST.
         * Realiza una petición GET a la Url establecida y convierte cada uno de
         * los elementos devueltos en objetos DataResource.
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         *
         *
         * @returns {object} Un objeto promise que se resolverá con el array de
         * elementos a mostrar cuando se complete la petición asíncrona. Los
         * elementos contendrán los datos devueltos por el servicio y serán
         * del tipo DataResource.
         */
        DataResource.query = function(){
            $log.log('query class function');
            var deferred = $q.defer();
            $http.get(configObj.url, {params: configObj.requestParams}).
                then(function (response){
                    $log.log(response.data);
                    var result = [];
                    angular.forEach(response.data, function (value, key){
                        result[key] = new DataResource(value);
                    });
                    deferred.resolve(result);
                });
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name DataResource#get
         *
         * @description
         *
         * Método para obtener un elemento a través de su campo id, realizará una
         * petición http de tipo GET a la url <url base> + <id>
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         *
         * @param {string} id Identificador del elemento a recuperar
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona. El elemento contendrá los
         * datos devueltos por el servicio y será un objeto de tipo DataResource.
         */
        DataResource.get = function(id){
            $log.log('get(id) class function');
            var getUrl = configObj.url + id;
            var deferred = $q.defer();
            $http.get(getUrl, {params: configObj.requestParams}).
                then(function(data, status, headers, config){
                    var resource = new DataResource(data);
                    deferred.resolve(resource);
                });
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name DataResource#$id
         *
         * @description
         *
         * Obtiene el campo id del objeto, es un método de instancia por lo que será
         * utilizable en cualquier elemento devuelto por el servicio DataResource.
         *
         * @returns {string} El valor del campo definido como id en la instancia
         * en la que se invoca.
         */
        DataResource.prototype.$id = function(){
            return getId(this);
        };

        /**
         * @ngdoc method
         * @name DataResource#save
         *
         * @description
         *
         * Método para realizar una inserción de un nuevo elemento a través de una
         * petición al api REST. La petición http será de tipo POST a la url base
         * definida por el servicio.
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         *
         * @param {object} data Objeto con los datos de la inserción.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona. El elemento contendrá los
         * datos devueltos por el servicio y será un objeto de tipo DataResource.
         */
        DataResource.save = function(data){
            var deferred = $q.defer();
            $http.post(configObj.url, data, {params: configObj.requestParams}).
                then(function(data, status, headers, config){
                    var resource = new DataResource(data);
                    deferred.resolve(resource);
                });
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name DataResource#$save
         *
         * @description
         *
         * Método para realizar una inserción de un nuevo elemento a través de una
         * petición al api REST. La petición http será de tipo POST a la url base
         * definida por el servicio.
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         * La diferencia con el método DataResource#save es que éste es un método de
         * instancia, de forma que se pueda invocar directamente sobre un elemento
         * devuelto previamente por el servicio.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona. El elemento contendrá los
         * datos devueltos por el servicio y será un objeto de tipo DataResource.
         */
        DataResource.prototype.$save = function(){
            $log.log('save instance function');
            return DataResource.save(this);
        };

        /**
         * @ngdoc method
         * @name DataResource#remove
         *
         * @description
         *
         * Método para eliminar un elemento a través de una petición al api REST.
         * La petición http será de tipo DELETE a la url <url base> + <id>.
         * Internamente utilizará únicamente el campo definido como id del objeto
         * para realizar la petición.
         *
         * @param {object} data Objeto a eliminar.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona al servicio $http.
         */
        DataResource.remove = function(data){
            $log.log('remove class function');
            $log.log(data);
            var id = _.isObject(data) ? data.$id() : data;
            var removeUrl = configObj.url + id;
            return $http.delete(removeUrl, {params: configObj.requestParams})
        };

        /**
         * @ngdoc method
         * @name DataResource#$remove
         *
         * @description
         *
         * Método para eliminar un elemento a través de una petición al api REST.
         * La petición http será de tipo DELETE a la url <url base> + <id>.
         * Internamente utilizará únicamente el campo definido como id del objeto
         * para realizar la petición.
         * La diferencia con el método DataResource#remove es que éste es un método
         * de instancia, de forma que se pueda invocar directamente sobre un elemento
         * devuelto previamente por el servicio.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona al servicio $http.
         */
        DataResource.prototype.$remove = function(){
            $log.log('remove instance function');
            return DataResource.remove(this);
        };

        /**
         * @ngdoc method
         * @name DataResource#update
         *
         * @description
         *
         * Método para realizar una modificación de un elemento a través de una
         * petición al api REST. La petición http será de tipo PUT a la url
         * <url base> + <id>.
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         *
         * @param {object} data Objeto con los datos de la modificación.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona. El elemento contendrá los
         * datos devueltos por el servicio y será un objeto de tipo DataResource.
         */
        DataResource.update = function(data){
            $log.log('update class function');
            var id = data instanceof DataResource ? data.$id() : data[configObj.idField];
            var updateUrl = configObj.url + id;
            var deferred = $q.defer();
            $http.put(updateUrl, data, {
                params: configObj.requestParams,
                //TODO es necesario el content-type?
                headers: {'Content-Type': 'application/json'}
                }).then(function(result){
                    var dr = new DataResource(result.data);
                    deferred.resolve(dr);
            });
            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name DataResource#$update
         *
         * @description
         *
         * Método para realizar una modificación de un elemento a través de una
         * petición al api REST. La petición http será de tipo PUT a la url
         * <url base> + <id>.
         * Hace uso del api $q de promesas de AngularJS para devolver una promesa
         * en vez del resultado ya que la funcionalidad es asíncrona.
         * La diferencia con el método DataResource#update es que éste es un método
         * de instancia, de forma que se pueda invocar directamente sobre un elemento
         * devuelto previamente por el servicio.
         *
         * @returns {object} Un objeto promise que se resolverá con el elemento
         * cuando se complete la petición asíncrona. El elemento contendrá los
         * datos devueltos por el servicio y será un objeto de tipo DataResource.
         */
        DataResource.prototype.$update = function(){
            $log.log('update instance function');
            return DataResource.update(this);
        };

        // se invoca de nuevo a la función para que el servicio DataResource
        // tenga los mismos métodos que el provider sin duplicar el código.
        configurador.configurar(DataResource, configObj);

        return DataResource;
    }];

});
/**
 * Created by itorrev on 10/04/14.
 */
'use strict';

/**
 * @ngdoc module
 * @name itvMessagesModule
 * @description
 *
 * Módulo que define un objeto que empareja clave-valor de los literales
 * utilizados en el grid, de forma que todos los literales estén en un
 * único fichero lo que facilitará su modificación.
 *
 */
var itvMessagesModule = angular.module('itvMessagesModule', []);

itvMessagesModule.value('itvMessages', {
    'panelbody.search.label': 'Buscar: ',
    'panelbody.search.tooltip': 'Filtro por columna activado',
    'panelbody.menu.add': 'Nuevo Registro',
    'panelbody.menu.hidecolumns': 'Ocultar Columnas',
    'panelbody.menu.filtercolumns': 'Filtrar Columnas',
    'panelbody.page.items': 'Filas por p&aacute;gina: ',
    'panelbody.search.btn.tooltip': 'Buscar en todas las columnas',
    'panelbody.remove.btn.tooltip': 'Eliminar filtro por columna',
    'panelbody.options.btn.tooltip': 'Opciones',
    'panelfooter.number.items': 'Mostrando {{ firstLastTotalObj.initIndex }} - {{ firstLastTotalObj.endIndex }} de {{ firstLastTotalObj.totalItems }} elementos',
    'modal.hidecolumns.label': 'Seleccionar columnas a ocultar',
    'modal.filter.label': 'Filtrar por campos',
    'modal.btn.ok': 'Aceptar',
    'modal.btn.cancel': 'Cancelar',
    'modal.btn.filter': 'Filtrar',
    'action.btn.delete.tooltip': 'Borrar elemento',
    'action.btn.edit.tooltip': 'Editar elemento',
    'action.btn.undo.tooltip': 'Deshacer',
    'action.btn.save.tooltip': 'Guardar',
    'action.btn.clearedit.tooltip': 'Quitar edici&oacute;n'
});
/**
 * @ngdoc module
 * @name itvUtilsService
 * @description
 *
 * Servicio con funciones que se utilizan en diferentes puntos del código.
 * Su refactorización en este servicio facilita la reutilización de código
 * evitando duplicidades.
 *
 */
var utilsServiceModule = angular.module('itvUtilsService', []);

/**
 * @ngdoc object
 * @name UtilsService
 * @description
 *
 * Contiene métodos reutilizables para su uso en distintas partes del
 * código del grid de datos.
 */
utilsServiceModule.factory('UtilsService', function(filterFilter){
    var UtilsService = {};

    /**
     * @ngdoc method
     * @name UtilsService#createHeaders
     *
     * @description
     *
     * Crea un objeto por cada cabecera de la tabla que almacenará el nombre
     * a mostrar, si se puede editar el campo correspondiente a esa columna
     * y si está oculto.
     *
     *
     * @param {array} headers Array con los nombres de cada columna de la tabla del grid.
     * @param {array} notEditableFields Array con los nombres de las columnas
     * que no permiten su edición.
     * @param {array} hiddenColumns Array con los nombres de cada columna no visible.
     *
     * @returns {array} Array con un objeto por cada columna con su nombre, si está
     * oculto y si es editable.
     *
     */
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

    /**
     * @ngdoc method
     * @name UtilsService#filterData
     *
     * @description
     *
     * Invoca al filtro general de AngularJS (filterFilter) para realizar búsquedas
     * en los elementos del grid.
     * Es necesaria la invocación del filtro en el código en vez de realizarlo en
     * el html con la notación habitual del filtro en AngularJS ya que se debe
     * guardar el número de elementos resultantes del filtrado tanto para la
     * paginación como para el literal del pie del grid donde se indican los
     * elementos mostrados y totales.
     *
     *
     * @param {string | function | object} filterParams Condición que se utilizará
     * para discriminar elementos.
     * Puede ser:
     * -string:
     *      El filtro devolverá todos los elementos que tengan alguna propiedad de
     *      tipo string que contenga la cadena.
     *
     * -function:
     *      El filtro devolverá los elementos para los que la función devuelva true al
     *      pasárselos como parámetro.
     *
     * -object:
     *      Se utilizará como patrón de ejemplo, buscando cadenas en propiedades
     *      específicas. Por ejemplo, si se usa el objeto
     *      { nombre: 'ivan', ciudad: 'guadalajara'} devolverá los objetos cuya
     *      propiedad nombre contenga la cadena 'ivan' y cuya propiedad ciudad
     *      contenga la cadena 'guadalajara'.
     *
     * @param {array} scopedData Elementos mostrados actualmente en el grid de datos.
     *
     * @returns {array} Subconjunto de los elementos del grid de datos que cumplen las
     * condiciones impuestas por la condición de filtrado.
     *
     */
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

    /**
     * @ngdoc method
     * @name UtilsService#setHiddenColumns
     *
     * @description
     *
     * Establece los valores de columna visible/ocultada para todas las columnas.
     *
     * @param {array} headers Array de objetos que corresponden a las columnas del
     * grid de datos.
     * @param {array} hiddenColumns Array con los nombres de cada columna no visible.
     *
     */
    UtilsService.setHiddenColumns = function(headers, hiddenColumns){
        angular.forEach(headers, function(value, key){
            value.isHidden = _.contains(hiddenColumns, value.name);
        });
    };

    /**
     * @ngdoc method
     * @name UtilsService#createAdvancedFilterObj
     *
     * @description
     *
     * Crea un nuevo objeto que servirá de patrón para el filtrado por columna.
     *
     *
     * @param {array} headers Array de objetos que corresponden a las columnas del
     * grid de datos.
     * @param {object} advancedFilterObj Objeto que sirve de patrón para realizar
     * el filtrado por columna.
     *
     * @returns {object} Un nuevo objeto para realizar el filtrado por columna
     * teniendo en cuenta si alguna columna ha sido ocultada o mostrada y
     * conservando los valores previos.
     *
     */
    UtilsService.createAdvancedFilterObj = function(headers, advancedFilterObj){
        var newAdvancedFilter = {};
        angular.forEach(headers, function(value, key){
            if(!value.isHidden){
                newAdvancedFilter[value.name] = '' || advancedFilterObj[value.name];
            }
        });
        return newAdvancedFilter;
    };

    /**
     * @ngdoc method
     * @name UtilsService#createCustomFilterFunction
     *
     * @description
     *
     * método para crear una función a medida para su uso en el filtro "filter" de AngularJS.
     * La función devuelta se invocará con cada uno de los elementos a filtrar como parámetro
     * y devolverá true si encuentra la cadena a buscar en cualquiera de las propiedades el
     * elemento que no se corresponda con una columna no visible.
     * Al no existir documentación al respecto he tenido que buscar su implementación en el
     * código fuente para averiguar cómo utilizar el filtro para que no aplique a las columnas
     * no visibles.
     *
     * @param {string} filterText Cadena a buscar
     * @param {array} headers Array de objetos que corresponden a las columnas del grid de datos.
     *
     * @returns {boolean} Buscará en el objeto la cadena filterText en las propiedades que
     * coincidan con el nombre de columnas visibles, devolviendo true si la encuentra y
     * false en caso contrario.
     */
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
     * @ngdoc method
     * @name UtilsService#getFirstLastTotalObject
     *
     * @description
     *
     * Crea un objeto con los índices de los elementos mostrados inicial y final
     * así como los elementos totales que se utilizará en conjunción con la
     * directiva para mostrar literales de forma que un literal que contenga
     * variables interpoladas se actualice cuando cambien dichos valores.
     *
     * @param {number} currentPage Número de página actual
     * @param {number} totalItems Total de elementos mostrados
     * @param {number} itemsPerPage Elementos mostrados en cada página
     *
     * @returns {object} un objeto con los valores calculados.
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

/**
 * @ngdoc module
 * @name itvAnimations
 * @description
 *
 * Contiene las animaciones a utilizar en el grid de datos
 *
 */
var itvAnimationsModule = angular.module('itvAnimations', []);

/**
 * @ngdoc animation
 * @name itvSlide
 * @description
 *
 * Realiza una animación de deslizamiento arriba y abajo cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 * Es necesario guardar la altura del elemento para realizar correctamente el deslizamiento
 * al mostrar.
 * Durante la animación de deslizar hacia arriba (ocultar) se añade la clase 'overflowHidden'
 * para que funcione correctamente, pero como da problemas si se deja de continuo tras
 * realizar la animación de deslizar hacia abajo (mostrar) se vuelve a quitar y para que no
 * se solape con la transición se le establece un timeout ligeramente superior a la duración
 * definida. También tras la animación se cambia la propiedad css de 'height' al valor
 * 'auto' para permitir que varíe el tamaño en función del número deelementos mostrados. No
 * es posible utilizar ese valor directamente puesto que en ese caso la animación no
 * funcionaría.
 *
 */
itvAnimationsModule.animation('.itvSlide', function($timeout, $log){
    var height = 0;
    return {
        beforeAddClass: function(element, className, done){
            if (className === 'ng-hide'){
                height = element.height();
                element.addClass('overflowHidden');
                TweenMax.to(element, 1, {css: {height: 0}, onComplete: done});
            }
        },
        removeClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {height: height}, onComplete: done});
                $timeout(function(){
                    element.removeClass('overflowHidden');
                    element.css('height', 'auto');
                }, 1100);
            }
        }
    }
});

/**
 * @ngdoc animation
 * @name itvFade
 * @description
 *
 * Realiza una animación de 'fade in-out' cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 */
itvAnimationsModule.animation('.itvFade', function($log){
    return {
        beforeAddClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {opacity: 0}, onComplete: done});
            }
        },
        removeClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {opacity: 1}, onComplete: done});
            }
        }
    }
});

angular.module('itvGrid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('itvGridTemplates/src/templates/advancedFilterModal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 itv-message=\"modal.filter.label\"></h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\" ng-repeat=\"name in headerNames\">\r" +
    "\n" +
    "            <label class=\"col-sm-2 control-label\" for=\"{{name}}\">{{name | capitalize}}</label>\r" +
    "\n" +
    "            <div class=\"col-sm-8\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"advancedFilterObj[name]\" id=\"{{name}}\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" itv-message=\"modal.btn.filter\"></button>\r" +
    "\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\" itv-message=\"modal.btn.cancel\"></button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/hideColumnModal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 itv-message=\"modal.hidecolumns.label\"></h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "            <ul>\r" +
    "\n" +
    "                <li ng-repeat=\"name in headerNames\">\r" +
    "\n" +
    "                    <div class=\"checkbox\">\r" +
    "\n" +
    "                        <label><input type=\"checkbox\" value=\"{{name}}\" itv-checkboxlist=\"columnsToHide\"> {{ name | capitalize}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" itv-message=\"modal.btn.ok\"></button>\r" +
    "\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\" itv-message=\"modal.btn.cancel\"></button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/itvGrid.html',
    "<div class=\"panel panel-default\">\r" +
    "\n" +
    "    <itv-Panelheader></itv-Panelheader>\r" +
    "\n" +
    "    <div class=\"animated-panel itvSlide\" ng-hide=\"isCollapsed\">\r" +
    "\n" +
    "        <itv-Panelbody></itv-Panelbody>\r" +
    "\n" +
    "        <table class=\"table table-striped table-bordered table-condensed table-hover\" id=\"tableTest\">\r" +
    "\n" +
    "            <thead>\r" +
    "\n" +
    "            <tr>\r" +
    "\n" +
    "                <th ng-repeat=\"header in headers\" ng-click=\"setOrderBy(header.name)\" class=\"headerStyle itvFade\" ng-hide=\"header.isHidden\">\r" +
    "\n" +
    "                    {{ header.name | capitalize}}\r" +
    "\n" +
    "                    <i ng-class=\"{'fa-sort-asc': orderBy.asc, 'fa-sort-desc': !orderBy.asc}\" ng-show=\"orderBy.headerName == header.name\" class=\"fa rightFloater\"></i>\r" +
    "\n" +
    "                    <i class=\"fa fa-sort rightFloater\" ng-show=\"orderBy.headerName != header.name\"></i>\r" +
    "\n" +
    "                </th>\r" +
    "\n" +
    "                <th class=\"col-xs-1\">Action</th>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            </thead>\r" +
    "\n" +
    "            <tbody>\r" +
    "\n" +
    "            <tr ng-show=\"insertMode\">\r" +
    "\n" +
    "                <td ng-repeat=\"header in headers\" ng-hide=\"header.isHidden\" class=\"itvFade\">\r" +
    "\n" +
    "                    <div ng-show=\"header.isEditable\"><input class=\"form-control\" type=\"text\" ng-model=\"insertRow[header.name]\"></div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <div class=\"btn-group\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"insertData()\"><i class=\"fa fa-save fa-lg\"></i></button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setInsertMode()\"><i class=\"fa fa-reply fa-lg\"></i></button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            <tr ng-repeat=\"row in filteredData | orderBy:orderBy.headerName:!orderBy.asc | paginationFilter:pagina:itemsPorPagina\">\r" +
    "\n" +
    "                <td ng-repeat=\"header in headers\" ng-hide=\"header.isHidden\"  class=\"itvFade\">\r" +
    "\n" +
    "                    <div ng-show=\"row.editMode == null || row.editMode == false || !header.isEditable\">{{ row[header.name] }}</div>\r" +
    "\n" +
    "                    <div ng-show=\"row.editMode == true && header.isEditable\"><input class=\"form-control\" type=\"text\" ng-model=\"copiedEditingRow[header.name]\"></div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "                <td>\r" +
    "\n" +
    "                    <div class=\"btn-group\" ng-show=\"row.editMode == null || row.editMode == false\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"deleteData(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.delete.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-trash-o fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setRowEditable(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.edit.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-edit fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"btn-group\" ng-show=\"row.editMode == true\">\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"setRowEditable(row)\" itv-tooltipfade tooltip=\"{{ 'action.btn.undo.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-reply fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                        <button class=\"btn btn-default btn-sm\" ng-click=\"updateData(copiedEditingRow)\" ng-show=\"row.editMode == true\"\r" +
    "\n" +
    "                                itv-tooltipfade tooltip=\"{{ 'action.btn.save.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                            <i class=\"fa fa-save fa-lg\"></i>\r" +
    "\n" +
    "                        </button>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </td>\r" +
    "\n" +
    "            </tr>\r" +
    "\n" +
    "            </tbody>\r" +
    "\n" +
    "        </table>\r" +
    "\n" +
    "        <itv-Panelfooter></itv-Panelfooter>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelBody.html',
    "<div class=\"panel-body\">\r" +
    "\n" +
    "    <form class=\"form-inline\" role=\"form\">\r" +
    "\n" +
    "        <div class=\"form-group\" ng-hide=\"advancedFilterActive\">\r" +
    "\n" +
    "            <label for=\"buscar\" itv-message=\"panelbody.search.label\"></label>\r" +
    "\n" +
    "            <input class=\"form-control\" type=\"text\" id=\"buscar\" ng-model=\"genericSearchFilter\"\r" +
    "\n" +
    "                   ng-disabled=\"advancedFilterActive\" itv-enterkey=\"doGenericFilter()\" itv-blur=\"doGenericFilter()\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group\" tooltip=\"{{'panelbody.search.tooltip' | messageFilter }}\"\r" +
    "\n" +
    "             itv-tooltipfade ng-show=\"advancedFilterActive\">\r" +
    "\n" +
    "            <label for=\"buscardisabled\" itv-message=\"panelbody.search.label\"></label>\r" +
    "\n" +
    "            <input class=\"form-control\" type=\"text\" id=\"buscardisabled\" ng-disabled=\"advancedFilterActive\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm form-control\" ng-hide=\"advancedFilterActive\" itv-tooltipfade\r" +
    "\n" +
    "                    ng-click=\"doGenericFilter()\" tooltip=\"{{ 'panelbody.search.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-filter fa-lg\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm form-control\" ng-show=\"advancedFilterActive\" itv-tooltipfade\r" +
    "\n" +
    "                    ng-click=\"clearAdvancedFilter()\" tooltip=\"{{ 'panelbody.remove.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-times fa-lg\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group dropdown rightFloater options-btn\">\r" +
    "\n" +
    "            <button class=\"btn btn-default btn-sm dropdown-toggle form-control rightFloater\" itv-tooltipfade\r" +
    "\n" +
    "                    tooltip=\"{{ 'panelbody.options.btn.tooltip' | messageFilter }}\">\r" +
    "\n" +
    "                <i class=\"fa fa-cog fa-lg\"></i>\r" +
    "\n" +
    "                <i class=\"fa fa-sort-down\"></i>\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <ul class=\"dropdown-menu\">\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"setInsertMode()\">\r" +
    "\n" +
    "                    <i class=\"fa fa-plus fa-lg\"></i> <span itv-message=\"panelbody.menu.add\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"openHideColumnModal()\">\r" +
    "\n" +
    "                    <i class=\"fa fa-columns fa-lg\"></i> <span itv-message=\"panelbody.menu.hidecolumns\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "                <li class=\"clickable menuItem\" ng-click=\"openAdvancedFilterModal()\">\r" +
    "\n" +
    "                    <i class=\"fa fa-filter fa-lg\"></i> <span itv-message=\"panelbody.menu.filtercolumns\"></span>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"form-group rightFloater\">\r" +
    "\n" +
    "            <label for=\"itemsPorPagina\" itv-message=\"panelbody.page.items\"></label>\r" +
    "\n" +
    "            <select class=\"form-control\" id=\"itemsPorPagina\" ng-model=\"itemsPorPagina\">\r" +
    "\n" +
    "                <option>10</option>\r" +
    "\n" +
    "                <option>25</option>\r" +
    "\n" +
    "                <option>50</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelFooter.html',
    "<div class=\"panel-footer\">\r" +
    "\n" +
    "    <div class=\"leftFloater\" itv-message=\"panelfooter.number.items\" itv-message-param=\"{{ firstLastTotalObj }}\">\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"rightFloater\">\r" +
    "\n" +
    "        <pagination boundary-links=\"true\" total-items=\"itemsTotales\" page=\"pagina\" items-per-page=\"itemsPorPagina\" class=\"pagination-sm\" max-size=\"5\" rotate=\"false\"\r" +
    "\n" +
    "                    on-select-page=\"cambioPagina(page)\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"clearBoth\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('itvGridTemplates/src/templates/panelHeader.html',
    "<div class=\"panel-heading\">\r" +
    "\n" +
    "    <div>\r" +
    "\n" +
    "        <div class=\"leftFloater\"><i class=\"fa fa-table\"></i> {{title}}</div>\r" +
    "\n" +
    "        <div class=\"rightFloater clickable\">\r" +
    "\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-chevron-up': !isCollapsed, 'fa-chevron-down': isCollapsed}\" ng-click=\"collapse()\"></i>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"clearBoth\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);