/**
 * Created by itorrev on 4/04/14.
 */
var mongoLabTestApp = angular.module('mongoLabTestApp', ['itvGrid', 'itvMarkdownModule']);

//mongoLabTestApp.config(function(DataResourceProvider){
//    var tx = function(data, idField){
//        var id = idField.split('.')[0];
//        var strippedIdObj = {};
//        strippedIdObj[id] = undefined;
//        return angular.extend({}, data, strippedIdObj);
//    }
//
//    DataResourceProvider.setRequestDataTransformer(tx);
//});