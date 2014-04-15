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
            $log.log('iniciada directiva para el valor ' + attrs.value);
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
                $log.log('actualmente en la seleccion: ');
                $log.log(scope.list);
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
 * @name itvSlideAnimation
 * @restrict A
 *
 * @description
 * Directiva que añade una clase css al elemento cuando cambia la expresión
 * definida como parámetro, para ello utiliza $watch().
 *
 * @element ANY
 * @param {expression} itvSlideAnimation Expresión de cuyo valor depende que
 * se añada la clase css al elemento.
 *
 */
itvUtilDirectivesModule.directive('itvSlideAnimation', function($animate){
    return function(scope, element, attrs){
        scope.$watch(attrs.itvSlideAnimation, function(newValue){
            console.log('cambio en valor: ' + newValue);
            if(newValue){
                console.log('entrando en addclass');
                $animate.addClass(element, 'itvSlide');
            }
        })
    }
});