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