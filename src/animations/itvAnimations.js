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
 * definida. También tras la animación se cambia la propiedad css de 'height' al valor
 * 'auto' para permitir que varíe el tamaño en función del número deelementos mostrados. No
 * es posible utilizar ese valor directamente puesto que en ese caso la animación no
 * funcionaría.
 *
 */
itvAnimationsModule.animation('.itvSlide',['$timeout', function($timeout){
    var height = 0;
    return {
        beforeAddClass: function(element, className, done){
            if (className === 'ng-hide'){
                height = element.height();
                element.addClass('overflowHidden');
                TweenMax.to(element, 1, {css: {height: 0}, onComplete: done});
            }
        },
        removeClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {height: height}, onComplete: done});
                $timeout(function(){
                    element.removeClass('overflowHidden');
                    element.css('height', 'auto');
                }, 1100);
            }
        }
    }
}]);

/**
 * @ngdoc animation
 * @name itvFade
 * @description
 *
 * Realiza una animación de 'fade in-out' cuando se añade y elimina
 * la clase '.ngHide' de un elemento.
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 */
itvAnimationsModule.animation('.itvFade', function(){
    return {
        beforeAddClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {opacity: 0}, onComplete: done});
            }
        },
        removeClass: function(element, className, done){
            if (className === 'ng-hide'){
                TweenMax.to(element, 1, {css: {opacity: 1}, onComplete: done});
            }
        }
    }
});

/**
 * @ngdoc animation
 * @name itvDetailSlide
 * @description
 *
 * Realiza una animación de 'slide' cuando se añade y elimina el elemento del DOM
 * Para ello se usa 'enter' y 'leave' que son los eventos que se lanzan en ese caso.
 *
 */
itvAnimationsModule.animation('.itvDetailSlide', function($timeout){
    return {
        enter: function(element, done){
            var div = element.find('div.overflowHidden');
            var height = div.css('height');
            element.addClass('overflowHidden');
            div.css('height', 0);
            TweenMax.to(div, 1, {css: {height: height}, onComplete: done});
        },

        leave: function(element, done){
            element.addClass('overflowHidden');
            var div = element.find('div.overflowHidden');
            TweenMax.to(div, 1, {css: {height: 0}, onComplete: done});
        }
    }
});
