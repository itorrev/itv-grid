/**
 * Created by itorrev on 8/04/14.
 */
'use strict';

var itvUtilDirectivesModule = angular.module('itvUtilDirectivesModule', []);

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