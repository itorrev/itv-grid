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
itvAnimationsModule.animation('.itvSlide', function($timeout, $log){
    var height = 0;
    return {
        beforeAddClass: function(element, className){
            if (className === 'ng-hide'){
                $log.log('itvSlide beforeAddClass');
                height = element.height();
                element.addClass('overflowHidden');
                TweenMax.to(element, 1, {css: {height: 0}});
            }
        },
        removeClass: function(element, className){
            if (className === 'ng-hide'){
                $log.log('itvSlide removeClass');
                TweenMax.to(element, 1, {css: {height: height}});
                $timeout(function(){
                    element.removeClass('overflowHidden');
                    element.css('height', 'auto');
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
 * Se utiliza 'beforeAddClass' ya que la animación ha de realizarse antes de que
 * se añada la clase '.ngHide' dado que si no se ocultaría el elemento antes de la animación.
 * Se utiliza 'removeClass' por el mismo motivo, realizar la animación una vez se ha quitado
 * la clase '.ngHide' del elemento.
 * A la hora de realizar la animación de volver a mostrar el elemento es
 * necesario comprobar el tipo de elemento para poner el valor correcto en la propiedad 'display'
 */
itvAnimationsModule.animation('.itvFade', function($log){
    return {
        beforeAddClass: function(element, className){
            if (className === 'ng-hide'){
                $log.log('itvFade beforeAddClass');
                TweenMax.to(element, 1, {css: {opacity: 0, display: 'none'}});
            }
        },
        removeClass: function(element, className){
            if (className === 'ng-hide'){
                $log.log('itvFade removeClass');
                var tagName = (element[0])['tagName'];
                var displayMode = 'block';
                if(tagName == 'TD' || tagName == 'TH'){
                    displayMode = 'table-cell';
                } else if(tagName == 'TABLE'){
                    displayMode = 'table';
                }
                TweenMax.to(element, 1, {css: {opacity: 1, display: displayMode}});
            }
        }
    }
});
