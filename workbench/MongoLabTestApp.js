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

mongoLabTestApp.config(function(DataResourceProvider){
    var dataExtractor = function(data){
        //console.log('Es character data wrapper: ' + data instanceof CharacterDataWrapper);
        console.log(data);
        if(_.isArray(data)){
            return data;
        } else {
            return data.data.results;
        }
    };
    DataResourceProvider.setDataExtractor(dataExtractor);

    var responseTransformer = function(data){
        if(_.has(data, 'isbn')){
            var responseElement = {};
            responseElement.id = data.id;
            responseElement.titulo = data.title;
            var txtObj = data.textObjects[0];
            if(!_.isUndefined(txtObj)){
                responseElement.sinopsis = data.textObjects[0].text;
            } else {
                responseElement.sinopsis = 'Sinopsis no encontrada';
            }
            responseElement.paginas = data.pageCount;
            responseElement.serie = data.series.name;
            responseElement.fecha = data.dates[0].date.substr(0, 10);
            responseElement.precio = data.prices[0].price;

            var portada = data.thumbnail.path;
            responseElement.portada = portada + '/portrait_fantastic.' + data.thumbnail.extension;
            return responseElement;
        } else {
            return data;
        }
    };
    DataResourceProvider.setResponseTransformer(responseTransformer);

    var params = {};
    params['apikey'] = '1df80cce49ec6ff2b537bf100dd1d1fe';
    params['limit'] = '100';
    params['format'] = 'comic';
    params['dateDescriptor'] = 'thisMonth';
    params['orderBy'] = 'onsaleDate';
    DataResourceProvider.setRequestParams(params);
});