/**
 * Created by Aleksandr on 8/03/14.
 */

'use strict';

var dataResourceModule = angular.module('dataResourceModule', []);

dataResourceModule.provider('DataResource', function(){

    var configurador = {};
    var configObj = {};

    configurador.configurar = function(obj, config){
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

        obj.setIdField = function(idField){
            if(!_.isUndefined(idField)){
                config.idField = idField;
            }
        };

        config.requestParams = {} || config.requestParams;

        obj.setRequestParams = function(params){
            if(!_.isUndefined(params)){
                config.requestParams = params;
            }
        };

        config.notEditableFields = [config.idField];

        obj.getNotEditableFields = function(){
            return config.notEditableFields;
        };
    };

    configurador.configurar(this, configObj);

    this.$get = ['$http', '$log', '$q', function($http, $log, $q){

        var DataResource = function(data){
            angular.extend(this, data);
        };

        var getId = function(data){
            return data[configObj.idField];
        };

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

        DataResource.prototype.$id = function(){
            return getId(this);
        };

        DataResource.save = function(data){
            var deferred = $q.defer();
            $http.post(configObj.url, data, {params: configObj.requestParams}).
                then(function(data, status, headers, config){
                    var resource = new DataResource(data);
                    deferred.resolve(resource);
                });
            return deferred.promise;
        };

        DataResource.prototype.$save = function(){
            return DataResource.save(this);
        };

        DataResource.remove = function(data){
            $log.log('remove class function');
            $log.log(data);
            var id = _.isObject(data) ? data.$id() : data;
            var removeUrl = configObj.url + id;
            return $http.delete(removeUrl, {params: configObj.requestParams})
        };

        DataResource.prototype.$remove = function(){
            return DataResource.remove(this);
        };

        DataResource.update = function(data){
            $log.log('update class function');
            var id = data instanceof DataResource ? data.$id() : data[configObj.idField];
            var updateUrl = configObj.url + id;
            var deferred = $q.defer();
            $http.put(updateUrl, data, {
                params: configObj.requestParams,
                headers: {'Content-Type': 'application/json'}
                }).then(function(result){
                    var dr = new DataResource(result.data);
                    deferred.resolve(dr);
            });
            return deferred.promise;
        };

        DataResource.prototype.$update = function(){
            $log.log('update instance function');
            return DataResource.update(this);
        };

        configurador.configurar(DataResource, configObj);
        return DataResource;
    }];

});