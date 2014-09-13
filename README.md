#itv-grid

<img src="https://raw.githubusercontent.com/itorrev/itv-grid/master/itv-grid.jpg" alt="captura de pantalla de itv-grid" style="max-width:100%;">

##Introducci&oacute;n
itv-grid es un grid de datos desarrollado en [AngularJS](http://angularjs.org/) que permite la lectura, creaci&oacute;n, edici&oacute;n y borrado de elementos de una base de datos a trav&eacute;s de un API REST.

El objetivo de este componente es permitir generar un 'datagrid' a partir de una url de conexi&oacute;n y una m&iacute;nima configuraci&oacute;n, sin que sea necesario escribir c&oacute;digo de ning&uacute;n tipo.

##Dependencias
itv-grid est&aacute; construido utilizando varias librer&iacute;as javascript:
    
- [AngularJS](http://angularjs.org/)
Framework utilizado para desarrollar el componente.
- [Bootstrap](http://getbootstrap.com/)
Framework en el que se basa el aspecto del grid.
- [Bootstrap-ui](http://angular-ui.github.io/bootstrap/)
Componentes de bootstrap desarrollados en AngularJS
- [Angular-animate](https://docs.angularjs.org/api/ngAnimate)
M&oacute;dulo de animaciones de AngularJS
- [jQuery](http://jquery.com/)
Dependencia de Bootstrap
- [Underscore](http://underscorejs.org/)
Librer&iacute;a de utilidades
- [Tweenmax](https://www.greensock.com/tag/tweenmax/)
Librer&iacute;a para realizar animaciones
- [FontAwesome](http://fortawesome.github.io/Font-Awesome/)
Librer&iacute;a de iconos

Todas las librer&iacute;as est&aacute;n disponibles a trav&eacute;s de CDNs con lo que ser&iacute;a suficiente 
incluir en la p&aacute;gina el siguiente bloque:

    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular-animate.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>

##Caracter&iacute;sticas
itv-grid implementa las caracter&iacute;sticas b&aacute;sicas de un grid de datos como paginaci&oacute;n, ordenaci&oacute;n por columnas,
edici&oacute;n creaci&oacute;n y borrado de elementos, ocultaci&oacute;n de columnas y filtrado por columnas o gen&eacute;rico.
Tambi&eacute;n implementa algunas funciones m&aacute;s avanzadas:

- Selecci&oacute;n m&uacute;ltiple

Mediante una columna de checkboxes en cada línea el grid permite la selecci&oacute;n m&uacute;ltiple de filas. Cuando haya al menos un elemento
seleccionado se activar&aacute; una opci&oacute;n en el men&uacute; llamada "Ver selecci&oacute;n" que mostrar&aacute; en el grid solo los elementos
seleccionados.

- Vista de detalle

Para mostrar campos largos (por ejemplo descripciones, biograf&iacute;as, etc...) e im&aacute;genes el grid permite definir una serie de campos
que se mostrar&aacute;n en una secci&oacute;n desplegable al hacer click en cada l&iacute;nea.

- Grid secundario

Algunas API rest poseen elementos enlazados de forma que a partir del id de un elemento se puede acceder a un elemento dependiente del primero,
un ejemplo ser&iacute;a un elemento "persona" a trav&eacute;s de cuyo id se puede acceder al elemento "tarjetas de cr&eacute;dito" asociadas a
esa persona, itv-grid permite configurarlo de forma que se muestre un grid hijo con esa informaci&oacute;n en una secci&oacute;n desplegable al
hacer click en cada una de las filas.

En el aspecto visual, itv-grid est&aacute; construido con un panel de bootstrap dentro del cual se integra una tabla para mostrar elementos.
Este panel se compone de una cabecera con el t&iacute;tulo del grid, un cuerpo que agrupa distintas opciones del grid, la tabla
integrada donde se muestran los datos y una zona para el pie del panel donde se muestra el elemento paginador y un literal
con los elementos mostrados y totales.
En el cuerpo del panel aparece un campo de texto para realizar b&uacute;squedas gen&eacute;ricas que aplicar&aacute;n a cualquier columna,
un elemento para seleccionar el n&uacute;mero de registros por p&aacute;gina y un bot&oacute;n que desplegar&aacute; un peque&ntilde;o men&uacute; de opciones a
trav&eacute;s del cual se accede a las opciones de creaci&oacute;n de un nuevo elemento y el filtrado y ocultaci&oacute;n de columnas, as&iacute; como el modo de selecci&oacute;n.

##API REST
itv-grid encapsula un servicio de datos basado en el objeto [$http](https://docs.angularjs.org/api/ng/service/$http) de AngularJS
y que est&aacute; preparado para interactuar con un servicio REST.
Dada una URL base, http://www.miservidor.com/rest/elementos la forma de interactuaci&oacute;n del servicio ser&aacute;:

- Una petici&oacute;n GET a la url base http://www.miservidor.com/rest/elementos/ devolver&aacute; la lista de elementos a mostrar
- Una petici&oacute;n POST a la url base http://www.miservidor.com/rest/elementos/ con la informaci&oacute;n de un nuevo elemento realizar&aacute; la inserci&oacute;n.
- Una petici&oacute;n PUT a la url base concatenada con el id del elemento http://www.miservidor.com/rest/elementos/{id} actualizar&aacute; el elemento con los datos enviados.
- Una petici&oacute;n DELETE a la url base concatenada con el id del elemento http://www.miservidor.com/rest/elementos/{id} realizar&aacute; el borrado.

##Utilizaci&oacute;n
####Importar el c&oacute;digo
Lo primero que hay que hacer es importar en la p&aacute;gina los ficheros javascript y css que forman el componente

    <link rel="stylesheet" href="gridStyle.css">
    <script src="itvDataGrid.js"></script>
####itv-grid-url
Como se ha escrito previamente, uno de los objetivos de itv-grid es permitir el uso del componente sin tener que desarrollar
ning&uacute;n tipo de c&oacute;digo javascript, el uso m&aacute;s simple posible ser&aacute; utilizar el tag html <itv-grid> junto con la URL
del servicio REST de donde obtener los datos.

    <itv-grid itv-grid-url="http://www.miservidor.com/rest/elementos"></itv-grid>
En este caso el grid mostrar&aacute; como columnas todas las propiedades del primer objeto devuelto en la petici&oacute;n GET a la URL
proporcionada, excepto aquellas propiedades devueltas que sean objetos o colecciones.
Si la url pertenece al mismo servidor en el que se aloja la p&aacute;gina, puede utilizarse una url relativa

    <itv-grid itv-grid-url="/rest/elementos"></itv-grid>

####itv-grid-columns
Lo ideal es indicar las propiedades o columnas de los objetos a mostrar utilizando para ello el atributo itv-grid-columns que contendr&aacute; la lista de nombres de columna separadas por comas y sin espacios:

    <itv-grid itv-grid-url="http://www.miservidor.com/rest/elementos" itv-grid-columns="id,nombre,apellido,pais,ciudad"></itv-grid>
####itv-grid-noteditable
Tambi&eacute;n es posible indicar que columnas no deben ser editables en el modo de edici&oacute;n de elementos mediante el atributo itv-grid-noteditable

    <itv-grid itv-grid-url="http://www.miservidor.com/rest/elementos" itv-grid-columns="id,nombre,apellido,pais,ciudad" itv-grid-noteditable="nombre,apellido"></itv-grid>
####itv-grid-hide
Si se desea que algunas de las columnas especificadas est&eacute;n ocultas de inicio pero puedan mostrarse a trav&eacute;s de las opciones del grid se utilizar&aacute; el atributo itv-grid-hide

    <itv-grid itv-grid-url="http://www.miservidor.com/rest/elementos" itv-grid-columns="id,nombre,apellido,pais,ciudad" itv-grid-hide="id"></itv-grid>
####itv-grid-title
El t&iacute;tulo mostrado en la cabecera del grid podr&aacute; definirse con el atributo itv-grid-title.

    <itv-grid itv-grid-url="http://www.miservidor.com/rest/elementos" itv-grid-title="Tabla de personal"></itv-grid>
####itv-grid-id
En caso de que la propiedad del elemento utilizada como id tenga un nombre distinto a "id" se debe indicar usando el atributo itv-grid-id.
Si dicha propiedad est&aacute; dentro de un objeto, como ocurre por ejemplo con la popular base de datos [MongoLab](https://mongolab.com/welcome/), se indicar&aacute; utilizando un punto como separador.

    <itv-grid itv-grid-url="https://api.mongolab.com/api/1/databases/itvempresa/collections/empleados/" itv-grid-id="_id.$oid"></itv-grid>
El ejemplo corresponde a una base de datos alojada en [MongoLab](https://mongolab.com/welcome/), en la que el id viene definido como un campo "$oid" dentro del objeto "_id"

####itv-grid-param
Hay bases de datos que requieren el env&iacute;o de un par&aacute;metro que servir&aacute; como token de autenticaci&oacute;n en todas las peticiones que se realicen,
para configurar un par&aacute;metro que se env&iacute;e en todas las peticiones se pueden usar los atributos itv-grid-param-name e itv-grid-param-value.
Tambi&eacute;n es el caso de [MongoLab](https://mongolab.com/welcome/), que requiere el env&iacute;o de un par&aacute;metro llamado "apiKey".

    <itv-grid itv-grid-url="https://api.mongolab.com/api/1/databases/itvempresa/collections/empleados/" itv-grid-id="_id.$oid"
        itv-grid-param-name="apiKey" itv-grid-param-value="A_a5oitaREIT2wisha3aweRA9J"></itv-grid>

####itv-grid-strip-updateid
Para completar la compatibilidad con [MongoLab](https://mongolab.com/welcome/) existe el atributo itv-grid-strip-updateid que permite eliminar el campo id del objeto a actualizar.
El valor del atributo para activar la opci&oacute;n ser&aacute; "true".

    <itv-grid itv-grid-url="https://api.mongolab.com/api/1/databases/itvempresa/collections/empleados/" itv-grid-id="_id.$oid"
        itv-grid-param-name="apiKey" itv-grid-param-value="A_a5oitaREIT2wisha3aweRA9J" itv-grid-strip-updateid="true">

####itv-grid-allowcud
Dado que en muchas ocasiones el grid se utilizar&aacute; para consumir datos de alguna API p&uacute;blica que permite la lectura pero no la edici&oacute;n o el borrado se ha introducido
este par&aacute;metro para activar las funcionalidades de creaci&oacute;n, edici&oacute;n y borrado, si no se indica este atributo con valor "true" el grid ser&aacute; de solo lectura
y no aparecer&aacute;n dichas opciones.

            <itv-grid itv-grid-url="https://api.mongolab.com/api/1/databases/itvempresa/collections/empleados/"
                      itv-grid-title="MongoLab Test" itv-grid-allowcud="true"
                      itv-grid-columns="edad,nombre,apellido,direccion,ciudad"
                      itv-grid-param-name="apiKey" itv-grid-param-value="o_YePtBXIXDJiG1MVpacLhhVpVNvDqcC"
                      itv-grid-id="_id.$oid" itv-grid-strip-updateid="true"></itv-grid>

####itv-grid-master-detail
Para mostrar campos largos (por ejemplo descripciones, biograf&iacute;as, etc...) e im&aacute;genes el grid permite definir una serie de campos
que se mostrar&aacute;n en una secci&oacute;n desplegable al hacer click en cada l&iacute;nea. Para configurar esta opci&oacute;n har&aacute; falta incluir este atributo con valor "true"
as&iacute; como el atributo  **itv-grid-detail-cols** que funciona de manera similar al atributo descrito anteriormente itv-grid-columns pero indicando las propiedades que aparecer&aacute;n
en esta secci&oacute;n.

            <itv-grid itv-grid-url="https://api.mongolab.com/api/1/databases/itvempresa/collections/empleados/"
                      itv-grid-title="MongoLab Test" itv-grid-allowcud="true"
                      itv-grid-columns="edad,nombre,apellido,direccion,ciudad"
                      itv-grid-param-name="apiKey" itv-grid-param-value="o_YePtBXIXDJiG1MVpacLhhVpVNvDqcC"
                      itv-grid-id="_id.$oid" itv-grid-strip-updateid="true" itv-grid-master-detail="true"
                      itv-grid-detail-cols="salario,email,telefono,departamento,contratacion"></itv-grid>

Si alguna de las propiedades definidas en itv-grid-detail-cols contiene la url de una im&aacute;gen, la directiva que crea la secci&oacute;n de detalle ser&aacute; capaz de cargarla y mostrarla
a la izquierda de la secci&oacute;n junto con el resto de campos.

####itv-subgrid
Para activar la funcionalidad de grid hijo es necesario utilizar este atributo con valor "true" aunque ser&aacute; necesario el uso de otros atributos para su correcta configuraci&oacute;n.
Ser&aacute; obligatorio el atributo **itv-subgrid-path** para componer la url del subgrid, si por ejemplo se parte de una url "/itvRestServer/rest/titulacion/" y cada titulaci&oacute;n
tiene una lista de asignaturas consultable a trav&eacute;s de la url "/itvRestServer/rest/titulacion/{id_titulacion}/asignatura" el valor del atributo ser&iacute;a itv-subgrid-path="asignatura".

Para indicar las columnas a mostrar en el subgrid se utilizar&aacute; el atributo **itv-subgrid-columns**.

           <itv-grid itv-grid-url="http://localhost:8080/itvRestServer/rest/titulacion/"
                      itv-grid-title="Carreras" itv-grid-allowcud="false"
                      itv-grid-columns="nombre,plan,creditos,cursos,centro,categoria" itv-subgrid="true"
                      itv-subgrid-path="asignatura"
                      itv-subgrid-columns="nombre,creditos,tipo,cuatrimestre,curso"></itv-grid>


##Servicio de Datos
Si se integra el componente en una aplicaci&oacute;n desarrollada en [AngularJS](http://angularjs.org/) es posible utilizar algunas opciones de configuraci&oacute;n
descritas anteriormente de forma program&aacute;tica, permitiendo algunas de ellas m&aacute;s flexibilidad.
La configuraci&oacute;n se realizar&aacute; a trav&eacute;s del servicio de datos DataResource, que est&aacute; definido como un objeto [$provider](https://docs.angularjs.org/guide/providers).
En la fase de configuraci&oacute;n de [AngularJS](http://angularjs.org/) se debe inyectar el "provider" del objeto

    var myApp = angular.module('myApp', ['itvGrid']);

    myApp.config(function(DataResourceProvider){
        //Aqui se realiza la configuracion
    });

Si por el contrario se quiere configurar a nivel de un [Controller](https://docs.angularjs.org/guide/controller) se inyectar&aacute; el propio DataResource

    var myApp = angular.module('myApp', ['itvGrid']);

    myApp.controller('myCtrl', function(DataResource){
        //configuracion
    });

En cualquier caso el servicio est&aacute; desarrollado para aceptar las mismas opciones de configuraci&oacute;n a trav&eacute;s de los mismos m&eacute;todos.

####setUrl
Con este m&eacute;todo se define la url del API REST

    DataResource.setUrl("http://www.miservidor.com/rest/elementos");

####setIdField
Permite establecer el nombre del campo que act&uacute;a como id, el valor por defecto del servicio es "id".

    DataResource.setIdField("_id.$oid");

####setRequestParams
A diferencia de los atributos itv-grid-param-name e itv-grid-param-value de la directiva, mediante este m&eacute;todo se pueden definir distintos
par&aacute;metros que ser&aacute;n enviados en cada petici&oacute;n al API REST.

    var myParams = {
        'apiKey': 'A_a5oitaREIT2wisha3aweRA9J',
        'otherParam': 'otherParamValue'
    }

    DataResource.setRequestParams(myParams);

####setRequestDataTransformer
Esta funci&oacute;n permite definir la funci&oacute;n que se utilizar&aacute; para transformar el elemento antes de realizar una petici&oacute;n UPDATE,
lo cual permite, por ejemplo, eliminar el campo definido como id antes de enviar los datos.

    var tx = function(data, idField){
        var id = idField.split('.')[0];
        var strippedIdObj = {};
        strippedIdObj[id] = undefined;
        return angular.extend({}, data, strippedIdObj);
    }

    DataResourceProvider.setRequestDataTransformer(tx);

Esta es la funci&oacute;n usada cuando el atributo itv-grid-strip-updateid de la directiva tiene valor "true".

####setDataExtractor
Esta funci&oacute;n permite recuperar el array de resultados a mostrar cuando la respuesta del servidor no es directamente dicho array, si por ejemplo la
estructura devuelta es un objeto con distintas propiedades y dentro de ese objeto hay otro en una propiedad "data" dentro del cual a su vez se encuentra
el array de resultados en una propiedad "results" ser&iacute;a necesario la siguiente funci&oacute;n:

    var dataExtractor = function(data){
        return data.data.results;
    };
    DataResourceProvider.setDataExtractor(dataExtractor);

####setResponseTransformer
Esta funci&oacute;n se aplicar&aacute; a cada uno de los elementos del array de resultados y permite manipularlos obteniendo solo los campos utilizados en el grid.
Tambi&eacute;n permite obtener datos que puedan estar anidados dentro de objetos y concatenarlos, por ejemplo si dentro del elemento hay una propiedad imagen que es
un objeto con las propiedades url y extension, se podr&iacute;a sacar ese objeto, concatenar sus propiedades para obtener la url de la imagen y almacenarlo en una nueva
propiedad del objeto devuelto por la funci&oacute;n. El siguiente c&oacute;digo se utiliza en uno de los ejemplo posteriores:

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

