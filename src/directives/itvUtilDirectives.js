/**
 * Created by itorrev on 8/04/14.
 */
'use strict';

var itvUtilDirectivesModule = angular.module('itvUtilDirectives', ['itvMessagesModule', 'ngAnimate']);

/**
 * Directiva para manejar un grupo de checkboxes y convertir la selección en un array de valores
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
 * Directiva que responde a una pulsación de la tecla enter ejecutando la función referenciada
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
 * Directiva que responde al evento de pérdida de foco ejecutando la función referenciada
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
 * Directiva para mostrar mensaje a partir de una clave
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
 * Directiva para hacer desaparecer el tooltip de Angular Bootstrap UI
 * Dado que no hay api para el acceso programático se utiliza un 'hack'
 * que consiste en modificar una propiedad expuesta por el propio bootstrap
 * para realizar la ocultación tras un timeout definido.
 * La directiva permite su uso con un valor de ms como parámetro para
 * definir el tiempo que tarda el tooltip en desaparecer
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
 * Directiva de animación para un efecto de deslizamiento vertical
 * Se apoya en la librería Tweenlite de greensock
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