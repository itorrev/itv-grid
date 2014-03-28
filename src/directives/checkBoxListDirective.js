/**
 * Created by Aleksandr on 26/03/14.
 *
 * Directiva para manejar un grupo de checkboxes y convertir la selección en un array de valores
 *
 */
'use strict';

var cblm = angular.module('checkBoxListModule', []);

cblm.directive('itvCheckboxlist', function($log){
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