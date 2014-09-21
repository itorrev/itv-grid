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
var utilsServiceModule = angular.module('itvUtilsService', ['itvDataResource']);

/**
 * @ngdoc object
 * @name UtilsService
 * @description
 *
 * Contiene métodos reutilizables para su uso en distintas partes del
 * código del grid de datos.
 */
utilsServiceModule.factory('UtilsService', function(filterFilter, DataResource){
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
     * El primer parámetro 'headers' siempre será un array pero sus elementos
     * pueden ser de dos tipos:
     *  - serán elementos de tipo String para columnas ya definidas y filtradas
     *  previamente
     *  -serán elementos de tipo array si se está utilizando un elemento de la
     *  tabla como ejemplo para definir las columnas, en este caso cada elemento
     *  será un array cuyo primer elemento será el nombre de la columna y el
     *  segundo será el valor de dicha columna.
     *
     * En el segundo caso solo se utilizarán como columna campos cuyo valor
     * no sea un objeto o un array.
     *
     * @param {array} headers Array con los nombres o los pares nombre, valor de
     * cada columna de la tabla del grid
     * @param {array} notEditableFields Array con los nombres de las columnas
     * que no permiten su edición.
     * @param {array} hiddenColumns Array con los nombres de cada columna no visible.
     * @param {string} idField id que no sera modificable en inserciones
     *
     * @returns {array} Array con un objeto por cada columna con su nombre, si está
     * oculto y si es editable.
     *
     */
    UtilsService.createHeaders = function(headers, notEditableFields, hiddenColumns, idField){
        var classHeaders = [];
        angular.forEach(headers, function(value, key){
            if(!angular.isArray(value) || (!angular.isObject(value[1]) && !angular.isArray(value[1]))){
                var nombre = angular.isArray(value) ? value[0] : value;
                classHeaders.push({
                    name: nombre,
                    isEditable: !_.contains(notEditableFields, nombre),
                    isHidden: _.contains(hiddenColumns, nombre),
                    isInsertable: nombre !== idField
                });
            }
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
        var endIndex = initIndex - 1 + (itemsPerPage * 1);
        if(endIndex > totalItems){
            endIndex = totalItems;
        }

        if(initIndex > endIndex){
            initIndex = endIndex;
        }

        return {
            'initIndex': initIndex,
            'endIndex': endIndex,
            'totalItems': totalItems
        }
    };

    /**
     * @ngdoc method
     * @name UtilsService#getSpecificDataService
     *
     * @description
     *
     * Crea una instancia del servicio de datos con una configuración específica
     *
     * @param {object} specificConfigDataService Objeto con la configuración
     * específica del servicio de datos
     *
     * @returns {object} un objeto DataResource configurado de acuerdo al
     * parámetro de entrada.
     */
    UtilsService.getSpecificDataService = function(specificConfigDataService){
        if(_.isEmpty(specificConfigDataService)){
            return DataResource;
        } else {
            console.log(JSON.stringify(specificConfigDataService));
            var specificConfigFunction = function(configurer){
                if(specificConfigDataService.id){
                    configurer.setIdField(specificConfigDataService.id);
                }
                if(specificConfigDataService.params){
                    configurer.setRequestParams(specificConfigDataService.params);
                }
                if(specificConfigDataService.url){
                    configurer.setUrl(specificConfigDataService.url);
                }
                if(specificConfigDataService.requestDataTx){
                    configurer.setRequestDataTransformer(specificConfigDataService.requestDataTx);
                }
                if(specificConfigDataService.multi){
                    console.log('es multi');
                    configurer.setMultiQuery(true);
                }
            };
            return DataResource.getInstanceWithSpecificConfig(specificConfigFunction);
        }
    };

    /**
     * @ngdoc method
     * @name UtilsService#getStripIdOnUpdateTransformer
     *
     * @description
     *
     * Crea una función para convertir en undefined el valor del campo recibido
     * como id del elemento recibido como parámetro.
     *
     * @returns {function} función transformadora que se encargará de eliminar
     * el campo id del objeto recibido como parámetro.
     */
    UtilsService.getStripIdOnUpdateTransformer = function(){
        return function(data, idField){
            var id = idField.split('.')[0];
            var strippedIdObj = {};
            strippedIdObj[id] = undefined;
            return angular.extend({}, data, strippedIdObj);
        }
    };

    /**
     * @ngdoc method
     * @name UtilsService#getSimpleTransformer
     *
     * @description
     *
     * Crea una función transformadora por defecto que no modificará el
     * objeto recibido como parámetro.
     *
     * @returns {function} función transformadora que devolverá el
     * elemento recibido como parámetro.
     */
    UtilsService.getSimpleTransformer = function(){
        return function(data, idField){
            return data;
        }
    };

    UtilsService.isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    return UtilsService;
});
