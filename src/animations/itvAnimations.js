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
 * @name itvSlide
 * @description
 *
 * Realiza una animación de deslizamiento arriba y abajo cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 * Es necesario guardar la altura del elemento para realizar correctamente el deslizamiento
 * al mostrar.
 * Durante la animación de deslizar hacia arriba (ocultar) se añade la clase 'overflowHidden'
 * para que funcione correctamente, pero como da problemas si se deja de continuo tras
 * realizar la animación de deslizar hacia abajo (mostrar) se vuelve a quitar y para que no
 * se solape con la transición se le establece un timeout ligeramente superior a la duración
 * definida.
 */
itvAnimationsModule.animation('.itvSlide', function($timeout){
    var height = 0;
    return {
        beforeAddClass: function(element, className){
            console.log('beforeaddclass con className: ' + className);
           height = element.height();
            if(className == 'ng-hide'){
                element.addClass('overflowHidden');
                TweenMax.to(element, 1, {css: {height: 0}});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {css: {height: height}});
                $timeout(function(){
                    element.removeClass('overflowHidden');
                }, 1100);
            }
        }
    }
});

/**
 * @ngdoc animation
 * @name itvFade
 * @description
 *
 * Realiza una animación de 'fade in-out' cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * A la hora de realizar la animación de volver a mostrar el elemento es
 * necesario comprobar si es una tabla para poner el valor correcto en la propiedad 'display'
 */
itvAnimationsModule.animation('.itvFade', function(){
    return {
        beforeAddClass: function(element, className){
            if(className == 'ng-hide'){
                TweenMax.to(element, 1, {opacity: 0, display: 'none'});
            }
        },
        removeClass: function(element, className){
            if(className == 'ng-hide'){
                var displayMode = (element[0].getAttribute('class')).indexOf('table') != -1 ? 'table' : 'block';
                TweenMax.to(element, 1, {opacity: 1, display: displayMode});
            }
        }
    }
});