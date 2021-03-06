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

        config.url = angular.isUndefined(config.url)? "" : config.url;

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
//                if(url.charAt(url.length - 1)  !== '/'){
//                    url = url + '/';
//                }
                config.url = url;
                console.log('Establecida url: ' + config.url);
            }
        };

        /**
         * @ngdoc method
         * @name DataResource#getUrl (DataResourceProvider#getUrl)
         *
         * @description
         *
         * Devuelve la Url base del servicio REST con el que interactuar.
         *
         * @returns {string} Url base del api REST cuyos datos se mostrarán.
         *
         */
        obj.getUrl = function(){
            return config.url;
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

        /**
         * @ngdoc method
         * @name DataResource#getIdField (DataResourceProvider#getIdField)
         *
         * @description
         *
         * Devuelve el campo que actuará como identificador de los elementos.
         *
         * @returns {string} identificador de los elementos.
         *
         */
        obj.getIdField = function(){
            return config.idField;
        };

        config.requestParams = config.requestParams || {};

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

        config.defaultRequestDataTransformer = function(data, idField){
            return data;
        };

        config.requestDataTransformer = _.isUndefined(config.requestDataTransformer) ?
            config.defaultRequestDataTransformer : config.requestDataTransformer;

        /**
         * @ngdoc method
         * @name DataResource#setRequestDataTransformer
         *      (DataResourceProvider#setRequestDataTransformer)
         *
         * @description
         *
         * Establece la función para manipular el elemento enviado en las peticiones 'update'
         *
         * @param {function} requestDataTransformerFunction La función transformadora.
         *
         */
        obj.setRequestDataTransformer = function(requestDataTransformerFunction){
            if(_.isFunction(requestDataTransformerFunction)){
                config.requestDataTransformer = requestDataTransformerFunction;
            }
        };

        config.defaultDataExtractor = function(data){
            return data;
        };

        config.dataExtractor = _.isUndefined(config.dataExtractor) ? config.defaultDataExtractor :
            config.dataExtractor;

        /**
         * @ngdoc method
         * @name DataResource#setDataExtractor
         *      (DataResourceProvider#setDataExtractor)
         *
         * @description
         *
         * Establece la función para obtener el array de elementos de la respuesta del servidor,
         * útil si la estructura de datos devuelta en las peticiones es compleja.
         *
         * @param {function} dataExtractorFn La función transformadora.
         *
         */
        obj.setDataExtractor = function(dataExtractorFn){
            if(_.isFunction(dataExtractorFn)){
                config.dataExtractor = dataExtractorFn;
            }
        };

        config.defaultResponseTransformer = function(data){
            return data;
        };

        config.responseTransformer = _.isUndefined(config.responseTransformer) ? config.defaultResponseTransformer :
            config.responseTransformer;

        /**
         * @ngdoc method
         * @name DataResource#setResponseTransformer
         *      (DataResourceProvider#setResponseTransformer)
         *
         * @description
         *
         * Establece la función para crear cada elemento a partir de los datos recibidos por el servidor,
         * sirve para normalizar una estructura de objetos anidados y obtener solo los campos a mostrar.
         *
         * @param {function} responseTransformerFn La función transformadora.
         *
         */
        obj.setResponseTransformer = function(responseTransformerFn){
            if(_.isFunction(responseTransformerFn)){
                config.responseTransformer = responseTransformerFn;
            }
        };

        config.setMultiQuery = function(multi){
            config.multiQuery = multi;
        }
    };

    configurador.configurar(this, configObj);

    // para la instanciación del servicio, al estar declarado como 'provider',
    // angularJS invocará el método $get() y utilizará el resultado en la inyección
    this.$get = ['$http', '$log', '$q', function($http, $log, $q){

        function createServiceInstance(configuration){
            // constructor para objetos DataResource, todos los elementos devueltos
            // por el servicio serán de este tipo.
            var DataResource = function(data){
                angular.extend(this, data);
            };

            // método para obtener el id de un elemento. Se contempla la posibilidad
            // de que sea compuesto.
            // Por ejemplo mongolab guarda el id de los elementos en el campo $oid
            // dentro del campo _id que es un objeto.
            var getId = function(data){
                var field = data;
                angular.forEach(configuration.idField.split('.'), function(value, key){
                    field = field[value];
                });
                return field;
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
                $log.log('query class function con multiquery ' + configuration.multiQuery);
                var deferred = $q.defer();
                if(!configuration.multiQuery || !_.has(configuration.requestParams, 'limit')){
                    $http.get(configuration.url, {params: configuration.requestParams}).
                        then(function (response){
                            $log.log(response.data);
                            var result = [];
                            var extractedData = configuration.dataExtractor(response.data);
                            angular.forEach(extractedData, function (value, key){
                                var responseElement = configuration.responseTransformer(value);
                                result[key] = new DataResource(responseElement);
                            });
                            deferred.resolve(result);
                        });
                } else {
                    //al haber un parámetro limit se realizarán peticiones múltiples
                    // añadiendo también un parámetro offset hasta que el tamaño de
                    // la respuesta sea menor que el limit
                    $log.log('Entrando por multiquery');
                    var result = [];
                    var currentOfsset = 0;
                    var requestParams = {};
                    angular.copy(configuration.requestParams, requestParams);
                    console.log('request params');
                    console.log(JSON.stringify(requestParams));
                    if(_.has(requestParams, 'offset')){
                        currentOfsset = requestParams['offset'] * 1;
                    }
                    var multiquery = function(){
                        requestParams['offset'] = currentOfsset;
                        console.log('request params dentro de multiquery: ' + JSON.stringify(requestParams));
                        console.log('current offset: ' + currentOfsset);
                        $http.get(configuration.url, {params: requestParams}).
                            then(function(response){
                                var extractedData = configuration.dataExtractor(response.data);
                                $log.log('recuperado array con longitud: ' + extractedData.length);
                                angular.forEach(extractedData, function(value, key){
                                    result.push(value);
                                });
                                if(extractedData.length < requestParams['limit']){
                                    var finalResult = [];
                                    angular.forEach(result, function (value, key){
                                        var responseElement = configuration.responseTransformer(value);
                                        finalResult[key] = new DataResource(responseElement);
                                    });
                                    deferred.resolve(finalResult);
                                } else {
                                    currentOfsset = currentOfsset + extractedData.length;
                                    multiquery();
                                }
                            }, function(response){
                                console.log('Error en multiquery');
                                console.log(JSON.stringify(response));
                            });
                    };
                    multiquery();
                }
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
                var getUrl = configuration.url + id;
                var deferred = $q.defer();
                $http.get(getUrl, {params: configuration.requestParams}).
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
                $http.post(configuration.url, data, {params: configuration.requestParams}).
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
                var id = _.isObject(data) ? data.$id() : data;
                var removeUrl = configuration.url + id;
                return $http.delete(removeUrl, {params: configuration.requestParams})
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
             * El objeto a enviar en la petición se pasa por una función transformadora
             * para permitir modificar los datos a enviar (por ejemplo MongoLab requiere
             * que el campo id no se envíe).
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
                var id = data instanceof DataResource ? data.$id() : getId(data);
                var updateUrl = configuration.url + id;
                var transformedData = configuration.requestDataTransformer(data, configuration.idField);
                var deferred = $q.defer();
                $http.put(updateUrl, transformedData, {
                    params: configuration.requestParams,
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

            /**
             * @ngdoc method
             * @name DataResource#getInstanceWithSpecificConfig
             *
             * @description
             *
             * Permite crear una instancia del servicio de datos con una configuración
             * específica distinta a la global donde pueden cambiar cosas como la url
             * a la que apunta para la recuperación de datos, los parámetros para las
             * peticiones, etc...
             * La base será la configuración general por lo que los campos no
             * sobreescritos guardarán los valores previos.
             *
             * @returns {object} Una instancia de DataResource con la nueva
             * configuración.
             */
            DataResource.getInstanceWithSpecificConfig = function(specificConfigFunct){
                var specificConfig = angular.copy(configuration);
                configurador.configurar(specificConfig, specificConfig);
                specificConfigFunct(specificConfig);
                return createServiceInstance(specificConfig);
            };

            // se invoca de nuevo a la función para que el servicio DataResource
            // tenga los mismos métodos que el provider sin duplicar el código.
            configurador.configurar(DataResource, configuration);

            return DataResource;
        }

        return createServiceInstance(configObj);
    }];

});