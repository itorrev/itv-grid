/**
 * @ngdoc module
 * @name itvAnimations
 * @description
 *
 * Contiene las animaciones a utilizar en el grid de datos
 *
 */
var itvAnimationsModule = angular.module('itvAnimations', []);

/**
 * @ngdoc animation
 * @name itvSlideTable
 * @description
 *
 * Realiza una animación de deslizamiento arriba y abajo cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 */
itvAnimationsModule.animation('.itvSlideTable', function(){
    return {
        beforeAddClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 0, display: 'none'});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 1, display: 'table'});
            }
        }
    }
});

/**
 * @ngdoc animation
 * @name itvSlide
 * @description
 *
 * Realiza una animación de deslizamiento arriba y abajo cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Similar a la animación 'itvSlideTable', con la única diferencia de que en la
 * animación de 'removeClass' utiliza el estilo 'display: 'block''. Si se utilizase
 * esta animación para la tabla, no se visualizaría correctamente.
 */
itvAnimationsModule.animation('.itvSlide', function(){
    return {
        beforeAddClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 0, display: 'none'});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 1, display: 'block'});
            }
        }
    }
});